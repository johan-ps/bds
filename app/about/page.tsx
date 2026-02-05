import { Hero } from "../components/ui/Hero";
import { LinkButton } from "../components/ui/LinkButton";
import { MediaCard } from "../components/ui/MediaCard";
import { Pill } from "../components/ui/Pill";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Card } from "../components/ui/Card";
import { values, aboutHeroImage } from "../content/about";
import { team } from "../content/team";
import { ProfileCard } from "../components/ui/ProfileCard";

export default function AboutPage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>About BDS</Pill>
          <h1>Rooted in culture. Powered by community.</h1>
          <p>Indian and Sri Lankan dance classes with modern training.</p>
          <div className="hero-actions">
            <LinkButton href="/schedule">Explore Classes</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Meet the Team
            </LinkButton>
          </div>
        </div>
        <MediaCard src={aboutHeroImage.src} alt={aboutHeroImage.alt} className="standalone" />
      </Hero>

      <Section className="hero-card reveal">
        <SectionTitle title="Our Mission" subtitle="Culture, wellness, and confidence." />
        <div className="grid">
          {values.map((value) => (
            <Card key={value.title}>
              <strong>{value.title}</strong>
              <p>{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="reveal">
        <SectionTitle
          title="Leadership & Choreography"
          subtitle="Director, head choreographer, and studio team."
        />
        <div className="grid">
          {team.map((leader) => (
            <ProfileCard key={leader.name} {...leader} />
          ))}
        </div>
      </Section>

      <Section className="highlight reveal">
        <SectionTitle title="Join the BDS Family" subtitle="Start with a trial class." />
        <LinkButton href="/booking">Book a Trial Class</LinkButton>
      </Section>
    </div>
  );
}
