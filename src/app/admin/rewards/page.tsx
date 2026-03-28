import { prisma } from "@/lib/prisma";
import { RewardListItem } from "@/components/admin/RewardListItem";
import { Button } from "@heroui/react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminRewardsPage() {
  const rewards = await prisma.reward.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { redemptions: true } } },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Rewards</h2>
        <Link href="/admin/rewards/new">
          <Button className="bg-green-600 text-white font-semibold" size="sm">
            Create Reward
          </Button>
        </Link>
      </div>

      {rewards.length === 0 ? (
        <p className="text-sm text-zinc-500">No rewards yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rewards.map((reward) => (
            <RewardListItem
              key={reward.id}
              reward={{
                id: reward.id,
                title: reward.title,
                businessName: reward.businessName,
                active: reward.active,
                validFrom: format(reward.validFrom, "yyyy-MM-dd"),
                validTo: format(reward.validTo, "yyyy-MM-dd"),
                maxRedemptions: reward.maxRedemptions,
                totalRedemptions: reward._count.redemptions,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
