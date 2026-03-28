import { prisma } from "@/lib/prisma";
import { getCurrentWeekKey } from "@/lib/weeks";
import { Card, CardContent } from "@heroui/react";

export default async function AdminPage() {
  const weekKey = getCurrentWeekKey();

  const [totalUsers, usersWithGoals, confirmedThisWeek, redemptionsByReward] =
    await Promise.all([
      prisma.user.count(),
      prisma.goal.count(),
      prisma.weeklyCheckIn.count({
        where: { confirmed: true, weekKey },
      }),
      prisma.redemption.groupBy({
        by: ["rewardId"],
        _count: true,
      }),
    ]);

  const rewardIds = redemptionsByReward.map((r) => r.rewardId);
  const rewards =
    rewardIds.length > 0
      ? await prisma.reward.findMany({
          where: { id: { in: rewardIds } },
          select: { id: true, title: true, businessName: true },
        })
      : [];

  const rewardMap = new Map(rewards.map((r) => [r.id, r]));

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Dashboard</h2>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-green-600">{totalUsers}</p>
            <p className="text-sm text-zinc-500">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-green-600">
              {usersWithGoals}
            </p>
            <p className="text-sm text-zinc-500">Users with Goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-green-600">
              {confirmedThisWeek}
            </p>
            <p className="text-sm text-zinc-500">
              Confirmed This Week ({weekKey})
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="mb-3 text-lg font-semibold">Redemptions by Reward</h3>
      {redemptionsByReward.length === 0 ? (
        <p className="text-sm text-zinc-500">No redemptions yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {redemptionsByReward
            .sort((a, b) => b._count - a._count)
            .map((r) => {
              const reward = rewardMap.get(r.rewardId);
              return (
                <Card key={r.rewardId}>
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {reward?.title ?? "Unknown Reward"}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {reward?.businessName}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {r._count}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
