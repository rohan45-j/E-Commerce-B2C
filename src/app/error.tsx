"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring service
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center container py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We encountered an unexpected error while rendering this page. Our technical team has been notified.
          </p>
          {error.digest && (
            <p className="text-[10px] text-muted-foreground font-mono">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Try Again
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto font-bold text-xs h-10 px-6">
              <Home className="h-4 w-4 mr-1.5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
