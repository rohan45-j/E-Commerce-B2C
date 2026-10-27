"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Plus, Star } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  value = [],
  onChange,
  maxImages = 8,
}: ImageUploaderProps) {
  const [urlInput, setUrlInput] = React.useState("");

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (value.length >= maxImages) {
      toast.error(`Maximum limit of ${maxImages} images reached`);
      return;
    }
    onChange([...value, urlInput.trim()]);
    setUrlInput("");
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = value[index];
    const withoutItem = value.filter((_, i) => i !== index);
    onChange([item, ...withoutItem]);
    toast.success("Primary image updated");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div
            key={index}
            className="group relative aspect-square rounded-xl border bg-muted/40 overflow-hidden shadow-sm"
          >
            <Image
              src={url}
              alt="Uploaded thumbnail"
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="icon"
                variant={index === 0 ? "default" : "secondary"}
                className="h-8 w-8 rounded-full"
                title={index === 0 ? "Primary image" : "Make primary"}
                onClick={() => handleSetPrimary(index)}
              >
                <Star
                  className={`h-4 w-4 ${
                    index === 0 ? "fill-amber-400 text-amber-400" : ""
                  }`}
                />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full"
                title="Remove image"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {index === 0 && (
              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                Primary
              </span>
            )}
          </div>
        ))}

        {value.length < maxImages && (
          <div className="flex flex-col items-center justify-center aspect-square rounded-xl border border-dashed border-muted-foreground/30 hover:border-emerald-500/60 transition-colors p-4 text-center">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-2">
              Add by Image URL
            </p>
            <div className="flex items-center gap-1 w-full">
              <Input
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                className="h-8 text-xs"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAddUrl}
                className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Upload or provide high-resolution product images (PNG, WebP, JPG). Click the star icon to set the primary thumbnail.
      </p>
    </div>
  );
}
