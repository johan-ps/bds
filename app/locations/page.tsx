import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Hero } from "../components/ui/Hero";
import { LinkButton } from "../components/ui/LinkButton";
import { MediaCard } from "../components/ui/MediaCard";
import { Pill } from "../components/ui/Pill";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { locations, locationsHeroImage } from "../content/locations";

export default function LocationsPage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Our Studios</Pill>
          <h1>Four spaces. One vibrant community.</h1>
          <p>Choose the studio that matches your schedule and vibe.</p>
          <div className="hero-actions">
            <LinkButton href="/booking">Book at a Studio</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Ask a Question
            </LinkButton>
          </div>
        </div>
        <MediaCard
          src={locationsHeroImage.src}
          alt={locationsHeroImage.alt}
          className="standalone"
        />
      </Hero>

      <Section className="hero-card reveal">
        <SectionTitle title="Studio Locations" subtitle="Easy access, welcoming spaces." />
        <div className="grid">
          {locations.map((location) => (
            <Card key={location.name}>
              <strong>{location.name}</strong>
              <p>{location.address}</p>
              <p>{location.hours}</p>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {location.features.map((feature) => (
                  <Badge key={feature}>{feature}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="highlight reveal">
        <SectionTitle
          title="Need Help Choosing?"
          subtitle="We will match you with the best location."
        />
        <LinkButton href="/contact">Talk to the Team</LinkButton>
      </Section>
    </div>
  );
}
