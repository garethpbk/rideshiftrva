import type { Metadata } from "next";
import { Card, CardContent, Button } from "@heroui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Richmond Transportation Plans",
};

const PLANS = [
  {
    key: "richmondConnects" as const,
    url: "https://experience.arcgis.com/experience/120779108e77426c84cd61ec48477ae4",
    preview: "/images/richmond-connects-tracker.png",
  },
  {
    key: "visionZero" as const,
    url: "https://www.rva.gov/sites/default/files/2021-05/VisionZero-RichmondActionPlan.pdf",
  },
  {
    key: "bicycleMaster" as const,
    url: "https://www.rva.gov/sites/default/files/2019-10/Richmond%20Bicycle%20Master%20Plan%203.6.15_lr.pdf",
  },
];

export default async function PlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("plans");

  return (
    <div className="mx-auto max-w-4xl p-4 py-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-zinc-600">
        {t("subtitle")}
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {PLANS.map((plan) => (
          <div key={plan.url}>
            <Card>
              <CardContent>
                <a
                  href={plan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:decoration-green-600"
                >
                  {t(`${plan.key}.name`)}
                </a>
                <p className="mt-1 text-sm text-zinc-600">{t(`${plan.key}.description`)}</p>
              </CardContent>
            </Card>
            {"preview" in plan && plan.preview && (
              <a
                href={plan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block overflow-hidden rounded-lg border border-zinc-200 transition-shadow hover:shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={plan.preview}
                  alt={`Preview of ${t(`${plan.key}.name`)}`}
                  className="w-full"
                />
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-green-50 p-6">
        <h2 className="text-xl font-bold text-green-800">
          {t("feedbackTitle")}
        </h2>
        <p className="mt-2 text-green-700">
          {t("feedbackDescription")}
        </p>
        <div className="mt-4">
          <a
            href="https://survey123.arcgis.com/share/71acb994607d49b7b3a4104e5f9a7637"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-green-600 text-white font-semibold">
              {t("feedbackButton")}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
