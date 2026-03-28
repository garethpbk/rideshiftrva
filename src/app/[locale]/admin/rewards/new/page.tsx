import { setRequestLocale } from "next-intl/server";
import { RewardForm } from "@/components/admin/RewardForm";

export default async function NewRewardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex justify-center">
      <RewardForm />
    </div>
  );
}
