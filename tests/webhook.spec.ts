import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { POST } from "../app/(frontend)/stripe/webhook/route";

const secret = process.env.STRIPE_WEBHOOK_SECRET!;
const body = JSON.stringify({ id: "evt_1", object: "event", type: "charge.succeeded", data: { object: {} } });

const post = (headers: Record<string, string>) =>
  POST(new Request("http://localhost/stripe/webhook", { method: "POST", body, headers }));

describe("stripe webhook", () => {
  it("rejects a request without a signature", async () => {
    expect((await post({})).status).toBe(400);
  });

  it("rejects a bad signature", async () => {
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: "whsec_wrong" });
    expect((await post({ "stripe-signature": signature })).status).toBe(400);
  });

  it("rejects a signature over a tampered body", async () => {
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: body + " ", secret });
    expect((await post({ "stripe-signature": signature })).status).toBe(400);
  });

  it("accepts a valid signature", async () => {
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: body, secret });
    expect((await post({ "stripe-signature": signature })).status).toBe(200);
  });
});
