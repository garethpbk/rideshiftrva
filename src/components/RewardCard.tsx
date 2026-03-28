"use client";

import { Card, CardContent, CardFooter, Chip } from "@heroui/react";
import { useTranslations } from "next-intl";

interface RewardCardProps {
  reward: {
    id: string;
    title: string;
    description: string;
    businessName: string;
    businessLogo: string | null;
    couponCode: string | null;
    maxRedemptions: number | null;
    totalRedemptions: number;
  };
  confirmed: boolean;
  redeemed: boolean;
  allClaimed: boolean;
}

export function RewardCard({ reward, confirmed, redeemed, allClaimed }: RewardCardProps) {
  const t = useTranslations("rewards");

  return (
    <Card className="w-full">
      <CardContent className="flex flex-row gap-4">
        {reward.businessLogo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reward.businessLogo}
            alt={reward.businessName}
            className="h-16 w-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-500">{reward.businessName}</p>
          <h3 className="text-lg font-semibold">{reward.title}</h3>
          {confirmed && (
            <p className="mt-1 text-sm text-zinc-600">{reward.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {!confirmed && (
          <p className="text-sm text-zinc-400">{t("unlockPrompt")}</p>
        )}
        {confirmed && allClaimed && !redeemed && (
          <Chip className="bg-zinc-100 text-zinc-600">{t("allClaimed")}</Chip>
        )}
        {confirmed && (redeemed || !allClaimed) && reward.couponCode && (
          <div className="flex items-center gap-2">
            <Chip className="bg-green-100 text-green-700">{t("earned")}</Chip>
            <code className="rounded bg-zinc-100 px-2 py-1 text-sm font-mono">
              {reward.couponCode}
            </code>
          </div>
        )}
        {confirmed && !redeemed && !allClaimed && !reward.couponCode && (
          <Chip className="bg-green-100 text-green-700">{t("unlocked")}</Chip>
        )}
      </CardFooter>
    </Card>
  );
}
