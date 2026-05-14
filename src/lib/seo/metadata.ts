import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aitools.realestate";
const SITE_NAME = "AI Tools for Real Estate";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
};

export function generatePageMeta({
  title,
  description,
  path,
  ogImage,
  type = "website",
  publishedAt,
  updatedAt,
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      ...(ogImage && { images: [{ url: ogImage }] }),
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    other: {
      "article:published_time": publishedAt || "",
      "article:modified_time": updatedAt || "",
    },
  };
}
