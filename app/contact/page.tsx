import { Card } from "../components/ui/Card";
import { Hero } from "../components/ui/Hero";
import { LinkButton } from "../components/ui/LinkButton";
import { Pill } from "../components/ui/Pill";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { StatsGrid } from "../components/ui/StatsGrid";

const contactStats = [
  { label: "Studios", value: "4" },
  { label: "Programs", value: "12" },
  { label: "Response", value: "24h" },
];

export default function ContactPage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Contact Us</Pill>
          <h1>Let us plan your dance journey.</h1>
          <p>Classes, private events, corporate wellness, and workshops.</p>
          <StatsGrid stats={contactStats} />
        </div>
        <div className="hero-card">
          <form className="form">
            <input type="text" placeholder="Full name" />
            <input type="email" placeholder="Email address" />
            <input type="tel" placeholder="Phone number" />
            <select>
              <option>General inquiry</option>
              <option>Private lesson</option>
              <option>Corporate wellness</option>
              <option>Kids program</option>
            </select>
            <textarea placeholder="Tell us about your goals"></textarea>
            <button className="cta" type="submit">
              Send Message
            </button>
          </form>
        </div>
      </Hero>

      <Section className="reveal">
        <SectionTitle title="Reach the Studio" subtitle="We are ready to help." />
        <div className="grid">
          <Card>
            <strong>Studio Support</strong>
            <p>hello@bollyfitdancestudio.com</p>
            <p>(555) 010-2233</p>
          </Card>
          <Card>
            <strong>Partnerships</strong>
            <p>partners@bollyfitdancestudio.com</p>
            <p>Brand activations, media, and events.</p>
          </Card>
          <Card>
            <strong>Follow Us</strong>
            <p>Instagram, TikTok, YouTube</p>
            <p>@bollyfitdancestudio</p>
          </Card>
        </div>
      </Section>

      <Section className="highlight reveal">
        <SectionTitle title="Want a Faster Reply?" subtitle="Call us during studio hours." />
        <LinkButton href="tel:5550102233">Call the Studio</LinkButton>
      </Section>
    </div>
  );
}
