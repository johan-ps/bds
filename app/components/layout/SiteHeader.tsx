"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  primaryNavigation,
  utilityNavigation,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";
import { useInlineStudioEditor } from "../site/InlineStudioEditor";
import { Icon } from "../ui/icons";
import { LinkButton } from "../ui/LinkButton";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAdmin, session } = useStudio();
  const { canEdit, isEditing, toggleEditor } = useInlineStudioEditor();
  const [scrolled, setScrolled] = useState(false);
  const isSignedIn = Boolean(session);
  const showInlineManager =
    isAdmin && canEdit && pathname !== "/admin" && pathname !== "/login" && pathname !== "/logout";
  const utilityLinks = utilityNavigation.filter(
    (item) => !(item.href === "/login" && isSignedIn)
  );

  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => {
      const max = root.scrollHeight - root.clientHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--scroll", String(ratio));
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="scroll-progress" />
      <div className="container header-inner">
        <Link className="logo" href="/">
          <img alt="BollyFit Dance Studio logo" className="logo-mark" src="/logo.jpeg" />
          <div className="logo-copy">
            <span>BollyFit</span>
            <small>Dance Studio</small>
          </div>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Menu">
            <Icon name="menu" />
          </summary>
          <div className="mobile-nav-panel">
            {primaryNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <div className="mobile-nav-divider" />
            {utilityLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {isSignedIn ? (
              <>
                <div className="mobile-nav-divider" />
                <Link href="/logout">Logout</Link>
              </>
            ) : null}
          </div>
        </details>
        <div className="header-actions">
          {isSignedIn ? (
            <>
              <span className="header-link header-link--static">{session?.email}</span>
              <Link className="header-link" href="/logout">
                Logout
              </Link>
            </>
          ) : (
            <Link className="header-link" href="/login">
              Login
            </Link>
          )}
          {showInlineManager ? (
            <button className="cta-button" onClick={toggleEditor} type="button">
              {isEditing ? "Exit Editor" : "Manage Studio"}
            </button>
          ) : !isAdmin ? (
            <LinkButton href="/booking">
              Book a Class <Icon name="arrow-right" size={18} />
            </LinkButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}
