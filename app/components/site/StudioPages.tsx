"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import type {
  EventPost,
  GalleryItem,
  InstructorProfile,
  PackageOption,
  ScheduleDay,
  StyleOffering,
  Testimonial,
} from "../../lib/studio-content";
import { useStudio } from "../providers/StudioProvider";
import { LinkButton } from "../ui/LinkButton";

function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      <div className="section-heading__aside">
        {copy ? <p>{copy}</p> : null}
        {action}
      </div>
    </div>
  );
}

function ResolvedImage({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  const { resolveImageUrl } = useStudio();

  return <img src={resolveImageUrl(src)} alt={alt} className={className} />;
}

function HeroPanel() {
  const { content, resolveImageUrl } = useStudio();

  return (
    <section className="hero-panel reveal">
      <div
        className="hero-panel__media"
        style={{ backgroundImage: `url(${resolveImageUrl(content.hero.backgroundImage)})` }}
      />
      <div className="hero-panel__veil" />
      <div className="hero-panel__glow hero-panel__glow--one" />
      <div className="hero-panel__glow hero-panel__glow--two" />
      <div className="hero-panel__content">
        <span className="hero-eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        <p className="hero-copy">{content.hero.subtitle}</p>
        <div className="hero-actions">
          <LinkButton href={content.hero.primaryAction.href}>
            {content.hero.primaryAction.label}
          </LinkButton>
          <LinkButton href={content.hero.secondaryAction.href} variant="secondary">
            {content.hero.secondaryAction.label}
          </LinkButton>
        </div>
        <div className="hero-stats">
          {content.stats.map((stat) => (
            <div className="hero-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-panel__spotlight">
        <div className="hero-note hero-note--left">{content.hero.notes[0]}</div>
        <div className="hero-note hero-note--right">{content.hero.notes[1]}</div>
        <div className="hero-photo-card">
          <ResolvedImage
            src={content.hero.spotlightImage}
            alt="BollyFit studio dancer in motion"
            className="cover-image"
          />
        </div>
      </div>
    </section>
  );
}

function SummitFeature() {
  const { content } = useStudio();

  return (
    <section className="summit-banner reveal">
      <div>
        <span className="chip">{content.summitFeature.label}</span>
        <h2>{content.summitFeature.title}</h2>
        <p>{content.summitFeature.description}</p>
      </div>
      <div>
        <p>{content.summitFeature.detail}</p>
        <LinkButton href={content.summitFeature.action.href}>
          {content.summitFeature.action.label}
        </LinkButton>
      </div>
    </section>
  );
}

function BrandPanel() {
  return (
    <section className="brand-panel reveal">
      <div className="brand-panel__logo">
        <img src="/logo.jpeg" alt="BollyFit Dance Studio full logo" className="cover-image" />
      </div>
      <div className="brand-panel__copy">
        <span className="chip">Studio identity</span>
        <h2>The full BollyFit brand stays visible, not just the small header mark.</h2>
        <p>
          This uses the actual uploaded studio logo so the site carries the real brand identity,
          not just a simplified icon treatment.
        </p>
      </div>
    </section>
  );
}

function StyleCard({ style }: { style: StyleOffering }) {
  return (
    <article className="style-card">
      <div className="style-card__image">
        <ResolvedImage src={style.image} alt={style.name} className="cover-image" />
      </div>
      <div className="style-card__body">
        <div className="style-card__topline">
          <span className="chip chip--light">{style.name}</span>
          <p>{style.audience}</p>
        </div>
        <h3>{style.name}</h3>
        <p>{style.summary}</p>
        <ul className="mini-list">
          {style.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function StylesGrid({ limit }: { limit?: number }) {
  const { content } = useStudio();
  const styles = typeof limit === "number" ? content.styleOfferings.slice(0, limit) : content.styleOfferings;

  return (
    <div className="style-grid">
      {styles.map((style) => (
        <StyleCard key={style.name} style={style} />
      ))}
    </div>
  );
}

function ScheduleBoard({ schedule }: { schedule: ScheduleDay[] }) {
  return (
    <div className="schedule-board">
      {schedule.map((day) => (
        <article className="schedule-day" key={day.day}>
          <div className="schedule-day__header">
            <h3>{day.day}</h3>
            <span>{day.sessions.length} session{day.sessions.length > 1 ? "s" : ""}</span>
          </div>
          <div className="schedule-day__list">
            {day.sessions.map((session) => (
              <div className="schedule-session" key={`${day.day}-${session.time}-${session.style}`}>
                <div className="schedule-session__time">{session.time}</div>
                <div>
                  <strong>{session.style}</strong>
                  <p>
                    {session.group} · {session.level}
                  </p>
                  <small>{session.instructor}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function InstructorGrid({ instructors }: { instructors: InstructorProfile[] }) {
  return (
    <div className="instructor-grid">
      {instructors.map((instructor) => (
        <article className="instructor-card" key={instructor.name}>
          <div className="instructor-card__image">
            <ResolvedImage src={instructor.image} alt={instructor.name} className="cover-image" />
          </div>
          <div className="instructor-card__body">
            <span className="chip chip--light">{instructor.role}</span>
            <h3>{instructor.name}</h3>
            <p className="instructor-card__specialties">{instructor.specialties}</p>
            <p>{instructor.bio}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function EventGrid({ events }: { events: EventPost[] }) {
  return (
    <div className="event-grid">
      {events.map((event) => (
        <article className="event-card" key={event.title}>
          <div className="event-card__image">
            <ResolvedImage src={event.image} alt={event.title} className="cover-image" />
          </div>
          <div className="event-card__body">
            <div className="event-card__meta">
              <span>{event.date}</span>
              <span>{event.location}</span>
            </div>
            <h3>{event.title}</h3>
            <p>{event.summary}</p>
            <Link className="text-link" href={event.ctaHref}>
              {event.ctaLabel}
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function GalleryGrid({ gallery }: { gallery: GalleryItem[] }) {
  return (
    <div className="gallery-grid">
      {gallery.map((item, index) => (
        <article
          className={`gallery-card ${index === 0 || index === 4 ? "gallery-card--large" : ""}`}
          key={`${item.title}-${index}`}
        >
          <ResolvedImage src={item.image} alt={item.title} className="cover-image" />
          <div className="gallery-card__overlay">
            <span className="chip chip--light">{item.category}</span>
            <strong>{item.title}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}

function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="testimonial-grid">
      {testimonials.map((item) => (
        <article className="testimonial-card" key={item.name}>
          <p>&quot;{item.quote}&quot;</p>
          <strong>{item.name}</strong>
          <span>{item.role}</span>
        </article>
      ))}
    </div>
  );
}

function PackagesGrid({ packages }: { packages: PackageOption[] }) {
  return (
    <div className="package-grid">
      {packages.map((option) => (
        <article className="package-card" key={option.name}>
          <div className="package-card__price">{option.price}</div>
          <h3>{option.name}</h3>
          <p>{option.summary}</p>
          <ul className="mini-list">
            {option.perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function FaqList() {
  const { content } = useStudio();

  return (
    <div className="faq-list">
      {content.faq.map((item) => (
        <details className="faq-item" key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

function StudioStoryPanel() {
  const { content } = useStudio();

  return (
    <section className="story-panel reveal">
      <div className="story-panel__copy">
        <SectionHeading
          eyebrow="The studio story"
          title={content.cultureStory.title}
          copy="The brand should feel premium, but the studio itself still needs to feel warm, rooted, and easy to join."
        />
        <div className="story-panel__text">
          {content.cultureStory.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="story-panel__visual">
        <ResolvedImage
          src={content.gallery[0]?.image ?? content.hero.spotlightImage}
          alt="BollyFit performance moment"
          className="cover-image"
        />
      </div>
    </section>
  );
}

function RegistrationForm() {
  const { submitRegistration } = useStudio();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      try {
        await submitRegistration({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          dancerAge: String(data.get("dancerAge") ?? ""),
          styleInterest: String(data.get("styleInterest") ?? ""),
          experience: String(data.get("experience") ?? ""),
          note: String(data.get("note") ?? ""),
        });

        form.reset();
        setErrorMessage("");
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Unable to submit registration.");
      }
    });
  }

  return (
    <form className="studio-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Full name
          <input name="name" type="text" required placeholder="Parent or student name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Phone
          <input name="phone" type="tel" required placeholder="0406165043" />
        </label>
        <label>
          Dancer age group
          <select name="dancerAge" defaultValue="Kids 7-10">
            <option>Mini movers 4-6</option>
            <option>Kids 7-10</option>
            <option>Juniors 11-13</option>
            <option>Teens 14-17</option>
            <option>Adults 18+</option>
          </select>
        </label>
      </div>
      <div className="form-grid">
        <label>
          Style interest
          <select name="styleInterest" defaultValue="Bollywood">
            <option>Bollywood</option>
            <option>Kuthu</option>
            <option>Hiphop</option>
            <option>Contemporary</option>
            <option>Fusion</option>
            <option>Need guidance</option>
          </select>
        </label>
        <label>
          Experience level
          <select name="experience" defaultValue="Beginner">
            <option>Beginner</option>
            <option>Some experience</option>
            <option>Intermediate</option>
            <option>Performance focused</option>
          </select>
        </label>
      </div>
      <label>
        Notes
        <textarea
          name="note"
          placeholder="Tell us about goals, schedule preferences, or interest in performance opportunities."
        />
      </label>
      <button className="cta-button" disabled={isPending} type="submit">
        {isPending ? "Submitting..." : "Send Registration"}
      </button>
      {status === "success" ? (
        <p className="form-status form-status--success">
          Registration received. The studio team will be in touch soon.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="form-status form-status--error">{errorMessage}</p>
      ) : null}
    </form>
  );
}

function ContactForm() {
  const { submitContactMessage } = useStudio();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      try {
        await submitContactMessage({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          phone: String(data.get("phone") ?? ""),
          inquiryType: String(data.get("inquiryType") ?? ""),
          message: String(data.get("message") ?? ""),
        });

        form.reset();
        setErrorMessage("");
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Unable to send message.");
      }
    });
  }

  return (
    <form className="studio-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Full name
          <input name="name" type="text" required placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Phone
          <input name="phone" type="tel" placeholder="Optional" />
        </label>
        <label>
          Inquiry type
          <select name="inquiryType" defaultValue="General inquiry">
            <option>General inquiry</option>
            <option>Class recommendation</option>
            <option>Performance booking</option>
            <option>Workshop or collaboration</option>
          </select>
        </label>
      </div>
      <label>
        Message
        <textarea
          name="message"
          required
          placeholder="Tell us what you need and we will guide you to the right class or service."
        />
      </label>
      <button className="cta-button" disabled={isPending} type="submit">
        {isPending ? "Sending..." : "Send Message"}
      </button>
      {status === "success" ? (
        <p className="form-status form-status--success">
          Message received. The studio team will get back to you soon.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="form-status form-status--error">{errorMessage}</p>
      ) : null}
    </form>
  );
}

function PageHero({
  eyebrow,
  title,
  copy,
  image,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <section className="page-hero reveal">
      <div className="page-hero__copy">
        <span className="hero-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{copy}</p>
        <div className="hero-actions">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
      <div className="page-hero__image">
        <ResolvedImage src={image} alt={title} className="cover-image" />
      </div>
    </section>
  );
}

export function HomePageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <HeroPanel />
      <SummitFeature />
      <BrandPanel />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Class styles"
          title="Training that feels dynamic from the first scroll"
          copy="The visual direction is clean and premium, but the programming still needs to communicate range, energy, and cultural identity fast."
          action={<LinkButton href="/classes">View all programs</LinkButton>}
        />
        <StylesGrid limit={4} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Weekly rhythm"
          title="A schedule that is easy to scan and easy to join"
          copy="Families and adult beginners should be able to understand the weekly rhythm without hunting for basic information."
          action={<LinkButton href="/booking">Claim a trial class</LinkButton>}
        />
        <ScheduleBoard schedule={content.schedule.slice(0, 4)} />
      </section>
      <StudioStoryPanel />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Faculty"
          title="Instructors who can teach, perform, and direct"
          copy="The site should communicate professionalism through faculty presentation, not just through generic marketing copy."
          action={<LinkButton href="/instructors">Meet the full team</LinkButton>}
        />
        <InstructorGrid instructors={content.instructors.slice(0, 3)} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Recent activity"
          title="Community performances and major milestones"
          copy="This is where the studio proves it is active, visible, and moving toward bigger stages."
          action={<LinkButton href="/events">See all updates</LinkButton>}
        />
        <EventGrid events={content.events} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Gallery"
          title="Motion, color, and stage energy"
          copy="A gallery that captures rehearsal energy, performance moments, and the spirit of the studio."
          action={<LinkButton href="/gallery">Open gallery</LinkButton>}
        />
        <GalleryGrid gallery={content.gallery} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="What families and dancers notice"
          title="A studio experience people want to explore"
        />
        <TestimonialsGrid testimonials={content.testimonials} />
      </section>
      <section className="cta-panel reveal">
        <div>
          <span className="chip">Ready to join</span>
          <h2>Register for your first class and let the studio guide the right fit.</h2>
          <p>
            Use the form to join a trial, ask for a recommendation, or tell the team you are
            interested in performance opportunities.
          </p>
        </div>
        <div className="cta-panel__actions">
          <LinkButton href="/booking">Start Registration</LinkButton>
          <LinkButton href="/contact" variant="secondary">
            Talk to the Studio
          </LinkButton>
        </div>
      </section>
    </div>
  );
}

export function ClassesPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Programs and styles"
        title="Five styles. One studio identity."
        copy="Each class track has its own rhythm, but the studio approach stays consistent: polished instruction, visible progress, and strong performance energy."
        image={content.hero.spotlightImage}
        primaryAction={<LinkButton href="/booking">Register now</LinkButton>}
        secondaryAction={<LinkButton href="/schedule" variant="secondary">View schedule</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Choose the style that matches your energy"
          copy="The goal is not to overwhelm visitors with every possible detail. The goal is to make the difference between programs obvious and attractive."
        />
        <StylesGrid />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Membership options"
          title="Simple ways to get started"
          copy="This gives prospective dancers a clear entry point before you decide on real pricing and billing rules."
        />
        <PackagesGrid packages={content.packages} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Good fit for"
          title="Kids, teens, adults, and performance pathways"
        />
        <div className="info-grid">
          <article className="info-card">
            <h3>Kids foundation tracks</h3>
            <p>Beginner-friendly structure, confidence building, and clear choreography language.</p>
          </article>
          <article className="info-card">
            <h3>Teen growth tracks</h3>
            <p>Stage confidence, stronger musicality, and performance-focused coaching.</p>
          </article>
          <article className="info-card">
            <h3>Adult classes</h3>
            <p>Fitness through dance, expressive training, and a welcoming pace for all levels.</p>
          </article>
          <article className="info-card">
            <h3>Competition and showcase prep</h3>
            <p>Extra rehearsals, team polish, and more intentional choreography direction.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export function AboutPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="About the studio"
        title="BollyFit is built to celebrate culture in motion."
        copy="The studio story matters because families and dancers want to know what the place stands for, not just what classes it sells."
        image={content.gallery[4]?.image ?? content.hero.backgroundImage}
        primaryAction={<LinkButton href="/events">See recent milestones</LinkButton>}
        secondaryAction={<LinkButton href="/contact" variant="secondary">Contact the studio</LinkButton>}
      />
      <StudioStoryPanel />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="What defines the brand"
          title="A modern studio with a strong cultural center"
        />
        <div className="info-grid">
          <article className="info-card">
            <h3>Culture first</h3>
            <p>South Asian movement and storytelling are treated as the center of the experience, not a side theme.</p>
          </article>
          <article className="info-card">
            <h3>Performance ready</h3>
            <p>Classes are designed to build stage confidence and clean choreography habits over time.</p>
          </article>
          <article className="info-card">
            <h3>Welcoming entry point</h3>
            <p>Beginners should feel invited in immediately, whether they are kids, teens, or adults.</p>
          </article>
          <article className="info-card">
            <h3>Community contribution</h3>
            <p>The studio shows up for cultural events, local showcases, and collaborations that matter.</p>
          </article>
        </div>
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Frequently asked"
          title="Questions families usually ask before booking"
        />
        <FaqList />
      </section>
    </div>
  );
}

export function SchedulePageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Studio schedule"
        title="Everything important is visible at a glance."
        copy="The weekly board is intentionally structured so parents and adult dancers can make a decision quickly without opening a second page."
        image={content.gallery[2]?.image ?? content.hero.spotlightImage}
        primaryAction={<LinkButton href="/booking">Register for a class</LinkButton>}
        secondaryAction={<LinkButton href="/contact" variant="secondary">Ask for help choosing</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Weekly class schedule"
          copy="Explore the weekly rhythm of classes and find a time that fits your routine."
        />
        <ScheduleBoard schedule={content.schedule} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="How to use the schedule"
          title="Find the right starting point faster"
        />
        <div className="info-grid">
          <article className="info-card">
            <h3>Beginners</h3>
            <p>Start with Bollywood Basics, Mini Movers, Adult Bollywood Fit, or Contemporary Foundations.</p>
          </article>
          <article className="info-card">
            <h3>Performance-focused dancers</h3>
            <p>Look for Fusion Team Lab, Performance Team Rehearsal, or Open Choreo Intensive.</p>
          </article>
          <article className="info-card">
            <h3>Need guidance</h3>
            <p>Use registration or contact forms and the studio can place you into the right level manually.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export function InstructorsPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Faculty and choreography"
        title="A team that can teach beginners and shape performers."
        copy="The studio feels more credible when the instructors are presented as specialists with clear strengths, not generic profile cards."
        image={content.gallery[1]?.image ?? content.hero.spotlightImage}
        primaryAction={<LinkButton href="/booking">Train with the team</LinkButton>}
        secondaryAction={<LinkButton href="/about" variant="secondary">Read the studio story</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Meet the instructors"
          copy="Meet the artists and teachers guiding classes, rehearsals, and performance growth."
        />
        <InstructorGrid instructors={content.instructors} />
      </section>
    </div>
  );
}

export function EventsPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Recent events and studio activity"
        title="The studio should always feel alive."
        copy="This page gives you a dedicated place to post milestones, showcase activity, and show momentum to families, dancers, and event partners."
        image={content.gallery[5]?.image ?? content.hero.backgroundImage}
        primaryAction={<LinkButton href="/contact">Book the studio</LinkButton>}
        secondaryAction={<LinkButton href="/booking" variant="secondary">Join a class</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Studio updates"
          copy="Follow performances, milestones, and recent moments from the studio community."
        />
        <EventGrid events={content.events} />
      </section>
      <SummitFeature />
    </div>
  );
}

export function GalleryPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Photo gallery"
        title="A visual mood that makes people want to keep scrolling."
        copy="A living visual story of classes, showcases, rehearsals, and stage moments."
        image={content.hero.backgroundImage}
        primaryAction={<LinkButton href="/booking">Register today</LinkButton>}
        secondaryAction={<LinkButton href="/booking" variant="secondary">Register today</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Recent studio imagery"
          copy="Use this area for class photos, event highlights, performance stills, rehearsal moments, or campaign visuals."
        />
        <GalleryGrid gallery={content.gallery} />
      </section>
      <section className="section-block reveal">
        <SectionHeading title="What the experience feels like" />
        <TestimonialsGrid testimonials={content.testimonials} />
      </section>
    </div>
  );
}

export function BookingPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Class registration"
        title="Register in one step and let the studio guide the rest."
        copy="This page is designed to convert. It keeps pricing simple, gives enough reassurance, and captures the details the studio actually needs."
        image={content.gallery[3]?.image ?? content.hero.spotlightImage}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Membership and class options"
          copy="Choose the class path that best fits your goals, schedule, and level."
        />
        <PackagesGrid packages={content.packages} />
      </section>
      <section className="registration-panel reveal">
        <div className="registration-panel__copy">
          <SectionHeading
            eyebrow="Registration form"
            title="Tell the studio what you are looking for"
            copy="Share your interests and the studio will help guide the right class fit."
          />
          <div className="info-grid">
            <article className="info-card">
              <h3>Trial classes</h3>
              <p>Perfect for families or adults who want to experience the energy before committing.</p>
            </article>
            <article className="info-card">
              <h3>Placement help</h3>
              <p>If you are unsure about level, age group, or style, the studio can recommend the right start point.</p>
            </article>
          </div>
        </div>
        <div className="registration-panel__form">
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}

export function ContactPageContent() {
  const { content } = useStudio();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Contact and inquiries"
        title="Talk to the studio about classes, performances, or partnerships."
        copy="This page works for parents, adult students, cultural organizations, and event partners who need a direct path to the studio."
        image={content.gallery[0]?.image ?? content.hero.backgroundImage}
      />
      <section className="contact-layout reveal">
        <div className="contact-details">
          <SectionHeading
            title="Studio contact"
            copy={content.contact.serviceArea}
          />
          <div className="info-grid">
            <article className="info-card">
              <h3>Email</h3>
              <p>{content.contact.email}</p>
            </article>
            <article className="info-card">
              <h3>Phone</h3>
              <p>{content.contact.phone}</p>
            </article>
            <article className="info-card">
              <h3>Instagram</h3>
              <p>
                <a
                  className="text-link"
                  href="https://www.instagram.com/bollyfit_dance_studio/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {content.contact.instagram}
                </a>
              </p>
            </article>
            <article className="info-card">
              <h3>Response time</h3>
              <p>{content.contact.responseTime}</p>
            </article>
          </div>
        </div>
        <div className="contact-form-card">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
