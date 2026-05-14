import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate";
const SITE_NAME = "AI Tools for Real Estate";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  noIndex?: boolean;
};

export function generatePageMeta({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
  publishedAt,
  updatedAt,
  noIndex = false,
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const desc = description.slice(0, 160);

  return {
    title,
    description: desc,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
    },
    other: {
      "og:site_name": SITE_NAME,
      ...(publishedAt ? { "article:published_time": publishedAt } : {}),
      ...(updatedAt ? { "article:modified_time": updatedAt } : {}),
    },
  };
}
