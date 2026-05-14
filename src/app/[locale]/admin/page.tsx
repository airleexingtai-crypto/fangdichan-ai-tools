"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Eye, RefreshCw, AlertCircle } from "lucide-react";

type ContentItem = {
  id: string;
  name?: string;
  title?: string;
  tagline?: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
  content_type: "Tool" | "Comparison" | "Tutorial" | "StatPage" | "Blog";
};

export default function AdminDashboard() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  if (!isSupabaseConfigured) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground">Supabase is not configured yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local</p>
      </div>
    );
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    const types = ["Tool", "Comparison", "Tutorial", "StatPage"] as const;
    const allItems: ContentItem[] = [];

    for (const type of types) {
      const table = type === "StatPage" ? "StatPage" : type;
      const { data } = await supabase
        .from(table)
        .select("id, slug, name, title, tagline, status, created_at, updated_at")
        .in("status", ["AI_GENERATED", "NEEDS_UPDATE"])
        .order("created_at", { ascending: false });

      if (data) {
        allItems.push(
          ...data.map((d: any) => ({
            ...d,
            content_type: type,
            name: d.name || d.title,
          }))
        );
      }
    }
    setItems(allItems);
    setLoading(false);
  }

  async function verifyItem(item: ContentItem) {
    const table = item.content_type === "StatPage" ? "StatPage" : item.content_type;
    await supabase
      .from(table)
      .update({
        status: "HUMAN_VERIFIED",
        verified_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    // Also create verification record
    await supabase.from("ContentVerification").insert({
      content_type: table,
      content_id: item.id,
      verified_by: "admin",
      notes: "Quick verification passed",
    });

    loadItems();
    setSelected(null);
  }

  async function rejectItem(item: ContentItem) {
    const table = item.content_type === "StatPage" ? "StatPage" : item.content_type;
    await supabase
      .from(table)
      .update({ status: "DRAFT" })
      .eq("id", item.id);

    loadItems();
    setSelected(null);
  }

  async function publishItem(item: ContentItem) {
    const table = item.content_type === "StatPage" ? "StatPage" : item.content_type;
    await supabase
      .from(table)
      .update({
        status: "PUBLISHED",
        published_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    loadItems();
    setSelected(null);
  }

  const pendingItems = items.filter((i) => i.status === "AI_GENERATED");
  const needsUpdateItems = items.filter((i) => i.status === "NEEDS_UPDATE");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Verification</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review AI-generated content before publishing
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadItems} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{pendingItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Update</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{needsUpdateItems.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingItems.length})
          </TabsTrigger>
          <TabsTrigger value="update">
            Needs Update ({needsUpdateItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p>No items pending review</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name / Title</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.content_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm">{item.name || item.slug}</span>
                      {item.tagline && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">{item.tagline}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>
                          <Eye className="h-4 w-4 mr-1" /> Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="update" className="mt-4">
          {needsUpdateItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p>No items need updating</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name / Title</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {needsUpdateItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{item.content_type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{item.name || item.slug}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString()}
                    </TableCell>
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
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review: {selected?.name || selected?.slug}</DialogTitle>
            <DialogDescription>
              Quick verification checklist — estimated 3-5 minutes
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              {/* Verification Checklist */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Verification Checklist</h4>
                {checklistItems.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 text-sm cursor-pointer hover:bg-card/50 p-2 rounded">
                    <input type="checkbox" className="mt-0.5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Content Preview */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">Content</h4>
                <p className="text-sm text-muted-foreground">
                  Slug: <code className="text-xs bg-card px-1 py-0.5 rounded">{selected.slug}</code><br />
                  Type: <Badge variant="outline" className="text-xs">{selected.content_type}</Badge><br />
                  Status: <Badge className="text-xs bg-yellow-500/10 text-yellow-500">{selected.status}</Badge><br />
                  Created: {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="destructive" size="sm" onClick={() => rejectItem(selected)}>
                  <XCircle className="mr-1 h-4 w-4" /> Reject
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => verifyItem(selected)}>
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Verify
                  </Button>
                  <Button size="sm" onClick={() => publishItem(selected)}>
                    Verify & Publish
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

const checklistItems = [
  "Name and tagline are correct",
  "Pricing tiers match the website (spot check 1-2 tiers)",
  "At least 1 feature is actually on the product's site",
  "No obviously wrong or fabricated information",
  "Affiliate link works and goes to the correct page",
  "No marketing fluff or exaggerated claims",
  "SEO title and description look good",
];
