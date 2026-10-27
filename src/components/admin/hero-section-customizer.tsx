"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Save,
  Loader2,
  RotateCcw,
  Eye,
  Truck,
  RefreshCw,
  Award,
  Link as LinkIcon,
  Tag,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import {
  HeroConfig,
  DEFAULT_HERO_CONFIG,
  extractHeroConfig,
} from "@/lib/hero-config";
import { updateSiteSettingsAction } from "@/app/admin/settings/actions";

interface HeroSectionCustomizerProps {
  initialSettings?: Record<string, string>;
  onSaved?: () => void;
}

export function HeroSectionCustomizer({
  initialSettings = {},
  onSaved,
}: HeroSectionCustomizerProps) {
  const [config, setConfig] = React.useState<HeroConfig>(() =>
    extractHeroConfig(initialSettings)
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);

  React.useEffect(() => {
    if (Object.keys(initialSettings).length > 0) {
      setConfig(extractHeroConfig(initialSettings));
    }
  }, [initialSettings]);

  const handleChange = (field: keyof HeroConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        hero_badge_text: config.badgeText,
        hero_title_main: config.titleMain,
        hero_title_highlight: config.titleHighlight,
        hero_subtitle: config.subtitle,
        hero_primary_btn_text: config.primaryBtnText,
        hero_primary_btn_link: config.primaryBtnLink,
        hero_secondary_btn_text: config.secondaryBtnText,
        hero_secondary_btn_link: config.secondaryBtnLink,
        hero_card_tag: config.cardTag,
        hero_card_title: config.cardTitle,
        hero_card_subtext: config.cardSubtext,
        hero_card_image: config.cardImage,
        hero_card_link: config.cardLink,
        hero_trust_badge_1: config.trustBadge1,
        hero_trust_badge_2: config.trustBadge2,
        hero_trust_badge_3: config.trustBadge3,
      };

      const res = await updateSiteSettingsAction(payload);
      if (res.success) {
        toast.success("Homepage Hero Banner updated live across the storefront!");
        onSaved?.();
      } else {
        toast.error(res.error || "Failed to update hero section");
      }
    } catch {
      toast.error("Failed to save hero section settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset hero banner to default Fabrilife content? Any unsaved edits will be lost.")) {
      setConfig(DEFAULT_HERO_CONFIG);
      toast.info("Restored default Fabrilife hero content. Click 'Save Hero Banner' to apply.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Hero Banner Customizer</h2>
            <span className="bg-[#04aeef]/10 text-[#04aeef] text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
              Homepage Top
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the main banner text, headlines, CTA action buttons, showcase cards, and trust badges shown on the homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#04aeef] hover:bg-[#0399d3] text-white flex items-center gap-2 text-xs font-bold px-4"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Hero Banner
          </Button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Headlines & CTA Buttons (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Headline & Badge Card */}
          <Card>
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Type className="h-4 w-4 text-[#04aeef]" />
                Headlines &amp; Introduction
              </CardTitle>
              <CardDescription className="text-xs">
                Main message that greets customers upon entering the website.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#04aeef]" /> Top Accent Badge Text
                </Label>
                <Input
                  value={config.badgeText}
                  onChange={(e) => handleChange("badgeText", e.target.value)}
                  placeholder="Summer '26 Drop Shoulder & Luxe Polos"
                  className="mt-1.5 h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase">
                    Main Headline
                  </Label>
                  <Input
                    value={config.titleMain}
                    onChange={(e) => handleChange("titleMain", e.target.value)}
                    placeholder="Matching Fashion & Class with"
                    className="mt-1.5 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground uppercase text-[#04aeef]">
                    Highlight Word
                  </Label>
                  <Input
                    value={config.titleHighlight}
                    onChange={(e) => handleChange("titleHighlight", e.target.value)}
                    placeholder="Comfort"
                    className="mt-1.5 h-9 text-xs font-bold text-[#04aeef]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  Subtitle / Brand Description
                </Label>
                <Textarea
                  value={config.subtitle}
                  onChange={(e) => handleChange("subtitle", e.target.value)}
                  rows={3}
                  className="mt-1.5 text-xs resize-none"
                  placeholder="Describe your brand value, fabric quality, and comfort..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons (CTAs) */}
          <Card>
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-[#ff3f6c]" />
                Call-To-Action (CTA) Buttons
              </CardTitle>
              <CardDescription className="text-xs">
                Links where customers go when clicking banner buttons.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-3.5 rounded-lg border bg-muted/20 space-y-3">
                <span className="text-[11px] font-bold uppercase text-[#04aeef]">
                  Primary Button (Solid Color)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-muted-foreground font-semibold">
                      Button Label
                    </Label>
                    <Input
                      value={config.primaryBtnText}
                      onChange={(e) => handleChange("primaryBtnText", e.target.value)}
                      placeholder="Shop Men's Polos →"
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground font-semibold">
                      Target Link / URL
                    </Label>
                    <Input
                      value={config.primaryBtnLink}
                      onChange={(e) => handleChange("primaryBtnLink", e.target.value)}
                      placeholder="/shop?category=mens-polo"
                      className="mt-1 h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border bg-muted/20 space-y-3">
                <span className="text-[11px] font-bold uppercase text-muted-foreground">
                  Secondary Button (Outline)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-muted-foreground font-semibold">
                      Button Label
                    </Label>
                    <Input
                      value={config.secondaryBtnText}
                      onChange={(e) => handleChange("secondaryBtnText", e.target.value)}
                      placeholder="Women's Ethnic Wear"
                      className="mt-1 h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-muted-foreground font-semibold">
                      Target Link / URL
                    </Label>
                    <Input
                      value={config.secondaryBtnLink}
                      onChange={(e) => handleChange("secondaryBtnLink", e.target.value)}
                      placeholder="/shop?category=womens-kurtis"
                      className="mt-1 h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Showcase Card & Trust Badges (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Showcase Product Card */}
          <Card>
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#04aeef]" />
                Right Showcase Card
              </CardTitle>
              <CardDescription className="text-xs">
                Featured image card on the right side of the hero section.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="relative w-20 h-24 rounded-lg bg-muted overflow-hidden shrink-0 border">
                  {config.cardImage ? (
                    <Image
                      src={config.cardImage}
                      alt={config.cardTitle}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <Label className="text-[11px] font-bold uppercase text-muted-foreground">
                      Image URL
                    </Label>
                    <Input
                      value={config.cardImage}
                      onChange={(e) => handleChange("cardImage", e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="mt-1 h-8 text-xs font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[11px] font-bold uppercase text-muted-foreground">
                  Collection Tag
                </Label>
                <Input
                  value={config.cardTag}
                  onChange={(e) => handleChange("cardTag", e.target.value)}
                  placeholder="Featured Collection"
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div>
                <Label className="text-[11px] font-bold uppercase text-muted-foreground">
                  Card Title
                </Label>
                <Input
                  value={config.cardTitle}
                  onChange={(e) => handleChange("cardTitle", e.target.value)}
                  placeholder="Premium Heavyweight Drop Shoulder"
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] font-bold uppercase text-muted-foreground">
                    Price Subtext
                  </Label>
                  <Input
                    value={config.cardSubtext}
                    onChange={(e) => handleChange("cardSubtext", e.target.value)}
                    placeholder="Starting from only ৳ 650.00"
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-bold uppercase text-muted-foreground">
                    Target Link
                  </Label>
                  <Input
                    value={config.cardLink}
                    onChange={(e) => handleChange("cardLink", e.target.value)}
                    placeholder="/shop?category=mens-drop-shoulder"
                    className="mt-1 h-8 text-xs font-mono text-[11px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3 Trust Badges */}
          <Card>
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                Trust &amp; Confidence Badges
              </CardTitle>
              <CardDescription className="text-xs">
                3 guarantee pills shown at the bottom of the hero banner.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#04aeef]" /> Badge 1
                </Label>
                <Input
                  value={config.trustBadge1}
                  onChange={(e) => handleChange("trustBadge1", e.target.value)}
                  placeholder="Cash on Delivery"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-500" /> Badge 2
                </Label>
                <Input
                  value={config.trustBadge2}
                  onChange={(e) => handleChange("trustBadge2", e.target.value)}
                  placeholder="7 Days Return"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-500" /> Badge 3
                </Label>
                <Input
                  value={config.trustBadge3}
                  onChange={(e) => handleChange("trustBadge3", e.target.value)}
                  placeholder="100% Combed Cotton"
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Storefront Hero Preview */}
      {showPreview && (
        <Card className="border-2 border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="py-3 px-6 bg-muted/40 border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#04aeef]" />
              <CardTitle className="text-xs font-black uppercase tracking-wider">
                Live Storefront Hero Preview
              </CardTitle>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Exact replica of how the hero banner renders on the homepage
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <section className="relative overflow-hidden bg-[#222f3f] text-white p-6 sm:p-10 lg:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-4">
                  {config.badgeText && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#04aeef]/20 border border-[#04aeef]/40 text-[#04aeef] text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{config.badgeText}</span>
                    </div>
                  )}

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                    {config.titleMain}{" "}
                    <span className="text-[#04aeef]">{config.titleHighlight}</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-xl">
                    {config.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {config.primaryBtnText && (
                      <span className="theme-btn-cta font-bold px-6 py-2.5 text-xs rounded-md shadow-md inline-block cursor-pointer">
                        {config.primaryBtnText}
                      </span>
                    )}
                    {config.secondaryBtnText && (
                      <span className="border border-white/40 text-white px-5 py-2.5 text-xs font-bold rounded-md backdrop-blur-sm inline-block cursor-pointer">
                        {config.secondaryBtnText}
                      </span>
                    )}
                  </div>

                  {/* Fast Trust Bar */}
                  <div className="grid grid-cols-3 gap-2 pt-5 border-t border-white/15 text-[11px] text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-[#04aeef] shrink-0" />
                      <span className="truncate">{config.trustBadge1}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{config.trustBadge2}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{config.trustBadge3}</span>
                    </div>
                  </div>
                </div>

                {/* Right Hero Image Card */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-[4/5] max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl">
                    {config.cardImage ? (
                      <Image
                        src={config.cardImage}
                        alt={config.cardTitle}
                        fill
                        unoptimized
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
                        No image set
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#04aeef]">
                        {config.cardTag}
                      </span>
                      <p className="text-sm font-extrabold text-white mt-0.5">
                        {config.cardTitle}
                      </p>
                      <p className="text-[11px] text-gray-300">
                        {config.cardSubtext}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
