"use server";

import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "@/validators/auth";
import { AuthService } from "@/server/services/auth.service";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function registerAction(formData: unknown) {
  const result = registerSchema.safeParse(formData);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Invalid form submission",
    };
  }

  try {
    const user = await AuthService.registerUser(result.data);
    return { success: true, data: user };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create account",
    };
  }
}

export async function loginWithCredentialsAction(formData: {
  email: string;
  password: string;
}) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Authentication failed. Please try again." };
      }
    }
    throw error;
  }
}

export async function forgotPasswordAction(formData: unknown) {
  const result = forgotPasswordSchema.safeParse(formData);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Invalid email",
    };
  }

  try {
    const res = await AuthService.requestPasswordReset(result.data);
    return { success: true, message: res.message, resetToken: res.resetToken };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to process request",
    };
  }
}

export async function resetPasswordAction(formData: unknown) {
  const result = resetPasswordSchema.safeParse(formData);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || "Invalid input",
    };
  }

  try {
    const res = await AuthService.resetPassword(result.data);
    return { success: true, message: res.message };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reset password",
    };
  }
}
