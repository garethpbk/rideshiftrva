import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWeekKey, getWeekDateRange, getModeLabel } from "@/lib/weeks";
import { RewardGrid } from "@/components/RewardGrid";
import { CheckInHistory } from "@/components/CheckInHistory";
import { GoalForm } from "@/components/GoalForm";
import { Card, CardContent, Chip } from "@heroui/react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [goal, currentCheckIn, recentCheckIns] = await Promise.all([
    prisma.goal.findUnique({ where: { userId: session.user.id } }),
    prisma.weeklyCheckIn.findUnique({
      where: {
        userId_weekKey: { userId: session.user.id, weekKey: getCurrentWeekKey() },
      },
    }),
    prisma.weeklyCheckIn.findMany({
      where: { userId: session.user.id },
      orderBy: { weekKey: "desc" },
      take: 10,
    }),
  ]);

  if (!goal) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <GoalForm />
      </div>
    );
  }

  const weekKey = getCurrentWeekKey();
  const { monday, sunday } = getWeekDateRange(weekKey);

  const rewards = await prisma.reward.findMany({
    where: {
      active: true,
      validFrom: { lte: sunday },
      validTo: { gte: monday },
    },
    include: { _count: { select: { redemptions: true } } },
  });

  const userRedemptions = await prisma.redemption.findMany({
    where: { userId: session.user.id, weekKey },
  });
  const redeemedRewardIds = new Set(userRedemptions.map((r) => r.rewardId));

  const responded = currentCheckIn?.response != null;

  return (
    <div className="mx-auto max-w-3xl p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-600">Dashboard</h1>
        <p className="text-sm text-zinc-500">{session.user.email}</p>
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Your weekly goals</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {goal.items.map((item) => (
                  <span key={item.mode} className="text-lg font-semibold">
                    {getModeLabel(item.mode)} {item.daysPerWeek}x/week
                  </span>
                ))}
              </div>
            </div>
            {responded ? (
              <Chip className="bg-green-100 text-green-700">
                {currentCheckIn?.response === "yes" ? "Confirmed!" : "Responded"}
              </Chip>
            ) : (
              <Chip className="bg-amber-100 text-amber-700">
                Check-in arrives Sunday
              </Chip>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">
          This Week&apos;s Rewards
          {rewards.length > 0 && (
            <span className="ml-2 text-sm font-normal text-zinc-500">
              {rewards.length} from local businesses
            </span>
          )}
        </h2>
        <RewardGrid
          rewards={rewards.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            businessName: r.businessName,
            businessLogo: r.businessLogo,
            couponCode: r.couponCode,
            maxRedemptions: r.maxRedemptions,
            totalRedemptions: r._count.redemptions,
          }))}
          confirmed={responded}
          redeemedRewardIds={redeemedRewardIds}
        />
      </div>

      <CheckInHistory
        checkIns={recentCheckIns.map((ci) => ({
          weekKey: ci.weekKey,
          goalSnapshot: ci.goalSnapshot,
          response: ci.response,
          respondedAt: ci.respondedAt,
        }))}
      />
    </div>
  );
}
