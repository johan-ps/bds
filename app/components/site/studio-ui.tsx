"use client";

import {
  useState,
  useTransition,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useStudio } from "../providers/StudioProvider";
import {
  useEditableElement,
  useInlineStudioEditor,
  type InlineFieldSelection,
} from "./InlineStudioEditor";
import { LinkButton } from "../ui/LinkButton";
import { Icon, type IconName } from "../ui/icons";

export type EditableTextTag =
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "div"
  | "strong"
  | "small"
  | "li"
  | "summary";

export type EditableTextField = Extract<InlineFieldSelection, { kind: "text" }>;
export type EditableImageField = Extract<InlineFieldSelection, { kind: "image" }>;

export function readValueAtPath(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((currentValue, segment) => {
    if (currentValue === null || currentValue === undefined) {
      return undefined;
    }

    const parsedSegment = /^\d+$/.test(segment) ? Number(segment) : segment;

    return (currentValue as Record<string, unknown> | unknown[])[parsedSegment as never];
  }, source);
}

/* ---------------------------------------------------------------- Eyebrow -- */
export function Eyebrow({
  children,
  icon = "sparkle",
  className = "section-eyebrow",
}: {
  children: ReactNode;
  icon?: IconName;
  className?: string;
}) {
  return (
    <span className={className}>
      <Icon name={icon} size={14} />
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ SectionHead -- */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  copy,
  action,
}: {
  eyebrow?: ReactNode;
  eyebrowIcon?: IconName;
  title: ReactNode;
  copy?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow> : null}
        <h2>{title}</h2>
      </div>
      <div className="section-heading__aside">
        {copy ? <p>{copy}</p> : null}
        {action}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- ResolvedImage -- */
export function ResolvedImage({
  alt,
  className,
  src,
  eager = false,
}: {
  alt: string;
  className?: string;
  src: string;
  eager?: boolean;
}) {
  const { resolveImageUrl } = useStudio();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolveImageUrl(src)}
      alt={alt}
      className={className}
      decoding="async"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
    />
  );
}

/* ------------------------------------------------------------- EditableText -- */
export function EditableText({
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
    if (!interactive) return;
    selectField(field);
  }

  function handleSelect(event: { preventDefault: () => void; stopPropagation: () => void }) {
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
              if (isSelected) return;
              handleSelect(event);
            }
          : undefined
      }
      onKeyDown={
        interactive
          ? (event) => {
              if (isSelected) return;
              if (event.key === "Enter" || event.key === " ") handleSelect(event);
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

/* -------------------------------------------------------------- EditableDiv -- */
export function EditableDiv({
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
        <div className="inline-image-controls" onClick={(event) => event.stopPropagation()}>
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
                if (!file) return;
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

/* ----------------------------------------------------- EditableActionButton -- */
export function EditableActionButton({
  href,
  hrefPath,
  label,
  labelPath,
  path,
  selectionLabel,
  variant = "primary",
  icon = "arrow-right",
}: {
  href: string;
  hrefPath: string;
  label: string;
  labelPath: string;
  path: string;
  selectionLabel: string;
  variant?: "primary" | "secondary";
  icon?: IconName | null;
}) {
  const { canEdit, isEditing } = useInlineStudioEditor();
  const editableProps = useEditableElement(
    { kind: "action", path, label: selectionLabel, labelPath, hrefPath },
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
      {icon ? <Icon name={icon} size={18} /> : null}
    </LinkButton>
  );
}

/* ----------------------------------------------------------------- PageHero -- */
export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  imageField,
  features,
  primaryAction,
  secondaryAction,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  copy: ReactNode;
  image: string;
  imageField?: EditableImageField;
  features?: { icon: IconName; title: string; sub: string }[];
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  const altText = typeof title === "string" ? title : "Page hero image";

  return (
    <section className="page-hero reveal">
      <EditableDiv
        className="hero-panel__media"
        field={
          imageField ?? {
            kind: "image",
            path: "hero.backgroundImage",
            label: "Page hero image",
            alt: altText,
          }
        }
      >
        <ResolvedImage src={image} alt={altText} className="cover-image" eager />
      </EditableDiv>
      <div className="hero-panel__veil" />
      <div className="page-hero__inner">
        <div className="page-hero__copy">
          <Eyebrow className="hero-eyebrow">{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{copy}</p>
          {features ? (
            <div className="cluster" style={{ gap: 24, marginTop: 8 }}>
              {features.map((feature) => (
                <div className="contact-row" key={feature.title} style={{ alignItems: "center" }}>
                  <span className="icon-disc" style={{ width: 42, height: 42 }}>
                    <Icon name={feature.icon} size={18} />
                  </span>
                  <div>
                    <h4>{feature.title}</h4>
                    <p style={{ fontSize: "0.84rem" }}>{feature.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {primaryAction || secondaryAction ? (
            <div className="hero-actions">
              {primaryAction}
              {secondaryAction}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- VideoCard -- */
export function VideoCard({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`tile zoom${className ? ` ${className}` : ""}`} style={{ cursor: "default" }}>
      <ResolvedImage src={src} alt={alt} className="cover-image" />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 1 }}>
        <span className="play-btn">
          <Icon name="play" size={20} />
        </span>
      </div>
      {caption ? (
        <div className="tile__cap" style={{ opacity: 1, transform: "none" }}>
          {caption}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- RegistrationForm -- */
export function RegistrationForm() {
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
          <input name="phone" type="tel" required placeholder="0406 165 043" />
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
            <option>Hip-Hop</option>
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
        <Icon name="send" size={18} />
      </button>
      {status === "success" ? (
        <p className="form-status form-status--success">
          Registration received. The studio team will be in touch soon.
        </p>
      ) : null}
      {status === "error" ? <p className="form-status form-status--error">{errorMessage}</p> : null}
    </form>
  );
}

/* -------------------------------------------------------------- ContactForm -- */
export function ContactForm() {
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
          Full Name
          <input name="name" type="text" required placeholder="Your full name" />
        </label>
        <label>
          Email Address
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          Phone Number
          <input name="phone" type="tel" placeholder="(555) 123-4567" />
        </label>
        <label>
          I&apos;m interested in
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
        <textarea name="message" required placeholder="Tell us how we can help you..." />
      </label>
      <button className="cta-button" disabled={isPending} type="submit">
        {isPending ? "Sending..." : "Send Message"}
        <Icon name="send" size={18} />
      </button>
      <p className="form-status">We respect your privacy. Your information is safe with us.</p>
      {status === "success" ? (
        <p className="form-status form-status--success">
          Message received. The studio team will get back to you soon.
        </p>
      ) : null}
      {status === "error" ? <p className="form-status form-status--error">{errorMessage}</p> : null}
    </form>
  );
}
