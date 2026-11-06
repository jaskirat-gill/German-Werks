export default function Loading() {
  return (
    <section
      className="grain grain-soft min-h-screen px-5 pb-24 pt-[120px] sm:px-7 lg:px-9"
      style={{
        background: 'var(--color-gw-ink)',
      }}
    >
      <div className="mt-32 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-[14px]"
            style={{
              aspectRatio: '3/4',
              background: 'rgba(239, 234, 226, 0.06)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
