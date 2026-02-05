import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Hero } from "../components/ui/Hero";
import { LinkButton } from "../components/ui/LinkButton";
import { Pill } from "../components/ui/Pill";
import { Section } from "../components/ui/Section";
import { SectionTitle } from "../components/ui/SectionTitle";

const packages = [
  {
    name: "Trial Pass",
    price: "$15",
    note: "One class of your choice",
  },
  {
    name: "8-Class Pack",
    price: "$120",
    note: "Valid for 2 months",
  },
  {
    name: "Unlimited Monthly",
    price: "$180",
    note: "All classes + events",
  },
];

export default function BookingPage() {
  return (
    <div className="container page-stack">
      <Hero className="reveal">
        <div>
          <Pill>Booking</Pill>
          <h1>Reserve your spot in seconds.</h1>
          <p>Classes, private sessions, and studio rentals in one place.</p>
          <div className="grid" style={{ marginTop: 24 }}>
            {packages.map((pack) => (
              <Card key={pack.name}>
                <strong>{pack.name}</strong>
                <Badge>{pack.price}</Badge>
                <p>{pack.note}</p>
              </Card>
            ))}
          </div>
        </div>
        <div className="hero-card">
          <form className="form">
            <input type="text" placeholder="Full name" />
            <input type="email" placeholder="Email address" />
            <select>
              <option>Choose location</option>
              <option>Downtown Studio</option>
              <option>Northside Studio</option>
              <option>Waterfront Studio</option>
              <option>Westpark Studio</option>
            </select>
            <select>
              <option>Choose class</option>
              <option>Bollyfit Burn</option>
              <option>Semiclassical Flow</option>
              <option>Kuthu Power</option>
              <option>Rhythm Remix</option>
            </select>
            <input type="date" />
            <input type="time" />
            <button className="cta" type="submit">
              Reserve Now
            </button>
          </form>
        </div>
      </Hero>

      <Section className="highlight reveal">
        <SectionTitle title="Need Something Special?" subtitle="Private rehearsals and events." />
        <LinkButton href="/contact">Request a Custom Booking</LinkButton>
      </Section>
    </div>
  );
}
