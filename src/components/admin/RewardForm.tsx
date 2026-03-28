"use client";

import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import { createReward, updateReward } from "@/lib/actions/admin";

interface RewardFormProps {
  reward?: {
    id: string;
    title: string;
    description: string;
    businessName: string;
    businessLogo: string | null;
    businessUrl: string | null;
    couponCode: string | null;
    validFrom: string;
    validTo: string;
    maxRedemptions: number | null;
    active: boolean;
  } | null;
}

const inputClass =
  "w-full rounded-lg border-2 border-zinc-200 px-3 py-2 text-sm focus:border-green-600 focus:outline-none";

export function RewardForm({ reward }: RewardFormProps) {
  const isEdit = !!reward;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-col gap-1 pb-0">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Reward" : "Create Reward"}
        </h2>
      </CardHeader>
      <CardContent>
        <form
          action={isEdit ? updateReward : createReward}
          className="flex flex-col gap-4"
        >
          {isEdit && <input type="hidden" name="id" value={reward.id} />}

          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              defaultValue={reward?.title ?? ""}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              defaultValue={reward?.description ?? ""}
              required
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              name="businessName"
              defaultValue={reward?.businessName ?? ""}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Business Logo URL
            </label>
            <input
              name="businessLogo"
              defaultValue={reward?.businessLogo ?? ""}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Business Website URL
            </label>
            <input
              name="businessUrl"
              defaultValue={reward?.businessUrl ?? ""}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Coupon Code
            </label>
            <input
              name="couponCode"
              defaultValue={reward?.couponCode ?? ""}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Valid From <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="validFrom"
                defaultValue={reward?.validFrom ?? ""}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Valid To <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="validTo"
                defaultValue={reward?.validTo ?? ""}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Max Redemptions
            </label>
            <input
              type="number"
              name="maxRedemptions"
              min={1}
              defaultValue={reward?.maxRedemptions?.toString() ?? ""}
              placeholder="Leave blank for unlimited"
              className={inputClass}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-green-600 text-white font-semibold"
            >
              {isEdit ? "Update Reward" : "Create Reward"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
