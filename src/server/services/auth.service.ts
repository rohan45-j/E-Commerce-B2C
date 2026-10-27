import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "@/validators/auth";
import crypto from "crypto";

export class AuthService {
  static async registerUser(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: input.email.toLowerCase().trim(),
        phone: input.phone?.trim() || null,
        passwordHash,
        role: "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  static async requestPasswordReset(input: ForgotPasswordInput) {
    const email = input.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return { success: true, message: "If an account exists, a reset link has been dispatched." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // In a live environment, Resend email would be sent here
    console.log(`[AUTH] Password reset token for ${email}: ${token}`);

    return {
      success: true,
      message: "If an account exists, a reset link has been dispatched.",
      resetToken: process.env.NODE_ENV === "development" ? token : undefined,
    };
  }

  static async resetPassword(input: ResetPasswordInput) {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: input.token },
    });

    if (!resetRecord || resetRecord.expires < new Date()) {
      throw new Error("Invalid or expired password reset link.");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { passwordHash },
    });

    // Delete token once used
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return { success: true, message: "Your password has been reset successfully. Please log in." };
  }
}
