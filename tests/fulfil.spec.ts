import { beforeAll, describe, expect, it, vi } from "vitest";
import { fulfilCheckoutSession } from "lib/commerce/fulfil";
import { createProduct, completedSession, resetDatabase } from "./helpers";

describe("fulfilCheckoutSession", () => {
  let payload: Awaited<ReturnType<typeof resetDatabase>>;

  beforeAll(async () => {
    payload = await resetDatabase();
  });

  async function setup(sessionId: string, province = "BC") {
    const product = await createProduct(5);
    const variantId = product.variants![0]!.id!;
    const cart = await payload.create({
      collection: "carts",
      data: { lines: [{ product: product.id, variantId, quantity: 2 }] },
    });
    const retrieve = vi.fn().mockResolvedValue(
      completedSession({ id: sessionId, productId: product.id, variantId, cartId: cart.id, province, quantity: 2, unitAmount: 12000 }),
    );
    return { product, cart, retrieve, stripe: { checkout: { sessions: { retrieve } } } as never };
  }

  async function orderCount(sessionId: string) {
    return (await payload.count({ collection: "orders", where: { stripeSessionId: { equals: sessionId } } })).totalDocs;
  }

  it("creates one order and decrements stock once when called twice", async () => {
    const { product, cart, retrieve, stripe } = await setup("cs_test_twice");

    const first = await fulfilCheckoutSession("cs_test_twice", { stripe });
    const second = await fulfilCheckoutSession("cs_test_twice", { stripe });

    expect(first?.created).toBe(true);
    expect(second?.created).toBe(false);
    expect(second?.order.id).toBe(first?.order.id);
    expect(await orderCount("cs_test_twice")).toBe(1);
    expect(retrieve).toHaveBeenCalledTimes(1);

    const after = await payload.findByID({ collection: "products", id: product.id });
    expect(after.variants![0]!.stock).toBe(3);
    await expect(payload.findByID({ collection: "carts", id: cart.id })).rejects.toThrow();

    expect(first?.order.totalCents).toBe(24000 + 1500 + 1560);
    expect(first?.order.shippingAddress?.province).toBe("BC");
    expect(first?.order.taxProvince).toBe("BC");
    expect(first?.order.taxMismatch).toBe(false);
    expect(first?.order.lines?.[0]).toMatchObject({ productTitle: "Test Splitter", quantity: 2, unitPriceCents: 12000 });
  });

  it("creates one order and decrements stock once under concurrent calls", async () => {
    const { product, stripe } = await setup("cs_test_race");

    await Promise.allSettled([
      fulfilCheckoutSession("cs_test_race", { stripe }),
      fulfilCheckoutSession("cs_test_race", { stripe }),
    ]);

    expect(await orderCount("cs_test_race")).toBe(1);
    const after = await payload.findByID({ collection: "products", id: product.id });
    expect(after.variants![0]!.stock).toBe(3);
  });

  it("does nothing for an unpaid session", async () => {
    const { retrieve, stripe } = await setup("cs_test_unpaid");
    retrieve.mockResolvedValue({ id: "cs_test_unpaid", payment_status: "unpaid" });
    expect(await fulfilCheckoutSession("cs_test_unpaid", { stripe })).toBeUndefined();
    expect(await orderCount("cs_test_unpaid")).toBe(0);
  });

  it("flags an order taxed for one province and shipped to another", async () => {
    const { stripe } = await setup("cs_test_mismatch", "AB");
    const result = await fulfilCheckoutSession("cs_test_mismatch", { stripe });
    expect(result?.order.taxProvince).toBe("AB");
    expect(result?.order.taxMismatch).toBe(true);
  });
});
