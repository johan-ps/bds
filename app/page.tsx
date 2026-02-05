import { Card } from "./components/ui/Card";
import { Chip } from "./components/ui/Chip";
import { Hero } from "./components/ui/Hero";
import { LinkButton } from "./components/ui/LinkButton";
import { MediaCard } from "./components/ui/MediaCard";
import { Pill } from "./components/ui/Pill";
import { ProfileCard } from "./components/ui/ProfileCard";
import { Section } from "./components/ui/Section";
import { SectionTitle } from "./components/ui/SectionTitle";
import { StatsGrid } from "./components/ui/StatsGrid";
import { danceStyles, heroImages, highlights, programs, stats, testimonials } from "./content/home";
import { team } from "./content/team";

export default function HomePage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Indian & Sri Lankan Dance School</Pill>
          <h1>
            <span className="accent-text">Bollyfit Dance Studio</span>
            <br />
            Move with rhythm. Train with joy.
          </h1>
          <p>
            Bollywood, semiclassical, kuthu, hiphop, and contemporary classes built for energy,
            confidence, and community.
          </p>
          <div className="hero-actions">
            <LinkButton href="/booking">Book a Trial Class</LinkButton>
            <LinkButton href="/schedule" variant="secondary">
              View Schedule
            </LinkButton>
          </div>
          <div className="chip-group">
            {danceStyles.map((style) => (
              <Chip key={style}>{style}</Chip>
            ))}
          </div>
          <StatsGrid stats={stats} />
        </div>
        <div className="hero-media">
          {heroImages.map((image, index) => (
            <MediaCard
              key={image.src}
              src={image.src}
              alt={image.alt}
              className={image.className}
              priority={index === 0}
            />
          ))}
        </div>
      </Hero>

      <Section className="hero-card reveal">
        <SectionTitle
          title="Why Dancers Choose BDS"
          subtitle="Culture-first choreography, modern fitness, and a welcoming vibe."
        />
        <div className="grid">
          {highlights.map((item) => (
            <Card key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="reveal">
        <SectionTitle title="Signature Programs" subtitle="Pick a style and feel the energy." />
        <div className="grid">
          {programs.map((program) => (
            <Card key={program.title}>
              <strong>{program.title}</strong>
              <p>{program.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="highlight reveal">
        <SectionTitle title="Upcoming This Week" subtitle="Limited spots across all locations." />
        <div className="grid">
          {[
            "Wed 6:30pm · Bollyfit Burn",
            "Thu 7:15pm · Semiclassical Flow",
            "Sat 10:00am · Kuthu Power",
          ].map((item) => (
            <Card key={item}>
              <strong>{item}</strong>
              <p>Book early for front-row placement.</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="reveal">
        <SectionTitle title="Meet the Faculty" subtitle="Leadership and choreographers." />
        <div className="grid">
          {team.map((person) => (
            <ProfileCard key={person.name} {...person} />
          ))}
        </div>
      </Section>

      <Section className="reveal">
        <SectionTitle title="Community Voices" subtitle="Short notes from our members." />
        <div className="grid">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <strong>{testimonial.name}</strong>
              <p>&quot;{testimonial.quote}&quot;</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="hero-card reveal">
        <SectionTitle title="Ready to Dance?" subtitle="Start with a trial class this week." />
        <div className="hero-actions">
          <LinkButton href="/booking">Claim Trial Pass</LinkButton>
          <LinkButton href="/contact" variant="secondary">
            Talk to Us
          </LinkButton>
        </div>
      </Section>
    </div>
  );
}
