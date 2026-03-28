import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RewardForm } from "@/components/admin/RewardForm";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Edit Reward",
};

export default async function EditRewardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const reward = await prisma.reward.findUnique({ where: { id } });
  if (!reward) redirect("/admin/rewards");

  return (
    <div className="flex justify-center">
      <RewardForm
        reward={{
          id: reward.id,
          title: reward.title,
          description: reward.description,
          businessName: reward.businessName,
          businessLogo: reward.businessLogo,
          couponCode: reward.couponCode,
          validFrom: format(reward.validFrom, "yyyy-MM-dd"),
          validTo: format(reward.validTo, "yyyy-MM-dd"),
          maxRedemptions: reward.maxRedemptions,
          active: reward.active,
        }}
      />
    </div>
  );
}
