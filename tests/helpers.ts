import { getClient } from "lib/commerce/payload";
import type Stripe from "stripe";

export async function resetDatabase() {
  const payload = await getClient();
  await payload.db.connection.dropDatabase();
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  return payload;
}

export async function createProduct(stock = 5, priceCents = 12000) {
  const payload = await getClient();
  const media = await payload.create({
    collection: "media",
    data: { alt: "test" },
    filePath: `${process.cwd()}/public/hero-car.png`,
  });
  return payload.create({
    collection: "products",
    data: {
      title: `Test Splitter ${Math.random().toString(36).slice(2, 8)}`,
      images: [{ image: media.id }],
      variants: [
        {
          title: "Gloss",
          selectedOptions: [{ name: "Finish", value: "Gloss" }],
          priceCents,
          sku: "TS-1",
          stock,
        },
      ],
    },
  });
}

export function completedSession(options: {
  id: string;
  productId: string;
  variantId: string;
  cartId?: string;
  province?: string;
  quantity: number;
  unitAmount: number;
}): Stripe.Checkout.Session {
  return {
    id: options.id,
    payment_status: "paid",
    payment_intent: `pi_${options.id}`,
    currency: "cad",
    amount_subtotal: options.unitAmount * options.quantity,
    amount_total: options.unitAmount * options.quantity + 1500 + 1560,
    total_details: { amount_shipping: 1500, amount_tax: 1560 },
    customer_details: { email: "buyer@example.com", name: "Buyer" },
    collected_information: {
      shipping_details: {
        name: "Buyer",
        address: { line1: "1 Main St", line2: null, city: "Vancouver", state: "BC", postal_code: "V6B 1A1", country: "CA" },
      },
    },
    metadata: {
      ...(options.cartId ? { cartId: options.cartId } : {}),
      ...(options.province ? { province: options.province } : {}),
    },
    line_items: {
      data: [
        {
          quantity: options.quantity,
          description: "Test Splitter - Gloss",
          price: {
            unit_amount: options.unitAmount,
            product: {
              metadata: {
                productId: options.productId,
                variantId: options.variantId,
                productTitle: "Test Splitter",
                variantTitle: "Gloss",
                sku: "TS-1",
              },
            },
          },
        },
      ],
    },
  } as unknown as Stripe.Checkout.Session;
}
