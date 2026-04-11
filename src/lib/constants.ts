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
    src: "https://picsum.photos/seed/ehc-pool1/600/800",
    alt: "Olympic-sized swimming pool with infinity edge",
    category: "Pool",
  },
  {
    src: "https://picsum.photos/seed/ehc-gym1/600/600",
    alt: "Modern gym floor with state-of-the-art equipment",
    category: "Gym",
  },
  {
    src: "https://picsum.photos/seed/ehc-court1/600/700",
    alt: "Professional tennis court under floodlights",
    category: "Courts",
  },
  {
    src: "https://picsum.photos/seed/ehc-resort1/600/800",
    alt: "Luxury resort suite with garden view",
    category: "Resort",
  },
  {
    src: "https://picsum.photos/seed/ehc-gym2/600/600",
    alt: "Free weights and functional training zone",
    category: "Gym",
  },
  {
    src: "https://picsum.photos/seed/ehc-pool2/600/700",
    alt: "Poolside lounge area with cabanas",
    category: "Pool",
  },
  {
    src: "https://picsum.photos/seed/ehc-court2/600/600",
    alt: "Indoor badminton court with sprung flooring",
    category: "Courts",
  },
  {
    src: "https://picsum.photos/seed/ehc-resort2/600/800",
    alt: "Spa treatment room with ambient lighting",
    category: "Resort",
  },
  {
    src: "https://picsum.photos/seed/ehc-gym3/600/700",
    alt: "Cardio deck with panoramic windows",
    category: "Gym",
  },
  {
    src: "https://picsum.photos/seed/ehc-pool3/600/600",
    alt: "Heated indoor lap pool",
    category: "Pool",
  },
];

export const GALLERY_CATEGORIES = ["All", "Pool", "Gym", "Courts", "Resort"] as const;

export const CONTACT_INFO = {
  address: "42 Greenfield Avenue, Whitefield, Bangalore 560066",
  phone: "+91 80 4567 8900",
  email: "hello@elitehealthclub.in",
  hours: "Mon – Sat: 5:30 AM – 10:00 PM | Sun: 7:00 AM – 8:00 PM",
};
