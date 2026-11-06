import { fulfilCheckoutSession } from "lib/commerce/fulfil";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Missing signature", { status: 400 });

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      await fulfilCheckoutSession(event.data.object.id);
    } catch (error) {
      console.error("Fulfilment failed:", error);
      return new Response("Fulfilment failed", { status: 500 });
    }
  }

  return Response.json({ received: true });
}
