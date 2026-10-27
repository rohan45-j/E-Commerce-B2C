"use client";

import * as React from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, FileText, ExternalLink } from "lucide-react";
import { createPageAction, updatePageAction, deletePageAction } from "./actions";
import { slugify } from "@/lib/utils";

interface PageRecord {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = React.useState<PageRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<PageRecord | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formTitle, setFormTitle] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formContent, setFormContent] = React.useState("");
  const [formSeoTitle, setFormSeoTitle] = React.useState("");
  const [formSeoDesc, setFormSeoDesc] = React.useState("");

  const fetchPages = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pages");
      if (res.ok) {
        const json = await res.json();
        setPages(json.data || []);
      }
    } catch {
      // Handled silently
    }
  }, []);

  React.useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const openCreateModal = () => {
    setEditingPage(null);
    setFormTitle("");
    setFormSlug("");
    setFormContent("<p>Write page content here...</p>");
    setFormSeoTitle("");
    setFormSeoDesc("");
    setIsDialogOpen(true);
  };

  const openEditModal = (p: PageRecord) => {
    setEditingPage(p);
    setFormTitle(p.title);
    setFormSlug(p.slug);
    setFormContent(p.content);
    setFormSeoTitle(p.seoTitle || "");
    setFormSeoDesc(p.seoDescription || "");
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Page title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formTitle.trim(),
        slug: formSlug.trim() || slugify(formTitle),
        content: formContent.trim(),
        seoTitle: formSeoTitle.trim() || undefined,
        seoDescription: formSeoDesc.trim() || undefined,
        isPublished: true,
      };

      if (editingPage) {
        const res = await updatePageAction(editingPage.id, payload);
        if (res.success) {
          toast.success("Page updated successfully");
          setIsDialogOpen(false);
          fetchPages();
        } else {
          toast.error(res.error || "Failed to update page");
        }
      } else {
        const res = await createPageAction(payload);
        if (res.success) {
          toast.success("Page created successfully");
          setIsDialogOpen(false);
          fetchPages();
        } else {
          toast.error(res.error || "Failed to create page");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      const res = await deletePageAction(deleteId);
      if (res.success) {
        toast.success("Page deleted");
        setDeleteId(null);
        fetchPages();
      } else {
        toast.error(res.error || "Failed to delete page");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<PageRecord>[] = [
    {
      header: "Page Title",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-xs text-foreground">{row.title}</p>
            <p className="text-[10px] text-muted-foreground font-mono">/pages/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Public URL",
      cell: (row) => (
        <Link
          href={`/pages/${row.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
        >
          View Live <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      header: "Status",
      cell: (row) =>
        row.isPublished ? (
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-500/10 text-[10px]">
            Published
          </Badge>
        ) : (
          <Badge variant="outline" className="border-zinc-500 text-zinc-500 bg-zinc-500/10 text-[10px]">
            Draft
          </Badge>
        ),
    },
    {
      header: "Actions",
      className: "text-right w-24",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => openEditModal(row)}
            title="Edit"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-rose-600 hover:text-rose-700"
            onClick={() => setDeleteId(row.id)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CMS Content Pages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage static informational pages like About, Privacy Policy, Terms, and FAQ.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
        >
          <Plus className="h-4 w-4" /> Add New Page
        </Button>
      </div>

      <DataTable
        data={pages}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Filter pages..."
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit Page" : "Create New Page"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pTitle">Title</Label>
                <Input
                  id="pTitle"
                  placeholder="e.g. Return Policy"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    if (!editingPage) setFormSlug(slugify(e.target.value));
                  }}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pSlug">URL Slug</Label>
                <Input
                  id="pSlug"
                  placeholder="return-policy"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Page Content</Label>
              <RichTextEditor
                value={formContent}
                onChange={setFormContent}
                rows={10}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1.5">
                <Label htmlFor="pSeoTitle">SEO Title (Optional)</Label>
                <Input
                  id="pSeoTitle"
                  placeholder="Meta title..."
                  value={formSeoTitle}
                  onChange={(e) => setFormSeoTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pSeoDesc">SEO Description (Optional)</Label>
                <Input
                  id="pSeoDesc"
                  placeholder="Meta description..."
                  value={formSeoDesc}
                  onChange={(e) => setFormSeoDesc(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Page"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete CMS Page"
        description="Are you sure you want to delete this page permanently?"
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}
