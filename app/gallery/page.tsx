import { Hero } from "../components/ui/Hero";
import { LinkButton } from "../components/ui/LinkButton";
import { MediaCard } from "../components/ui/MediaCard";
import { Pill } from "../components/ui/Pill";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { galleryImages } from "../content/gallery";

export default function GalleryPage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Gallery</Pill>
          <h1>Moments of rhythm, color, and culture.</h1>
          <p>Classes, performances, and community celebrations.</p>
          <div className="hero-actions">
            <LinkButton href="/booking">Join a Class</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Book a Performance
            </LinkButton>
          </div>
        </div>
        <div className="hero-card">
          <SectionTitle title="Studio Highlights" subtitle="A glimpse of our energy." />
        </div>
      </Hero>

      <Section className="reveal">
        <div className="grid">
          {galleryImages.map((image) => (
            <MediaCard
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="standalone"
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
