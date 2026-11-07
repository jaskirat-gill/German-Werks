import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Cart, Product } from "cms/payload-types";
import { buildLineItems } from "lib/commerce/checkout";
import { createCheckoutSession } from "lib/commerce/create-session";
import { getClient } from "lib/commerce/payload";
import { createProduct, resetDatabase } from "./helpers";

const create = vi.fn();
const taxRates = {
  list: () =>
    (async function* () {
      yield { id: "txr_ab", metadata: { germanwerks_province: "AB" } };
      yield { id: "txr_bc", metadata: { germanwerks_province: "BC" } };
    })(),
};
vi.mock("lib/stripe", () => ({
  getStripe: () => ({ checkout: { sessions: { create } }, taxRates }),
}));

type Line = NonNullable<Cart["lines"]>[number];

const product = {
  id: "p1",
  title: "Splitter",
  variants: [
    { id: "v1", title: "Gloss", priceCents: 12000, stock: 3, sku: "S-1" },
    { id: "v2", title: "Default Title", priceCents: 500, stock: 0 },
  ],
} as unknown as Product;

describe("buildLineItems", () => {
  it("prices every line from the product, ignoring any client-supplied price", () => {
    const forged = { id: "l1", product, variantId: "v1", quantity: 2, unitPriceCents: 1, priceCents: 1 } as unknown as Line;
    const [item] = buildLineItems([forged], "txr_bc");
    expect(item?.price_data?.unit_amount).toBe(12000);
    expect(item?.quantity).toBe(2);
  });

  it("clamps quantity to stock and drops out-of-stock or unknown variants", () => {
    const lines = [
      { product, variantId: "v1", quantity: 10 },
      { product, variantId: "v2", quantity: 1 },
      { product, variantId: "missing", quantity: 1 },
    ] as unknown as Line[];
    const items = buildLineItems(lines, "txr_bc");
    expect(items).toHaveLength(1);
    expect(items[0]?.quantity).toBe(3);
  });

  it("attaches the chosen province's tax rate to every line", () => {
    const [item] = buildLineItems([{ product, variantId: "v1", quantity: 1 } as unknown as Line], "txr_bc");
    expect(item?.tax_rates).toEqual(["txr_bc"]);
  });
});

describe("createCheckoutSession", () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  it("recomputes prices from Payload on every call", async () => {
    create.mockResolvedValue({ url: "https://checkout.stripe.test/s" });
    const payload = await getClient();
    const created = await createProduct(5, 12000);
    const variantId = created.variants![0]!.id!;
    const cart = await payload.create({
      collection: "carts",
      data: { lines: [{ product: created.id, variantId, quantity: 2 }] },
    });

    await createCheckoutSession(cart.id, "BC");
    expect(create.mock.calls[0]![0].line_items[0].price_data.unit_amount).toBe(12000);

    await payload.update({
      collection: "products",
      id: created.id,
      data: { variants: [{ ...created.variants![0]!, priceCents: 15000 }] },
    });
    await createCheckoutSession(cart.id, "BC");
    expect(create.mock.calls[1]![0].line_items[0].price_data.unit_amount).toBe(15000);
    expect(create.mock.calls[1]![0].metadata).toEqual({ cartId: cart.id, province: "BC" });
    expect(create.mock.calls[1]![0].line_items[0].tax_rates).toEqual(["txr_bc"]);
  });

  it("refuses to create a session when the province has no tax rate", async () => {
    create.mockClear();
    await expect(createCheckoutSession("any-cart", "ON")).rejects.toThrow(/No active Stripe tax rate for ON/);
    expect(create).not.toHaveBeenCalled();
  });
});
