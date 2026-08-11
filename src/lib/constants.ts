export const NAV_LINKS = [
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Membership", href: "#plans" },
  { label: "Contact", href: "#contact" },
] as const;

export const amenities = [
  {
    id: "pool",
    name: "Swimming Pool",
    icon: "Waves" as const,
    image: "/SwimmingPool.png",
    description:
      "Mini Olympic Sized pool aimed at Low impact & Joint friendly exercises to meet longevity goals and reset your soul every day. Surrounded by soothing greenery and Clay Walls",
    stat: "25m Heated",
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    icon: "Dumbbell" as const,
    image: "/IndoorGym.png",
    description:
      "State of the art executive Gym with 24 hr unrestricted access to members to add years to their life.",
    stat: "12,000 sq ft",
  },
  {
    id: "tennis",
    name: "Multi Game Outdoor Court",
    icon: "Activity" as const,
    image: "/tenniscourt1.png",
    description:
      "Asphalt based multipurpose joint friendly turf for Tennis, Basketball and Pickle ball. Flood lights for extended usage for professionals.",
  },
  {
    id: "badminton",
    name: "Luxury Stay",
    icon: "Hotel" as const,
    image: "/LivingArea.png",
    description:
      "Three suite rooms for members and their guests to service throughout the year, with prior booking.",
  },
  {
    id: "resort",
    name: "Sauna",
    icon: "Flame" as const,
    image: "/SaunaSteamBath2.png",
    description:
      "Complete your daily ritual in our sauna sanctuary—a space where heat heals the body and the silence resets the soul. It’s the final, vital step in adding life to your years.",
  },
  {
    id: "steambath",
    name: "Steam Bath",
    icon: "Cloud" as const,
    image: "/SaunaSteamBath3.png",
    description:
      "Vital screen free sanctuary designed to lower stress, support deep detoxification, and melt tension from gym and courts.",
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

const homepageContentGalleryImages = [
  {
    src: `${publicBasePath}/SwimmingPool.png`,
    alt: "Olympic-sized swimming pool with infinity edge",
    category: "Pool",
    width: 842,
    height: 1264,
  },
  {
    src: `${publicBasePath}/IndoorGym.png`,
    alt: "Modern gym floor with state-of-the-art equipment",
    category: "Gym",
    width: 1195,
    height: 896,
  },
  {
    src: `${publicBasePath}/ConferenceHall_1.png`,
    alt: "Modern conference hall with elegant interior",
    category: "Hall",
    width: 1195,
    height: 896,
  },
  {
    src: `${publicBasePath}/MiniCafe1.png`,
    alt: "Cozy mini cafe area with seating and refreshments",
    category: "Resort",
    width: 1024,
    height: 1024,
  },
  {
    src: `${publicBasePath}/tenniscourt1.png`,
    alt: "Professional tennis court under floodlights",
    category: "Courts",
    width: 1448,
    height: 1086,
  },
  {
    src: `${publicBasePath}/LivingArea.png`,
    alt: "Comfortable clubhouse living area",
    category: "Resort",
    width: 1195,
    height: 896,
  },
  {
    src: `${publicBasePath}/IndoorGym2.png`,
    alt: "Free weights and functional training zone",
    category: "Gym",
    width: 1195,
    height: 896,
  },
  {
    src: `${publicBasePath}/ConferenceHall_2.png`,
    alt: "Elegant meeting hall with conference seating",
    category: "Hall",
    width: 1254,
    height: 1254,
  },
  {
    src: `${publicBasePath}/SaunaSteamBath.png`,
    alt: "Spa treatment room with ambient lighting",
    category: "Resort",
    width: 1024,
    height: 1024,
  },
  {
    src: `${publicBasePath}/DiningArea.png`,
    alt: "Elegant dining area with comfortable seating",
    category: "Resort",
    width: 1024,
    height: 1024,
  },
  {
    src: `${publicBasePath}/SaunaSteamBath3.png`,
    alt: "Modern steam bath with ambient lighting and wooden benches",
    category: "Resort",
    width: 1024,
    height: 1024,
  },
  {
    src: `${publicBasePath}/SaunaSteamBath2.png`,
    alt: "Elegant sauna steam room with wooden interiors",
    category: "Resort",
    width: 1024,
    height: 1024,
  },
  {
    src: `${publicBasePath}/MiniCafe2.png`,
    alt: "Cafe counter with snacks and beverages",
    category: "Resort",
    width: 1024,
    height: 1024,
  },
  {
    src: `${publicBasePath}/pool2.png`,
    alt: "Serene pool area with lounge chairs and greenery",
    category: "Pool",
    width: 1195,
    height: 896,
  },
  {
    src: `${publicBasePath}/court.png`,
    alt: "Professional tennis court under floodlights",
    category: "Courts",
    width: 1122,
    height: 1402,
  },
];

const currentGalleryImages = [
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

export const galleryImages = [
  ...homepageContentGalleryImages,
  ...currentGalleryImages,
];

export const GALLERY_CATEGORIES = [
  "All",
  "Pool",
  "Gym",
  "Courts",
  "Resort",
  "Hall",
  "Club Grounds",
] as const;

export const CONTACT_INFO = {
  address:
    "1-1, Kakumanivaripalem, Kandukur Rural, Kandukur, SPSR Nellore, Andhra Pradesh - 523105",
  mapsUrl: "https://maps.app.goo.gl/RARUCYvAzuCu4pLfA?g_st=aw",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=15.213987,79.922782&z=16&output=embed",
  phone: "+91 81878 61777",
  email: "Elitehealthclubkdkr@gmail.com",
  hours: "Mon – Sat: 5:30 AM – 10:00 PM | Sun: 7:00 AM – 8:00 PM",
};
