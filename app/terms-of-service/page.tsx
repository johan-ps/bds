import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../components/site/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | BollyFit Dance Studio",
  description:
    "Terms of Service for BollyFit Dance Studio, including website use, class bookings, participation, cancellations, media, and account responsibilities.",
};

const sections: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    body: (
      <p>
        By using this website, submitting a form, creating an account, booking a class, or participating in studio
        services, you agree to these Terms of Service. If you do not agree, please do not use the website or studio
        services.
      </p>
    ),
  },
  {
    title: "Studio Services",
    body: (
      <p>
        BollyFit Dance Studio may offer classes, workshops, events, performances, private sessions, memberships,
        and related services. Schedules, instructors, locations, class levels, pricing, and availability may change
        at any time.
      </p>
    ),
  },
  {
    title: "Bookings and Payments",
    body: (
      <p>
        Bookings are subject to availability and studio confirmation. Payments, deposits, membership fees, and
        package purchases must be completed according to the instructions provided at checkout or by the studio.
        Taxes, processing fees, and third-party payment terms may apply.
      </p>
    ),
  },
  {
    title: "Cancellations and Credits",
    body: (
      <p>
        Cancellation, rescheduling, refund, and class-credit rules may vary by class, event, package, or promotion.
        Unless a separate written policy says otherwise, contact the studio before the scheduled class or event if
        you need to cancel or reschedule.
      </p>
    ),
  },
  {
    title: "Participant Responsibilities",
    body: (
      <p>
        Participants are responsible for arriving on time, wearing appropriate clothing and footwear, following
        instructor guidance, respecting other dancers, and using the studio space safely. Parents or guardians are
        responsible for minors before and after class unless otherwise agreed by the studio.
      </p>
    ),
  },
  {
    title: "Health and Safety",
    body: (
      <p>
        Dance and fitness activities involve physical movement and some risk of injury. By participating, you
        confirm that you are able to take part safely or have consulted a qualified professional when needed. Stop
        participating and notify an instructor if you feel pain, dizziness, or discomfort.
      </p>
    ),
  },
  {
    title: "Website and Account Use",
    body: (
      <p>
        You agree to provide accurate information, keep account credentials secure, and avoid using the website in
        a way that disrupts service, attempts unauthorized access, copies protected content, or harms the studio,
        students, staff, or other users.
      </p>
    ),
  },
  {
    title: "Photos, Videos, and Content",
    body: (
      <p>
        Website text, photos, videos, graphics, logos, class descriptions, and other content belong to BollyFit
        Dance Studio or its licensors unless otherwise stated. You may not copy, reuse, or distribute studio content
        without permission. Event and class media may be used for studio communication and promotion where
        appropriate.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    body: (
      <p>
        To the fullest extent permitted by law, BollyFit Dance Studio is not responsible for indirect, incidental,
        special, or consequential damages arising from website use, scheduling changes, participation in services,
        third-party platforms, or circumstances outside the studio&apos;s reasonable control.
      </p>
    ),
  },
  {
    title: "Changes to These Terms",
    body: (
      <p>
        We may update these terms from time to time. The updated version will be posted on this page with a revised
        date. Continued use of the website or studio services after changes are posted means you accept the updated
        terms.
      </p>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <p>
        For questions about these terms, contact BollyFit Dance Studio through the contact page or by email at
        bollyfitdancestudio@gmail.com.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms describe the basic rules for using the BollyFit Dance Studio website and participating in studio services."
      updated="June 11, 2026"
      sections={sections}
    />
  );
}
