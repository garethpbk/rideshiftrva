import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GoalForm } from "@/components/GoalForm";

export const metadata: Metadata = {
  title: "Set Your Goal",
};

export default async function GoalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const goal = await prisma.goal.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GoalForm
        existingGoal={goal ? { items: goal.items } : null}
      />
    </div>
  );
}
