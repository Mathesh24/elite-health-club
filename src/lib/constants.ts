export const NAV_LINKS = [
  { label: "Amenities", href: "#amenities" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Plans", href: "#plans" },
  { label: "Contact", href: "#contact" },
] as const;

export const amenities = [
  {
    id: "pool",
    name: "Swimming Pool",
    icon: "Waves" as const,
    description:
      "Mini Olympic Sized pool aimed at Low impact & Joint friendly exercises to meet longevity goals and reset your soul every day. Surrounded by soothing greenery and Clay Walls",
    stat: "25m Heated",
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    icon: "Dumbbell" as const,
    description:
      "State of the art executive Gym with 24 hr unrestricted access to members to add years to their life.",
    stat: "12,000 sq ft",
  },
  {
    id: "tennis",
    name: " Multi Game Outdoor Court",
    icon: "Activity" as const,
    description:
      "Asphalt based multipurpose joint friendly turf for Tennis , Basketball and Pickle ball. Flood lights for extended usage for professionals.",
  },
  {
    id: "badminton",
    name: "Luxury Stay",
    icon: "Hotel" as const,
    description:
      "Three suite rooms for members and their guests to service throughout the year , with prior booking.",
  },
  {
    id: "resort",
    name: "SAUNA",
    icon: "Flame" as const,
    description:
      "Complete your daily ritual in our sauna sanctuary—a space where heat heals the body and the silence resets the soul. It’s the final, vital step in adding life to your years.",
  },
  {
    id: "steambath",
    name: "STEAM BATH",
    icon: "Cloud" as const,
    description:
      "Vital screen free sanctuary designed to lower stress, support deep detoxification, and melt tension from gym and courts.",
  },
];

export const plans = [
  {
    name: "Silver",
    monthlyPrice: 79,
    annualPrice: 759,
    features: [
      "Gym & fitness centre access",
      "Swimming pool access",
      "Locker room & showers",
      "Free Wi-Fi",
      "1 fitness assessment / quarter",
    ],
    highlighted: false,
  },
  {
    name: "Gold",
    monthlyPrice: 149,
    annualPrice: 1429,
    features: [
      "All Silver benefits",
      "Tennis & badminton courts",
      "Group classes (50+ / week)",
      "2 guest passes / month",
      "Sauna & steam room",
      "Priority booking",
    ],
    highlighted: true,
  },
  {
    name: "Platinum",
    monthlyPrice: 249,
    annualPrice: 2389,
    features: [
      "All Gold benefits",
      "Resort & suite access",
      "Personal trainer (4 sessions / mo)",
      "Spa & wellness treatments",
      "Unlimited guest passes",
      "Exclusive member events",
      "Dedicated concierge",
    ],
    highlighted: false,
  },
];

export const testimonials = [
  {
    quote:
      "Joining Elite Health Club was the best decision I made this year. The facilities are immaculate and the staff genuinely care about your progress.",
    name: "Priya Sharma",
    tier: "Platinum Member",
    initials: "PS",
  },
  {
    quote:
      "I've been to gyms across the country, and nothing comes close. The pool alone is worth the membership — it's like training at a five-star resort.",
    name: "David Chen",
    tier: "Gold Member",
    initials: "DC",
  },
  {
    quote:
      "The tennis coaching programme took my game to a whole new level. Coach Rajan is exceptional, and the court quality rivals professional venues.",
    name: "Ananya Iyer",
    tier: "Gold Member",
    initials: "AI",
  },
  {
    quote:
      "As a busy professional, the resort stay option is a lifesaver. I can work out, unwind in the spa, and sleep in luxury — all without leaving the club.",
    name: "Marcus Johnson",
    tier: "Platinum Member",
    initials: "MJ",
  },
  {
    quote:
      "I started with Silver and upgraded to Gold within a month. The group classes are addictive, and the community here is incredibly welcoming.",
    name: "Fatima Al-Rashid",
    tier: "Gold Member",
    initials: "FA",
  },
];

export const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "5,000+", label: "Active Members" },
  { value: "50+", label: "Classes Every Week" },
];

export const galleryImages = [
  {
    src: "/SwimmingPool.png",
    alt: "Olympic-sized swimming pool with infinity edge",
    category: "Pool",
  },
  {
    src: "/IndoorGym.png",
    alt: "Modern gym floor with state-of-the-art equipment",
    category: "Gym",
  },
  {
    src: "/ConferenceHall_1.png",
    alt: "Modern conference hall with elegant interior",
    category: "Hall",
  },
  {
    src: "/MiniCafe1.png",
    alt: "Cozy mini cafe area with seating and refreshments",
    category: "Resort",
  },
  {
    src: "/tenniscourt1.png",
    alt: "Professional tennis court under floodlights",
    category: "Courts",
  },
  {
    src: "/LivingArea.png",
    alt: "Comfortable clubhouse living area",
    category: "Resort",
  },
  {
    src: "/IndoorGym2.png",
    alt: "Free weights and functional training zone",
    category: "Gym",
  },
  {
    src: "/ConferenceHall_2.png",
    alt: "Elegant meeting hall with conference seating",
    category: "Hall",
  },

  {
    src: "/SaunaSteamBath.png",
    alt: "Spa treatment room with ambient lighting",
    category: "Resort",
  },
  {
    src: "/DiningArea.png",
    alt: "Elegant dining area with comfortable seating",
    category: "Resort",
  },
  {
    src: "/SaunaSteamBath3.png",
    alt: "Modern steam bath with ambient lighting and wooden benches",
    category: "Resort",
  },
  {
    src: "/SaunaSteamBath2.png",
    alt: "Elegant sauna steam room with wooden interiors",
    category: "Resort",
  },
  {
    src: "/MiniCafe2.png",
    alt: "Cafe counter with snacks and beverages",
    category: "Resort",
  },
   {
    src: "/pool2.png",
    alt: "Serene pool area with lounge chairs and greenery",
    category: "Pool",
  },
  {
    src: "/court.png",
    alt: "Professional tennis court under floodlights",
    category: "Courts",
  },
  
];

export const GALLERY_CATEGORIES = ["All", "Pool", "Gym", "Courts", "Resort", "Hall"] as const;

export const CONTACT_INFO = {
  address: "Kandukur, Andhra Pradesh - 523 105",
  phone: " +91 8187861777",
  email: "elitehealthclubkdkr@gmail.com",
  hours:  "Mon – Sat\n5:30 AM – 10:00 PM\n\nSun\n7:00 AM – 8:00 PM",
};
