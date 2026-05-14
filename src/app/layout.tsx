import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "AI Tools for Real Estate — Find, Compare & Choose the Best AI Tools",
    template: "%s | AI Tools for Real Estate",
  },
  description:
    "Discover and compare the best AI tools for real estate professionals. Pricing, features, reviews, side-by-side comparisons, tutorials, and industry statistics — all in one place.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate"),
  authors: [{ name: "AI Tools for Real Estate" }],
  creator: "AI Tools for Real Estate",
  publisher: "AI Tools for Real Estate",
  keywords: ["AI tools", "real estate", "property technology", "proptech", "AI software", "real estate AI", "property valuation", "AI CRM", "real estate marketing"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Tools for Real Estate",
    title: "AI Tools for Real Estate — Find, Compare & Choose the Best AI Tools",
    description: "Discover and compare the best AI tools for real estate professionals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools for Real Estate",
    description: "Discover and compare the best AI tools for real estate professionals.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // Placeholders — add real values when available
    // google: "your-google-site-verification",
  },
  category: "Technology",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
