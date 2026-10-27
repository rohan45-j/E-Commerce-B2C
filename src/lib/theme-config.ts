export interface ThemeTokens {
  primaryBrand: string;
  headerBg: string;
  ctaBg: string;
  ctaHover: string;
  ctaText: string;
  accentBadge: string;
  announcementBg: string;
  announcementText: string;
  btnRadius: string;
}

export const DEFAULT_THEME: ThemeTokens = {
  primaryBrand: "#04aeef",
  headerBg: "#222f3f",
  ctaBg: "#222f3f",
  ctaHover: "#04aeef",
  ctaText: "#ffffff",
  accentBadge: "#ff3f6c",
  announcementBg: "#222f3f",
  announcementText: "#ffffff",
  btnRadius: "8px",
};

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  previewColors: string[];
  tokens: ThemeTokens;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "fabrilife-classic",
    name: "Fabrilife Signature",
    description: "The iconic Bangladesh D2C lifestyle palette: Charcoal navy, electric cyan, and coral pink.",
    previewColors: ["#04aeef", "#222f3f", "#ff3f6c"],
    tokens: {
      primaryBrand: "#04aeef",
      headerBg: "#222f3f",
      ctaBg: "#222f3f",
      ctaHover: "#04aeef",
      ctaText: "#ffffff",
      accentBadge: "#ff3f6c",
      announcementBg: "#222f3f",
      announcementText: "#ffffff",
      btnRadius: "8px",
    },
  },
  {
    id: "emerald-luxe",
    name: "Emerald Luxury",
    description: "Prestige organic feel with deep emerald forest tones, gold badge accents, and dark headers.",
    previewColors: ["#059669", "#064e3b", "#d97706"],
    tokens: {
      primaryBrand: "#059669",
      headerBg: "#064e3b",
      ctaBg: "#059669",
      ctaHover: "#047857",
      ctaText: "#ffffff",
      accentBadge: "#d97706",
      announcementBg: "#064e3b",
      announcementText: "#ffffff",
      btnRadius: "10px",
    },
  },
  {
    id: "midnight-indigo",
    name: "Midnight Indigo",
    description: "Modern tech-fashion aesthetic with sleek indigo, slate navy, and rose highlights.",
    previewColors: ["#6366f1", "#0f172a", "#f43f5e"],
    tokens: {
      primaryBrand: "#6366f1",
      headerBg: "#0f172a",
      ctaBg: "#6366f1",
      ctaHover: "#4f46e5",
      ctaText: "#ffffff",
      accentBadge: "#f43f5e",
      announcementBg: "#0f172a",
      announcementText: "#ffffff",
      btnRadius: "8px",
    },
  },
  {
    id: "crimson-street",
    name: "Crimson Streetwear",
    description: "Bold, high-energy apparel look with energetic crimson red, dark zinc, and warm amber accents.",
    previewColors: ["#e11d48", "#18181b", "#f59e0b"],
    tokens: {
      primaryBrand: "#e11d48",
      headerBg: "#18181b",
      ctaBg: "#e11d48",
      ctaHover: "#be123c",
      ctaText: "#ffffff",
      accentBadge: "#e11d48",
      announcementBg: "#18181b",
      announcementText: "#ffffff",
      btnRadius: "6px",
    },
  },
  {
    id: "sunset-coral",
    name: "Sunset Coral & Violet",
    description: "Vibrant and youthful lifestyle palette featuring sunset coral CTA and royal purple header.",
    previewColors: ["#f97316", "#312e81", "#ec4899"],
    tokens: {
      primaryBrand: "#f97316",
      headerBg: "#312e81",
      ctaBg: "#f97316",
      ctaHover: "#ea580c",
      ctaText: "#ffffff",
      accentBadge: "#ec4899",
      announcementBg: "#312e81",
      announcementText: "#ffffff",
      btnRadius: "12px",
    },
  },
  {
    id: "monochrome-clean",
    name: "Minimalist Monochrome",
    description: "Ultra-clean high fashion aesthetic: Pitch black CTAs, crisp borders, and electric blue badges.",
    previewColors: ["#000000", "#111827", "#2563eb"],
    tokens: {
      primaryBrand: "#2563eb",
      headerBg: "#111827",
      ctaBg: "#000000",
      ctaHover: "#2563eb",
      ctaText: "#ffffff",
      accentBadge: "#2563eb",
      announcementBg: "#111827",
      announcementText: "#ffffff",
      btnRadius: "4px",
    },
  },
];

export function extractThemeTokens(settings: Record<string, string> = {}): ThemeTokens {
  return {
    primaryBrand: settings["theme_primary_brand"] || DEFAULT_THEME.primaryBrand,
    headerBg: settings["theme_header_bg"] || DEFAULT_THEME.headerBg,
    ctaBg: settings["theme_cta_bg"] || DEFAULT_THEME.ctaBg,
    ctaHover: settings["theme_cta_hover"] || DEFAULT_THEME.ctaHover,
    ctaText: settings["theme_cta_text"] || DEFAULT_THEME.ctaText,
    accentBadge: settings["theme_accent_badge"] || DEFAULT_THEME.accentBadge,
    announcementBg: settings["theme_announcement_bg"] || DEFAULT_THEME.announcementBg,
    announcementText: settings["theme_announcement_text"] || DEFAULT_THEME.announcementText,
    btnRadius: settings["theme_btn_radius"] || DEFAULT_THEME.btnRadius,
  };
}

export function generateThemeCss(tokens: ThemeTokens): string {
  return `
:root {
  --primary-brand: ${tokens.primaryBrand};
  --brand-navy: ${tokens.headerBg};
  --header-bg: ${tokens.headerBg};
  --cta-bg: ${tokens.ctaBg};
  --cta-hover: ${tokens.ctaHover};
  --cta-text: ${tokens.ctaText};
  --accent-badge: ${tokens.accentBadge};
  --announcement-bg: ${tokens.announcementBg};
  --announcement-text: ${tokens.announcementText};
  --btn-radius: ${tokens.btnRadius};
}

/* Global Dynamic Theme Classes */
.theme-announcement {
  background-color: var(--announcement-bg) !important;
  color: var(--announcement-text) !important;
}

.theme-btn-cta {
  background-color: var(--cta-bg) !important;
  color: var(--cta-text) !important;
  border-radius: var(--btn-radius) !important;
  transition: all 0.2s ease-in-out !important;
}

.theme-btn-cta:hover {
  background-color: var(--cta-hover) !important;
  color: var(--cta-text) !important;
}

.theme-badge-accent {
  background-color: var(--accent-badge) !important;
  color: #ffffff !important;
}

.theme-text-brand {
  color: var(--primary-brand) !important;
}

.theme-bg-brand {
  background-color: var(--primary-brand) !important;
}

.theme-border-brand {
  border-color: var(--primary-brand) !important;
}

.theme-hover-brand:hover {
  color: var(--primary-brand) !important;
}
  `.trim();
}
