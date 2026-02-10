import Link from "next/link";

export default function NotFound() {
  return (
    <section className="rounded-3xl border border-ink/10 bg-white/80 p-10 text-center shadow-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-ink/50">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink md:text-4xl">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base text-ink/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex justify-center text-base font-semibold text-accent"
      >
        Go back home
      </Link>
    </section>
  );
}
