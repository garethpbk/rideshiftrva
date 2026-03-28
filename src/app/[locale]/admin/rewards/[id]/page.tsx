import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RewardForm } from "@/components/admin/RewardForm";
import { format } from "date-fns";
import { setRequestLocale } from "next-intl/server";

export default async function EditRewardPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

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
          businessUrl: reward.businessUrl,
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
