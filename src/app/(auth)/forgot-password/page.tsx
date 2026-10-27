"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/validators/auth";
import { forgotPasswordAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [devToken, setDevToken] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await forgotPasswordAction(values);
      if (res.success) {
        setIsSubmitted(true);
        if (res.resetToken) {
          setDevToken(res.resetToken);
        }
        toast.success("Instructions dispatched! Check your email.");
      } else {
        toast.error(res.error || "Request failed");
      }
    } catch {
      toast.error("Failed to request password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
      <div className="w-full max-w-md space-y-6 bg-card border rounded-2xl p-8 shadow-sm">
        <Link
          href="/login"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Login
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto dark:bg-emerald-950 dark:text-emerald-400">
              <MailCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <p className="text-sm text-muted-foreground">
              If an account with that email exists, we have sent instructions to reset your password.
            </p>
            {devToken && (
              <div className="p-3 bg-muted rounded text-xs text-left break-all">
                <span className="font-semibold text-emerald-600">[Dev Link]: </span>
                <Link
                  href={`/reset-password?token=${devToken}`}
                  className="underline text-emerald-600"
                >
                  Click here to simulate reset link
                </Link>
              </div>
            )}
            <Link href="/login">
              <Button className="w-full mt-4" variant="outline">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
              <p className="text-sm text-muted-foreground">
                Enter your registered email and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
