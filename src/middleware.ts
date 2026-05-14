import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "zh"],
  localePrefix: "as-needed",
  defaultLocale: "en",
  localeDetection: false,
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
