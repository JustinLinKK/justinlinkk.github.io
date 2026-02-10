import Link from "next/link";

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Gallery", href: "/tech-gallery" },
  { label: "Cluster Status", href: "/cluster-status" },
  { label: "Blog", href: "/blog" },
  { label: "CV", href: "/cv-download" }
];

export default function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="text-2xl font-semibold tracking-tight md:text-3xl">
        Justin Lin
      </Link>
      <nav className="hidden gap-6 text-base font-semibold md:flex">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-accent">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="text-base md:hidden">Menu</div>
    </header>
  );
}
