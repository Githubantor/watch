export interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  description: string;
  specs: string[];
  image: string;
  accent: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "heritage-chrono",
    name: "Heritage Chronograph",
    collection: "Heritage",
    price: 12500,
    description:
      "A masterful chronograph that captures the essence of classic watchmaking. Featuring a hand-wound movement with column-wheel mechanism, this timepiece honors our legacy of precision.",
    specs: ["40mm 18K Gold Case", "Hand-wound Movement", "72hr Power Reserve", "Sapphire Crystal", "Alligator Strap"],
    image: "/images/watch-heritage.jpg",
    accent: "Gold",
    featured: true,
  },
  {
    id: "ocean-master",
    name: "Ocean Master 300",
    collection: "Sport",
    price: 8900,
    description:
      "Engineered for the depths. The Ocean Master 300 combines professional-grade water resistance with refined elegance, making it equally at home in the boardroom or beneath the waves.",
    specs: ["42mm Steel Case", "Automatic Movement", "300m Water Resistance", "Ceramic Bezel", "Steel Bracelet"],
    image: "/images/watch-sport.jpg",
    accent: "Steel",
    featured: true,
  },
  {
    id: "aviator-gmt",
    name: "Aviator GMT",
    collection: "Sport",
    price: 15200,
    description:
      "Born for the skies. This GMT chronograph features a dual-time zone function and a titanium case, designed for the modern explorer who values precision across continents.",
    specs: ["44mm Titanium Case", "GMT Movement", "56hr Power Reserve", "Anti-reflective Crystal", "Titanium Bracelet"],
    image: "/images/watch-chrono.jpg",
    accent: "Titanium",
    featured: true,
  },
  {
    id: "classic-moon",
    name: "Classic Moonphase",
    collection: "Heritage",
    price: 22800,
    description:
      "A celestial masterpiece. The moonphase complication, adorned with a star-studded sky, sits within an elegant platinum case — a true collector's piece.",
    specs: ["38mm Platinum Case", "Moonphase Movement", "48hr Power Reserve", "Sapphire Crystal", "Leather Strap"],
    image: "/images/watch-moon.jpg",
    accent: "Platinum",
    featured: true,
  },
  {
    id: "sport-elite",
    name: "Sport Elite",
    collection: "Diamond",
    price: 6500,
    description:
      "The perfect fusion of athletic performance and luxury. Carbon composite construction meets diamond-set bezel for a watch that transcends categories.",
    specs: ["41mm Carbon Case", "Quartz Movement", "10yr Battery", "Diamond Bezel", "Rubber Strap"],
    image: "/images/watch-diamond.jpg",
    accent: "Carbon",
    featured: true,
  },
  {
    id: "royal-tourbillon",
    name: "Royal Tourbillon",
    collection: "Diamond",
    price: 45000,
    description:
      "The pinnacle of horological artistry. Our flagship tourbillon features a hand-engraved movement visible through an openworked dial, set in rose gold.",
    specs: ["43mm Rose Gold Case", "Tourbillon Movement", "96hr Power Reserve", "Openworked Dial", "Alligator Strap"],
    image: "/images/watch-tourbillon.jpg",
    accent: "Rose Gold",
    featured: true,
  },
];

export const collections = [
  {
    id: "heritage",
    name: "Heritage",
    subtitle: "Classic Excellence",
    description: "Time-honored designs that transcend generations, crafted with centuries-old techniques.",
    image: "/images/watch-heritage.jpg",
  },
  {
    id: "sport",
    name: "Sport",
    subtitle: "Precision in Motion",
    description: "Engineered for the adventurous spirit, combining durability with refined aesthetics.",
    image: "/images/watch-sport.jpg",
  },
  {
    id: "diamond",
    name: "Diamond",
    subtitle: "Radiant Luxury",
    description: "Exquisite timepieces adorned with meticulously selected precious gems.",
    image: "/images/watch-diamond.jpg",
  },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}
