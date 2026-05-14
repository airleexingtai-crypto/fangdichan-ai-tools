import { createNavigation } from "next-intl/navigation";

export const { Link, usePathname, useRouter, getPathname } = createNavigation({
  locales: ["en", "zh"] as const,
  localePrefix: "as-needed",
  defaultLocale: "en",
});
