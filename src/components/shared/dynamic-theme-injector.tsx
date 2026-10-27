import { MarketingService } from "@/server/services/marketing.service";
import { extractThemeTokens, generateThemeCss } from "@/lib/theme-config";

export async function DynamicThemeInjector() {
  let css = "";
  try {
    const settings = await MarketingService.getSiteSettings();
    const tokens = extractThemeTokens(settings);
    css = generateThemeCss(tokens);
  } catch {
    // Fallback default theme when database is not yet connected
    const tokens = extractThemeTokens({});
    css = generateThemeCss(tokens);
  }

  return (
    <style
      id="dynamic-theme-styles"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
