import { baseUrl } from "lib/utils";
import { getStripe } from "lib/stripe";
import { buildLineItems, buildShippingOptions, findTaxRateId } from "./checkout";
import { getClient } from "./payload";

export async function createCheckoutSession(cartId: string, province: string) {
  const payload = await getClient();
  const stripe = getStripe();
  const taxRateId = await findTaxRateId(stripe, province);
  const cart = await payload.findByID({ collection: "carts", id: cartId, depth: 1 });
  const lineItems = buildLineItems(cart.lines ?? [], taxRateId);
  if (!lineItems.length) throw new Error("Cart is empty");

  const shipping = await payload.findGlobal({ slug: "shipping-settings" });
  const shippingOptions = buildShippingOptions(shipping.options);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ["CA"] },
    ...(shippingOptions.length ? { shipping_options: shippingOptions } : {}),
    metadata: { cartId, province },
    success_url: `${baseUrl}/order/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/search`,
  });

  if (!session.url) throw new Error("Stripe returned no checkout URL");
  return session.url;
}
