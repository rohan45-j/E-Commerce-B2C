"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Palette,
  Sparkles,
  ShoppingBag,
  Heart,
  Save,
  Loader2,
  RefreshCw,
  Sliders,
  Check,
  Eye,
  Smartphone,
  Monitor,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import {
  THEME_PRESETS,
  DEFAULT_THEME,
  ThemeTokens,
  extractThemeTokens,
} from "@/lib/theme-config";
import { updateSiteSettingsAction } from "@/app/admin/settings/actions";

interface ThemeCustomizerProps {
  initialSettings?: Record<string, string>;
  onSaved?: () => void;
}

export function ThemeCustomizer({ initialSettings = {}, onSaved }: ThemeCustomizerProps) {
  const [tokens, setTokens] = React.useState<ThemeTokens>(() => extractThemeTokens(initialSettings));
  const [isSaving, setIsSaving] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<string | null>("fabrilife-classic");
  const [previewTab, setPreviewTab] = React.useState<"desktop" | "mobile">("desktop");

  React.useEffect(() => {
    if (Object.keys(initialSettings).length > 0) {
      setTokens(extractThemeTokens(initialSettings));
    }
  }, [initialSettings]);

  const handleTokenChange = (key: keyof ThemeTokens, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null); // customized
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTokens(preset.tokens);
    setActivePreset(presetId);
    toast.success(`Applied "${preset.name}" color preset!`);
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        theme_primary_brand: tokens.primaryBrand,
        theme_header_bg: tokens.headerBg,
        theme_cta_bg: tokens.ctaBg,
        theme_cta_hover: tokens.ctaHover,
        theme_cta_text: tokens.ctaText,
        theme_accent_badge: tokens.accentBadge,
        theme_announcement_bg: tokens.announcementBg,
        theme_announcement_text: tokens.announcementText,
        theme_btn_radius: tokens.btnRadius,
      };

      const res = await updateSiteSettingsAction(payload);
      if (res.success) {
        toast.success("Theme and color styling updated live across the entire storefront!");
        onSaved?.();
      } else {
        toast.error(res.error || "Failed to save theme settings");
      }
    } catch (err) {
      toast.error(`Error saving theme: ${err instanceof Error ? err.message : "Network error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setTokens(DEFAULT_THEME);
    setActivePreset("fabrilife-classic");
    toast.info("Reset to Fabrilife default theme");
  };

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-[#04aeef]/10 text-[#04aeef] flex items-center justify-center">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Storefront Theme &amp; Color CMS
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize brand colors, CTA buttons, badges, and border radius in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetToDefault}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset Default
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSaving}
            onClick={handleSaveTheme}
            className="bg-[#222f3f] hover:bg-[#04aeef] text-white text-xs gap-2 h-9 px-4 font-bold shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Theme...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> Save Theme Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. 1-Click Theme Presets Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-4 w-4 text-[#04aeef]" /> 1-Click Theme Presets
          </Label>
          <span className="text-[11px] text-muted-foreground">
            Select a curated palette or customize tokens below
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "border-[#04aeef] bg-[#04aeef]/5 ring-2 ring-[#04aeef]/30 shadow-md"
                    : "bg-card hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    {preset.previewColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="font-bold text-xs text-foreground truncate">
                    {preset.name}
                  </p>
                </div>
                {isSelected && (
                  <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-[#04aeef] text-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Split View: Color Controls (Left) vs Live Component Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Color & Styling Controls (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#04aeef]" /> Brand &amp; Header Colors
              </CardTitle>
              <CardDescription className="text-xs">
                Controls the storefront top banner, header accents, and primary branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Brand Color */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
                <div>
                  <Label className="font-semibold text-xs">Primary Brand Accent</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Active links, icons, search highlights, and logos.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tokens.primaryBrand}
                    onChange={(e) => handleTokenChange("primaryBrand", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                  />
                  <Input
                    value={tokens.primaryBrand}
                    onChange={(e) => handleTokenChange("primaryBrand", e.target.value)}
                    className="w-24 h-8 text-xs font-mono uppercase bg-background"
                  />
                </div>
              </div>

              {/* Header & Nav Background */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
                <div>
                  <Label className="font-semibold text-xs">Header &amp; Footer Dark Tone</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Background for footer, hero cards, and announcement bars.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tokens.headerBg}
                    onChange={(e) => handleTokenChange("headerBg", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                  />
                  <Input
                    value={tokens.headerBg}
                    onChange={(e) => handleTokenChange("headerBg", e.target.value)}
                    className="w-24 h-8 text-xs font-mono uppercase bg-background"
                  />
                </div>
              </div>

              {/* Top Announcement Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg border bg-muted/20 space-y-2">
                  <Label className="text-xs font-semibold">Announcement Bar BG</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tokens.announcementBg}
                      onChange={(e) => handleTokenChange("announcementBg", e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                    />
                    <Input
                      value={tokens.announcementBg}
                      onChange={(e) => handleTokenChange("announcementBg", e.target.value)}
                      className="h-8 text-xs font-mono uppercase bg-background"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20 space-y-2">
                  <Label className="text-xs font-semibold">Announcement Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tokens.announcementText}
                      onChange={(e) => handleTokenChange("announcementText", e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                    />
                    <Input
                      value={tokens.announcementText}
                      onChange={(e) => handleTokenChange("announcementText", e.target.value)}
                      className="h-8 text-xs font-mono uppercase bg-background"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons & Badges Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#ff3f6c]" /> CTA Buttons &amp; Badges
              </CardTitle>
              <CardDescription className="text-xs">
                Directly updates &quot;Add to Bag&quot;, checkout buttons, discount badges, and border radius.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* CTA Button Background */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
                <div>
                  <Label className="font-semibold text-xs">CTA Button Background</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Primary action color for &quot;Add to Bag&quot; and checkout.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tokens.ctaBg}
                    onChange={(e) => handleTokenChange("ctaBg", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                  />
                  <Input
                    value={tokens.ctaBg}
                    onChange={(e) => handleTokenChange("ctaBg", e.target.value)}
                    className="w-24 h-8 text-xs font-mono uppercase bg-background"
                  />
                </div>
              </div>

              {/* CTA Button Hover */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-lg border bg-muted/20">
                <div>
                  <Label className="font-semibold text-xs">CTA Button Hover Color</Label>
                  <p className="text-[11px] text-muted-foreground">
                    State shown when customer hovers cursor over buttons.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={tokens.ctaHover}
                    onChange={(e) => handleTokenChange("ctaHover", e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                  />
                  <Input
                    value={tokens.ctaHover}
                    onChange={(e) => handleTokenChange("ctaHover", e.target.value)}
                    className="w-24 h-8 text-xs font-mono uppercase bg-background"
                  />
                </div>
              </div>

              {/* CTA Button Text & Badge Accent */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border bg-muted/20 space-y-2">
                  <Label className="text-xs font-semibold">CTA Button Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tokens.ctaText}
                      onChange={(e) => handleTokenChange("ctaText", e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                    />
                    <Input
                      value={tokens.ctaText}
                      onChange={(e) => handleTokenChange("ctaText", e.target.value)}
                      className="h-8 text-xs font-mono uppercase bg-background"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-muted/20 space-y-2">
                  <Label className="text-xs font-semibold flex items-center gap-1">
                    <Flame className="h-3 w-3 text-rose-500" /> Discount Badge Pill
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tokens.accentBadge}
                      onChange={(e) => handleTokenChange("accentBadge", e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border p-0.5 bg-background"
                    />
                    <Input
                      value={tokens.accentBadge}
                      onChange={(e) => handleTokenChange("accentBadge", e.target.value)}
                      className="h-8 text-xs font-mono uppercase bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Button Border Radius Slider */}
              <div className="p-3.5 rounded-lg border bg-muted/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Button Border Radius</Label>
                  <span className="text-xs font-mono font-bold text-foreground bg-background px-2 py-0.5 rounded border">
                    {tokens.btnRadius}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground">Square (0px)</span>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="2"
                    value={parseInt(tokens.btnRadius, 10) || 8}
                    onChange={(e) => handleTokenChange("btnRadius", `${e.target.value}px`)}
                    className="flex-1 accent-[#04aeef] cursor-pointer"
                  />
                  <span className="text-[11px] text-muted-foreground">Pill (24px)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Storefront Mockup Preview (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-muted-foreground">
              <Eye className="h-4 w-4 text-[#04aeef]" /> Live Component Preview
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewTab("desktop")}
                className={`p-1.5 rounded-md text-xs transition-all ${
                  previewTab === "desktop" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                title="Desktop View"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("mobile")}
                className={`p-1.5 rounded-md text-xs transition-all ${
                  previewTab === "mobile" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                title="Mobile View"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-slate-100 dark:bg-slate-900/60 p-4 shadow-inner space-y-4">
            {/* 1. Header Bar Simulation */}
            <div className="rounded-xl overflow-hidden border shadow-sm bg-white dark:bg-slate-950">
              {/* Announcement Bar */}
              <div
                className="py-1 px-3 text-[10px] font-bold flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: tokens.announcementBg,
                  color: tokens.announcementText,
                }}
              >
                <span className="flex items-center gap-1 truncate">
                  <Sparkles className="h-2.5 w-2.5" style={{ color: tokens.primaryBrand }} />
                  FREE SHIPPING OVER ৳1,500
                </span>
                <span className="text-[9px] opacity-80 hidden sm:inline">7 Days Return</span>
              </div>

              {/* Main Nav Mockup */}
              <div className="p-3 flex items-center justify-between border-b gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-tight text-foreground uppercase">
                    FABRI<span style={{ color: tokens.primaryBrand }}>LIFE</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                  <span
                    className="px-2 py-1 rounded cursor-default"
                    style={{ color: tokens.primaryBrand }}
                  >
                    Men
                  </span>
                  <span className="text-muted-foreground hover:text-foreground">Women</span>
                  <span className="text-muted-foreground hover:text-foreground">Sports</span>
                </div>

                <div className="relative">
                  <ShoppingBag className="h-4 w-4 text-foreground" />
                  <span
                    className="absolute -top-1.5 -right-1.5 text-[8px] font-bold text-white h-3.5 w-3.5 rounded-full flex items-center justify-center shadow"
                    style={{ backgroundColor: tokens.accentBadge }}
                  >
                    3
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Interactive Product Card Simulation */}
            <div className="max-w-[280px] mx-auto rounded-xl border bg-white dark:bg-slate-950 overflow-hidden shadow-md">
              <div className="relative aspect-[3/4] w-full bg-slate-100 dark:bg-slate-900">
                <Image
                  src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80"
                  alt="Product simulation"
                  fill
                  className="object-cover"
                />

                {/* Dynamic Accent Discount Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                    style={{ backgroundColor: tokens.accentBadge }}
                  >
                    -28%
                  </span>
                </div>

                <button
                  type="button"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-slate-700"
                >
                  <Heart className="h-3.5 w-3.5" style={{ color: tokens.accentBadge }} />
                </button>
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest block"
                    style={{ color: tokens.primaryBrand }}
                  >
                    Designer Polo
                  </span>
                  <h4 className="font-semibold text-xs text-foreground line-clamp-1 mt-0.5">
                    Signature Eastbound Luxe Polo
                  </h4>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm text-foreground">৳ 875.00</span>
                  <span className="text-[10px] text-muted-foreground line-through">৳ 1,200.00</span>
                </div>

                {/* Dynamic CTA Button */}
                <Button
                  type="button"
                  className="w-full text-xs font-bold uppercase tracking-wider h-8 gap-1.5 shadow-sm transition-all"
                  style={{
                    backgroundColor: tokens.ctaBg,
                    color: tokens.ctaText,
                    borderRadius: tokens.btnRadius,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.ctaHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.ctaBg;
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
                </Button>
              </div>
            </div>

            {/* 3. Hero CTA Buttons Simulation */}
            <div className="p-3 rounded-xl border bg-white dark:bg-slate-950 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Hero Section CTA Buttons:
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="flex-1 text-xs font-bold h-9 shadow-sm"
                  style={{
                    backgroundColor: tokens.ctaBg,
                    color: tokens.ctaText,
                    borderRadius: tokens.btnRadius,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.ctaHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.ctaBg;
                  }}
                >
                  Shop Men&apos;s Collection
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-xs font-bold h-9"
                  style={{
                    borderRadius: tokens.btnRadius,
                    borderColor: tokens.primaryBrand,
                    color: tokens.primaryBrand,
                  }}
                >
                  Explore Women&apos;s
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
