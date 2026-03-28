import type { Metadata } from "next";
import { RewardForm } from "@/components/admin/RewardForm";

export const metadata: Metadata = {
  title: "Create Reward",
};

export default function NewRewardPage() {
  return (
    <div className="flex justify-center">
      <RewardForm />
    </div>
  );
}
