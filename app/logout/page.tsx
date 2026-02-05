import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";
import { LinkButton } from "../components/ui/LinkButton";

export default function LogoutPage() {
  return (
    <div className="container page-stack">
      <Section className="hero-card reveal">
        <SectionTitle title="You are logged out." subtitle="See you in class soon." />
        <div className="hero-actions">
          <LinkButton href="/">Return Home</LinkButton>
        </div>
      </Section>
    </div>
  );
}
