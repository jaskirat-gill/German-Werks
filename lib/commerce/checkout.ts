import type { Cart, Product, ShippingSetting } from "cms/payload-types";
import type Stripe from "stripe";
import { CURRENCY } from "./money";

type CartLine = NonNullable<Cart["lines"]>[number];

export function buildLineItems(
  lines: CartLine[],
  taxRateId: string,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const line of lines) {
    if (typeof line.product === "string") continue;
    const product: Product = line.product;
    const variant = product.variants?.find((v) => v.id === line.variantId);
    if (!variant) continue;

    const quantity = Math.min(line.quantity, variant.stock ?? 0);
    if (quantity < 1) continue;

    const variantTitle = variant.title === "Default Title" ? "" : variant.title;
    items.push({
      quantity,
      price_data: {
        currency: CURRENCY.toLowerCase(),
        unit_amount: variant.priceCents,
        product_data: {
          name: variantTitle ? `${product.title} - ${variantTitle}` : product.title,
          metadata: {
            productId: product.id,
            variantId: variant.id!,
            productTitle: product.title,
            variantTitle,
            sku: variant.sku ?? "",
          },
        },
      },
      tax_rates: [taxRateId],
    });
  }

  return items;
}

export function buildShippingOptions(
  options: ShippingSetting["options"],
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  return (options ?? []).map((option) => ({
    shipping_rate_data: {
      type: "fixed_amount",
      display_name: option.label,
      fixed_amount: { amount: option.amountCents, currency: CURRENCY.toLowerCase() },
    },
  }));
}

export async function findTaxRateId(stripe: Pick<Stripe, "taxRates">, province: string) {
  for await (const rate of stripe.taxRates.list({ active: true, limit: 100 })) {
    if (rate.metadata?.germanwerks_province === province) return rate.id;
  }
  throw new Error(`No active Stripe tax rate for ${province}; run pnpm stripe:tax-rates`);
}
