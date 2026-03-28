"use client";

import { Card, CardContent, CardFooter, Chip, Button } from "@heroui/react";
import { toggleRewardActive } from "@/lib/actions/admin";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface RewardListItemProps {
  reward: {
    id: string;
    title: string;
    description: string;
    businessName: string;
    couponCode: string | null;
    active: boolean;
    validFrom: string;
    validTo: string;
    maxRedemptions: number | null;
    totalRedemptions: number;
  };
}

export function RewardListItem({ reward }: RewardListItemProps) {
  const [toggling, setToggling] = useState(false);
  const t = useTranslations("admin.rewards");

  async function handleToggle() {
    setToggling(true);
    try {
      await toggleRewardActive(reward.id);
    } catch {
      // ignore
    } finally {
      setToggling(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{reward.title}</h3>
              <Chip
                className={
                  reward.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }
                size="sm"
              >
                {reward.active ? t("active") : t("inactive")}
              </Chip>
            </div>
            <p className="text-sm font-medium text-zinc-600">
              {reward.businessName}
            </p>
            <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
              {reward.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-green-600">
              {reward.totalRedemptions}
            </p>
            <p className="text-xs text-zinc-400">
              {reward.maxRedemptions
                ? t("ofClaimed", { max: reward.maxRedemptions })
                : t("claimed")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span>
            {reward.validFrom} — {reward.validTo}
          </span>
          {reward.couponCode && (
            <code className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-zinc-600">
              {reward.couponCode}
            </code>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Link href={`/admin/rewards/${reward.id}`}>
          <Button className="bg-zinc-100 text-zinc-700" size="sm">
            {t("edit")}
          </Button>
        </Link>
        <Button
          className={
            reward.active
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }
          size="sm"
          isDisabled={toggling}
          onPress={handleToggle}
        >
          {reward.active ? t("deactivate") : t("activate")}
        </Button>
      </CardFooter>
    </Card>
  );
}
