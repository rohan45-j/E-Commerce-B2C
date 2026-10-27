import { MarketingService } from "@/server/services/marketing.service";
import { ThemeCustomizer } from "@/components/admin/theme-customizer";

export const dynamic = "force-dynamic";

export default async function AdminThemePage() {
  let settings: Record<string, string> = {};
  try {
    settings = await MarketingService.getSiteSettings();
  } catch {
    settings = {};
  }

  return (
    <div className="space-y-6">
      <ThemeCustomizer initialSettings={settings} />
    </div>
  );
}
