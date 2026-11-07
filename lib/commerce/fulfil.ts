import type { Order } from "cms/payload-types";
import type { Payload } from "payload";
import type Stripe from "stripe";
import { getStripe } from "lib/stripe";
import { getClient } from "./payload";
import { sendOrderPlacedEmails } from "./order-emails";

type Deps = { stripe?: Pick<Stripe, "checkout">; payload?: Payload };

const findOrder = async (payload: Payload, sessionId: string) =>
  (
    await payload.find({
      collection: "orders",
      where: { stripeSessionId: { equals: sessionId } },
      limit: 1,
      depth: 0,
    })
  ).docs[0];

type StockLine = { productId: string; variantId: string; quantity: number };

async function decrementStock(payload: Payload, lines: StockLine[]) {
  const byProduct = new Map<string, Map<string, number>>();
  for (const { productId, variantId, quantity } of lines) {
    if (!productId || !variantId) continue;
    const variants = byProduct.get(productId) ?? new Map<string, number>();
    variants.set(variantId, (variants.get(variantId) ?? 0) + quantity);
    byProduct.set(productId, variants);
  }

  for (const [productId, variants] of byProduct) {
    const product = await payload.findByID({ collection: "products", id: productId, depth: 0 }).catch(() => null);
    if (!product) continue;
    await payload.update({
      collection: "products",
      id: productId,
      data: {
        variants: (product.variants ?? []).map((variant) => ({
          ...variant,
          stock: Math.max(0, (variant.stock ?? 0) - (variants.get(variant.id!) ?? 0)),
        })),
      },
    });
  }
}

export async function fulfilCheckoutSession(
  sessionId: string,
  deps: Deps = {},
): Promise<{ order: Order; created: boolean } | undefined> {
  const payload = deps.payload ?? (await getClient());

  const existing = await findOrder(payload, sessionId);
  if (existing) return { order: existing, created: false };

  const stripe = deps.stripe ?? getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product", "payment_intent"],
  });
  if (session.payment_status !== "paid") return undefined;

  const shipping = session.collected_information?.shipping_details;
  const address = shipping?.address;
  const paymentIntent = session.payment_intent;
  const taxProvince = session.metadata?.province ?? "";

  const lines = (session.line_items?.data ?? []).map((item) => {
    const product = item.price?.product;
    const meta = typeof product === "object" && product && "metadata" in product ? product.metadata : {};
    return {
      productTitle: meta.productTitle || item.description || "",
      variantTitle: meta.variantTitle || "",
      sku: meta.sku || "",
      quantity: item.quantity ?? 1,
      unitPriceCents: item.price?.unit_amount ?? 0,
      productId: meta.productId ?? "",
      variantId: meta.variantId ?? "",
    };
  });

  let order: Order;
  try {
    order = await payload.create({
      collection: "orders",
      depth: 0,
      data: {
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof paymentIntent === "string" ? paymentIntent : paymentIntent?.id,
        email: session.customer_details?.email ?? "",
        name: shipping?.name ?? session.customer_details?.name ?? "",
        shippingAddress: {
          line1: address?.line1,
          line2: address?.line2,
          city: address?.city,
          province: address?.state,
          postalCode: address?.postal_code,
          country: address?.country,
        },
        lines: lines.map(({ productId, variantId, ...line }) => line),
        subtotalCents: session.amount_subtotal ?? 0,
        shippingCents: session.total_details?.amount_shipping ?? 0,
        taxCents: session.total_details?.amount_tax ?? 0,
        totalCents: session.amount_total ?? 0,
        currency: session.currency ?? "cad",
        status: "paid",
        taxProvince,
        taxMismatch: Boolean(taxProvince && address?.state && address.state !== taxProvince),
      },
    });
  } catch (error) {
    const raced = await findOrder(payload, sessionId);
    if (raced) return { order: raced, created: false };
    throw error;
  }

  await decrementStock(payload, lines);

  const cartId = session.metadata?.cartId;
  if (cartId) await payload.delete({ collection: "carts", id: cartId }).catch(() => undefined);

  try {
    await sendOrderPlacedEmails(payload, order);
  } catch (error) {
    payload.logger.error({ err: error, msg: "Order emails failed" });
  }

  return { order, created: true };
}
