import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/validators/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Attempt database verification first
        try {
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (user && user.passwordHash) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                phone: user.phone,
              };
            }
          }
        } catch (dbError) {
          console.warn("[Auth] Database unavailable or authentication failed, trying bootstrap admin credentials:", dbError);
        }

        // 2. Initial / Fallback administrator verification from environment
        const configuredAdminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
        const configuredAdminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!@#";

        if (normalizedEmail === configuredAdminEmail && password === configuredAdminPassword) {
          return {
            id: "system-admin-bootstrap-id",
            name: process.env.ADMIN_NAME || "System Administrator",
            email: configuredAdminEmail,
            image: null,
            role: "ADMIN",
            phone: "+8801700000000",
          };
        }

        return null;
      },
    }),
  ],
});
