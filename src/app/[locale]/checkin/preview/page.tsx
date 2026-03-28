import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentWeekKey, getWeekDateRange } from "@/lib/weeks";
import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { FeedbackForm } from "@/components/FeedbackForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Check-In Preview (Dev)",
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ response?: string }>;
}

export default async function CheckInPreviewPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("checkin");
  const tp = await getTranslations("checkin.preview");

  const { response } = await searchParams;
  const userCount = await prisma.user.count();

  const weekKey = getCurrentWeekKey();
  const { monday, sunday } = getWeekDateRange(weekKey);
  const rewards = await prisma.reward.findMany({
    where: {
      active: true,
      validFrom: { lte: sunday },
      validTo: { gte: monday },
    },
  });

  if (!response || (response !== "yes" && response !== "no")) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold">{tp("title")}</h1>
        <p className="text-zinc-500">{tp("previewAs")}</p>
        <div className="flex gap-4">
          <Link href="/checkin/preview?response=yes">
            <Button className="bg-green-600 text-white font-semibold px-8 py-3">
              {tp("yesLabel")}
            </Button>
          </Link>
          <Link href="/checkin/preview?response=no">
            <Button className="bg-zinc-200 text-zinc-700 font-semibold px-8 py-3">
              {tp("noLabel")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
                        {r.couponCode && (
                          <p className="text-sm">
                            {t("couponCode")}: <span className="font-mono font-bold text-green-600">{r.couponCode}</span>
                          </p>
                        )}
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
                      {r.couponCode && (
                        <p className="text-sm">
                          {t("couponCode")}: <span className="font-mono font-bold text-green-600">{r.couponCode}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <FeedbackForm checkInId="preview" />
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
