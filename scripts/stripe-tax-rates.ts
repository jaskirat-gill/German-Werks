import "dotenv/config";
import Stripe from "stripe";
import { PROVINCES } from "../lib/commerce/provinces";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set");
  process.exit(1);
}
const stripe = new Stripe(key);

const existing: Stripe.TaxRate[] = [];
for await (const rate of stripe.taxRates.list({ active: true, limit: 100 })) {
  if (rate.metadata?.germanwerks_province) existing.push(rate);
}

for (const rate of PROVINCES) {
  const current = existing.filter((r) => r.metadata?.germanwerks_province === rate.code);
  const match = current.find((r) => r.percentage === rate.percentage && r.state === rate.code);

  for (const stale of current.filter((r) => r !== match)) {
    await stripe.taxRates.update(stale.id, { active: false });
  }

  const taxRate =
    match ??
    (await stripe.taxRates.create({
      display_name: rate.displayName,
      percentage: rate.percentage,
      inclusive: false,
      jurisdiction: rate.name,
      country: "CA",
      state: rate.code,
      tax_type: rate.taxType,
      metadata: { germanwerks_province: rate.code },
    }));

  console.log(`${rate.code}  ${rate.percentage}%  ${taxRate.id}${match ? "" : "  (created)"}`);
}
