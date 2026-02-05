import Image from "next/image";
import Link from "next/link";
import { primaryNav } from "../../content/navigation";
import { LinkButton } from "../ui/LinkButton";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          <Image src="/logo.jpeg" alt="Bollyfit Dance Studio logo" width={44} height={44} priority />
          <span>Bollyfit Dance Studio</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <div className="mobile-nav-panel">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </details>
        <LinkButton href="/booking">Book a Trial</LinkButton>
      </div>
    </header>
  );
}
