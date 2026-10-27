"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Link2, Eye } from "lucide-react";
import { toast } from "sonner";

interface SingleImageUploaderProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  assetType?: "logo" | "favicon" | "image";
  accept?: string;
  helperText?: string;
}

export function SingleImageUploader({
  id,
  label,
  description,
  value,
  onChange,
  assetType = "image",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,.ico",
  helperText,
}: SingleImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isManualUrlMode, setIsManualUrlMode] = React.useState(false);
  const [manualUrlInput, setManualUrlInput] = React.useState(value);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    setManualUrlInput(value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 5MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", assetType);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onChange(data.url);
        toast.success(`${label} uploaded successfully!`);
      } else {
        toast.error(data.error || `Failed to upload ${label}`);
      }
    } catch (err) {
      toast.error(`An error occurred while uploading: ${err instanceof Error ? err.message : "Network error"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    onChange(manualUrlInput.trim());
    toast.success("Image URL applied");
  };

  const handleRemove = () => {
    onChange("");
    setManualUrlInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isFavicon = assetType === "favicon";

  return (
    <div className="space-y-3 p-4 rounded-xl border bg-card/60 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <Label htmlFor={id} className="font-semibold text-sm text-foreground">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsManualUrlMode(!isManualUrlMode)}
          className="text-xs text-[#04aeef] hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Link2 className="h-3 w-3" />
          {isManualUrlMode ? "Upload via file picker" : "Paste image URL"}
        </button>
      </div>

      {/* Upload or Manual URL Input Bar */}
      {isManualUrlMode ? (
        <div className="flex items-center gap-2">
          <Input
            id={id}
            placeholder="https://example.com/logo.png"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            className="text-xs h-9 bg-background"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleApplyManualUrl}
            className="bg-[#222f3f] hover:bg-[#04aeef] text-white text-xs h-9"
          >
            Apply
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs border-dashed border-slate-300 dark:border-slate-700 hover:border-[#04aeef] h-10 px-4"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#04aeef]" />
                Uploading {label}...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 text-[#04aeef]" />
                Choose {isFavicon ? "Favicon" : "Logo"} File
              </>
            )}
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 h-10"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Remove
            </Button>
          )}

          {helperText && (
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {helperText}
            </span>
          )}
        </div>
      )}

      {/* Live Preview Display */}
      {value ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              Live Preview
            </span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-mono truncate max-w-xs">
              {value}
            </span>
          </div>

          {isFavicon ? (
            /* Favicon Browser Tab Simulation Preview */
            <div className="rounded-lg border bg-slate-100 dark:bg-slate-900 p-2.5 max-w-md">
              <div className="text-[10px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Browser Tab Simulation:
              </div>
              <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-800 border rounded-t-lg px-3 py-1.5 shadow-sm">
                <div className="relative h-4 w-4 flex-shrink-0">
                  <Image
                    src={value}
                    alt="Favicon preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-foreground truncate max-w-[200px]">
                  Fabrilife | Fashion &amp; Comfort
                </span>
                <span className="text-muted-foreground text-xs hover:text-foreground cursor-default ml-1">
                  ×
                </span>
              </div>
            </div>
          ) : (
            /* Store Logo Preview on Dark & Light Backgrounds */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {/* Light Header Background */}
              <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Light Header Preview
                </span>
                <div className="relative h-12 w-full flex items-center justify-start">
                  <Image
                    src={value}
                    alt="Logo light preview"
                    width={180}
                    height={48}
                    unoptimized
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Dark Header / Hero Background */}
              <div className="rounded-xl border border-slate-800 bg-[#222f3f] p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Dark Header / Footer Preview
                </span>
                <div className="relative h-12 w-full flex items-center justify-start">
                  <Image
                    src={value}
                    alt="Logo dark preview"
                    width={180}
                    height={48}
                    unoptimized
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-dashed flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          No {label.toLowerCase()} uploaded yet. Default text branding will be used.
        </div>
      )}
    </div>
  );
}
