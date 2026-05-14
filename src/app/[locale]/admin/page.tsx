"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Eye, RefreshCw, AlertCircle, Plus, Pencil, Trash2, BarChart3, FileText, Wrench, BookOpen, TrendingUp } from "lucide-react";

type ContentItem = {
  id: string;
  name?: string;
  title?: string;
  tagline?: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  content_type: "Tool" | "Comparison" | "Tutorial" | "StatPage";
};

type Stats = {
  totalTools: number;
  publishedTools: number;
  pendingReview: number;
  needsUpdate: number;
  totalComparisons: number;
  totalTutorials: number;
  totalStats: number;
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-500/10 text-gray-500",
  AI_GENERATED: "bg-yellow-500/10 text-yellow-500",
  HUMAN_VERIFIED: "bg-blue-500/10 text-blue-500",
  PUBLISHED: "bg-green-500/10 text-green-500",
  NEEDS_UPDATE: "bg-orange-500/10 text-orange-500",
  ARCHIVED: "bg-red-500/10 text-red-500",
};

export default function AdminDashboard() {
  const locale = useLocale();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTools: 0, publishedTools: 0, pendingReview: 0, needsUpdate: 0, totalComparisons: 0, totalTutorials: 0, totalStats: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingTool, setEditingTool] = useState<any>(null);

  useEffect(() => {
    if (isSupabaseConfigured) { loadItems(); loadStats(); }
  }, []);

  async function loadStats() {
    const [tools, comparisons, tutorials, stats] = await Promise.all([
      supabase.from("Tool").select("id, status", { count: "exact" }),
      supabase.from("Comparison").select("id, status", { count: "exact" }),
      supabase.from("Tutorial").select("id, status", { count: "exact" }),
      supabase.from("StatPage").select("id, status", { count: "exact" }),
    ]);

    setStats({
      totalTools: tools.count || 0,
      publishedTools: (tools.data || []).filter((t: any) => t.status === "PUBLISHED").length,
      pendingReview: [
        ...(tools.data || []), ...(comparisons.data || []),
        ...(tutorials.data || []), ...(stats.data || []),
      ].filter((i: any) => i.status === "AI_GENERATED").length,
      needsUpdate: [
        ...(tools.data || []), ...(comparisons.data || []),
        ...(tutorials.data || []), ...(stats.data || []),
      ].filter((i: any) => i.status === "NEEDS_UPDATE").length,
      totalComparisons: comparisons.count || 0,
      totalTutorials: tutorials.count || 0,
      totalStats: stats.count || 0,
    });
  }

  async function loadItems() {
    setLoading(true);
    const types = ["Tool", "Comparison", "Tutorial", "StatPage"] as const;
    const all: ContentItem[] = [];

    for (const type of types) {
      const { data } = await supabase
        .from(type)
        .select("id, slug, name, title, tagline, status, created_at, updated_at, published_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (data) {
        all.push(...data.map((d: any) => ({ ...d, content_type: type, name: d.name || d.title })));
      }
    }
    setAllItems(all);
    setItems(all.filter((i) => i.status === "AI_GENERATED" || i.status === "NEEDS_UPDATE"));
    setLoading(false);
  }

  async function updateStatus(item: ContentItem, newStatus: string) {
    const table = item.content_type;
    const updates: Record<string, any> = { status: newStatus };

    if (newStatus === "PUBLISHED") updates.published_at = new Date().toISOString();
    if (newStatus === "HUMAN_VERIFIED") updates.verified_at = new Date().toISOString();

    await supabase.from(table).update(updates).eq("id", item.id);

    if (newStatus === "HUMAN_VERIFIED" || newStatus === "PUBLISHED") {
      await supabase.from("ContentVerification").insert({
        content_type: table,
        content_id: item.id,
        verified_by: "admin",
        notes: newStatus === "PUBLISHED" ? "Published via admin dashboard" : "Verified via admin dashboard",
      });
    }

    setSelected(null);
    loadItems();
    loadStats();
  }

  async function deleteItem(item: ContentItem) {
    if (!confirm(`Delete "${item.name || item.slug}"? This cannot be undone.`)) return;
    await supabase.from(item.content_type).delete().eq("id", item.id);
    loadItems();
    loadStats();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">Supabase is not configured yet.</p>
              <p className="text-sm text-muted-foreground">
                Add <code className="bg-card px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="bg-card px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to .env.local
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Content management, verification, and publishing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { loadItems(); loadStats(); }} disabled={loading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href={`/${locale}`} className="no-style">
            <Button variant="ghost" size="sm">View Site →</Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-1" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="review">
            <Eye className="h-4 w-4 mr-1" /> Review ({items.length})
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Wrench className="h-4 w-4 mr-1" /> Tools ({allItems.filter((i) => i.content_type === "Tool").length})
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-1" /> All Content
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Tools</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{stats.totalTools}</div><p className="text-xs text-muted-foreground">{stats.publishedTools} published</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{stats.pendingReview}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Needs Update</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0"><div className="text-2xl font-bold">{stats.needsUpdate}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Other Content</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm space-y-0.5">
                  <div className="flex justify-between"><span>Comparisons</span><span className="font-medium">{stats.totalComparisons}</span></div>
                  <div className="flex justify-between"><span>Tutorials</span><span className="font-medium">{stats.totalTutorials}</span></div>
                  <div className="flex justify-between"><span>Stats Pages</span><span className="font-medium">{stats.totalStats}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Content</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allItems.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell><Badge variant="outline" className="text-xs">{item.content_type}</Badge></TableCell>
                      <TableCell className="font-medium text-sm">{item.name || item.slug}</TableCell>
                      <TableCell><Badge className={`text-xs ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review Queue */}
        <TabsContent value="review">
          {items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm">No content items need review.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Badge variant="outline" className="text-xs">{item.content_type}</Badge></TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">{item.name || item.slug}</span>
                      {item.tagline && <p className="text-xs text-muted-foreground truncate max-w-xs">{item.tagline}</p>}
                    </TableCell>
                    <TableCell><Badge className={`text-xs ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
                        <Eye className="h-4 w-4 mr-1" /> Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* Tools Management */}
        <TabsContent value="tools">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {allItems.filter((i) => i.content_type === "Tool").length} tools total
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.filter((i) => i.content_type === "Tool").map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell>
                    <span className="font-medium text-sm">{tool.name || tool.slug}</span>
                    {tool.tagline && <p className="text-xs text-muted-foreground truncate max-w-xs">{tool.tagline}</p>}
                  </TableCell>
                  <TableCell className="text-sm font-mono">{tool.slug}</TableCell>
                  <TableCell><Badge className={`text-xs ${STATUS_COLORS[tool.status] || ""}`}>{tool.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tool.published_at ? new Date(tool.published_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(tool)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Link href={`/${locale}/tools/${tool.slug}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteItem(tool)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* All Content */}
        <TabsContent value="content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Badge variant="outline" className="text-xs">{item.content_type}</Badge></TableCell>
                  <TableCell className="text-sm font-mono">{item.slug}</TableCell>
                  <TableCell className="font-medium text-sm">{item.name || "—"}</TableCell>
                  <TableCell><Badge className={`text-xs ${STATUS_COLORS[item.status] || ""}`}>{item.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>Review</Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteItem(item)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review: {selected?.name || selected?.slug}</DialogTitle>
            <DialogDescription>
              Quick verification — estimated 3-5 minutes
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Verification Checklist */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Verification Checklist</h4>
                {[
                  "Name and tagline are correct",
                  "Pricing tiers match the website (spot check 1-2 tiers)",
                  "At least 1 feature is actually on the product's site",
                  "No obviously wrong or fabricated information",
                  "Affiliate link works and goes to the correct page",
                  "No marketing fluff or exaggerated claims",
                  "SEO title and description look good",
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-3 text-sm cursor-pointer hover:bg-card/50 p-2 rounded">
                    <input type="checkbox" className="mt-0.5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Meta */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Slug: <code className="text-xs bg-card px-1 py-0.5 rounded">{selected.slug}</code></p>
                  <p>Type: <Badge variant="outline" className="text-xs ml-1">{selected.content_type}</Badge></p>
                  <p>Status: <Badge className={`text-xs ${STATUS_COLORS[selected.status] || ""}`}>{selected.status}</Badge></p>
                  <p>Created: {new Date(selected.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="destructive" size="sm" onClick={() => updateStatus(selected, "DRAFT")}>
                  <XCircle className="mr-1 h-4 w-4" /> Reject
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateStatus(selected, "NEEDS_UPDATE")}>
                    <AlertCircle className="mr-1 h-4 w-4" /> Needs Update
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateStatus(selected, "HUMAN_VERIFIED")}>
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Verify
                  </Button>
                  <Button size="sm" onClick={() => updateStatus(selected, "PUBLISHED")}>
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
