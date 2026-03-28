"use server";

import { prisma } from "@/lib/prisma";

export async function submitFeedback(checkInId: string, feedback: string) {
  await prisma.weeklyCheckIn.update({
    where: { id: checkInId },
    data: { feedback },
  });
}
