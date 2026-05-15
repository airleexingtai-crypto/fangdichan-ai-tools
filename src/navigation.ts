import { createNavigation } from "next-intl/navigation";

export const { Link, usePathname, useRouter, getPathname } = createNavigation({
  locales: ["en", "zh", "ko", "ja", "de", "it", "fr"] as const,
  localePrefix: "as-needed",
  defaultLocale: "en",
});
