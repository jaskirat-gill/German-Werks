import { beforeAll, describe, expect, it, vi } from "vitest";
import { resetDatabase } from "./helpers";

describe("order shipped hook", () => {
  let payload: Awaited<ReturnType<typeof resetDatabase>>;

  beforeAll(async () => {
    payload = await resetDatabase();
  });

  it("sets shippedAt and emails the customer once when status becomes shipped", async () => {
    const order = await payload.create({
      collection: "orders",
      data: {
        stripeSessionId: "cs_test_ship",
        email: "buyer@example.com",
        lines: [{ productTitle: "Splitter", quantity: 1, unitPriceCents: 100 }],
        subtotalCents: 100,
        shippingCents: 0,
        taxCents: 0,
        totalCents: 100,
        status: "paid",
      },
    });
    const send = vi.spyOn(payload, "sendEmail").mockResolvedValue(undefined);

    const shipped = await payload.update({
      collection: "orders",
      id: order.id,
      data: { status: "shipped", trackingNumber: "TRACK123" },
    });
    expect(shipped.shippedAt).toBeTruthy();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]![0]).toMatchObject({ to: "buyer@example.com" });
    expect(String(send.mock.calls[0]![0].html)).toContain("TRACK123");

    await payload.update({ collection: "orders", id: order.id, data: { trackingNumber: "TRACK456" } });
    expect(send).toHaveBeenCalledTimes(1);
  });
});
