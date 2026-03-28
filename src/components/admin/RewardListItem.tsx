"use client";

import { Card, CardContent, Chip, Button } from "@heroui/react";
import { toggleRewardActive } from "@/lib/actions/admin";
import { useState } from "react";
import Link from "next/link";

interface RewardListItemProps {
  reward: {
    id: string;
    title: string;
    businessName: string;
    active: boolean;
    validFrom: string;
    validTo: string;
    maxRedemptions: number | null;
    totalRedemptions: number;
  };
}

export function RewardListItem({ reward }: RewardListItemProps) {
  const [toggling, setToggling] = useState(false);

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
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{reward.title}</p>
          <p className="text-sm text-zinc-500">{reward.businessName}</p>
          <p className="text-xs text-zinc-400">
            {reward.validFrom} — {reward.validTo}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="text-zinc-500">
              {reward.totalRedemptions}
              {reward.maxRedemptions ? ` / ${reward.maxRedemptions}` : ""}{" "}
              claimed
            </p>
          </div>
          <Chip
            className={
              reward.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          >
            {reward.active ? "Active" : "Inactive"}
          </Chip>
          <Link href={`/admin/rewards/${reward.id}`}>
            <Button className="bg-zinc-100 text-zinc-700" size="sm">
              Edit
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
            {reward.active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
