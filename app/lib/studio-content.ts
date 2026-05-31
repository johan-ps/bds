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
  instagram?: string;
  youtube?: string;
};

export type FounderProfile = {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  image: string;
  stats: StudioStat[];
};

export type ValueItem = {
  title: string;
  summary: string;
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

export type HighlightItem = {
  title: string;
  image: string;
};

export type GalleryItem = {
  title: string;
  category: string;
  image: string;
};

export type GalleryAlbum = {
  title: string;
  meta: string;
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

export type ContactHour = {
  label: string;
  time: string;
};

export type StudioContent = {
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
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
    image: string;
    location: string;
    date: string;
    community: string;
    action: ActionLink;
  };
  stats: StudioStat[];
  styleOfferings: StyleOffering[];
  cultureStory: {
    title: string;
    paragraphs: string[];
  };
  values: ValueItem[];
  founder: FounderProfile;
  schedule: ScheduleDay[];
  instructors: InstructorProfile[];
  events: EventPost[];
  pastHighlights: HighlightItem[];
  gallery: GalleryItem[];
  albums: GalleryAlbum[];
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
    address: string;
    responseTime: string;
    hours: ContactHour[];
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

const IMG = {
  heroDancer: "/images/hero-dancer.jpg",
  bollywoodStage: "/images/bollywood-stage.jpg",
  bollywoodRed: "/images/bollywood-red.jpg",
  kuthu: "/images/kuthu-leap.jpg",
  hiphop: "/images/hiphop-dancer.jpg",
  contemporary: "/images/contemporary-purple.jpg",
  summit: "/images/world-of-dance-summit.jpg",
  founder: "/images/founder-portrait.jpg",
  team: "/images/team-group.jpg",
  logoBurst: "/images/bds-logo-burst.jpg",
};

export const seedStudioContent: StudioContent = {
  hero: {
    eyebrow: "South Asian dance training for the next generation",
    title: "Where Culture Takes the Floor",
    titleHighlight: "Culture",
    subtitle:
      "BollyFit Dance Studio blends South Asian culture, global movement, and modern training to help you grow in confidence, artistry, and stage presence.",
    primaryAction: {
      label: "Explore Classes",
      href: "/classes",
    },
    secondaryAction: {
      label: "View Schedule",
      href: "/schedule",
    },
    backgroundImage: IMG.heroDancer,
    spotlightImage: IMG.heroDancer,
    notes: [
      "Movement is our language. Culture is our rhythm. Confidence is our stage.",
      "Performance-led training for kids, teens, and adults.",
    ],
  },
  summitFeature: {
    label: "Global Stage",
    title: "World of Dance Summit, Los Angeles",
    description:
      "We're proud to represent South Asian culture on one of the most respected dance stages in the world.",
    detail:
      "That milestone reflects what drives BollyFit: promoting South Asian culture, building confidence through movement, and showing up for community events with pride and purpose.",
    image: IMG.summit,
    location: "Los Angeles, CA",
    date: "Summer 2026",
    community: "International Stage, Global Community",
    action: {
      label: "Explore Event",
      href: "/events",
    },
  },
  stats: [
    { value: "1,200+", label: "Active Students" },
    { value: "25+", label: "Expert Instructors" },
    { value: "120+", label: "Weekly Classes" },
    { value: "50+", label: "Shows & Events" },
  ],
  styleOfferings: [
    {
      name: "Bollywood",
      summary: "High-energy, expressive, and full of filmi flair.",
      audience: "High-energy dance routines inspired by Bollywood blockbusters.",
      image: IMG.bollywoodRed,
      highlights: ["Film-style choreography", "Fitness through dance", "Audience appeal"],
    },
    {
      name: "Kuthu",
      summary: "Powerful beats, bold moves, traditional soul.",
      audience: "Explosive footwork, festival rhythm, and full-room energy.",
      image: IMG.kuthu,
      highlights: ["Fast footwork", "Athletic drills", "Stage confidence"],
    },
    {
      name: "Hip-Hop",
      summary: "Urban vibes, freestyle energy, limitless attitude.",
      audience: "Groove, control, and musicality with a strong performance edge.",
      image: IMG.hiphop,
      highlights: ["Foundations", "Texture changes", "Crew choreography"],
    },
    {
      name: "Contemporary",
      summary: "Fluid movement, deep expression, pure artistry.",
      audience: "Emotional phrasing, stronger body awareness, and storytelling.",
      image: IMG.contemporary,
      highlights: ["Lines and flow", "Floorwork", "Emotional performance"],
    },
    {
      name: "Fusion",
      summary: "A blend of styles. Limitless creativity. Signature BollyFit energy.",
      audience: "For competitive teams and dancers who want versatility.",
      image: IMG.bollywoodStage,
      highlights: ["Hybrid choreography", "Competition pieces", "Creative direction"],
    },
  ],
  cultureStory: {
    title: "Rooted in Culture. Driven by Purpose.",
    paragraphs: [
      "BollyFit is more than a dance studio — it's a community that celebrates South Asian heritage, inspires self-expression, and empowers every dancer to shine on and off the stage.",
      "That same spirit shapes every class. We train hard, perform with intention, and create space for dancers to grow in confidence while representing their heritage on bigger and bigger stages.",
      "From community showcases to international competition opportunities, the goal stays the same: celebrate diversity, build cross-cultural connection, and make the studio feel alive the moment someone walks in.",
    ],
  },
  values: [
    { title: "Culture First", summary: "We honor our roots in every move." },
    { title: "Empowerment", summary: "Building confidence that lasts a lifetime." },
    { title: "Excellence", summary: "Premium training with global standards." },
    { title: "Community", summary: "A family that uplifts and grows together." },
    { title: "Creativity", summary: "We inspire original expression and fearless artistry." },
  ],
  founder: {
    name: "Anika Rao",
    role: "Founder & Artistic Director",
    tagline: "Visionary. Choreographer. Community Catalyst.",
    bio: "Anika founded BollyFit Dance Studio with a mission to honor South Asian culture through movement while creating a space where every dancer feels seen, challenged, and inspired. With 15+ years of performance and teaching experience, she leads with heart, excellence, and purpose.",
    image: IMG.founder,
    stats: [
      { value: "15+", label: "Years Experience" },
      { value: "Trained", label: "India & USA" },
      { value: "Featured", label: "Global Stages" },
      { value: "Expert in", label: "Bolly, Fusion, Contemporary" },
    ],
  },
  schedule: [
    {
      day: "Monday",
      sessions: [
        { time: "5:30 PM", style: "Bollywood Basics", group: "Kids 7-10", level: "Beginner", instructor: "Anika" },
        { time: "7:15 PM", style: "Fusion Team Lab", group: "Teens", level: "Intermediate", instructor: "Riya" },
      ],
    },
    {
      day: "Tuesday",
      sessions: [
        { time: "6:00 PM", style: "Kuthu Power", group: "Open", level: "All levels", instructor: "Arjun" },
        { time: "7:30 PM", style: "Adult Bollywood Fit", group: "Adults", level: "All levels", instructor: "Anika" },
      ],
    },
    {
      day: "Wednesday",
      sessions: [
        { time: "5:45 PM", style: "Junior Hip-Hop", group: "Juniors", level: "Beginner", instructor: "Arjun" },
        { time: "7:15 PM", style: "Contemporary Flow", group: "Teens & Adults", level: "Intermediate", instructor: "Sahana" },
      ],
    },
    {
      day: "Thursday",
      sessions: [
        { time: "6:00 PM", style: "Bollywood Performance", group: "Teens", level: "Intermediate", instructor: "Anika" },
        { time: "7:30 PM", style: "Hip-Hop Crew Drills", group: "Open", level: "Intermediate", instructor: "Arjun" },
      ],
    },
    {
      day: "Friday",
      sessions: [
        { time: "6:15 PM", style: "Fusion Choreo", group: "Competition team", level: "Advanced", instructor: "Riya" },
        { time: "7:45 PM", style: "Adult Kuthu Fit", group: "Adults", level: "All levels", instructor: "Arjun" },
      ],
    },
    {
      day: "Saturday",
      sessions: [
        { time: "10:00 AM", style: "Mini Movers Bollywood", group: "Ages 4-6", level: "Beginner", instructor: "Anika" },
        { time: "11:30 AM", style: "Contemporary Foundations", group: "Juniors", level: "Beginner", instructor: "Sahana" },
        { time: "1:00 PM", style: "Performance Team Rehearsal", group: "Selected", level: "Advanced", instructor: "Riya" },
      ],
    },
    {
      day: "Sunday",
      sessions: [
        { time: "11:00 AM", style: "Open Choreo Intensive", group: "Teens & Adults", level: "Open", instructor: "Guest faculty" },
      ],
    },
  ],
  instructors: [
    {
      name: "Anika Rao",
      role: "Founder & Director",
      specialties: "Bollywood, Fusion, Contemporary",
      bio: "Anika leads the studio vision with a teaching style that balances discipline, warmth, and visible stage confidence.",
      image: IMG.bollywoodRed,
      instagram: "https://www.instagram.com/bollyfit_dance_studio/",
      youtube: "https://www.youtube.com/",
    },
    {
      name: "Arjun Selvan",
      role: "Lead Choreographer",
      specialties: "Kuthu, Hip-Hop, Folk Fusion",
      bio: "Arjun focuses on timing, stamina, and crowd-commanding energy for dancers building a stronger performance identity.",
      image: IMG.kuthu,
      instagram: "https://www.instagram.com/bollyfit_dance_studio/",
      youtube: "https://www.youtube.com/",
    },
    {
      name: "Sahana Iyer",
      role: "Contemporary Lead",
      specialties: "Contemporary, Lyrical",
      bio: "Sahana helps dancers move with more range, fluidity, and intention while keeping choreography emotionally grounded.",
      image: IMG.contemporary,
      instagram: "https://www.instagram.com/bollyfit_dance_studio/",
      youtube: "https://www.youtube.com/",
    },
    {
      name: "Riya Krish",
      role: "Competition Team Coach",
      specialties: "Fusion, Stage Direction",
      bio: "Riya shapes polished competition sets and trains teams to move with precision under pressure.",
      image: IMG.hiphop,
      instagram: "https://www.instagram.com/bollyfit_dance_studio/",
      youtube: "https://www.youtube.com/",
    },
  ],
  events: [
    {
      title: "World of Dance Summit",
      date: "Summer 2026",
      location: "Los Angeles, CA",
      summary:
        "BollyFit has been selected to compete at the World of Dance Summit, taking our culture and choreography to an international audience.",
      image: IMG.summit,
      ctaLabel: "Get Tickets",
      ctaHref: "/contact",
    },
    {
      title: "Community Cultural Showcase",
      date: "Spring 2026",
      location: "Sydney, AU",
      summary:
        "Our dancers performed voluntarily at a regional cultural event, celebrating diversity and building deeper community connection through movement.",
      image: IMG.bollywoodStage,
      ctaLabel: "Learn More",
      ctaHref: "/contact",
    },
    {
      title: "Kuthu Fusion Workshop",
      date: "Open Registration",
      location: "Studio Program",
      summary:
        "High-energy Kuthu fusion training with explosive footwork, bold movement, and traditional rhythm reimagined for the stage.",
      image: IMG.kuthu,
      ctaLabel: "Book Now",
      ctaHref: "/booking",
    },
    {
      title: "Contemporary Movement Lab",
      date: "Open Registration",
      location: "Studio Program",
      summary:
        "Explore fluid movement, expression, and storytelling through dance in this intensive, expression-led lab.",
      image: IMG.contemporary,
      ctaLabel: "Register Now",
      ctaHref: "/booking",
    },
  ],
  pastHighlights: [
    { title: "BollyFit Showcase 2024", image: IMG.bollywoodStage },
    { title: "World of Dance Summit 2024", image: IMG.summit },
    { title: "Kuthu Night: Live", image: IMG.kuthu },
    { title: "Student Company Showcase", image: IMG.contemporary },
  ],
  gallery: [
    { title: "Stage spotlight", category: "Performance", image: IMG.bollywoodRed },
    { title: "Company photo", category: "Community", image: IMG.team },
    { title: "Bollywood lead", category: "Performance", image: IMG.heroDancer },
    { title: "Crew energy", category: "Hip-Hop", image: IMG.hiphop },
    { title: "Festival rhythm", category: "Performance", image: IMG.bollywoodStage },
    { title: "Kuthu power", category: "Studio", image: IMG.kuthu },
    { title: "World of Dance Summit", category: "Performance", image: IMG.summit },
    { title: "Contemporary phrasing", category: "Technique", image: IMG.contemporary },
    { title: "Behind the scenes", category: "Community", image: IMG.team },
  ],
  albums: [
    { title: "World of Dance Summit", meta: "124 Photos · 2 Videos", image: IMG.summit },
    { title: "BollyFit Showcase 2025", meta: "98 Photos · 1 Video", image: IMG.bollywoodStage },
    { title: "Workshop Highlights", meta: "76 Photos · 3 Videos", image: IMG.kuthu },
    { title: "Studio Life", meta: "63 Photos · 2 Videos", image: IMG.team },
  ],
  testimonials: [
    {
      name: "Shreya P.",
      role: "Parent",
      quote:
        "BollyFit is my second home. The energy, the instructors, the community — everything pushes me to be better.",
    },
    {
      name: "Karan M.",
      role: "Adult student",
      quote:
        "I've grown so much in confidence and technique. The classes are challenging, fun, and so inspiring!",
    },
    {
      name: "Nivetha R.",
      role: "Performance team dancer",
      quote:
        "From my first class, I felt welcomed. BollyFit truly brings culture, passion, and family together.",
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
      question: "Do I need dance experience to join?",
      answer:
        "Not at all! BollyFit welcomes all levels — from complete beginners to advanced dancers. Our classes are designed to help you grow at your own pace in a supportive environment.",
    },
    {
      question: "What should I wear to class?",
      answer:
        "Wear comfortable, movement-friendly clothing and supportive shoes. Bring water and a small towel. For certain styles we'll guide you on the best footwear once you start.",
    },
    {
      question: "Can I try a class before committing?",
      answer:
        "Yes. Your first class is a free trial so you can experience the energy, meet the instructors, and find the right fit before joining a program.",
    },
    {
      question: "Do you offer classes for all ages?",
      answer:
        "We run beginner-friendly pathways for kids, teens, and adults, plus a performance team track for dancers who want extra rehearsal and stage experience.",
    },
  ],
  contact: {
    email: "bollyfitdancestudio@gmail.com",
    phone: "0406 165 043",
    instagram: "@bollyfit_dance_studio",
    youtube: "BollyFit Dance Studio",
    whatsapp: "+61 406 165 043",
    serviceArea: "Serving families, teens, adults, and event partners across Sydney.",
    address: "Sydney, Australia",
    responseTime: "Typical reply within 24 hours.",
    hours: [
      { label: "Mon – Fri", time: "4:00pm – 9:00pm" },
      { label: "Saturday", time: "9:00am – 6:00pm" },
      { label: "Sunday", time: "10:00am – 4:00pm" },
    ],
  },
};
