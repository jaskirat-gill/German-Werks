import { ScrollReveal } from "components/animations/scroll-reveal";

const stats = [
  { value: "100%", label: "DRY CARBON" },
  { value: "-15 LBS", label: "AVG SAVINGS" },
  { value: "UV COAT", label: "PROTECTED" },
];

export function TrustStats() {
  return (
    <section className="border-t border-gw-charcoal py-16">
      <ScrollReveal>
        <div className="mx-auto flex max-w-screen-lg items-center justify-center gap-12 md:gap-20">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-12 md:gap-20">
              <div className="text-center">
                <p className="font-heading text-xl font-bold text-gw-text md:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[2px] text-gw-muted">
                  {stat.label}
                </p>
              </div>
              {i < stats.length - 1 && (
                <div className="h-8 w-px bg-gw-charcoal" />
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
