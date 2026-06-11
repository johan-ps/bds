import Link from "next/link";
import type { ReactNode } from "react";

export type LegalSection = {
  title: string;
  body: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="page-shell legal-page">
      <section className="legal-hero reveal">
        <span className="hero-eyebrow">{eyebrow}</span>
        <div className="legal-hero__copy">
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
        <span className="legal-updated">Last updated: {updated}</span>
      </section>

      <section className="legal-layout reveal">
        <aside className="legal-summary">
          <strong>Quick links</strong>
          <nav aria-label={`${title} sections`}>
            {sections.map((section) => (
              <a href={`#${slugify(section.title)}`} key={section.title}>
                {section.title}
              </a>
            ))}
          </nav>
          <div className="legal-summary__contact">
            <span>Questions?</span>
            <Link href="/contact">Contact the studio</Link>
          </div>
        </aside>

        <div className="legal-content">
          {sections.map((section) => (
            <article className="legal-card" id={slugify(section.title)} key={section.title}>
              <h2>{section.title}</h2>
              <div>{section.body}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
