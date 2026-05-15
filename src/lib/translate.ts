import { supabase } from "@/lib/supabase";

/** Fetch content translation from ContentTranslation table. Returns null if locale is en (default). */
export async function getTranslation(
  contentType: string,
  contentId: string,
  locale: string,
) {
  if (locale === "en") return null;
  const { data } = await supabase
    .from("ContentTranslation")
    .select("*")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("locale", locale)
    .maybeSingle();
  return data;
}

/**
 * Apply translation to an entity's display fields.
 * Falls back to original DB fields when no translation exists.
 */
export function applyTranslation<T extends Record<string, any>>(
  original: T,
  translation: Record<string, any> | null,
  fields: string[],
): T {
  if (!translation) return original;
  const result = { ...original };
  for (const field of fields) {
    if (translation[field] != null) {
      result[field as keyof T] = translation[field];
    }
  }
  // Merge extra_json fields if present
  if (translation.extra_json && typeof translation.extra_json === "object") {
    Object.assign(result, translation.extra_json);
  }
  return result;
}
