import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Hero } from "../components/ui/Hero";
import { LinkButton } from "../components/ui/LinkButton";
import { MediaCard } from "../components/ui/MediaCard";
import { Pill } from "../components/ui/Pill";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { schedule, scheduleHeroImage } from "../content/schedule";
import { danceStyles } from "../content/home";
import { Chip } from "../components/ui/Chip";

export default function SchedulePage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Weekly Schedule</Pill>
          <h1>Plan your week with the rhythm that fits you.</h1>
          <p>Morning, evening, and weekend sessions across all studios.</p>
          <div className="chip-group">
            {danceStyles.map((style) => (
              <Chip key={style}>{style}</Chip>
            ))}
          </div>
          <div className="hero-actions">
            <LinkButton href="/booking">Reserve a Class</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Ask About Levels
            </LinkButton>
          </div>
        </div>
        <MediaCard
          src={scheduleHeroImage.src}
          alt={scheduleHeroImage.alt}
          className="standalone"
        />
      </Hero>

      <Section className="hero-card reveal">
        <SectionTitle title="Weekly Lineup" subtitle="Every day has a mix of styles." />
        <div className="grid">
          {schedule.map((day) => (
            <Card key={day.day}>
              <strong>{day.day}</strong>
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {day.sessions.map((session) => (
                  <div key={`${day.day}-${session.time}`} style={{ display: "grid", gap: 4 }}>
                    <Badge>{session.time}</Badge>
                    <span>{session.className}</span>
                    <small style={{ color: "var(--muted)" }}>{session.location}</small>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="highlight reveal">
        <SectionTitle
          title="Need a Custom Plan?"
          subtitle="We will build a schedule around your goals."
        />
        <LinkButton href="/booking">Book a Consultation</LinkButton>
      </Section>
    </div>
  );
}
