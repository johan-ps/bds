import { pexels } from "./images";

export type ActionLink = {
  label: string;
  href: string;
};

export type StudioStat = {
  value: string;
  label: string;
};

export type StyleOffering = {
  name: string;
  summary: string;
  audience: string;
  image: string;
  highlights: string[];
};

export type ScheduleSession = {
  time: string;
  style: string;
  group: string;
  level: string;
  instructor: string;
};

export type ScheduleDay = {
  day: string;
  sessions: ScheduleSession[];
};

export type InstructorProfile = {
  name: string;
  role: string;
  specialties: string;
  bio: string;
  image: string;
};

export type EventPost = {
  title: string;
  date: string;
  location: string;
  summary: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export type GalleryItem = {
  title: string;
  category: string;
  image: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export type PackageOption = {
  name: string;
  price: string;
  summary: string;
  perks: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type StudioContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    backgroundImage: string;
    spotlightImage: string;
    notes: string[];
  };
  summitFeature: {
    label: string;
    title: string;
    description: string;
    detail: string;
    action: ActionLink;
  };
  stats: StudioStat[];
  styleOfferings: StyleOffering[];
  cultureStory: {
    title: string;
    paragraphs: string[];
  };
  schedule: ScheduleDay[];
  instructors: InstructorProfile[];
  events: EventPost[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  packages: PackageOption[];
  faq: FaqItem[];
  contact: {
    email: string;
    phone: string;
    instagram: string;
    youtube: string;
    whatsapp: string;
    serviceArea: string;
    responseTime: string;
  };
};

export const primaryNavigation = [
  { label: "Classes", href: "/classes" },
  { label: "Schedule", href: "/schedule" },
  { label: "Instructors", href: "/instructors" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const utilityNavigation = [
  { label: "Studio Story", href: "/about" },
  { label: "Register", href: "/booking" },
  { label: "Login", href: "/login" },
];

export const seedStudioContent: StudioContent = {
  hero: {
    eyebrow: "South Asian dance training for the next generation of performers",
    title: "Where Culture Takes The Floor",
    subtitle:
      "BollyFit Dance Studio blends kuthu, hiphop, contemporary, bollywood, and fusion into a studio experience that feels modern, high-energy, and deeply rooted in community.",
    primaryAction: {
      label: "Register For Classes",
      href: "/booking",
    },
    secondaryAction: {
      label: "See Weekly Schedule",
      href: "/schedule",
    },
    backgroundImage: pexels("1701194", 1800),
    spotlightImage: pexels("358042", 1200),
    notes: [
      "Performance-led training for kids, teens, and adults.",
      "Selected to compete at the World of Dance Summit in Los Angeles.",
    ],
  },
  summitFeature: {
    label: "Global Stage",
    title: "World of Dance Summit, Los Angeles",
    description:
      "Our studio has been selected to compete at the World of Dance Summit, taking the energy of our community and culture to one of the most respected dance stages in the world.",
    detail:
      "That milestone reflects what drives BollyFit: promoting South Asian culture, building confidence through movement, and showing up for community events with pride and purpose.",
    action: {
      label: "Explore Recent Events",
      href: "/events",
    },
  },
  stats: [
    { value: "5", label: "signature styles" },
    { value: "All ages", label: "kids to adults" },
    { value: "Performance", label: "training pathway" },
    { value: "Community", label: "culture-first focus" },
  ],
  styleOfferings: [
    {
      name: "Kuthu",
      summary: "Explosive footwork, festival rhythm, and full-room energy.",
      audience: "Best for: open level performers who want stamina and stage presence",
      image: pexels("1701200", 1200),
      highlights: ["Fast footwork", "Athletic drills", "Stage confidence"],
    },
    {
      name: "Hiphop",
      summary: "Groove, control, and musicality with a strong performance edge.",
      audience: "Best for: juniors, teens, and adults building freestyle confidence",
      image: pexels("1190298", 1200),
      highlights: ["Foundations", "Texture changes", "Crew choreography"],
    },
    {
      name: "Contemporary",
      summary: "Fluid movement, emotional phrasing, and stronger body awareness.",
      audience: "Best for: dancers who want expression, range, and storytelling",
      image: pexels("1190297", 1200),
      highlights: ["Lines and flow", "Floorwork", "Emotional performance"],
    },
    {
      name: "Bollywood",
      summary: "Big expressions, cinematic energy, and joyful cardio-driven training.",
      audience: "Best for: all levels looking for performance and confidence",
      image: pexels("175658", 1200),
      highlights: ["Film-style choreography", "Fitness through dance", "Audience appeal"],
    },
    {
      name: "Fusion",
      summary: "A modern mix of South Asian rhythm and contemporary stage craft.",
      audience: "Best for: competitive teams and dancers who want versatility",
      image: pexels("1738986", 1200),
      highlights: ["Hybrid choreography", "Competition pieces", "Creative direction"],
    },
  ],
  cultureStory: {
    title: "Built on culture, contribution, and bold performance",
    paragraphs: [
      "BollyFit Dance Studio has had the privilege of voluntarily performing at cultural and competitive events across the community. Our dancers show up because they believe in sharing South Asian culture with energy, excellence, and pride.",
      "That same spirit shapes every class. We train hard, perform with intention, and create space for dancers to grow in confidence while representing their heritage on bigger and bigger stages.",
      "From community showcases to international competition opportunities, the goal is the same: celebrate diversity, build cross-cultural connection, and make the studio feel alive the moment someone walks in.",
    ],
  },
  schedule: [
    {
      day: "Monday",
      sessions: [
        {
          time: "5:30 PM",
          style: "Bollywood Basics",
          group: "Kids 7-10",
          level: "Beginner",
          instructor: "Anika",
        },
        {
          time: "7:15 PM",
          style: "Fusion Team Lab",
          group: "Teens",
          level: "Intermediate",
          instructor: "Riya",
        },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        {
          time: "6:00 PM",
          style: "Kuthu Power",
          group: "Open",
          level: "All levels",
          instructor: "Arjun",
        },
        {
          time: "7:30 PM",
          style: "Adult Bollywood Fit",
          group: "Adults",
          level: "All levels",
          instructor: "Megha",
        },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        {
          time: "5:45 PM",
          style: "Junior Hiphop",
          group: "Juniors",
          level: "Beginner",
          instructor: "Arjun",
        },
        {
          time: "7:15 PM",
          style: "Contemporary Flow",
          group: "Teens & Adults",
          level: "Intermediate",
          instructor: "Sahana",
        },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        {
          time: "6:00 PM",
          style: "Bollywood Performance",
          group: "Teens",
          level: "Intermediate",
          instructor: "Megha",
        },
        {
          time: "7:30 PM",
          style: "Hiphop Crew Drills",
          group: "Open",
          level: "Intermediate",
          instructor: "Arjun",
        },
      ],
    },
    {
      day: "Friday",
      sessions: [
        {
          time: "6:15 PM",
          style: "Fusion Choreo",
          group: "Competition team",
          level: "Advanced",
          instructor: "Riya",
        },
        {
          time: "7:45 PM",
          style: "Adult Kuthu Fit",
          group: "Adults",
          level: "All levels",
          instructor: "Anika",
        },
      ],
    },
    {
      day: "Saturday",
      sessions: [
        {
          time: "10:00 AM",
          style: "Mini Movers Bollywood",
          group: "Ages 4-6",
          level: "Beginner",
          instructor: "Anika",
        },
        {
          time: "11:30 AM",
          style: "Contemporary Foundations",
          group: "Juniors",
          level: "Beginner",
          instructor: "Sahana",
        },
        {
          time: "1:00 PM",
          style: "Performance Team Rehearsal",
          group: "Selected dancers",
          level: "Advanced",
          instructor: "Riya",
        },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        {
          time: "11:00 AM",
          style: "Open Choreo Intensive",
          group: "Teens & Adults",
          level: "Open",
          instructor: "Guest faculty",
        },
      ],
    },
  ],
  instructors: [
    {
      name: "Anika Rao",
      role: "Studio Director",
      specialties: "Bollywood, kids foundations, community performances",
      bio: "Anika leads the studio vision with a teaching style that balances discipline, warmth, and visible stage confidence.",
      image: pexels("774909", 1000),
    },
    {
      name: "Arjun Selvan",
      role: "Lead Choreographer",
      specialties: "Kuthu, hiphop, performance drilling",
      bio: "Arjun focuses on timing, stamina, and crowd-commanding energy for dancers building a stronger performance identity.",
      image: pexels("2379004", 1000),
    },
    {
      name: "Sahana Iyer",
      role: "Contemporary Instructor",
      specialties: "Contemporary, fusion storytelling, technique",
      bio: "Sahana helps dancers move with more range, fluidity, and intention while keeping choreography emotionally grounded.",
      image: pexels("1181686", 1000),
    },
    {
      name: "Riya Krish",
      role: "Competition Team Coach",
      specialties: "Fusion, stage direction, ensemble work",
      bio: "Riya shapes polished competition sets and trains teams to move with precision under pressure.",
      image: pexels("415829", 1000),
    },
  ],
  events: [
    {
      title: "Selected for World of Dance Summit",
      date: "Summer 2026",
      location: "Los Angeles",
      summary:
        "BollyFit has been selected to compete at the World of Dance Summit, taking our culture and choreography to an international audience.",
      image: pexels("358042", 1200),
      ctaLabel: "Join the Journey",
      ctaHref: "/contact",
    },
    {
      title: "Community Cultural Showcase",
      date: "Spring 2026",
      location: "Sydney",
      summary:
        "Our dancers performed voluntarily at a regional cultural event, celebrating diversity and building deeper community connection through movement.",
      image: pexels("1701194", 1200),
      ctaLabel: "Book a Performance",
      ctaHref: "/contact",
    },
    {
      title: "Youth Performance Team Auditions",
      date: "Open Registration",
      location: "Studio Program",
      summary:
        "Dancers ready for extra rehearsals, stronger choreography detail, and stage-focused coaching can audition for the next performance cycle.",
      image: pexels("1738986", 1200),
      ctaLabel: "Register Now",
      ctaHref: "/booking",
    },
  ],
  gallery: [
    { title: "Stage rehearsal", category: "Performance", image: pexels("1701193", 1200) },
    { title: "Bollywood team practice", category: "Studio", image: pexels("175658", 1200) },
    { title: "Crew training", category: "Hiphop", image: pexels("1190298", 1200) },
    { title: "Contemporary phrasework", category: "Technique", image: pexels("1190297", 1200) },
    { title: "Festival spotlight", category: "Community", image: pexels("1701200", 1200) },
    { title: "Open choreography session", category: "Fusion", image: pexels("1738986", 1200) },
  ],
  testimonials: [
    {
      name: "Shreya P.",
      role: "Parent",
      quote:
        "The studio feels polished and welcoming at the same time. My daughter feels proud of what she is learning here.",
    },
    {
      name: "Karan M.",
      role: "Adult student",
      quote:
        "The classes are energetic, culturally grounded, and surprisingly well structured. It made me want to keep coming back.",
    },
    {
      name: "Nivetha R.",
      role: "Performance team dancer",
      quote:
        "Training here pushed my stage confidence up quickly. Every rehearsal feels like it is building toward something bigger.",
    },
  ],
  packages: [
    {
      name: "Trial Class",
      price: "Free Trial",
      summary: "A free first class to experience the studio before joining a program.",
      perks: ["One trial class", "Level guidance", "Instructor recommendation"],
    },
    {
      name: "Monthly Studio Pass",
      price: "$145 / month",
      summary: "Consistent weekly training for dancers building rhythm, confidence, and fitness.",
      perks: ["One class track", "Make-up class option", "Event updates"],
    },
    {
      name: "Performance Track",
      price: "$185 / month",
      summary: "For dancers preparing for showcases, team routines, and stage opportunities.",
      perks: ["Extra rehearsals", "Choreography focus", "Performance pathway"],
    },
  ],
  faq: [
    {
      question: "Do you offer classes for beginners?",
      answer:
        "Yes. We run beginner-friendly pathways for kids, teens, and adults, and we can recommend the right starting class after registration.",
    },
    {
      question: "Can students join for performance opportunities?",
      answer:
        "Yes. We offer class-based performance opportunities and a stronger team track for dancers who want extra rehearsal and stage experience.",
    },
    {
      question: "Do you handle event and cultural show bookings?",
      answer:
        "Yes. The studio can be contacted for cultural showcases, stage performances, workshops, and private choreography requests.",
    },
  ],
  contact: {
    email: "bollyfitdancestudio@gmail.com",
    phone: "0406165043",
    instagram: "@bollyfit_dance_studio",
    youtube: "BollyFit Dance Studio",
    whatsapp: "+61 406 165 043",
    serviceArea: "Serving families, teens, adults, and event partners across Sydney.",
    responseTime: "Typical reply within 24 hours.",
  },
};
