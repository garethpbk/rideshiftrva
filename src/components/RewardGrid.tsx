"use client";

import { RewardCard } from "./RewardCard";
import { useTranslations } from "next-intl";

interface Reward {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessLogo: string | null;
  couponCode: string | null;
  maxRedemptions: number | null;
  totalRedemptions: number;
}

interface RewardGridProps {
  rewards: Reward[];
  confirmed: boolean;
  redeemedRewardIds: Set<string>;
}

export function RewardGrid({ rewards, confirmed, redeemedRewardIds }: RewardGridProps) {
  const t = useTranslations("rewards");

  if (rewards.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-default-300 p-8 text-center">
        <p className="text-default-500">{t("noRewards")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          confirmed={confirmed}
          redeemed={redeemedRewardIds.has(reward.id)}
          allClaimed={
            reward.maxRedemptions != null &&
            reward.totalRedemptions >= reward.maxRedemptions
          }
        />
      ))}
    </div>
  );
}
