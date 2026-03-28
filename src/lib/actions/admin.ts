"use server";

import crypto from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMail, EMAIL_FROM } from "@/lib/email";
import { getCurrentWeekKey, getModeLabel } from "@/lib/weeks";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Unauthorized");
  return session;
}

export async function createReward(formData: FormData) {
  const session = await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const businessName = formData.get("businessName") as string;
  const businessLogo = (formData.get("businessLogo") as string) || null;
  const businessUrl = (formData.get("businessUrl") as string) || null;
  const couponCode = (formData.get("couponCode") as string) || null;
  const validFrom = formData.get("validFrom") as string;
  const validTo = formData.get("validTo") as string;
  const maxRedemptionsStr = formData.get("maxRedemptions") as string;
  const maxRedemptions = maxRedemptionsStr
    ? parseInt(maxRedemptionsStr, 10)
    : null;

  if (!title || !description || !businessName || !validFrom || !validTo) {
    throw new Error("Missing required fields");
  }

  await prisma.reward.create({
    data: {
      title,
      description,
      businessName,
      businessLogo,
      businessUrl,
      couponCode,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      maxRedemptions,
      createdBy: session.user.id,
    },
  });

  revalidatePath("/admin/rewards", "layout");
  revalidatePath("/", "layout");
  const locale = await getLocale();
  redirect(`/${locale}/admin/rewards`);
}

export async function updateReward(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const businessName = formData.get("businessName") as string;
  const businessLogo = (formData.get("businessLogo") as string) || null;
  const businessUrl = (formData.get("businessUrl") as string) || null;
  const couponCode = (formData.get("couponCode") as string) || null;
  const validFrom = formData.get("validFrom") as string;
  const validTo = formData.get("validTo") as string;
  const maxRedemptionsStr = formData.get("maxRedemptions") as string;
  const maxRedemptions = maxRedemptionsStr
    ? parseInt(maxRedemptionsStr, 10)
    : null;

  if (
    !id ||
    !title ||
    !description ||
    !businessName ||
    !validFrom ||
    !validTo
  ) {
    throw new Error("Missing required fields");
  }

  await prisma.reward.update({
    where: { id },
    data: {
      title,
      description,
      businessName,
      businessLogo,
      businessUrl,
      couponCode,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      maxRedemptions,
    },
  });

  revalidatePath("/admin/rewards", "layout");
  revalidatePath("/", "layout");
  const locale = await getLocale();
  redirect(`/${locale}/admin/rewards`);
}

export async function toggleRewardActive(rewardId: string) {
  await requireAdmin();

  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
  if (!reward) throw new Error("Reward not found");

  await prisma.reward.update({
    where: { id: rewardId },
    data: { active: !reward.active },
  });

  revalidatePath("/admin/rewards", "layout");
  revalidatePath("/", "layout");
}

export async function sendCheckInEmail(userId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { goal: true },
  });

  if (!user || !user.email) {
    return { success: false, error: "User not found" };
  }

  if (!user.goal) {
    return { success: false, error: "User has no goal set" };
  }

  const weekKey = getCurrentWeekKey();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let existing = await prisma.weeklyCheckIn.findUnique({
    where: { userId_weekKey: { userId: user.id, weekKey } },
  });

  let confirmToken: string;

  if (existing) {
    // Reuse existing record — generate a new token if it was already used
    confirmToken = existing.confirmToken ?? crypto.randomBytes(32).toString("hex");
    if (!existing.confirmToken) {
      await prisma.weeklyCheckIn.update({
        where: { id: existing.id },
        data: { confirmToken },
      });
    }
  } else {
    confirmToken = crypto.randomBytes(32).toString("hex");
    existing = await prisma.weeklyCheckIn.create({
      data: {
        userId: user.id,
        weekKey,
        goalSnapshot: user.goal.items,
        confirmToken,
      },
    });
  }

  const checkIn = existing;

  const yesUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}&response=yes`;
  const noUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}&response=no`;

  const goalBullets = user.goal.items
    .map((g) => `<li>${getModeLabel(g.mode)} ${g.daysPerWeek} day${g.daysPerWeek !== 1 ? "s" : ""}</li>`)
    .join("");

  try {
    await sendMail({
      from: EMAIL_FROM,
      to: user.email,
      subject: "Did you meet your weekly travel sustainability goals?",
      html: `
        <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
          <h2 style="color: #16a34a;">RideShift RVA</h2>
          <p>Hey${user.name ? ` ${user.name}` : ""}!</p>
          <p>Did you meet your sustainable travel goals this week?</p>
          <p>Your weekly goals were:</p>
          <ul style="margin: 8px 0 16px 0; padding-left: 20px;">${goalBullets}</ul>
          <div style="margin: 20px 0;">
            <a href="${yesUrl}" style="display: inline-block; padding: 14px 28px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 8px;">
              Yes
            </a>
            <a href="${noUrl}" style="display: inline-block; padding: 14px 28px; background: #e4e4e7; color: #3f3f46; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              No
            </a>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 16px;">
            Either way, we appreciate your commitment to a greener Richmond.
          </p>
          <p style="color: #666; font-size: 14px;">
            <a href="${baseUrl}/goal" style="color: #16a34a;">Want to change your goals?</a>
          </p>
        </div>
      `,
    });

    await prisma.weeklyCheckIn.update({
      where: { id: checkIn.id },
      data: { sentAt: new Date() },
    });

    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    console.error(`Failed to send check-in email to ${user.email}:`, error);
    return { success: false, error: "Failed to send email" };
  }
}
