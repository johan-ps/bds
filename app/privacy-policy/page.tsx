import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "../components/site/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | BollyFit Dance Studio",
  description:
    "Privacy Policy for BollyFit Dance Studio, including how contact, booking, newsletter, and account information may be collected and used.",
};

const sections: LegalSection[] = [
  {
    title: "Information We Collect",
    body: (
      <>
        <p>
          We may collect information you provide directly, including your name, email address, phone number,
          dancer or student details, class interests, contact messages, booking requests, newsletter sign-ups,
          and account login details.
        </p>
        <p>
          We may also collect basic technical information such as browser type, device information, pages viewed,
          and general usage activity to help keep the website secure and improve the visitor experience.
        </p>
      </>
    ),
  },
  {
    title: "How We Use Information",
    body: (
      <p>
        We use collected information to respond to inquiries, manage class registrations, communicate about
        schedules and studio updates, maintain accounts, send requested newsletters, improve our website, and
        protect the safety and security of our services.
      </p>
    ),
  },
  {
    title: "Student and Family Information",
    body: (
      <p>
        Because dance classes may involve minors, parents or guardians should submit information on behalf of
        children when required. We use student and family information only for studio-related purposes such as
        placement, attendance, communication, scheduling, and safety.
      </p>
    ),
  },
  {
    title: "Photos, Videos, and Media",
    body: (
      <p>
        Studio classes, events, and performances may include photography or video. We will use reasonable care
        when sharing media for promotional or community purposes. If you have media preferences for yourself or a
        student, contact the studio so those preferences can be noted.
      </p>
    ),
  },
  {
    title: "Sharing Information",
    body: (
      <p>
        We do not sell personal information. We may share information with service providers that help operate the
        website, manage communications, process registrations, host data, or support studio operations. We may also
        share information when required by law or to protect the rights, safety, or security of the studio, students,
        families, and website users.
      </p>
    ),
  },
  {
    title: "Data Storage and Security",
    body: (
      <p>
        We use reasonable administrative, technical, and organizational safeguards to protect information. No
        website, email system, or online storage method is completely secure, so we cannot guarantee absolute
        security.
      </p>
    ),
  },
  {
    title: "Your Choices",
    body: (
      <p>
        You may contact us to request access, updates, or deletion of personal information where applicable. You
        can unsubscribe from marketing emails by using the unsubscribe option when available or by contacting the
        studio directly.
      </p>
    ),
  },
  {
    title: "Contact Us",
    body: (
      <p>
        For privacy questions or requests, contact BollyFit Dance Studio through the contact page or by email at
        bollyfitdancestudio@gmail.com.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This policy explains how BollyFit Dance Studio may collect, use, store, and protect information submitted through the website and studio services."
      updated="June 11, 2026"
      sections={sections}
    />
  );
}
