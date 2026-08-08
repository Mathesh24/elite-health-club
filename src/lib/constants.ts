export const NAV_LINKS = [
  { label: "Amenities", href: "#amenities" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Membership", href: "#plans" },
  { label: "Contact", href: "#contact" },
] as const;

export const amenities = [
  {
    id: "pool",
    name: "Swimming Pool",
    icon: "Waves" as const,
    description:
      "Olympic-sized heated pool with dedicated lap lanes and a resort-style infinity edge overlooking landscaped gardens.",
    stat: "25m Heated",
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    icon: "Dumbbell" as const,
    description:
      "State-of-the-art equipment across 12,000 sq ft, with dedicated zones for strength, cardio, and functional training.",
    stat: "12,000 sq ft",
  },
  {
    id: "tennis",
    name: "Tennis Courts",
    icon: "CircleDot" as const,
    description:
      "Four professional-grade courts with floodlighting for evening play, plus coaching from certified pros.",
    stat: "4 Courts",
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "Volleyball" as const,
    description:
      "Three international-standard indoor courts with sprung wooden flooring and tournament-grade lighting.",
    stat: "3 Courts",
  },
  {
    id: "resort",
    name: "Resort & Stay",
    icon: "Hotel" as const,
    description:
      "Luxury suites with spa access, farm-to-table dining, and curated wellness retreat packages for members and guests.",
    stat: "24 Suites",
  },
];

export const testimonials = [
  {
    quote:
      "Joining Elite Health Club was the best decision I made this year. The facilities are immaculate and the staff genuinely care about your progress.",
    name: "Priya Sharma",
    tier: "Elite Member",
    initials: "PS",
  },
  {
    quote:
      "I've been to gyms across the country, and nothing comes close. The pool alone is worth the membership — it's like training at a five-star resort.",
    name: "David Chen",
    tier: "Elite Member",
    initials: "DC",
  },
  {
    quote:
      "The tennis coaching programme took my game to a whole new level. Coach Rajan is exceptional, and the court quality rivals professional venues.",
    name: "Ananya Iyer",
    tier: "Elite Member",
    initials: "AI",
  },
  {
    quote:
      "As a busy professional, the resort stay option is a lifesaver. I can work out, unwind in the spa, and sleep in luxury — all without leaving the club.",
    name: "Marcus Johnson",
    tier: "Elite Member",
    initials: "MJ",
  },
  {
    quote:
      "The group classes are addictive, and the community here is incredibly welcoming. I felt at home from my very first month.",
    name: "Fatima Al-Rashid",
    tier: "Elite Member",
    initials: "FA",
  },
];

export const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "5,000+", label: "Active Members" },
  { value: "50+", label: "Classes Every Week" },
];

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const galleryImages = [
  {
    src: `${publicBasePath}/elite-pool-daylight-wide.webp`,
    alt: "Elite Health Club swimming pool filled with clear water in natural daylight",
    category: "Pool",
    width: 1448,
    height: 1086,
  },
  {
    src: `${publicBasePath}/elite-pool-daylight-overview.webp`,
    alt: "Elevated daylight view of the full Elite Health Club swimming pool",
    category: "Pool",
    width: 1086,
    height: 1448,
  },
  {
    src: `${publicBasePath}/gallery-2026-08-08-at-17-38-50.webp`,
    alt: "Elite Health Club pool filled with water at blue hour",
    category: "Pool",
    width: 1600,
    height: 1200,
  },
  {
    src: `${publicBasePath}/gallery-2026-08-08-at-17-38-49.webp`,
    alt: "Elevated evening view of the filled Elite Health Club pool",
    category: "Pool",
    width: 960,
    height: 1280,
  },
  {
    src: `${publicBasePath}/gallery-14.webp`,
    alt: "Clean landscaped entrance to the Elite Health Club pool area",
    category: "Club Grounds",
    width: 1448,
    height: 1086,
  },
  {
    src: `${publicBasePath}/gallery-9.webp`,
    alt: "Clean landscaped poolside walkway and privacy wall",
    category: "Club Grounds",
    width: 1086,
    height: 1448,
  },
  {
    src: `${publicBasePath}/gallery-8.webp`,
    alt: "Front view of the clean, filled Elite Health Club swimming pool",
    category: "Pool",
    width: 1448,
    height: 1086,
  },
  {
    src: `${publicBasePath}/gallery-10.webp`,
    alt: "Elevated view of the clean, filled swimming pool and clubhouse",
    category: "Pool",
    width: 1086,
    height: 1448,
  },
  {
    src: `${publicBasePath}/gallery-12.webp`,
    alt: "Angled view of the clean, filled pool and clubhouse",
    category: "Pool",
    width: 1086,
    height: 1448,
  },
  {
    src: `${publicBasePath}/gallery-13.webp`,
    alt: "Elevated view of the clean, filled pool and club grounds",
    category: "Pool",
    width: 1448,
    height: 1086,
  },
];

export const GALLERY_CATEGORIES = [
  "All",
  "Pool",
  "Club Grounds",
] as const;

export const CONTACT_INFO = {
  address: "6W7F+H4V, Oguru, Andhra Pradesh",
  mapsUrl: "https://maps.app.goo.gl/RARUCYvAzuCu4pLfA?g_st=aw",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=15.213987,79.922782&z=16&output=embed",
  phone: "+91 80 4567 8900",
  email: "hello@elitehealthclub.in",
  hours: "Mon – Sat: 5:30 AM – 10:00 PM | Sun: 7:00 AM – 8:00 PM",
};
