"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWeekKey } from "@/lib/weeks";
import { revalidatePath } from "next/cache";

export async function claimReward(rewardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const weekKey = getCurrentWeekKey();

  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { userId_weekKey: { userId: session.user.id, weekKey } },
  });

  if (!checkIn?.response) {
    throw new Error("You must respond to your weekly check-in before claiming rewards");
  }

  const reward = await prisma.reward.findUnique({
    where: { id: rewardId },
    include: { _count: { select: { redemptions: true } } },
  });

  if (!reward || !reward.active) {
    throw new Error("Reward not found");
  }

  if (reward.maxRedemptions && reward._count.redemptions >= reward.maxRedemptions) {
    throw new Error("This reward has been fully claimed");
  }

  await prisma.redemption.create({
    data: {
      userId: session.user.id,
      rewardId,
      weekKey,
    },
  });

  revalidatePath("/dashboard");
}
