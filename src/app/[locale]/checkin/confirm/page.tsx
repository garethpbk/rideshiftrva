import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { sendCouponEmails } from "@/lib/email";
import { getWeekDateRange } from "@/lib/weeks";
import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { FeedbackForm } from "@/components/FeedbackForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Confirm Check-In",
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; response?: string }>;
}

export default async function ConfirmPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("checkin");

  const { token, response } = await searchParams;

  if (!token || !response || (response !== "yes" && response !== "no")) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <p className="text-zinc-500">{t("invalidLink")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { confirmToken: token },
  });

  if (!checkIn) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="flex flex-col pb-0">
            <h1 className="text-xl font-bold text-green-600">{t("alreadyResponded")}</h1>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">{t("alreadyRespondedDescription")}</p>
            <Link href="/dashboard" className="mt-4 inline-block text-green-600 underline">
              {t("goToDashboard")}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  await prisma.weeklyCheckIn.update({
    where: { id: checkIn.id },
    data: {
      response,
      respondedAt: new Date(),
      confirmToken: null,
    },
  });

  try {
    await sendCouponEmails(checkIn.userId, checkIn.weekKey);
  } catch (error) {
    console.error("Failed to send coupon emails:", error);
  }

  const { monday, sunday } = getWeekDateRange(checkIn.weekKey);
  const rewards = await prisma.reward.findMany({
    where: {
      active: true,
      validFrom: { lte: sunday },
      validTo: { gte: monday },
    },
  });

  const userCount = await prisma.user.count();

  if (response === "yes") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader className="flex flex-col pb-0">
            <h1 className="text-2xl font-bold text-green-600">{t("greatWork")}</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-zinc-600">
              {t("committed", { count: userCount.toLocaleString() })}
            </p>
            {rewards.length > 0 && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-green-600">{t("yourRewards")}</h2>
                <div className="flex flex-col gap-2">
                  {rewards.map((r) => (
                    <Card key={r.id} className="border border-green-100">
                      <CardContent className="py-2">
                        <p className="font-semibold">{r.title}</p>
                        <p className="text-sm text-zinc-500">{r.businessName}</p>
                        <p className="text-sm">
                          {t("couponCode")}: <span className="font-mono font-bold text-green-600">{r.couponCode}</span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            <Link href="/goal">
              <Button className="bg-zinc-100 text-zinc-700">
                {t("changeGoals")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col pb-0">
          <h1 className="text-2xl font-bold text-green-600">
            {t("stillOnPath")}
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-zinc-600">
            {t("goalsDirection", { count: userCount.toLocaleString() })}
          </p>
          {rewards.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-green-600">{t("yourRewards")}</h2>
              <div className="flex flex-col gap-2">
                {rewards.map((r) => (
                  <Card key={r.id} className="border border-green-100">
                    <CardContent className="py-2">
                      <p className="font-semibold">{r.title}</p>
                      <p className="text-sm text-zinc-500">{r.businessName}</p>
                      <p className="text-sm">
                        {t("couponCode")}: <span className="font-mono font-bold text-green-600">{r.couponCode}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <FeedbackForm checkInId={checkIn.id} />
          <Link href="/goal">
            <Button className="bg-zinc-100 text-zinc-700">
              {t("changeGoals")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
