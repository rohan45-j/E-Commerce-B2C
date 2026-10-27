"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Store, CreditCard, Search, PhoneCall, Palette } from "lucide-react";
import { SingleImageUploader } from "@/components/admin/single-image-uploader";
import { ThemeCustomizer } from "@/components/admin/theme-customizer";
import { updateSiteSettingsAction } from "./actions";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchSettings = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        setSettings(json.data || {});
      }
    } catch {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateSiteSettingsAction(settings);
      if (res.success) {
        toast.success("Site settings updated successfully across the storefront!");
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    } catch {
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Everything shown on the store is completely dynamic and configured here.
          </p>
        </div>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-xl mb-6">
          <TabsTrigger value="general" className="text-xs gap-1.5">
            <Store className="h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="theme" className="text-xs gap-1.5 text-[#04aeef] font-bold">
            <Palette className="h-3.5 w-3.5" /> Theme &amp; Colors
          </TabsTrigger>
          <TabsTrigger value="contact" className="text-xs gap-1.5">
            <PhoneCall className="h-3.5 w-3.5" /> Contact
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs gap-1.5">
            <CreditCard className="h-3.5 w-3.5" /> Payments
          </TabsTrigger>
          <TabsTrigger value="seo" className="text-xs gap-1.5">
            <Search className="h-3.5 w-3.5" /> SEO &amp; Meta
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: General Info */}
        <TabsContent value="general">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Store Identity &amp; Branding Assets</CardTitle>
              <CardDescription className="text-xs">
                Upload your store logo and browser favicon directly from your computer or specify an image URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-2xl">
              <div className="space-y-1.5">
                <Label htmlFor="site_name">Store Name</Label>
                <Input
                  id="site_name"
                  value={settings["site_name"] || "Fabrilife Lifestyle"}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  placeholder="e.g. Fabrilife Lifestyle"
                />
              </div>

              {/* 1. Store Logo Uploader */}
              <SingleImageUploader
                id="site_logo"
                label="Store Logo"
                description="Upload your main store logo. Displays in the header, footer, mobile drawer, and checkout invoices."
                value={settings["site_logo"] || ""}
                onChange={(url) => handleChange("site_logo", url)}
                assetType="logo"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                helperText="Recommended: Transparent PNG or SVG (Height: 40-60px)"
              />

              {/* 2. Store Favicon Uploader */}
              <SingleImageUploader
                id="site_favicon"
                label="Browser Favicon"
                description="Upload the small website icon displayed in web browser tabs, search results, and bookmark bars."
                value={settings["site_favicon"] || ""}
                onChange={(url) => handleChange("site_favicon", url)}
                assetType="favicon"
                accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml"
                helperText="Recommended: 32x32 or 64x64 .ico or .png"
              />

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="currency_code">Currency Code</Label>
                  <Input
                    id="currency_code"
                    value={settings["currency_code"] || "BDT"}
                    onChange={(e) => handleChange("currency_code", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="currency_symbol">Currency Symbol</Label>
                  <Input
                    id="currency_symbol"
                    value={settings["currency_symbol"] || "৳"}
                    onChange={(e) => handleChange("currency_symbol", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Contact & Location */}
        <TabsContent value="contact">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Customer Support & Address</CardTitle>
              <CardDescription className="text-xs">
                Contact information displayed in header, footer, invoices, and order emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <Label htmlFor="support_phone">Helpline / Hotline Phone</Label>
                <Input
                  id="support_phone"
                  value={settings["support_phone"] || "+880 9612-000000"}
                  onChange={(e) => handleChange("support_phone", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="support_email">Official Support Email</Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settings["support_email"] || "support@kinakati.com"}
                  onChange={(e) => handleChange("support_email", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="office_address">Physical Office / Flagship Address</Label>
                <Textarea
                  id="office_address"
                  rows={3}
                  value={
                    settings["office_address"] ||
                    "Level 14, Crystal Palace, SE(D) 22 Gulshan Avenue, Dhaka-1212"
                  }
                  onChange={(e) => handleChange("office_address", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Payments */}
        <TabsContent value="payments">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Payment Gateway Toggles</CardTitle>
              <CardDescription className="text-xs">
                Enable or disable payment methods accepted at checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div>
                  <p className="font-semibold text-xs">Cash on Delivery (COD)</p>
                  <p className="text-[11px] text-muted-foreground">
                    Allow customers to pay rider in cash upon package inspection
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings["enable_cod"] !== "false"}
                    onChange={(e) =>
                      handleChange("enable_cod", e.target.checked ? "true" : "false")
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div>
                  <p className="font-semibold text-xs">Stripe Card Checkout</p>
                  <p className="text-[11px] text-muted-foreground">
                    Accept Visa, MasterCard, and international card payments
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings["enable_stripe"] !== "false"}
                    onChange={(e) =>
                      handleChange("enable_stripe", e.target.checked ? "true" : "false")
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div>
                  <p className="font-semibold text-xs">bKash / SSLCommerz</p>
                  <p className="text-[11px] text-muted-foreground">
                    Enable Bangladeshi mobile financial services and online bank transfers
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings["enable_bkash"] !== "false"}
                    onChange={(e) =>
                      handleChange("enable_bkash", e.target.checked ? "true" : "false")
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: SEO */}
        <TabsContent value="seo">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Global SEO Defaults</CardTitle>
              <CardDescription className="text-xs">
                Fallback OpenGraph titles, meta descriptions, and analytics IDs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-1.5">
                <Label htmlFor="seo_meta_title">Default Meta Title</Label>
                <Input
                  id="seo_meta_title"
                  value={
                    settings["seo_meta_title"] ||
                    "KinaKati | কেনাকাটা হোক আরও সহজ | Online Shopping in Bangladesh"
                  }
                  onChange={(e) => handleChange("seo_meta_title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="seo_meta_description">Default Meta Description</Label>
                <Textarea
                  id="seo_meta_description"
                  rows={3}
                  value={
                    settings["seo_meta_description"] ||
                    "Official online store for authentic Bangladeshi designer fashion and gadgets."
                  }
                  onChange={(e) => handleChange("seo_meta_description", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ga_id">Google Analytics Measurement ID (Optional)</Label>
                <Input
                  id="ga_id"
                  placeholder="G-XXXXXXXXXX"
                  value={settings["ga_id"] || ""}
                  onChange={(e) => handleChange("ga_id", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Dynamic Theme & Color CMS */}
        <TabsContent value="theme" className="space-y-6">
          <ThemeCustomizer initialSettings={settings} onSaved={fetchSettings} />
        </TabsContent>
      </Tabs>
    </form>
  );
}
