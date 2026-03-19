"use client";

import Link from "next/link";
import {
  primaryNavigation,
  utilityNavigation,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";
import { LinkButton } from "../ui/LinkButton";

export function SiteHeader() {
  const { isAdmin, session } = useStudio();
  const isSignedIn = Boolean(session);
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
                {isAdmin ? <Link href="/admin">Admin Dashboard</Link> : null}
                <Link href="/logout">Logout</Link>
              </>
            ) : null}
          </div>
        </details>
        <div className="header-actions">
          {isSignedIn ? (
            <>
              {isAdmin ? (
                <Link className="header-link" href="/admin">
                  Dashboard
                </Link>
              ) : (
                <span className="header-link header-link--static">{session?.email}</span>
              )}
              <Link className="header-link" href="/logout">
                Logout
              </Link>
            </>
          ) : (
            <Link className="header-link" href="/login">
              Login
            </Link>
          )}
          <LinkButton href={isAdmin ? "/admin" : "/booking"}>
            {isAdmin ? "Manage Studio" : "Register Now"}
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
