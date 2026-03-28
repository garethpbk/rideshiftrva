import type { NextAuthConfig } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { sendMail, EMAIL_FROM } from "./email";
import { prisma } from "./prisma";

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const authConfig: NextAuthConfig = {
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER || "smtp://localhost:1025",
      from: EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        await sendMail({
          from: EMAIL_FROM,
          to: email,
          subject: "Sign in to RideShift RVA",
          html: `
            <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
              <h2 style="color: #16a34a;">RideShift RVA</h2>
              <p>Click the link below to sign in:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Sign In
              </a>
              <p style="color: #666; font-size: 14px; margin-top: 16px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.isAdmin = user.isAdmin ?? false;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      try {
        const userCount = await prisma.user.count();
        await sendMail({
          from: EMAIL_FROM,
          to: user.email!,
          subject: "Welcome to RideShiftRVA",
          html: `
            <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
              <h2 style="color: #16a34a;">Welcome to RideShift RVA!</h2>
              <p>Thank you for signing up for RideShiftRVA.</p>
              <p>
                You are joining a community of <strong>${userCount.toLocaleString()}</strong>
                Richmond residents committed to a sustainable future for our city.
              </p>
              <p>Set your goals to get started:</p>
              <a href="${baseUrl}/goal" style="display: inline-block; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                Set Your Goals
              </a>
              <p style="color: #666; font-size: 14px; margin-top: 16px;">
                Move green, save green.
              </p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    },
  },
};
