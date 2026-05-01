"use client";
import {
  useState,
  useTransition,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
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
import {
  useEditableElement,
  useEditableStudioContent,
  useInlineStudioEditor,
  type InlineFieldSelection,
} from "./InlineStudioEditor";
import { LinkButton } from "../ui/LinkButton";

type EditableTextTag =
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "p"
  | "div"
  | "strong"
  | "small"
  | "li"
  | "summary";

type EditableTextField = Extract<InlineFieldSelection, { kind: "text" }>;
type EditableImageField = Extract<InlineFieldSelection, { kind: "image" }>;

function readValueAtPath(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((currentValue, segment) => {
    if (currentValue === null || currentValue === undefined) {
      return undefined;
    }

    const parsedSegment = /^\d+$/.test(segment) ? Number(segment) : segment;

    return (currentValue as Record<string, unknown> | unknown[])[parsedSegment as never];
  }, source);
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  copy?: ReactNode;
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

function EditableText({
  as,
  children,
  className,
  field,
}: {
  as?: EditableTextTag;
  children: ReactNode;
  className?: string;
  field: EditableTextField;
}) {
  const Tag = (as ?? "span") as EditableTextTag;
  const { canEdit, content, isEditing, selectedField, selectField, updateTextField } =
    useInlineStudioEditor();
  const interactive = canEdit && isEditing;
  const isSelected = selectedField?.kind === "text" && selectedField.path === field.path;
  const currentValue = String(readValueAtPath(content, field.path) ?? children ?? "");
  const nextClassName = [
    className,
    interactive ? "inline-editable inline-editable--text" : "",
    isSelected ? "inline-editable--selected inline-editable--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function selectCurrentField() {
    if (!interactive) {
      return;
    }

    selectField(field);
  }

  function handleSelect(event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) {
    event.preventDefault();
    event.stopPropagation();
    selectCurrentField();
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    event.stopPropagation();

    if (event.key === "Escape") {
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Enter" && !field.multiline) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  return (
    <Tag
      className={nextClassName}
      data-inline-label={interactive ? field.label : undefined}
      onClick={
        interactive
          ? (event) => {
              if (isSelected) {
                return;
              }

              handleSelect(event);
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (event) => {
              if (isSelected) {
                return;
              }

              if (event.key === "Enter" || event.key === " ") {
                handleSelect(event);
              }
            }
          : undefined
      }
      role={interactive && !isSelected ? "button" : undefined}
      tabIndex={interactive && !isSelected ? 0 : undefined}
    >
      {interactive && isSelected ? (
        field.multiline ? (
          <textarea
            aria-label={field.label}
            autoFocus
            className="inline-textarea"
            onChange={(event) => updateTextField(field.path, event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleEditorKeyDown}
            placeholder={field.placeholder}
            rows={4}
            value={currentValue}
          />
        ) : (
          <input
            aria-label={field.label}
            autoFocus
            className="inline-text-input"
            onChange={(event) => updateTextField(field.path, event.target.value)}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handleEditorKeyDown}
            placeholder={field.placeholder}
            type="text"
            value={currentValue}
          />
        )
      ) : (
        children
      )}
    </Tag>
  );
}

function EditableDiv({
  children,
  className,
  field,
  style,
}: {
  children?: ReactNode;
  className?: string;
  field: EditableImageField;
  style?: CSSProperties;
}) {
  const { content, selectedField, setImageField, uploadImageField } = useInlineStudioEditor();
  const editableProps = useEditableElement(field, className);
  const isSelected = selectedField?.kind === "image" && selectedField.path === field.path;
  const currentValue = String(readValueAtPath(content, field.path) ?? "");

  return (
    <div {...editableProps} style={style}>
      {children}
      {isSelected ? (
        <div
          className="inline-image-controls"
          onClick={(event) => event.stopPropagation()}
        >
          <input
            aria-label={field.label}
            className="inline-text-input"
            onChange={(event) => {
              void setImageField(field.path, event.target.value);
            }}
            placeholder={field.placeholder ?? "Paste image URL"}
            type="text"
            value={currentValue}
          />
          <label className="upload-button">
            <span>Upload image</span>
            <input
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                void uploadImageField(field.path, file);
                event.target.value = "";
              }}
              type="file"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}

function EditableActionButton({
  href,
  hrefPath,
  label,
  labelPath,
  path,
  selectionLabel,
  variant = "primary",
}: {
  href: string;
  hrefPath: string;
  label: string;
  labelPath: string;
  path: string;
  selectionLabel: string;
  variant?: "primary" | "secondary";
}) {
  const { canEdit, isEditing } = useInlineStudioEditor();
  const editableProps = useEditableElement(
    {
      kind: "action",
      path,
      label: selectionLabel,
      labelPath,
      hrefPath,
    },
    variant === "secondary" ? "cta secondary" : "cta"
  );

  if (canEdit && isEditing) {
    return (
      <button {...editableProps} type="button">
        {label}
      </button>
    );
  }

  return (
    <LinkButton href={href} variant={variant}>
      {label}
    </LinkButton>
  );
}

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
      <div className="hero-panel__veil" />
      <div className="hero-panel__glow hero-panel__glow--one" />
      <div className="hero-panel__glow hero-panel__glow--two" />
      <div className="hero-panel__content">
        <EditableText
          as="span"
          className="hero-eyebrow"
          field={{ kind: "text", path: "hero.eyebrow", label: "Hero eyebrow" }}
        >
          {content.hero.eyebrow}
        </EditableText>
        <EditableText
          as="h1"
          field={{ kind: "text", path: "hero.title", label: "Hero title", multiline: true }}
        >
          {content.hero.title}
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
          />
        </div>
        <div className="hero-stats">
          {content.stats.map((stat, index) => (
            <div className="hero-stat" key={stat.label}>
              <EditableText
                as="strong"
                field={{ kind: "text", path: `stats.${index}.value`, label: `Stat ${index + 1} value` }}
              >
                {stat.value}
              </EditableText>
              <EditableText
                as="span"
                field={{ kind: "text", path: `stats.${index}.label`, label: `Stat ${index + 1} label` }}
              >
                {stat.label}
              </EditableText>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-panel__spotlight">
        <EditableText
          as="div"
          className="hero-note hero-note--left"
          field={{ kind: "text", path: "hero.notes.0", label: "Hero note one", multiline: true }}
        >
          {content.hero.notes[0]}
        </EditableText>
        <EditableText
          as="div"
          className="hero-note hero-note--right"
          field={{ kind: "text", path: "hero.notes.1", label: "Hero note two", multiline: true }}
        >
          {content.hero.notes[1]}
        </EditableText>
        <EditableDiv
          className="hero-photo-card"
          field={{
            kind: "image",
            path: "hero.spotlightImage",
            label: "Hero spotlight image",
            alt: "BollyFit studio dancer in motion",
          }}
        >
          <ResolvedImage
            src={content.hero.spotlightImage}
            alt="BollyFit studio dancer in motion"
            className="cover-image"
          />
        </EditableDiv>
      </div>
    </section>
  );
}

function SummitFeature() {
  const content = useEditableStudioContent();

  return (
    <section className="summit-banner reveal">
      <div className="summit-banner__copy">
        <EditableText
          as="span"
          className="chip"
          field={{ kind: "text", path: "summitFeature.label", label: "Summit feature label" }}
        >
          {content.summitFeature.label}
        </EditableText>
        <EditableText
          as="h2"
          field={{ kind: "text", path: "summitFeature.title", label: "Summit feature title", multiline: true }}
        >
          {content.summitFeature.title}
        </EditableText>
        <EditableText
          as="p"
          field={{
            kind: "text",
            path: "summitFeature.description",
            label: "Summit feature description",
            multiline: true,
          }}
        >
          {content.summitFeature.description}
        </EditableText>
      </div>
      <div className="summit-banner__aside">
        <EditableText
          as="p"
          field={{
            kind: "text",
            path: "summitFeature.detail",
            label: "Summit feature detail",
            multiline: true,
          }}
        >
          {content.summitFeature.detail}
        </EditableText>
        <EditableActionButton
          href={content.summitFeature.action.href}
          hrefPath="summitFeature.action.href"
          label={content.summitFeature.action.label}
          labelPath="summitFeature.action.label"
          path="summitFeature.action"
          selectionLabel="Summit feature button"
        />
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
        <span className="chip">BollyFit identity</span>
        <h2>A studio identity rooted in color, culture, and stage presence.</h2>
        <p>
          BollyFit brings together South Asian cultural energy, performance confidence, and a
          welcoming studio spirit that feels bold from the first impression.
        </p>
      </div>
    </section>
  );
}

function StyleCard({ style, index }: { style: StyleOffering; index: number }) {
  return (
    <article className="style-card">
      <EditableDiv
        className="style-card__image"
        field={{
          kind: "image",
          path: `styleOfferings.${index}.image`,
          label: `${style.name} image`,
          alt: style.name,
        }}
      >
        <ResolvedImage src={style.image} alt={style.name} className="cover-image" />
      </EditableDiv>
      <div className="style-card__body">
        <div className="style-card__topline">
          <EditableText
            as="span"
            className="chip chip--light"
            field={{ kind: "text", path: `styleOfferings.${index}.name`, label: `${style.name} chip label` }}
          >
            {style.name}
          </EditableText>
          <EditableText
            as="p"
            field={{ kind: "text", path: `styleOfferings.${index}.audience`, label: `${style.name} audience`, multiline: true }}
          >
            {style.audience}
          </EditableText>
        </div>
        <EditableText
          as="h3"
          field={{ kind: "text", path: `styleOfferings.${index}.name`, label: `${style.name} title`, multiline: true }}
        >
          {style.name}
        </EditableText>
        <EditableText
          as="p"
          field={{ kind: "text", path: `styleOfferings.${index}.summary`, label: `${style.name} summary`, multiline: true }}
        >
          {style.summary}
        </EditableText>
        <ul className="mini-list">
          {style.highlights.map((highlight, highlightIndex) => (
            <EditableText
              as="li"
              field={{
                kind: "text",
                path: `styleOfferings.${index}.highlights.${highlightIndex}`,
                label: `${style.name} highlight ${highlightIndex + 1}`,
              }}
              key={highlight}
            >
              {highlight}
            </EditableText>
          ))}
        </ul>
      </div>
    </article>
  );
}

function StylesGrid({ limit }: { limit?: number }) {
  const content = useEditableStudioContent();
  const styles = typeof limit === "number" ? content.styleOfferings.slice(0, limit) : content.styleOfferings;

  return (
    <div className="style-grid">
      {styles.map((style, index) => (
        <StyleCard key={style.name} index={index} style={style} />
      ))}
    </div>
  );
}

function ScheduleBoard({ schedule }: { schedule: ScheduleDay[] }) {
  return (
    <div
      className="schedule-board"
      style={{ "--schedule-columns": String(schedule.length) } as CSSProperties}
    >
      {schedule.map((day, dayIndex) => (
        <article className="schedule-day" key={day.day}>
          <div className="schedule-day__header">
            <EditableText
              as="h3"
              field={{ kind: "text", path: `schedule.${dayIndex}.day`, label: `${day.day} heading` }}
            >
              {day.day}
            </EditableText>
            <span>{day.sessions.length} session{day.sessions.length > 1 ? "s" : ""}</span>
          </div>
          <div className="schedule-day__list">
            {day.sessions.map((session, sessionIndex) => (
              <div className="schedule-session" key={`${day.day}-${session.time}-${session.style}`}>
                <EditableText
                  as="div"
                  className="schedule-session__time"
                  field={{
                    kind: "text",
                    path: `schedule.${dayIndex}.sessions.${sessionIndex}.time`,
                    label: `${day.day} session ${sessionIndex + 1} time`,
                  }}
                >
                  {session.time}
                </EditableText>
                <div>
                  <EditableText
                    as="strong"
                    field={{
                      kind: "text",
                      path: `schedule.${dayIndex}.sessions.${sessionIndex}.style`,
                      label: `${day.day} session ${sessionIndex + 1} style`,
                    }}
                  >
                    {session.style}
                  </EditableText>
                  <p>
                    <EditableText
                      as="span"
                      field={{
                        kind: "text",
                        path: `schedule.${dayIndex}.sessions.${sessionIndex}.group`,
                        label: `${day.day} session ${sessionIndex + 1} group`,
                      }}
                    >
                      {session.group}
                    </EditableText>{" "}
                    ·{" "}
                    <EditableText
                      as="span"
                      field={{
                        kind: "text",
                        path: `schedule.${dayIndex}.sessions.${sessionIndex}.level`,
                        label: `${day.day} session ${sessionIndex + 1} level`,
                      }}
                    >
                      {session.level}
                    </EditableText>
                  </p>
                  <EditableText
                    as="small"
                    field={{
                      kind: "text",
                      path: `schedule.${dayIndex}.sessions.${sessionIndex}.instructor`,
                      label: `${day.day} session ${sessionIndex + 1} instructor`,
                    }}
                  >
                    {session.instructor}
                  </EditableText>
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
      {instructors.map((instructor, index) => (
        <article className="instructor-card" key={instructor.name}>
          <EditableDiv
            className="instructor-card__image"
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
              as="span"
              className="chip chip--light"
              field={{ kind: "text", path: `instructors.${index}.role`, label: `${instructor.name} role` }}
            >
              {instructor.role}
            </EditableText>
            <EditableText
              as="h3"
              field={{ kind: "text", path: `instructors.${index}.name`, label: `${instructor.name} name` }}
            >
              {instructor.name}
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
              {instructor.specialties}
            </EditableText>
            <EditableText
              as="p"
              field={{ kind: "text", path: `instructors.${index}.bio`, label: `${instructor.name} bio`, multiline: true }}
            >
              {instructor.bio}
            </EditableText>
          </div>
        </article>
      ))}
    </div>
  );
}

function EventGrid({ events }: { events: EventPost[] }) {
  return (
    <div className="event-grid">
      {events.map((event, index) => (
        <article className="event-card" key={event.title}>
          <EditableDiv
            className="event-card__image"
            field={{
              kind: "image",
              path: `events.${index}.image`,
              label: `${event.title} image`,
              alt: event.title,
            }}
          >
            <ResolvedImage src={event.image} alt={event.title} className="cover-image" />
          </EditableDiv>
          <div className="event-card__body">
            <div className="event-card__meta">
              <EditableText
                as="span"
                field={{ kind: "text", path: `events.${index}.date`, label: `${event.title} date` }}
              >
                {event.date}
              </EditableText>
              <EditableText
                as="span"
                field={{ kind: "text", path: `events.${index}.location`, label: `${event.title} location` }}
              >
                {event.location}
              </EditableText>
            </div>
            <EditableText
              as="h3"
              field={{ kind: "text", path: `events.${index}.title`, label: `Event ${index + 1} title`, multiline: true }}
            >
              {event.title}
            </EditableText>
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
            />
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
          <EditableDiv
            className="gallery-card__image inline-editable-card-fill"
            field={{
              kind: "image",
              path: `gallery.${index}.image`,
              label: `${item.title} gallery image`,
              alt: item.title,
            }}
          >
            <ResolvedImage src={item.image} alt={item.title} className="cover-image" />
          </EditableDiv>
          <div className="gallery-card__overlay">
            <EditableText
              as="span"
              className="chip chip--light"
              field={{ kind: "text", path: `gallery.${index}.category`, label: `${item.title} category` }}
            >
              {item.category}
            </EditableText>
            <EditableText
              as="strong"
              field={{ kind: "text", path: `gallery.${index}.title`, label: `Gallery item ${index + 1} title` }}
            >
              {item.title}
            </EditableText>
          </div>
        </article>
      ))}
    </div>
  );
}

function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="testimonial-grid">
      {testimonials.map((item, index) => (
        <article className="testimonial-card" key={item.name}>
          <EditableText
            as="p"
            field={{ kind: "text", path: `testimonials.${index}.quote`, label: `${item.name} quote`, multiline: true }}
          >
            &quot;{item.quote}&quot;
          </EditableText>
          <EditableText
            as="strong"
            field={{ kind: "text", path: `testimonials.${index}.name`, label: `Testimonial ${index + 1} name` }}
          >
            {item.name}
          </EditableText>
          <EditableText
            as="span"
            field={{ kind: "text", path: `testimonials.${index}.role`, label: `${item.name} role` }}
          >
            {item.role}
          </EditableText>
        </article>
      ))}
    </div>
  );
}

function PackagesGrid({ packages }: { packages: PackageOption[] }) {
  return (
    <div className="package-grid">
      {packages.map((option, index) => (
        <article className="package-card" key={option.name}>
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
        </article>
      ))}
    </div>
  );
}

function FaqList() {
  const content = useEditableStudioContent();

  return (
    <div className="faq-list">
      {content.faq.map((item, index) => (
        <details className="faq-item" key={item.question}>
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

function StudioStoryPanel() {
  const content = useEditableStudioContent();

  return (
    <section className="story-panel reveal">
      <div className="story-panel__copy">
        <SectionHeading
          eyebrow="The studio story"
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
              key={paragraph}
            >
              {paragraph}
            </EditableText>
          ))}
        </div>
      </div>
      <EditableDiv
        className="story-panel__visual"
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
  imageField,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  copy: ReactNode;
  image: string;
  imageField?: EditableImageField;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  const altText = typeof title === "string" ? title : "Page hero image";

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
      <EditableDiv
        className="page-hero__image"
        field={
          imageField ?? {
            kind: "image",
            path: "hero.backgroundImage",
            label: "Page hero image",
            alt: altText,
          }
        }
      >
        <ResolvedImage src={image} alt={altText} className="cover-image" />
      </EditableDiv>
    </section>
  );
}

export function HomePageContent() {
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <HeroPanel />
      <SummitFeature />
      <BrandPanel />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Class styles"
          title="Training with range, rhythm, and stage energy"
          copy="Explore Bollywood, Kuthu, Hiphop, Contemporary, and Fusion programs built for confidence, technique, and performance growth."
          action={<LinkButton href="/classes">View all programs</LinkButton>}
        />
        <StylesGrid limit={4} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Weekly rhythm"
          title="A schedule that is easy to scan and easy to join"
          copy="See class times, age groups, and levels at a glance so it is easy to find the right fit for your week."
          action={<LinkButton href="/booking">Claim a trial class</LinkButton>}
        />
        <ScheduleBoard schedule={content.schedule.slice(0, 4)} />
      </section>
      <StudioStoryPanel />
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Faculty"
          title="Instructors who can teach, perform, and direct"
          copy="Meet the choreographers and instructors guiding dancers from first steps to stage-ready performances."
          action={<LinkButton href="/instructors">Meet the full team</LinkButton>}
        />
        <InstructorGrid instructors={content.instructors.slice(0, 3)} />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Recent activity"
          title="Community performances and major milestones"
          copy="Follow recent performances, community appearances, and milestones from across the studio."
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Programs and styles"
        title="Five styles. One studio identity."
        copy="Each class track has its own rhythm, but the studio approach stays consistent: polished instruction, visible progress, and strong performance energy."
        image={content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: "hero.spotlightImage",
          label: "Classes page hero image",
          alt: "Classes page hero image",
        }}
        primaryAction={<LinkButton href="/booking">Register now</LinkButton>}
        secondaryAction={<LinkButton href="/schedule" variant="secondary">View schedule</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Choose the style that matches your energy"
          copy="Each program brings its own rhythm while building confidence, musicality, and strong movement foundations."
        />
        <StylesGrid />
      </section>
      <section className="section-block reveal">
        <SectionHeading
          eyebrow="Membership options"
          title="Simple ways to get started"
          copy="Choose a clear starting point and grow into the class path that best matches your goals."
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="About the studio"
        title="BollyFit celebrates culture in motion."
        copy="The studio story matters because families and dancers want to know what the place stands for, not just what classes it sells."
        image={content.gallery[4]?.image ?? content.hero.backgroundImage}
        imageField={{
          kind: "image",
          path: content.gallery[4] ? "gallery.4.image" : "hero.backgroundImage",
          label: "About page hero image",
          alt: "About page hero image",
        }}
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Studio schedule"
        title="See the full week at a glance."
        copy="Browse class times, age groups, and levels in one place so it is easy to plan your week."
        image={content.gallery[2]?.image ?? content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: content.gallery[2] ? "gallery.2.image" : "hero.spotlightImage",
          label: "Schedule page hero image",
          alt: "Schedule page hero image",
        }}
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Faculty and choreography"
        title="A team that can teach beginners and shape performers."
        copy="Meet the artists and teachers shaping technique, confidence, and performance quality across the studio."
        image={content.gallery[1]?.image ?? content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: content.gallery[1] ? "gallery.1.image" : "hero.spotlightImage",
          label: "Instructors page hero image",
          alt: "Instructors page hero image",
        }}
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Recent events and studio activity"
        title="A studio community that stays active and visible."
        copy="Follow performance milestones, community appearances, showcases, and special moments from the BollyFit journey."
        image={content.gallery[5]?.image ?? content.hero.backgroundImage}
        imageField={{
          kind: "image",
          path: content.gallery[5] ? "gallery.5.image" : "hero.backgroundImage",
          label: "Events page hero image",
          alt: "Events page hero image",
        }}
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Photo gallery"
        title="Moments from rehearsals, performances, and studio life."
        copy="A living visual story of classes, showcases, rehearsals, and stage moments."
        image={content.hero.backgroundImage}
        imageField={{
          kind: "image",
          path: "hero.backgroundImage",
          label: "Gallery page hero image",
          alt: "Gallery page hero image",
        }}
        primaryAction={<LinkButton href="/booking">Register today</LinkButton>}
        secondaryAction={<LinkButton href="/booking" variant="secondary">Register today</LinkButton>}
      />
      <section className="section-block reveal">
        <SectionHeading
          title="Recent studio imagery"
          copy="Explore class photos, event highlights, rehearsal moments, and stage energy from the studio community."
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Class registration"
        title="Register in one step and let the studio guide the rest."
        copy="Share a few details and the studio will help guide you toward the right class, level, or trial."
        image={content.gallery[3]?.image ?? content.hero.spotlightImage}
        imageField={{
          kind: "image",
          path: content.gallery[3] ? "gallery.3.image" : "hero.spotlightImage",
          label: "Booking page hero image",
          alt: "Booking page hero image",
        }}
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
  const content = useEditableStudioContent();

  return (
    <div className="page-shell">
      <PageHero
        eyebrow="Contact and inquiries"
        title="Talk to the studio about classes, performances, or partnerships."
        copy="This page works for parents, adult students, cultural organizations, and event partners who need a direct path to the studio."
        image={content.gallery[0]?.image ?? content.hero.backgroundImage}
        imageField={{
          kind: "image",
          path: content.gallery[0] ? "gallery.0.image" : "hero.backgroundImage",
          label: "Contact page hero image",
          alt: "Contact page hero image",
        }}
      />
      <section className="contact-layout reveal">
        <div className="contact-details">
          <SectionHeading
            title="Studio contact"
            copy={
              <EditableText
                as="span"
                field={{ kind: "text", path: "contact.serviceArea", label: "Service area", multiline: true }}
              >
                {content.contact.serviceArea}
              </EditableText>
            }
          />
          <div className="info-grid">
            <article className="info-card">
              <h3>Email</h3>
              <EditableText
                as="p"
                field={{ kind: "text", path: "contact.email", label: "Contact email" }}
              >
                {content.contact.email}
              </EditableText>
            </article>
            <article className="info-card">
              <h3>Phone</h3>
              <EditableText
                as="p"
                field={{ kind: "text", path: "contact.phone", label: "Contact phone" }}
              >
                {content.contact.phone}
              </EditableText>
            </article>
            <article className="info-card">
              <h3>Instagram</h3>
              <p>
                <EditableText
                  as="span"
                  className="text-link"
                  field={{ kind: "text", path: "contact.instagram", label: "Instagram handle" }}
                >
                  {content.contact.instagram}
                </EditableText>
              </p>
            </article>
            <article className="info-card">
              <h3>Response time</h3>
              <EditableText
                as="p"
                field={{ kind: "text", path: "contact.responseTime", label: "Response time" }}
              >
                {content.contact.responseTime}
              </EditableText>
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
