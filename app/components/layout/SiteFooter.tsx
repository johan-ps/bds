"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { primaryNavigation, utilityNavigation } from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";
import { useEditableStudioContent } from "../site/InlineStudioEditor";
import { Icon } from "../ui/icons";
import type { IconName } from "../ui/icons";

const SOCIALS: { name: IconName; href: string; label: string }[] = [
  { name: "instagram", href: "https://www.instagram.com/bollyfit_dance_studio/", label: "Instagram" },
  { name: "facebook", href: "https://www.facebook.com/", label: "Facebook" },
  { name: "youtube", href: "https://www.youtube.com/", label: "YouTube" },
  { name: "tiktok", href: "https://www.tiktok.com/", label: "TikTok" },
];

export function SiteFooter() {
  const content = useEditableStudioContent();
  const { session } = useStudio();
  const isSignedIn = Boolean(session);
  const [subscribed, setSubscribed] = useState(false);
  const utilityLinks = utilityNavigation.filter(
    (item) => !(item.href === "/login" && isSignedIn)
  );

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
    event.currentTarget.reset();
  }

  return (
    <footer className="footer" id="site-footer">
      <div className="container footer-shell">
        <div className="footer-brand">
          <Link className="logo" href="/">
            <img alt="BollyFit Dance Studio logo" className="logo-mark" src="/logo.jpeg" />
            <div className="logo-copy">
              <span>BollyFit</span>
              <small>Dance Studio</small>
            </div>
          </Link>
          <p className="footer-tagline">Where culture takes the floor and confidence takes flight.</p>
          <div className="footer-socials">
            {SOCIALS.map((social) => (
              <a
                aria-label={social.label}
                href={social.href}
                key={social.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon name={social.name} size={18} />
              </a>
            ))}
            <a aria-label="Email" href={`mailto:${content.contact.email}`}>
              <Icon name="mail" size={18} />
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <strong>Explore</strong>
          {primaryNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="footer-contact">
          <strong>Studio</strong>
          <span className="footer-info-row">
            <span className="footer-info-icon">
              <Icon name="pin" size={16} />
            </span>
            <span>{content.contact.address}</span>
          </span>
          <a className="footer-info-row" href={`tel:${content.contact.phone.replace(/[^0-9+]/g, "")}`}>
            <span className="footer-info-icon">
              <Icon name="phone" size={16} />
            </span>
            <span>{content.contact.phone}</span>
          </a>
          <a className="footer-info-row" href={`mailto:${content.contact.email}`}>
            <span className="footer-info-icon">
              <Icon name="mail" size={16} />
            </span>
            <span>{content.contact.email}</span>
          </a>
        </div>

        <div className="footer-links footer-hours">
          <strong>Hours</strong>
          <div className="footer-hours-list">
            {content.contact.hours.map((hour) => (
              <span key={hour.label}>
                <span>{hour.label}</span>
                <b>{hour.time}</b>
              </span>
            ))}
          </div>
          <nav className="footer-utility" aria-label="Footer utility navigation">
            {utilityLinks.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-newsletter">
          <strong>Newsletter</strong>
          <p>Stay updated on classes, events, and exclusive offers.</p>
          <form className="newsletter" onSubmit={handleSubscribe}>
            <input aria-label="Email address" name="email" placeholder="Enter your email" required type="email" />
            <button aria-label="Subscribe" className="cta-button" type="submit">
              <Icon name="arrow-right" size={18} />
            </button>
          </form>
          {subscribed ? (
            <p className="form-status form-status--success">Thanks — you&apos;re on the list!</p>
          ) : null}
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BollyFit Dance Studio. All rights reserved.</span>
        <span className="footer-bottom__links">
          <Link href="/about">Privacy Policy</Link>
          <Link href="/about">Terms of Service</Link>
        </span>
      </div>
    </footer>
  );
}
