import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo">
            <Image src="/logo.jpeg" alt="Bollyfit Dance Studio logo" width={44} height={44} />
            <span>BDS</span>
          </div>
          <p>Fitness through dance. Culture, community, confidence.</p>
        </div>
        <div>
          <strong>Studio</strong>
          <p>Open daily 6am - 10pm</p>
          <p>hello@bollyfitdancestudio.com</p>
          <p>(555) 010-2233</p>
        </div>
        <div>
          <strong>Explore</strong>
          <p>
            <Link href="/schedule">Class Schedule</Link>
          </p>
          <p>
            <Link href="/about">About BDS</Link>
          </p>
          <p>
            <Link href="/gallery">Gallery</Link>
          </p>
          <p>
            <Link href="/booking">Book a Session</Link>
          </p>
          <p>
            <Link href="/contact">Contact Us</Link>
          </p>
        </div>
        <div>
          <strong>Social</strong>
          <p>@bollyfitdancestudio</p>
          <p>Instagram · TikTok · YouTube</p>
        </div>
      </div>
    </footer>
  );
}
