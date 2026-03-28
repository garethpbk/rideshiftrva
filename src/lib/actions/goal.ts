"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const VALID_MODES = ["bike", "bus", "carpool", "walk", "scooter"];

export async function upsertGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const raw = formData.get("goals") as string;
  const items: Array<{ mode: string; daysPerWeek: number }> = JSON.parse(raw);

  if (!items.length) throw new Error("At least one goal is required");

  const seen = new Set<string>();
  for (const item of items) {
    if (!VALID_MODES.includes(item.mode)) throw new Error(`Invalid mode: ${item.mode}`);
    if (item.daysPerWeek < 1 || item.daysPerWeek > 7) throw new Error("Days must be 1-7");
    if (seen.has(item.mode)) throw new Error(`Duplicate mode: ${item.mode}`);
    seen.add(item.mode);
  }

  await prisma.goal.upsert({
    where: { userId: session.user.id },
    update: { items },
    create: { userId: session.user.id, items },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function clearGoal() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.goal.deleteMany({ where: { userId: session.user.id } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
