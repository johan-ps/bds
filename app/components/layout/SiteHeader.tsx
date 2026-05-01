"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  primaryNavigation,
  utilityNavigation,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";
import { useInlineStudioEditor } from "../site/InlineStudioEditor";
import { LinkButton } from "../ui/LinkButton";

export function SiteHeader() {
  const pathname = usePathname();
  const { isAdmin, session } = useStudio();
  const { canEdit, isEditing, toggleEditor } = useInlineStudioEditor();
  const isSignedIn = Boolean(session);
  const showInlineManager = isAdmin && canEdit && pathname !== "/admin" && pathname !== "/login" && pathname !== "/logout";
  const utilityLinks = utilityNavigation.filter(
    (item) => !(item.href === "/login" && isSignedIn)
  );

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          <img alt="BollyFit Dance Studio logo" className="logo-mark" src="/logo.jpeg" />
          <div className="logo-copy">
            <span>BollyFit Dance Studio</span>
            <small>Fitness Through Dance</small>
          </div>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {primaryNavigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
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
            <button
              className="cta-button"
              onClick={toggleEditor}
              type="button"
            >
              {isEditing ? "Exit Editor" : "Manage Studio"}
            </button>
          ) : !isAdmin ? (
            <LinkButton href="/booking">Register Now</LinkButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}
