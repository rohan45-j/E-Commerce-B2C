import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin, Home } from "lucide-react";

export const dynamic = "force-dynamic";

interface AddressRecord {
  id: string;
  name?: string | null;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  addressLine: string;
  isDefaultShipping: boolean;
}

export default async function CustomerAddressesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let addresses: AddressRecord[] = [];
  if (userId) {
    try {
      addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefaultShipping: "desc" },
      });
    } catch {
      // DB offline
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-emerald-600" />
            Saved Delivery Addresses
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your home and office delivery addresses for 1-click checkout
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="p-5 rounded-2xl border bg-card shadow-sm space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5 text-foreground">
                <Home className="h-3.5 w-3.5 text-emerald-600" />
                {addr.name || "Delivery Address"}
              </span>
              {addr.isDefaultShipping && (
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {addr.addressLine}<br />
              {addr.upazila}, {addr.district}, {addr.division}
            </p>

            <p className="text-xs text-muted-foreground pt-1">
              Contact: {addr.phone}
            </p>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border bg-card space-y-3">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-bold text-sm">No Saved Addresses</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              When you place orders, your delivery addresses will automatically be saved here for rapid re-ordering.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
