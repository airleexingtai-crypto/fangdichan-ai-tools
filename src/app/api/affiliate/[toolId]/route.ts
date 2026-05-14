import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// /out/[toolId]?ref=page-slug → 302 redirect to actual affiliate URL
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ toolId: string }> }
) {
  const { toolId } = await params;
  const ref = request.nextUrl.searchParams.get("ref") || "unknown";

  try {
    // Get the tool's affiliate URL
    const { data: tool, error } = await supabase
      .from("Tool")
      .select("affiliate_url, slug")
      .eq("id", toolId)
      .single();

    if (error || !tool?.affiliate_url) {
      // No affiliate link — redirect to tool page
      return NextResponse.redirect(
        new URL(`/en/tools/${tool?.slug || toolId}`, request.url)
      );
    }

    // Log the click
    await supabase.from("AffiliateClick").insert({
      toolId,
      pageSlug: ref,
      ipHash: hashIP(request.headers.get("x-forwarded-for") || "unknown"),
    });

    // 302 redirect to actual affiliate URL
    return NextResponse.redirect(tool.affiliate_url);
  } catch {
    return NextResponse.redirect(new URL("/en/tools", request.url));
  }
}

function hashIP(ip: string): string {
  // Simple one-way hash for privacy
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
