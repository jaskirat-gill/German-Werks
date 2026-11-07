import "dotenv/config";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set");
  process.exit(1);
}
const stripe = new Stripe(key);

type Rate = {
  code: string;
  jurisdiction: string;
  percentage: number;
  displayName: string;
  taxType: Stripe.TaxRateCreateParams.TaxType;
};

const rates: Rate[] = [
  { code: "AB", jurisdiction: "Alberta", percentage: 5, displayName: "GST", taxType: "gst" },
  { code: "BC", jurisdiction: "British Columbia", percentage: 12, displayName: "GST + PST", taxType: "sales_tax" },
  { code: "MB", jurisdiction: "Manitoba", percentage: 12, displayName: "GST + PST", taxType: "sales_tax" },
  { code: "NB", jurisdiction: "New Brunswick", percentage: 15, displayName: "HST", taxType: "hst" },
  { code: "NL", jurisdiction: "Newfoundland and Labrador", percentage: 15, displayName: "HST", taxType: "hst" },
  { code: "NS", jurisdiction: "Nova Scotia", percentage: 14, displayName: "HST", taxType: "hst" },
  { code: "NT", jurisdiction: "Northwest Territories", percentage: 5, displayName: "GST", taxType: "gst" },
  { code: "NU", jurisdiction: "Nunavut", percentage: 5, displayName: "GST", taxType: "gst" },
  { code: "ON", jurisdiction: "Ontario", percentage: 13, displayName: "HST", taxType: "hst" },
  { code: "PE", jurisdiction: "Prince Edward Island", percentage: 15, displayName: "HST", taxType: "hst" },
  { code: "QC", jurisdiction: "Quebec", percentage: 14.975, displayName: "GST + QST", taxType: "sales_tax" },
  { code: "SK", jurisdiction: "Saskatchewan", percentage: 11, displayName: "GST + PST", taxType: "sales_tax" },
  { code: "YT", jurisdiction: "Yukon", percentage: 5, displayName: "GST", taxType: "gst" },
];

const existing: Stripe.TaxRate[] = [];
for await (const rate of stripe.taxRates.list({ active: true, limit: 100 })) {
  if (rate.metadata?.germanwerks_province) existing.push(rate);
}

const ids: string[] = [];
for (const rate of rates) {
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
      jurisdiction: rate.jurisdiction,
      country: "CA",
      state: rate.code,
      tax_type: rate.taxType,
      metadata: { germanwerks_province: rate.code },
    }));

  console.log(`${rate.code}  ${rate.percentage}%  ${taxRate.id}${match ? "" : "  (created)"}`);
  ids.push(taxRate.id);
}

console.log(`\nSTRIPE_TAX_RATE_IDS=${ids.join(",")}`);
