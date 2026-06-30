"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Gallery", href: "/tech-gallery" },
  { label: "Cluster Status", href: "/cluster-status" },
  { label: "Blog", href: "/blog" },
  { label: "CV", href: "/cv-download" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Justin Lin
        </Link>

        <nav className="hidden gap-4 text-sm font-semibold lg:flex xl:gap-6 xl:text-base">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/40 hover:text-accent lg:hidden"
          aria-expanded={isMenuOpen ? "true" : "false"}
          aria-controls="mobile-site-menu"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-site-menu"
          className="mt-4 grid gap-2 rounded-2xl border border-ink/10 bg-white/90 p-3 shadow-lg backdrop-blur lg:hidden"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-ink hover:bg-ink/5 hover:text-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
