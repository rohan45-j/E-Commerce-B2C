export interface HeroConfig {
  badgeText: string;
  titleMain: string;
  titleHighlight: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  cardTag: string;
  cardTitle: string;
  cardSubtext: string;
  cardImage: string;
  cardLink: string;
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  badgeText: "Summer '26 Drop Shoulder & Luxe Polos",
  titleMain: "Matching Fashion & Class with",
  titleHighlight: "Comfort",
  subtitle:
    "Bangladesh's premier direct-to-consumer apparel brand. 100% combed cotton, tailored comfort, and pre-shrunk durability designed for your daily confidence.",
  primaryBtnText: "Shop Men's Polos →",
  primaryBtnLink: "/shop?category=mens-polo",
  secondaryBtnText: "Women's Ethnic Wear",
  secondaryBtnLink: "/shop?category=womens-kurtis",
  cardTag: "Featured Collection",
  cardTitle: "Premium Heavyweight Drop Shoulder",
  cardSubtext: "Starting from only ৳ 650.00",
  cardImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85",
  cardLink: "/shop?category=mens-drop-shoulder",
  trustBadge1: "Cash on Delivery",
  trustBadge2: "7 Days Return",
  trustBadge3: "100% Combed Cotton",
};

export function extractHeroConfig(settings: Record<string, string>): HeroConfig {
  return {
    badgeText: settings["hero_badge_text"] || DEFAULT_HERO_CONFIG.badgeText,
    titleMain: settings["hero_title_main"] || DEFAULT_HERO_CONFIG.titleMain,
    titleHighlight: settings["hero_title_highlight"] || DEFAULT_HERO_CONFIG.titleHighlight,
    subtitle: settings["hero_subtitle"] || DEFAULT_HERO_CONFIG.subtitle,
    primaryBtnText: settings["hero_primary_btn_text"] || DEFAULT_HERO_CONFIG.primaryBtnText,
    primaryBtnLink: settings["hero_primary_btn_link"] || DEFAULT_HERO_CONFIG.primaryBtnLink,
    secondaryBtnText: settings["hero_secondary_btn_text"] || DEFAULT_HERO_CONFIG.secondaryBtnText,
    secondaryBtnLink: settings["hero_secondary_btn_link"] || DEFAULT_HERO_CONFIG.secondaryBtnLink,
    cardTag: settings["hero_card_tag"] || DEFAULT_HERO_CONFIG.cardTag,
    cardTitle: settings["hero_card_title"] || DEFAULT_HERO_CONFIG.cardTitle,
    cardSubtext: settings["hero_card_subtext"] || DEFAULT_HERO_CONFIG.cardSubtext,
    cardImage: settings["hero_card_image"] || DEFAULT_HERO_CONFIG.cardImage,
    cardLink: settings["hero_card_link"] || DEFAULT_HERO_CONFIG.cardLink,
    trustBadge1: settings["hero_trust_badge_1"] || DEFAULT_HERO_CONFIG.trustBadge1,
    trustBadge2: settings["hero_trust_badge_2"] || DEFAULT_HERO_CONFIG.trustBadge2,
    trustBadge3: settings["hero_trust_badge_3"] || DEFAULT_HERO_CONFIG.trustBadge3,
  };
}
