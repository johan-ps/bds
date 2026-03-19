"use client";

import Link from "next/link";
import {
  primaryNavigation,
  utilityNavigation,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";

export function SiteFooter() {
  const { content, isAdmin, session } = useStudio();
  const isSignedIn = Boolean(session);
  const utilityLinks = utilityNavigation.filter(
    (item) => !(item.href === "/login" && isSignedIn)
  );

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-brand">
          <div className="logo">
            <img alt="BollyFit Dance Studio logo" className="logo-mark" src="/logo.jpeg" />
            <div className="logo-copy">
              <span>BollyFit Dance Studio</span>
              <small>Fitness Through Dance</small>
            </div>
          </div>
          <p>
            A modern cultural dance school built around movement, confidence, and South Asian
            performance energy.
          </p>
          <p>{content.contact.serviceArea}</p>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="footer-links">
          <strong>Studio</strong>
          {utilityLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
          {isAdmin ? <Link href="/admin">Studio Management</Link> : null}
          {isSignedIn ? <Link href="/logout">Logout</Link> : null}
        </div>
        <div className="footer-contact">
          <strong>Connect</strong>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <a href={`tel:${content.contact.phone.replace(/[^0-9+]/g, "")}`}>{content.contact.phone}</a>
          <a
            href="https://www.instagram.com/bollyfit_dance_studio/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {content.contact.instagram}
          </a>
          <span>{content.contact.youtube}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Fitness Through Dance.</span>
        <span>{new Date().getFullYear()} BollyFit Dance Studio</span>
      </div>
    </footer>
  );
}
