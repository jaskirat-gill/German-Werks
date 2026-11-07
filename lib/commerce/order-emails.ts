import type { Order } from "cms/payload-types";
import { formatCents } from "../../cms/formatMoney";
import type { Payload } from "payload";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (order: Order, cents: number) =>
  formatCents(cents, (order.currency ?? "cad").toUpperCase());

function summaryHtml(order: Order) {
  const rows = (order.lines ?? [])
    .map(
      (line) =>
        `<tr><td>${escapeHtml(line.productTitle)}${line.variantTitle ? ` - ${escapeHtml(line.variantTitle)}` : ""}</td><td>${line.quantity}</td><td>${money(order, line.unitPriceCents * line.quantity)}</td></tr>`,
    )
    .join("");
  return `<table cellpadding="6">${rows}</table>
<p>Subtotal ${money(order, order.subtotalCents)}<br>Shipping ${money(order, order.shippingCents)}<br>Tax ${money(order, order.taxCents)}<br><strong>Total ${money(order, order.totalCents)}</strong></p>`;
}

const siteName = () => process.env.SITE_NAME || "German Werks";

export async function sendOrderPlacedEmails(payload: Payload, order: Order) {
  const settings = await payload.findGlobal({ slug: "site-settings" });
  const ref = order.stripeSessionId.slice(-8);

  await payload.sendEmail({
    to: order.email,
    subject: `${siteName()} order confirmation`,
    html: `<p>Thanks${order.name ? `, ${escapeHtml(order.name)}` : ""}. We received your order and will email you when it ships.</p>${summaryHtml(order)}`,
  });

  if (settings.contactEmail) {
    const address = order.shippingAddress;
    await payload.sendEmail({
      to: settings.contactEmail,
      subject: `New order ${ref} - ${money(order, order.totalCents)}`,
      html: `<p>${escapeHtml(order.name ?? "")} &lt;${escapeHtml(order.email)}&gt;</p>
<p>${[address?.line1, address?.line2, address?.city, address?.province, address?.postalCode, address?.country].filter(Boolean).map((part) => escapeHtml(part!)).join(", ")}</p>${summaryHtml(order)}`,
    });
  }
}

export async function sendOrderShippedEmail(payload: Payload, order: Order) {
  await payload.sendEmail({
    to: order.email,
    subject: `${siteName()} order shipped`,
    html: `<p>Your order has shipped.</p>${order.trackingNumber ? `<p>Tracking number: <strong>${escapeHtml(order.trackingNumber)}</strong></p>` : ""}${summaryHtml(order)}`,
  });
}
