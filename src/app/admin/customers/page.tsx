import { requireStaffOrAdmin } from "@/server/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Users, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

interface CustomerRecord {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  createdAt: Date;
  _count: {
    orders: number;
    reviews: number;
  };
}

export default async function AdminCustomersPage() {
  await requireStaffOrAdmin();

  let customers: CustomerRecord[] = [];
  try {
    customers = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true, reviews: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch {
    // DB offline during build
    customers = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-600" />
          Registered Customers ({customers.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          View customer accounts, contact information, lifetime order counts, and engagement
        </p>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm">No customers registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Orders Placed</th>
                  <th className="p-4 text-center">Reviews</th>
                  <th className="p-4 text-right">Joined On</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                          {c.name ? c.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <span>{c.name || "Customer"}</span>
                          <span className="block text-[10px] text-muted-foreground font-normal">ID: {c.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-emerald-600" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-emerald-600" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-600"
                          : c.role === "STAFF"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {c.role}
                      </span>
                    </td>

                    <td className="p-4 text-center font-bold text-foreground">
                      {c._count.orders}
                    </td>

                    <td className="p-4 text-center text-muted-foreground">
                      {c._count.reviews}
                    </td>

                    <td className="p-4 text-right text-muted-foreground whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
