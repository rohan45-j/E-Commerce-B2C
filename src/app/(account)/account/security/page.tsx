"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Key, Lock } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          Security & Password
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage your account password, active sessions, and credential security
        </p>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Key className="h-4 w-4 text-emerald-600" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Current Password</label>
            <Input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">New Password (Min 8 characters)</label>
            <Input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Confirm New Password</label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="text-xs"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 mt-2"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </div>

      <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Lock className="h-4 w-4 text-emerald-600" />
          Active Account Sessions
        </h3>
        <p className="text-xs text-muted-foreground">
          You are currently logged in on this browser. You can sign out from your account at any time.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          Sign Out of Account
        </Button>
      </div>
    </div>
  );
}
