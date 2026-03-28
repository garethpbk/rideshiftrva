import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWeekKey, getWeekDateRange, calculateStreak } from "@/lib/weeks";
import { calculateImpact } from "@/lib/impact";
import { RewardGrid } from "@/components/RewardGrid";
import { CheckInHistory } from "@/components/CheckInHistory";
import { GoalForm } from "@/components/GoalForm";
import { Card, CardContent, Chip } from "@heroui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard");
  const tModes = await getTranslations("modes");

  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [goal, currentCheckIn, recentCheckIns, allCheckIns] = await Promise.all([
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
    prisma.weeklyCheckIn.findMany({
      where: { userId: session.user.id },
      select: { response: true, goalSnapshot: true, weekKey: true },
    }),
  ]);

  const impact = calculateImpact(allCheckIns);
  const streak = calculateStreak(allCheckIns);

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
        <h1 className="text-3xl font-bold text-green-600">{t("title")}</h1>
        <p className="text-sm text-zinc-500">{session.user.email}</p>
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">{t("weeklyGoals")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {goal.items.map((item) => (
                  <span key={item.mode} className="text-lg font-semibold">
                    {t("daysPerWeek", { mode: tModes(item.mode as "bike" | "bus" | "carpool" | "walk" | "scooter"), days: item.daysPerWeek })}
                  </span>
                ))}
              </div>
            </div>
            {responded ? (
              <Chip className="bg-green-100 text-green-700">
                {currentCheckIn?.response === "yes" ? t("confirmed") : t("responded")}
              </Chip>
            ) : (
              <Chip className="bg-amber-100 text-amber-700">
                {t("checkInSunday")}
              </Chip>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-4">
        <Card className="flex-1">
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {streak > 0 ? `🔥 ${t("streak", { count: streak })}` : t("streakStart")}
            </p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent>
            <p className="mb-2 text-sm font-semibold text-zinc-500">{t("impactTitle")}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-bold text-green-600">{impact.tripsAvoided}</p>
                <p className="text-xs text-zinc-500">{t("tripsAvoided")}</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">{impact.milesSaved}</p>
                <p className="text-xs text-zinc-500">{t("milesSaved")}</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">{impact.co2SavedLbs}</p>
                <p className="text-xs text-zinc-500">{t("co2Saved")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-xl font-semibold">
          {t("thisWeeksRewards")}
          {rewards.length > 0 && (
            <span className="ml-2 text-sm font-normal text-zinc-500">
              {t("fromLocalBusinesses", { count: rewards.length })}
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
