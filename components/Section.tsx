export default function Section({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-ink/10 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(13,15,22,0.4)] backdrop-blur">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-ink/70">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
