"use client";

import { useMemo, useState, type CSSProperties } from "react";
import type {
  EventPost,
  GalleryItem,
  InstructorProfile,
  PackageOption,
  ScheduleDay,
  Testimonial,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";
import { useEditableStudioContent } from "./InlineStudioEditor";
import { LinkButton } from "../ui/LinkButton";
import { Icon, type IconName } from "../ui/icons";
import { Counter } from "../ui/Counter";
import { Carousel } from "../ui/Carousel";
import { Lightbox } from "../ui/Lightbox";
import {
  ContactForm,
  EditableActionButton,
  EditableDiv,
  EditableText,
  Eyebrow,
  PageHero,
  RegistrationForm,
  ResolvedImage,
  SectionHeading,
} from "./studio-ui";

/* ============================================================ helpers === */

const STAT_ICONS: IconName[] = ["users", "star", "calendar", "trophy"];

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <span className="stars" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, index) => (
        <Icon key={index} name="star" size={15} />
      ))}
    </span>
  );
}

function highlightWord(text: string, word: string) {
  if (!word || !text.includes(word)) return text;
  const parts = text.split(word);
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? <span className="gradient-text">{word}</span> : null}
        </span>
      ))}
    </>
  );
}

function styleModifier(style: string) {
  const value = style.toLowerCase();
  if (value.includes("hip")) return "cal__class--hiphop";
  if (value.includes("kuthu")) return "cal__class--kuthu";
  if (value.includes("contemp")) return "cal__class--contemporary";
  if (value.includes("fusion")) return "cal__class--fusion";
  if (value.includes("kid") || value.includes("mini") || value.includes("junior"))
    return "cal__class--kids";
  return "";
}

function styleIcon(style: string): IconName {
  const value = style.toLowerCase();
  if (value.includes("hip")) return "flame";
  if (value.includes("kuthu")) return "music";
  if (value.includes("contemp")) return "heart";
  if (value.includes("fusion")) return "layers";
  return "star";
}

function toMinutes(time: string) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (/pm/i.test(match[3])) hours += 12;
  return hours * 60 + Number(match[2]);
}

/* ============================================================== HERO ==== */

function HeroPanel() {
  const content = useEditableStudioContent();
  const { resolveImageUrl } = useStudio();

  return (
    <section className="hero-panel reveal">
      <EditableDiv
        field={{
          kind: "image",
          path: "hero.backgroundImage",
          label: "Hero background image",
          alt: "Hero background image",
        }}
        className="hero-panel__media"
        style={{ backgroundImage: `url(${resolveImageUrl(content.hero.backgroundImage)})` }}
      />
      <EditableDiv
        field={{
          kind: "image",
          path: "hero.spotlightImage",
          label: "Hero spotlight image",
          alt: "Hero spotlight image",
        }}
        className="hero-panel__subject"
        style={{ backgroundImage: `url(${resolveImageUrl(content.hero.spotlightImage)})` }}
      />
      <div className="hero-panel__veil" />
      <div className="hero-panel__glow hero-panel__glow--one" />
      <div className="hero-panel__glow hero-panel__glow--two" />
      <div className="hero-panel__inner">
        <div className="hero-panel__content">
          <div className="hero-panel__copy">
            <EditableText
              as="span"
              className="hero-eyebrow"
              field={{ kind: "text", path: "hero.eyebrow", label: "Hero eyebrow" }}
            >
              <Icon name="sparkle" size={14} />
              {content.hero.eyebrow}
            </EditableText>
            <EditableText
              as="h1"
              field={{ kind: "text", path: "hero.title", label: "Hero title", multiline: true }}
            >
              {highlightWord(content.hero.title, content.hero.titleHighlight)}
            </EditableText>
            <EditableText
              as="p"
              className="hero-copy"
              field={{ kind: "text", path: "hero.subtitle", label: "Hero subtitle", multiline: true }}
            >
              {content.hero.subtitle}
            </EditableText>
            <div className="hero-actions">
              <EditableActionButton
                href={content.hero.primaryAction.href}
                hrefPath="hero.primaryAction.href"
                label={content.hero.primaryAction.label}
                labelPath="hero.primaryAction.label"
                path="hero.primaryAction"
                selectionLabel="Hero primary button"
              />
              <EditableActionButton
                href={content.hero.secondaryAction.href}
                hrefPath="hero.secondaryAction.href"
                label={content.hero.secondaryAction.label}
                labelPath="hero.secondaryAction.label"
                path="hero.secondaryAction"
                selectionLabel="Hero secondary button"
                variant="secondary"
                icon="calendar"
              />
            </div>
          </div>
          <div className="hero-panel__bottom">
            <div className="hero-stats">
              {content.stats.map((stat, index) => (
                <div className="hero-stat" key={stat.label}>
                  <span className="icon-disc">
                    <Icon name={STAT_ICONS[index % STAT_ICONS.length]} size={17} />
                  </span>
                  <div>
                    <strong>
                      <Counter value={stat.value} />
                    </strong>
                    <EditableText
                      as="span"
                      field={{ kind: "text", path: `stats.${index}.label`, label: `Stat ${index + 1} label` }}
                    >
                      {stat.label}
                    </EditableText>
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-note hero-note--float">
              <EditableText
                as="span"
                field={{ kind: "text", path: "hero.notes.0", label: "Hero note", multiline: true }}
              >
                {content.hero.notes[0]}
              </EditableText>
              <span className="play-btn play-btn--ghost">
                <Icon name="play" size={16} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ SUMMIT ==== */

function SummitFeature() {
  const content = useEditableStudioContent();
  const { summitFeature } = content;

  return (
    <section className="summit-banner reveal">
      <div className="summit-banner__copy">
        <EditableText
          as="span"
          className="chip"
          field={{ kind: "text", path: "summitFeature.label", label: "Summit label" }}
        >
          {summitFeature.label}
        </EditableText>
        <EditableText
          as="h2"
          field={{ kind: "text", path: "summitFeature.title", label: "Summit title", multiline: true }}
        >
          {summitFeature.title}
        </EditableText>
        <EditableText
          as="p"
          field={{
            kind: "text",
            path: "summitFeature.description",
            label: "Summit description",
            multiline: true,
          }}
        >
          {summitFeature.description}
        </EditableText>
        <EditableActionButton
          href={summitFeature.action.href}
          hrefPath="summitFeature.action.href"
          label={summitFeature.action.label}
          labelPath="summitFeature.action.label"
          path="summitFeature.action"
          selectionLabel="Summit button"
          variant="secondary"
        />
      </div>
      <EditableDiv
        className="summit-banner__media zoom"
        field={{
          kind: "image",
          path: "summitFeature.image",
          label: "Summit image",
          alt: summitFeature.title,
        }}
      >
        <ResolvedImage src={summitFeature.image} alt={summitFeature.title} className="cover-image" />
      </EditableDiv>
      <div className="summit-banner__meta">
        <div className="summit-meta-row">
          <Icon name="pin" size={18} />
          <span>{summitFeature.location}</span>
        </div>
        <div className="summit-meta-row">
          <Icon name="calendar" size={18} />
          <span>{summitFeature.date}</span>
        </div>
        <div className="summit-meta-row">
          <Icon name="globe" size={18} />
          <span>{summitFeature.community}</span>
        </div>
      </div>
    </section>
  );
}

/* ========================================================== IDENTITY ==== */

const VALUE_ICONS: IconName[] = ["heart", "users", "trophy", "star", "compass"];

function IdentityPanel() {
  const content = useEditableStudioContent();

  return (
    <section className="brand-panel reveal">
      <div className="brand-panel__logo zoom">
        <ResolvedImage src="/images/bds-logo-burst.jpg" alt="BollyFit Dance Studio" className="cover-image" />
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <span className="play-btn">
            <Icon name="play" size={22} />
          </span>
        </div>
      </div>
      <div className="brand-panel__copy">
        <Eyebrow>Our Identity</Eyebrow>
        <EditableText
          as="h2"
          field={{ kind: "text", path: "cultureStory.title", label: "Identity title", multiline: true }}
        >
          {content.cultureStory.title}
        </EditableText>
        <EditableText
          as="p"
          field={{
            kind: "text",
            path: "cultureStory.paragraphs.0",
            label: "Identity intro",
            multiline: true,
          }}
        >
          {content.cultureStory.paragraphs[0]}
        </EditableText>
        <div className="value-grid">
          {content.values.slice(0, 4).map((value, index) => (
            <div className="value-item" key={value.title}>
              <h4>
                <span className="icon-disc" style={{ width: 38, height: 38, borderRadius: 11 }}>
                  <Icon name={VALUE_ICONS[index % VALUE_ICONS.length]} size={16} />
                </span>
                {value.title}
              </h4>
              <p>{value.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================= STYLE TILES === */

function StyleTiles({ limit = 4 }: { limit?: number }) {
  const content = useEditableStudioContent();
  const styles = content.styleOfferings.slice(0, limit);

  return (
    <div className="style-tiles">
      {styles.map((style, index) => (
        <article className="style-tile" key={style.name}>
          <EditableDiv
            className="style-tile__img"
            field={{
              kind: "image",
              path: `styleOfferings.${index}.image`,
              label: `${style.name} image`,
              alt: style.name,
            }}
          >
            <ResolvedImage src={style.image} alt={style.name} className="cover-image" />
          </EditableDiv>
          <div className="style-tile__body">
            <EditableText
              as="h3"
              field={{ kind: "text", path: `styleOfferings.${index}.name`, label: `${style.name} name` }}
            >
              {style.name}
            </EditableText>
            <EditableText
              as="p"
              field={{ kind: "text", path: `styleOfferings.${index}.summary`, label: `${style.name} summary`, multiline: true }}
            >
              {style.summary}
            </EditableText>
            <LinkButton href="/classes" variant="secondary">
              Explore Style <Icon name="arrow-right" size={16} />
            </LinkButton>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ===================================================== STYLE CARDS (classes) */

const STYLE_LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];

function StyleProgramCards() {
  const content = useEditableStudioContent();
  const [style, setStyle] = useState("All Styles");
  const [level, setLevel] = useState("All Levels");

  const filtered = content.styleOfferings.filter(
    (offering) => style === "All Styles" || offering.name === style
  );

  return (
    <div className="section-block">
      <div className="filterbar reveal" role="group" aria-label="Class filters">
        <span className="badge" style={{ border: 0, background: "transparent" }}>
          <Icon name="compass" size={15} /> Style
        </span>
        {["All Styles", ...content.styleOfferings.map((offering) => offering.name)].map((option) => (
          <button
            className="filter-pill"
            key={option}
            type="button"
            aria-pressed={style === option}
            onClick={() => setStyle(option)}
          >
            {option}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        {STYLE_LEVELS.map((option) => (
          <button
            className="filter-pill"
            key={option}
            type="button"
            aria-pressed={level === option}
            onClick={() => setLevel(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="style-tiles reveal" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {filtered.map((offering, index) => {
          const realIndex = content.styleOfferings.indexOf(offering);
          return (
            <article className="style-tile" key={offering.name} style={{ "--i": index } as CSSProperties}>
              <EditableDiv
                className="style-tile__img"
                field={{
                  kind: "image",
                  path: `styleOfferings.${realIndex}.image`,
                  label: `${offering.name} image`,
                  alt: offering.name,
                }}
              >
                <ResolvedImage src={offering.image} alt={offering.name} className="cover-image" />
              </EditableDiv>
              <div className="style-tile__body">
                <span className="icon-disc" style={{ position: "absolute", top: 16, left: 16, width: 42, height: 42 }}>
                  <Icon name={styleIcon(offering.name)} size={18} />
                </span>
                <h3>{offering.name}</h3>
                <p>{offering.audience}</p>
                <span className="badge" style={{ width: "fit-content" }}>
                  {level} · 2–3× / week
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

const AUDIENCE_PROGRAMS: { name: string; copy: string; meta: string; icon: IconName }[] = [
  { name: "Kids (5–9)", copy: "Fun, structured classes that build coordination, joy, and confidence.", meta: "All Levels · 1–2× / week", icon: "heart" },
  { name: "Teens (10–17)", copy: "Build skills, stage presence, and leadership in a supportive space.", meta: "Beginner to Advanced · 2–3× / week", icon: "users" },
  { name: "Adults (18+)", copy: "Dance for fitness, creativity, and confidence — your way, your pace.", meta: "Beginner to Advanced · 1–3× / week", icon: "flame" },
  { name: "Performance Teams", copy: "Train for competition, festivals, and global performances.", meta: "Intermediate to Advanced · 3–4× / week", icon: "trophy" },
];

function AudiencePrograms() {
  return (
    <div className="grid-4">
      {AUDIENCE_PROGRAMS.map((program, index) => (
        <article
          className="info-card card-hover reveal"
          key={program.name}
          style={{ "--i": index } as CSSProperties}
        >
          <span className="icon-disc">
            <Icon name={program.icon} size={20} />
          </span>
          <h3 style={{ marginTop: 14 }}>{program.name}</h3>
          <p>{program.copy}</p>
          <span className="badge" style={{ width: "fit-content", color: "var(--accent-gold)" }}>
            {program.meta}
          </span>
        </article>
      ))}
    </div>
  );
}

/* ===================================================== INSTRUCTOR CAROUSEL */

function InstructorCarousel() {
  const content = useEditableStudioContent();

  return (
    <Carousel ariaLabel="Instructors">
      {content.instructors.map((instructor) => (
        <article className="carousel-card card-hover" key={instructor.name}>
          <div className="carousel-card__img zoom">
            <ResolvedImage src={instructor.image} alt={instructor.name} className="cover-image" />
            <div className="carousel-card__cap">
              <strong>{instructor.name}</strong>
              <span>{instructor.role}</span>
            </div>
          </div>
        </article>
      ))}
    </Carousel>
  );
}

/* ============================================================= FOUNDER === */

function FounderCard() {
  const content = useEditableStudioContent();
  const { founder } = content;

  return (
    <section className="founder-card reveal">
      <EditableDiv
        className="founder-card__media zoom"
        field={{ kind: "image", path: "founder.image", label: "Founder image", alt: founder.name }}
      >
        <ResolvedImage src={founder.image} alt={founder.name} className="cover-image" />
      </EditableDiv>
      <div className="founder-card__body">
        <span className="chip" style={{ width: "fit-content" }}>
          <EditableText as="span" field={{ kind: "text", path: "founder.role", label: "Founder role" }}>
            {founder.role}
          </EditableText>
        </span>
        <EditableText as="h2" field={{ kind: "text", path: "founder.name", label: "Founder name" }}>
          {founder.name}
        </EditableText>
        <p style={{ color: "var(--accent-gold)", fontWeight: 600, margin: 0 }}>
          <EditableText
            as="span"
            field={{ kind: "text", path: "founder.tagline", label: "Founder tagline", multiline: true }}
          >
            {founder.tagline}
          </EditableText>
        </p>
        <EditableText
          as="p"
          field={{ kind: "text", path: "founder.bio", label: "Founder bio", multiline: true }}
        >
          {founder.bio}
        </EditableText>
        <div className="founder-card__stats">
          {founder.stats.map((stat, index) => (
            <div className="founder-card__stat" key={stat.label}>
              <span className="icon-disc" style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 6 }}>
                <Icon name={STAT_ICONS[index % STAT_ICONS.length]} size={16} />
              </span>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================================================== INSTRUCTOR GRID === */

function InstructorGrid({ instructors }: { instructors: InstructorProfile[] }) {
  const content = useEditableStudioContent();

  return (
    <div className="instructor-grid">
      {instructors.map((instructor) => {
        const index = content.instructors.indexOf(instructor);
        return (
          <article className="instructor-card card-hover reveal" key={instructor.name}>
            <EditableDiv
              className="instructor-card__image zoom"
              field={{
                kind: "image",
                path: `instructors.${index}.image`,
                label: `${instructor.name} image`,
                alt: instructor.name,
              }}
            >
              <ResolvedImage src={instructor.image} alt={instructor.name} className="cover-image" />
            </EditableDiv>
            <div className="instructor-card__body">
              <EditableText
                as="h3"
                field={{ kind: "text", path: `instructors.${index}.name`, label: `${instructor.name} name` }}
              >
                {instructor.name}
              </EditableText>
              <EditableText
                as="span"
                className="chip chip--light"
                field={{ kind: "text", path: `instructors.${index}.role`, label: `${instructor.name} role` }}
              >
                {instructor.role}
              </EditableText>
              <EditableText
                as="p"
                className="instructor-card__specialties"
                field={{
                  kind: "text",
                  path: `instructors.${index}.specialties`,
                  label: `${instructor.name} specialties`,
                  multiline: true,
                }}
              >
                Styles: {instructor.specialties}
              </EditableText>
              <EditableText
                as="p"
                field={{ kind: "text", path: `instructors.${index}.bio`, label: `${instructor.name} bio`, multiline: true }}
              >
                {instructor.bio}
              </EditableText>
              <div className="instructor-socials">
                <a
                  aria-label="Instagram"
                  href={instructor.instagram ?? "https://www.instagram.com/bollyfit_dance_studio/"}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon name="instagram" size={16} />
                </a>
                <a
                  aria-label="YouTube"
                  href={instructor.youtube ?? "https://www.youtube.com/"}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon name="youtube" size={16} />
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ======================================================= SCHEDULE CAL === */

const SCHEDULE_FILTERS = ["All", "Bollywood", "Kuthu", "Hip-Hop", "Contemporary", "Fusion"];

function ScheduleCalendar({ schedule }: { schedule: ScheduleDay[] }) {
  const [filter, setFilter] = useState("All");

  const times = useMemo(() => {
    const set = new Set<string>();
    schedule.forEach((day) => day.sessions.forEach((session) => set.add(session.time)));
    return [...set].sort((a, b) => toMinutes(a) - toMinutes(b));
  }, [schedule]);

  const matches = (style: string) =>
    filter === "All" || style.toLowerCase().includes(filter.toLowerCase());

  return (
    <div className="section-block">
      <div className="filterbar reveal" aria-label="Schedule filters" role="group">
        <span className="badge" style={{ border: 0, background: "transparent" }}>
          <Icon name="compass" size={15} /> Style
        </span>
        {SCHEDULE_FILTERS.map((option) => (
          <button
            className="filter-pill"
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="cal reveal">
        <div className="cal__head">
          <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Weekly Schedule</strong>
          <span className="badge">
            <Icon name="calendar" size={15} /> {schedule.length}-day week
          </span>
        </div>
        <div className="cal__scroll">
          <div className="cal__grid" style={{ gridTemplateColumns: `88px repeat(${schedule.length}, minmax(0, 1fr))` }}>
            <div className="cal__time cal__day" aria-hidden />
            {schedule.map((day) => (
              <div className="cal__day" key={day.day}>
                <strong>{day.day.slice(0, 3)}</strong>
                <span>{day.sessions.length} class{day.sessions.length === 1 ? "" : "es"}</span>
              </div>
            ))}
            {times.map((time) => (
              <ScheduleRow key={time} time={time} schedule={schedule} matches={matches} />
            ))}
          </div>
        </div>
      </div>

      <div className="cal-legend">
        {[
          { label: "Bollywood", color: "var(--accent-gold)" },
          { label: "Hip-Hop", color: "var(--accent-violet)" },
          { label: "Kuthu", color: "var(--accent-amber)" },
          { label: "Contemporary", color: "var(--accent-magenta)" },
          { label: "Fusion", color: "#6fe0a8" },
          { label: "Kids", color: "var(--accent-coral)" },
        ].map((item) => (
          <span key={item.label}>
            <i style={{ background: item.color }} /> {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScheduleRow({
  time,
  schedule,
  matches,
}: {
  time: string;
  schedule: ScheduleDay[];
  matches: (style: string) => boolean;
}) {
  return (
    <>
      <div className="cal__time">{time}</div>
      {schedule.map((day) => {
        const session = day.sessions.find((item) => item.time === time);
        return (
          <div className="cal__cell" key={`${day.day}-${time}`}>
            {session && matches(session.style) ? (
              <div className={`cal__class ${styleModifier(session.style)}`}>
                <strong>{session.style}</strong>
                <span>{session.level}</span>
                <span>{session.group}</span>
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

/* ============================================================ EVENTS ==== */

function FeaturedEvent({ index = 0 }: { index?: number }) {
  const content = useEditableStudioContent();
  const event = content.events[index];
  if (!event) return null;

  return (
    <section className="featured-event reveal">
      <div className="featured-event__body">
        <span className="chip" style={{ width: "fit-content" }}>
          Featured Event
        </span>
        <EditableText
          as="h2"
          field={{ kind: "text", path: `events.${index}.title`, label: "Featured event title", multiline: true }}
        >
          {event.title}
        </EditableText>
        <EditableText
          as="p"
          field={{ kind: "text", path: `events.${index}.summary`, label: "Featured event summary", multiline: true }}
        >
          {event.summary}
        </EditableText>
        <div className="featured-event__meta">
          <span className="badge">
            <Icon name="calendar" size={15} /> {event.date}
          </span>
          <span className="badge">
            <Icon name="pin" size={15} /> {event.location}
          </span>
        </div>
        <div className="hero-actions">
          <EditableActionButton
            href={event.ctaHref}
            hrefPath={`events.${index}.ctaHref`}
            label={event.ctaLabel}
            labelPath={`events.${index}.ctaLabel`}
            path={`events.${index}.cta`}
            selectionLabel="Featured event button"
          />
          <LinkButton href="/contact" variant="secondary">
            Get Directions <Icon name="pin" size={16} />
          </LinkButton>
        </div>
      </div>
      <EditableDiv
        className="featured-event__media zoom"
        field={{ kind: "image", path: `events.${index}.image`, label: "Featured event image", alt: event.title }}
      >
        <ResolvedImage src={event.image} alt={event.title} className="cover-image" />
      </EditableDiv>
    </section>
  );
}

function EventGrid({ events }: { events: EventPost[] }) {
  const content = useEditableStudioContent();

  return (
    <div className="grid-4">
      {events.map((event, localIndex) => {
        const index = content.events.indexOf(event);
        return (
          <article className="event-card card-hover reveal" key={event.title} style={{ "--i": localIndex } as CSSProperties}>
            <EditableDiv
              className="event-card__image zoom"
              field={{ kind: "image", path: `events.${index}.image`, label: `${event.title} image`, alt: event.title }}
            >
              <ResolvedImage src={event.image} alt={event.title} className="cover-image" />
              <span className="date-badge">
                <Icon name="calendar" size={16} />
              </span>
            </EditableDiv>
            <div className="event-card__body">
              <EditableText
                as="h3"
                field={{ kind: "text", path: `events.${index}.title`, label: `Event ${index + 1} title`, multiline: true }}
              >
                {event.title}
              </EditableText>
              <div className="cluster">
                <span className="badge">
                  <Icon name="calendar" size={14} /> {event.date}
                </span>
                <span className="badge">
                  <Icon name="pin" size={14} /> {event.location}
                </span>
              </div>
              <EditableText
                as="p"
                field={{ kind: "text", path: `events.${index}.summary`, label: `${event.title} summary`, multiline: true }}
              >
                {event.summary}
              </EditableText>
              <EditableActionButton
                href={event.ctaHref}
                hrefPath={`events.${index}.ctaHref`}
                label={event.ctaLabel}
                labelPath={`events.${index}.ctaLabel`}
                path={`events.${index}.cta`}
                selectionLabel={`${event.title} call to action`}
                variant="secondary"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PastHighlights() {
  const content = useEditableStudioContent();

  return (
    <div className="highlight-grid">
      {content.pastHighlights.map((highlight, index) => (
        <article className="highlight reveal" key={highlight.title} style={{ "--i": index } as CSSProperties}>
          <ResolvedImage src={highlight.image} alt={highlight.title} className="cover-image" />
          <span className="play-btn">
            <Icon name="play" size={18} />
          </span>
          <div className="highlight__cap">{highlight.title}</div>
        </article>
      ))}
    </div>
  );
}

/* =========================================================== GALLERY ==== */

function GalleryMasonry({ gallery }: { gallery: GalleryItem[] }) {
  const content = useEditableStudioContent();
  const { resolveImageUrl } = useStudio();
  const categories = useMemo(
    () => ["All Moments", ...Array.from(new Set(gallery.map((item) => item.category)))],
    [gallery]
  );
  const [active, setActive] = useState("All Moments");
  const visible = gallery.filter((item) => active === "All Moments" || item.category === active);

  return (
    <div className="section-block">
      <div className="filterbar reveal" aria-label="Gallery filters" role="group">
        {categories.map((category) => (
          <button
            className="filter-pill"
            key={category}
            type="button"
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <Lightbox>
        <div className="masonry reveal">
          {visible.map((item) => {
            const index = content.gallery.indexOf(item);
            return (
              <article
                className="tile"
                key={`${item.title}-${index}`}
                data-lightbox
                data-src={resolveImageUrl(item.image)}
                data-alt={item.title}
                role="button"
                tabIndex={0}
                aria-label={`${item.title}, view full screen`}
              >
                <EditableDiv
                  field={{
                    kind: "image",
                    path: `gallery.${index}.image`,
                    label: `${item.title} gallery image`,
                    alt: item.title,
                  }}
                >
                  <ResolvedImage src={item.image} alt={item.title} />
                </EditableDiv>
                <div className="tile__cap">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                </div>
              </article>
            );
          })}
        </div>
      </Lightbox>
    </div>
  );
}

function AlbumGrid() {
  const content = useEditableStudioContent();

  return (
    <div className="album-grid">
      {content.albums.map((album, index) => (
        <article className="album reveal" key={album.title} style={{ "--i": index } as CSSProperties}>
          <ResolvedImage src={album.image} alt={album.title} className="cover-image" />
          <div className="album__body">
            <strong>{album.title}</strong>
            <span>{album.meta}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ========================================================= TESTIMONIALS == */

function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const content = useEditableStudioContent();

  return (
    <div className="grid-3">
      {testimonials.map((item) => {
        const index = content.testimonials.indexOf(item);
        return (
          <article className="testimonial-card card-hover reveal" key={item.name} style={{ "--i": index } as CSSProperties}>
            <StarRow />
            <EditableText
              as="p"
              field={{ kind: "text", path: `testimonials.${index}.quote`, label: `${item.name} quote`, multiline: true }}
            >
              &quot;{item.quote}&quot;
            </EditableText>
            <div className="testimonial-author">
              <span className="avatar">{item.name.charAt(0)}</span>
              <div>
                <EditableText
                  as="strong"
                  field={{ kind: "text", path: `testimonials.${index}.name`, label: `Testimonial ${index + 1} name` }}
                >
                  {item.name}
                </EditableText>
                <br />
                <EditableText
                  as="span"
                  field={{ kind: "text", path: `testimonials.${index}.role`, label: `${item.name} role` }}
                >
                  {item.role}
                </EditableText>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ========================================================== PACKAGES ==== */

function PackagesGrid({ packages }: { packages: PackageOption[] }) {
  const content = useEditableStudioContent();

  return (
    <div className="grid-3">
      {packages.map((option, localIndex) => {
        const index = content.packages.indexOf(option);
        return (
          <article
            className={`package-card card-hover reveal${localIndex === 1 ? " is-featured" : ""}`}
            key={option.name}
            style={{ "--i": localIndex } as CSSProperties}
          >
            <EditableText
              as="div"
              className="package-card__price"
              field={{ kind: "text", path: `packages.${index}.price`, label: `${option.name} price` }}
            >
              {option.price}
            </EditableText>
            <EditableText
              as="h3"
              field={{ kind: "text", path: `packages.${index}.name`, label: `Package ${index + 1} name` }}
            >
              {option.name}
            </EditableText>
            <EditableText
              as="p"
              field={{ kind: "text", path: `packages.${index}.summary`, label: `${option.name} summary`, multiline: true }}
            >
              {option.summary}
            </EditableText>
            <ul className="mini-list">
              {option.perks.map((perk, perkIndex) => (
                <EditableText
                  as="li"
                  field={{
                    kind: "text",
                    path: `packages.${index}.perks.${perkIndex}`,
                    label: `${option.name} perk ${perkIndex + 1}`,
                  }}
                  key={perk}
                >
                  {perk}
                </EditableText>
              ))}
            </ul>
            <LinkButton href="/booking">
              Choose plan <Icon name="arrow-right" size={16} />
            </LinkButton>
          </article>
        );
      })}
    </div>
  );
}

/* ============================================================== FAQ ===== */

function FaqList() {
  const content = useEditableStudioContent();

  return (
    <div className="faq-list">
      {content.faq.map((item, index) => (
        <details className="faq-item" key={item.question} open={index === 0}>
          <EditableText
            as="summary"
            field={{ kind: "text", path: `faq.${index}.question`, label: `FAQ ${index + 1} question`, multiline: true }}
          >
            {item.question}
          </EditableText>
          <EditableText
            as="p"
            field={{ kind: "text", path: `faq.${index}.answer`, label: `FAQ ${index + 1} answer`, multiline: true }}
          >
            {item.answer}
          </EditableText>
        </details>
      ))}
    </div>
  );
}

/* ======================================================= STUDIO STORY ==== */

function StudioStoryPanel() {
  const content = useEditableStudioContent();

  return (
    <section className="story-panel reveal">
      <div className="story-panel__copy">
        <SectionHeading
          eyebrow="The Studio Story"
          title={
            <EditableText
              as="span"
              field={{ kind: "text", path: "cultureStory.title", label: "Studio story title", multiline: true }}
            >
              {content.cultureStory.title}
            </EditableText>
          }
          copy="BollyFit brings together cultural pride, performance training, and a welcoming space for dancers of every age."
        />
        <div className="story-panel__text">
          {content.cultureStory.paragraphs.map((paragraph, index) => (
            <EditableText
              as="p"
              field={{
                kind: "text",
                path: `cultureStory.paragraphs.${index}`,
                label: `Studio story paragraph ${index + 1}`,
                multiline: true,
              }}
              key={index}
            >
              {paragraph}
            </EditableText>
          ))}
        </div>
      </div>
      <EditableDiv
        className="story-panel__visual zoom"
        field={{
          kind: "image",
          path: content.gallery[0] ? "gallery.0.image" : "hero.spotlightImage",
          label: "Studio story image",
          alt: "BollyFit performance moment",
        }}
      >
        <ResolvedImage
          src={content.gallery[0]?.image ?? content.hero.spotlightImage}
          alt="BollyFit performance moment"
          className="cover-image"
        />
      </EditableDiv>
    </section>
  );
}

/* ============================================================ CTA BAND === */

function CtaBand({
  title,
  copy,
  image = "/images/team-group.jpg",
  primary,
  secondary,
}: {
  title: string;
  copy: string;
  image?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="cta-band reveal">
      <div className="cta-band__bg">
        <ResolvedImage src={image} alt="" className="cover-image" />
      </div>
      <div style={{ display: "grid", gap: 12, maxWidth: "30ch" }}>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      <div className="cta-band__actions">
        <LinkButton href={primary.href}>
          {primary.label} <Icon name="arrow-right" size={18} />
        </LinkButton>
        {secondary ? (
          <LinkButton href={secondary.href} variant="secondary">
            {secondary.label}
          </LinkButton>
        ) : null}
      </div>
    </section>
  );
}

/* ====================================================== JOURNEY (classes) */

const JOURNEY_STEPS: { step: string; title: string; copy: string; icon: IconName }[] = [
  { step: "Step 1", title: "Explore", copy: "Find the style that moves you.", icon: "compass" },
  { step: "Step 2", title: "Build", copy: "Develop skills, strength, and stage presence.", icon: "flame" },
  { step: "Step 3", title: "Perform", copy: "Take the stage in shows, events, and competitions.", icon: "music" },
  { step: "Step 4", title: "Inspire", copy: "Lead, create, and inspire the next wave.", icon: "star" },
];

function DanceJourney() {
  return (
    <div className="grid-4">
      {JOURNEY_STEPS.map((item, index) => (
        <article className="info-card card-hover reveal" key={item.title} style={{ "--i": index } as CSSProperties}>
          <span className="icon-disc">
            <Icon name={item.icon} size={20} />
          </span>
          <span className="badge" style={{ width: "fit-content", marginTop: 14 }}>{item.step}</span>
          <h3 style={{ marginTop: 8 }}>{item.title}</h3>
          <p>{item.copy}</p>
        </article>
      ))}
    </div>
  );
}

/* ====================================================== CONTACT INFO ===== */

function ContactInfo() {
  const content = useEditableStudioContent();
  const { contact } = content;

  return (
    <div className="contact-form-card" style={{ alignSelf: "start" }}>
      <SectionHeading title="Get in Touch" copy="Reach out to us through any of these channels." />
      <div className="contact-info" style={{ marginTop: 18 }}>
        <div className="contact-row">
          <span className="icon-disc icon-disc--coral">
            <Icon name="phone" size={18} />
          </span>
          <div>
            <h4>Phone</h4>
            <a href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}>{contact.phone}</a>
          </div>
        </div>
        <div className="contact-row">
          <span className="icon-disc">
            <Icon name="mail" size={18} />
          </span>
          <div>
            <h4>Email</h4>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
        <div className="contact-row">
          <span className="icon-disc icon-disc--violet">
            <Icon name="pin" size={18} />
          </span>
          <div>
            <h4>Studio Area</h4>
            <p>{contact.address}</p>
          </div>
        </div>
        <div className="contact-row">
          <span className="icon-disc">
            <Icon name="clock" size={18} />
          </span>
          <div>
            <h4>Hours</h4>
            {contact.hours.map((hour) => (
              <p key={hour.label}>
                {hour.label}: {hour.time}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-socials" style={{ marginTop: 20 }}>
        <a aria-label="Instagram" href="https://www.instagram.com/bollyfit_dance_studio/" rel="noopener noreferrer" target="_blank">
          <Icon name="instagram" size={18} />
        </a>
        <a aria-label="Facebook" href="https://www.facebook.com/" rel="noopener noreferrer" target="_blank">
          <Icon name="facebook" size={18} />
        </a>
        <a aria-label="YouTube" href="https://www.youtube.com/" rel="noopener noreferrer" target="_blank">
          <Icon name="youtube" size={18} />
        </a>
        <a aria-label="TikTok" href="https://www.tiktok.com/" rel="noopener noreferrer" target="_blank">
          <Icon name="tiktok" size={18} />
        </a>
      </div>
    </div>
  );
}

/* ============================================================ INFO CARDS = */

function InfoCards({ items }: { items: { title: string; copy: string; icon?: IconName }[] }) {
  return (
    <div className="grid-4">
      {items.map((item, index) => (
        <article className="info-card card-hover reveal" key={item.title} style={{ "--i": index } as CSSProperties}>
          {item.icon ? (
            <span className="icon-disc">
              <Icon name={item.icon} size={20} />
            </span>
          ) : null}
          <h3 style={{ marginTop: item.icon ? 14 : 0 }}>{item.title}</h3>
          <p>{item.copy}</p>
        </article>
      ))}
    </div>
  );
}

/* ===================================================================== */
/* PAGES                                                                  */
/* ===================================================================== */

export function HomePageContent() {
  const content = useEditableStudioContent();
  return (
    <div className="page-shell">
      <HeroPanel />
      <SummitFeature />
      <IdentityPanel />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Our Dance Styles"
          title="Train. Express. Inspire."
          copy="Explore Bollywood, Kuthu, Hip-Hop, and Contemporary programs built for confidence, technique, and performance growth."
          action={
            <LinkButton href="/classes" variant="secondary">
              View All Styles <Icon name="arrow-right" size={16} />
            </LinkButton>
          }
        />
        <StyleTiles limit={4} />
      </section>
      <section className="section-block section-block--instructors reveal">
        <SectionHeading
          eyebrow="Our Instructors"
          title="Learn From. Be Inspired By."
          copy="Meet the choreographers and instructors guiding dancers from first steps to stage-ready performances."
          action={
            <LinkButton href="/instructors" variant="secondary">
              View All Instructors <Icon name="arrow-right" size={16} />
            </LinkButton>
          }
        />
        <InstructorCarousel />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="What Our Students Say"
          title="Real Stories. Real Impact."
        />
        <TestimonialsGrid testimonials={content.testimonials} />
      </section>
      <CtaBand
        title="Ready to Start Your Dance Journey?"
        copy="Join a community that celebrates culture, creativity, and confidence — on and off the stage."
        primary={{ label: "Book Your Class Now", href: "/booking" }}
        secondary={{ label: "View Schedule", href: "/schedule" }}
      />
    </div>
  );
}

export function ClassesPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="South Asian dance training for the next generation"
        title={
          <>
            Classes
            <span className="hero-sub gradient-text">Train. Express. Inspire.</span>
          </>
        }
        copy="From Bollywood to Hip-Hop and beyond, our classes are crafted to build confidence, culture, and stage-ready skills for every dancer."
        image={content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: "hero.spotlightImage",
          label: "Classes page hero image",
          alt: "Classes page hero image",
        }}
        primaryAction={
          <LinkButton href="/booking">
            Book Your Class Now <Icon name="arrow-right" size={18} />
          </LinkButton>
        }
        secondaryAction={
          <LinkButton href="/schedule" variant="secondary">
            See Weekly Schedule
          </LinkButton>
        }
      />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Our Programs"
          title="Our Classes & Programs"
          copy="Each program brings its own rhythm while building confidence, musicality, and strong movement foundations."
        />
        <StyleProgramCards />
        <AudiencePrograms />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Faculty"
          title="Learn From The Best"
          action={
            <LinkButton href="/instructors" variant="secondary">
              View All Instructors <Icon name="arrow-right" size={16} />
            </LinkButton>
          }
        />
        <InstructorCarousel />
      </section>
      <section className="section-block reveal">
        <SectionHeading eyebrow="Your Path" title="Your Dance Journey" />
        <DanceJourney />
      </section>
      <section className="section-block reveal">
        <SectionHeading eyebrow="Membership" title="Simple ways to get started" />
        <PackagesGrid packages={content.packages} />
      </section>
      <CtaBand
        title="Ready to Start Your Dance Journey?"
        copy="Join a community that celebrates culture, creativity, and confidence."
        image={content.styleOfferings[0]?.image ?? "/images/team-group.jpg"}
        primary={{ label: "Book Your Class Now", href: "/booking" }}
        secondary={{ label: "See Weekly Schedule", href: "/schedule" }}
      />
    </div>
  );
}

export function SchedulePageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="South Asian dance training for the next generation"
        title={
          <>
            Class <span className="gradient-text">Schedule</span>
          </>
        }
        copy="Explore our weekly class lineup designed for every age, level, and passion. From high-energy Bollywood to powerful Hip-Hop, find your rhythm and join the movement."
        image={content.styleOfferings[1]?.image ?? content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: "styleOfferings.1.image",
          label: "Schedule page hero image",
          alt: "Schedule page hero image",
        }}
        primaryAction={
          <LinkButton href="/booking">
            Book a Class <Icon name="arrow-right" size={18} />
          </LinkButton>
        }
        secondaryAction={
          <LinkButton href="/contact" variant="secondary">
            Ask for help choosing
          </LinkButton>
        }
      />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Weekly Rhythm"
          title="Find your class. Claim your spot."
          copy="See class times, age groups, and levels at a glance, then filter by the style that moves you."
        />
        <ScheduleCalendar schedule={content.schedule} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Booking & Attendance"
          title="Simple. Transparent. Respectful."
        />
        <InfoCards
          items={[
            { title: "Advance Booking", copy: "All classes require advance booking to secure your spot. Walk-ins are subject to availability.", icon: "calendar" },
            { title: "Cancellation Policy", copy: "Cancel at least 12 hours in advance to receive class credit. Late cancels are charged as taken.", icon: "clock" },
            { title: "Arrive Early", copy: "Arrive 10 minutes early to check in and warm up. Classes start on time.", icon: "users" },
            { title: "What to Bring", copy: "Bring water, a small towel, and wear comfortable movement-friendly attire.", icon: "heart" },
          ]}
        />
      </section>
      <CtaBand
        title="Ready to move?"
        copy="Book your class now and be part of the BollyFit community."
        image={content.styleOfferings[1]?.image ?? "/images/team-group.jpg"}
        primary={{ label: "Book a Class", href: "/booking" }}
        secondary={{ label: "Talk to the Studio", href: "/contact" }}
      />
    </div>
  );
}

export function InstructorsPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Our Team"
        title={
          <>
            Meet <span className="gradient-text">the Team</span>
          </>
        }
        copy="Passionate artists. Expert mentors. Community builders. Our team brings world-class training and South Asian culture to life — on and off the stage."
        image={content.founder.image}
        imageField={{
          kind: "image",
          path: "founder.image",
          label: "Instructors page hero image",
          alt: "Instructors page hero image",
        }}
        features={[
          { icon: "users", title: "25+", sub: "Expert Instructors" },
          { icon: "music", title: "5", sub: "Dance Styles" },
          { icon: "heart", title: "Thousands", sub: "Lives Impacted" },
        ]}
        primaryAction={
          <LinkButton href="/booking">
            Book Your Class <Icon name="arrow-right" size={18} />
          </LinkButton>
        }
      />
      <FounderCard />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Our Instructors"
          title="Learn. Grow. Be Inspired."
          copy="Our instructors are performing artists and passionate educators dedicated to helping you unlock your full potential."
        />
        <InstructorGrid instructors={content.instructors} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Our Philosophy"
          title="We Teach More Than Dance."
          copy="We build confidence, community, and culture in every class."
        />
        <div className="grid-4">
          {content.values.map((value, index) => (
            <article className="info-card card-hover reveal" key={value.title} style={{ "--i": index } as CSSProperties}>
              <span className="icon-disc">
                <Icon name={VALUE_ICONS[index % VALUE_ICONS.length]} size={20} />
              </span>
              <h3 style={{ marginTop: 14 }}>{value.title}</h3>
              <p>{value.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand
        title="Ready to Train With Us?"
        copy="Join a global community where culture comes to life through movement."
        primary={{ label: "Book Your Class", href: "/booking" }}
        secondary={{ label: "Inquire About Training", href: "/contact" }}
      />
    </div>
  );
}

export function EventsPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Events that move. Culture that unites."
        title={
          <>
            Perform. <span className="gradient-text">Train. Compete.</span> Celebrate Culture.
          </>
        }
        copy="From global stages to local showcases, BollyFit events bring together dancers, artists, and dreamers to learn, compete, and create unforgettable moments."
        image={content.summitFeature.image}
        imageField={{
          kind: "image",
          path: "summitFeature.image",
          label: "Events page hero image",
          alt: "Events page hero image",
        }}
        features={[
          { icon: "star", title: "Performances", sub: "Showcase your talent" },
          { icon: "flame", title: "Workshops", sub: "Train with leaders" },
          { icon: "trophy", title: "Competitions", sub: "Challenge yourself" },
        ]}
      />
      <FeaturedEvent index={0} />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Upcoming Events"
          title="Join Us at These Unmissable Events"
          action={
            <LinkButton href="/schedule" variant="secondary">
              View Full Calendar <Icon name="arrow-right" size={16} />
            </LinkButton>
          }
        />
        <EventGrid events={content.events} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Past Highlights"
          title="Relive the Energy. Celebrate the Moments."
        />
        <PastHighlights />
      </section>
      <CtaBand
        title="Be Part of Something Bigger."
        copy="Whether you're performing, learning, or cheering from the audience, our events are where passion meets purpose."
        image={content.summitFeature.image}
        primary={{ label: "Reserve Your Spot", href: "/booking" }}
        secondary={{ label: "Explore All Events", href: "/contact" }}
      />
    </div>
  );
}

export function GalleryPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Moments that move us"
        title={
          <>
            <span className="gradient-text">Gallery</span>
            <span className="hero-sub">Every Move. Every Moment. Our Story.</span>
          </>
        }
        copy="Explore the energy, passion, and joy of BollyFit Dance Studio through our performances, classes, and community."
        image={content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: "hero.spotlightImage",
          label: "Gallery page hero image",
          alt: "Gallery page hero image",
        }}
        primaryAction={
          <LinkButton href="/events">
            View Upcoming Events <Icon name="arrow-right" size={18} />
          </LinkButton>
        }
        secondaryAction={
          <LinkButton href="/booking" variant="secondary">
            Join the Community
          </LinkButton>
        }
      />
      <section className="section-block reveal">
        <SectionHeading title="Every Move. Every Moment." copy="Tap any image to view it full screen." />
        <GalleryMasonry gallery={content.gallery} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Featured Albums"
          title="Collections from the studio"
          action={
            <LinkButton href="/events" variant="secondary">
              View All Albums <Icon name="arrow-right" size={16} />
            </LinkButton>
          }
        />
        <AlbumGrid />
      </section>
      <CtaBand
        title="Be Part of the Movement"
        copy="Follow us for daily inspiration, behind-the-scenes moments, and updates from the BollyFit community."
        primary={{ label: "Follow @bollyfit_dance_studio", href: "https://www.instagram.com/bollyfit_dance_studio/" }}
        secondary={{ label: "Join the Community", href: "/booking" }}
      />
    </div>
  );
}

export function ContactPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="We'd love to hear from you"
        title={
          <>
            Let&apos;s <span className="gradient-text">Connect</span>
          </>
        }
        copy="Have questions, ideas, or ready to join the BollyFit family? We're here to help you take the next step in your dance journey."
        image={content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: "hero.spotlightImage",
          label: "Contact page hero image",
          alt: "Contact page hero image",
        }}
        features={[
          { icon: "clock", title: "Fast Response", sub: "We reply within 24 hours" },
          { icon: "heart", title: "Friendly Support", sub: "Real people, real help" },
          { icon: "users", title: "Dance Community", sub: "You belong here" },
        ]}
      />
      <section className="contact-layout reveal">
        <div className="contact-form-card">
          <SectionHeading
            eyebrow="Send Us a Message"
            title="Send Us a Message"
            copy="Fill out the form below and we'll get back to you."
          />
          <div style={{ marginTop: 16 }}>
            <ContactForm />
          </div>
        </div>
        <ContactInfo />
      </section>
      <section className="section-block reveal">
        <div className="map-block">
          <div className="map-pin" />
          <div className="contact-form-card" style={{ position: "absolute", left: 24, bottom: 24, maxWidth: 320 }}>
            <h3>Find Us in {content.contact.address}</h3>
            <p style={{ marginTop: 6 }}>
              {content.contact.serviceArea}
            </p>
            <LinkButton href="/contact" variant="secondary">
              Get Directions <Icon name="arrow-right" size={16} />
            </LinkButton>
          </div>
        </div>
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Quick Answers"
          title="Frequently Asked Questions"
        />
        <FaqList />
      </section>
      <CtaBand
        title="Ready to Start Your Dance Journey?"
        copy="Book your trial class today and experience the energy, culture, and confidence that come with BollyFit."
        image={content.hero.spotlightImage}
        primary={{ label: "Book Your Trial Class", href: "/booking" }}
        secondary={{ label: "View Class Schedule", href: "/schedule" }}
      />
    </div>
  );
}

export function AboutPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="About the studio"
        title={
          <>
            BollyFit celebrates <span className="gradient-text">culture in motion.</span>
          </>
        }
        copy="The studio story matters because families and dancers want to know what the place stands for, not just what classes it sells."
        image={content.gallery[4]?.image ?? content.hero.backgroundImage}
        imageField={{
          kind: "image",
          path: content.gallery[4] ? "gallery.4.image" : "hero.backgroundImage",
          label: "About page hero image",
          alt: "About page hero image",
        }}
        primaryAction={
          <LinkButton href="/events">
            See recent milestones <Icon name="arrow-right" size={18} />
          </LinkButton>
        }
        secondaryAction={
          <LinkButton href="/contact" variant="secondary">
            Contact the studio
          </LinkButton>
        }
      />
      <StudioStoryPanel />
      <section className="section-block reveal">
        <SectionHeading eyebrow="What Defines Us" title="A modern studio with a strong cultural center" />
        <div className="grid-4">
          {content.values.map((value, index) => (
            <article className="info-card card-hover reveal" key={value.title} style={{ "--i": index } as CSSProperties}>
              <span className="icon-disc">
                <Icon name={VALUE_ICONS[index % VALUE_ICONS.length]} size={20} />
              </span>
              <h3 style={{ marginTop: 14 }}>{value.title}</h3>
              <p>{value.summary}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-block reveal">
        <SectionHeading eyebrow="Frequently Asked" title="Questions families usually ask before booking" />
        <FaqList />
      </section>
      <CtaBand
        title="Ready to Start Your Dance Journey?"
        copy="Join a community that celebrates culture, creativity, and confidence."
        primary={{ label: "Start Registration", href: "/booking" }}
        secondary={{ label: "Talk to the Studio", href: "/contact" }}
      />
    </div>
  );
}

export function BookingPageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Class registration"
        title={
          <>
            Register in one step. <span className="gradient-text">Let the studio guide the rest.</span>
          </>
        }
        copy="Share a few details and the studio will help guide you toward the right class, level, or trial."
        image={content.styleOfferings[3]?.image ?? content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: "styleOfferings.3.image",
          label: "Booking page hero image",
          alt: "Booking page hero image",
        }}
        primaryAction={
          <LinkButton href="#register">
            Start Registration <Icon name="arrow-right" size={18} />
          </LinkButton>
        }
      />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Membership"
          title="Membership and class options"
          copy="Choose the class path that best fits your goals, schedule, and level."
        />
        <PackagesGrid packages={content.packages} />
      </section>
      <section className="registration-panel reveal" id="register">
        <div className="registration-panel__copy">
          <SectionHeading
            eyebrow="Registration form"
            title="Tell the studio what you are looking for"
            copy="Share your interests and the studio will help guide the right class fit."
          />
          <InfoCards
            items={[
              { title: "Trial classes", copy: "Perfect for families or adults who want to experience the energy before committing.", icon: "star" },
              { title: "Placement help", copy: "Unsure about level, age group, or style? The studio can recommend the right starting point.", icon: "compass" },
            ]}
          />
        </div>
        <div className="registration-panel__form">
          <RegistrationForm />
        </div>
      </section>
      <CtaBand
        title="Ready to Start Your Dance Journey?"
        copy="Join a community that celebrates culture, creativity, and confidence."
        image={content.styleOfferings[0]?.image ?? "/images/team-group.jpg"}
        primary={{ label: "Talk to the Studio", href: "/contact" }}
        secondary={{ label: "See Weekly Schedule", href: "/schedule" }}
      />
    </div>
  );
}
