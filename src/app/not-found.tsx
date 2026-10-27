import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center container py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="h-10 w-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-emerald-600">404</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The page, collection, or product you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6">
              <Home className="h-4 w-4 mr-1.5" />
              Return Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="w-full sm:w-auto font-bold text-xs h-10 px-6">
              <Search className="h-4 w-4 mr-1.5" />
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
