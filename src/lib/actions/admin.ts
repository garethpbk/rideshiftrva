"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendCouponEmails } from "@/lib/email";
import { getCurrentWeekKey } from "@/lib/weeks";
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

  try {
    await sendCouponEmails(userId, weekKey);
    revalidatePath("/admin/users", "layout");
    return { success: true };
  } catch (error) {
    console.error(`Failed to send reward email to ${user.email}:`, error);
    return { success: false, error: "Failed to send email" };
  }
}
