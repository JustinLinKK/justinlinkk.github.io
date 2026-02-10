export default function Tag({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-ink/15 px-3 py-1 text-xs uppercase tracking-wide text-ink/70">
      {label}
    </span>
  );
}
