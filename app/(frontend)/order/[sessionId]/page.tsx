import { ClearCart } from "components/cart/clear-cart";
import { formatCents } from "cms/formatMoney";
import { fulfilCheckoutSession } from "lib/commerce/fulfil";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

const label = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  opacity: 0.6,
};

export default async function OrderPage(props: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await props.params;

  let result;
  try {
    result = await fulfilCheckoutSession(sessionId);
  } catch (error) {
    console.error("Order lookup failed:", error);
    return notFound();
  }

  const order = result?.order;
  const money = (cents: number) =>
    formatCents(cents, (order?.currency ?? "cad").toUpperCase());

  return (
    <section
      className="grain min-h-screen px-5 pb-24 pt-[120px] sm:px-7 lg:px-9"
      style={{ background: "var(--color-gw-ink)", color: "var(--color-gw-bone)" }}
    >
      {order ? (
        <div className="mx-auto max-w-2xl">
          <ClearCart />
          <div style={label}>Order confirmed</div>
          <h1
            className="mt-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            Thank <em style={{ color: "var(--color-gw-accent)" }}>you.</em>
          </h1>
          <p className="mt-4 text-sm opacity-75">
            A confirmation was sent to {order.email}. We will email you when
            your order ships.
          </p>

          <ul className="mt-10 divide-y" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
            {(order.lines ?? []).map((line) => (
              <li key={line.id} className="flex justify-between gap-4 py-4 text-sm">
                <span>
                  {line.productTitle}
                  {line.variantTitle ? (
                    <span className="block opacity-60">{line.variantTitle}</span>
                  ) : null}
                  <span className="block opacity-60">Qty {line.quantity}</span>
                </span>
                <span>{money(line.unitPriceCents * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 text-sm">
            {[
              ["Subtotal", order.subtotalCents],
              ["Shipping", order.shippingCents],
              ["Tax", order.taxCents],
              ["Total", order.totalCents],
            ].map(([name, cents]) => (
              <div key={name} className="flex justify-between">
                <dt className="opacity-60">{name}</dt>
                <dd>{money(cents as number)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div style={label}>Payment pending</div>
          <p className="mt-4 text-sm opacity-75">
            We have not received confirmation of your payment yet. Refresh this
            page in a moment, or{" "}
            <Link href="/search" className="underline">
              return to the catalog
            </Link>
            .
          </p>
        </div>
      )}
    </section>
  );
}
