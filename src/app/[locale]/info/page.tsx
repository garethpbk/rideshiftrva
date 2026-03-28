import type { Metadata } from "next";
import { Card, CardContent } from "@heroui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Richmond Transit Resources",
};

const RESOURCES = [
  {
    categoryKey: "publicTransit" as const,
    items: [
      {
        key: "grtc" as const,
        url: "https://www.ridegrtc.com",
      },
      {
        key: "grtcMaps" as const,
        url: "https://www.ridegrtc.com/maps-and-schedules/",
      },
      {
        key: "transitApp" as const,
        url: "https://www.ridegrtc.com/rider-guide/mobile-apps/",
      },
    ],
  },
  {
    categoryKey: "biking" as const,
    items: [
      {
        key: "bikeMap" as const,
        url: "https://richmond-geo-hub-cor.hub.arcgis.com/datasets/bicycle-infrastructure-completed/about",
      },
      {
        key: "bikeWalk" as const,
        url: "https://www.sportsbackers.org/program/bike-walk-rva/rva-bikeways-guide/",
      },
      {
        key: "pedBikeTrails" as const,
        url: "https://www.rva.gov/public-works/pedestrian-bicycling-and-trails",
      },
    ],
  },
  {
    categoryKey: "scooters" as const,
    items: [
      {
        key: "escooter" as const,
        url: "https://www.rva.gov/public-works/e-scooter-program",
      },
    ],
  },
  {
    categoryKey: "carpooling" as const,
    items: [
      {
        key: "ridefinders" as const,
        url: "https://www.ridefinders.com/",
      },
      {
        key: "connectingVA" as const,
        url: "https://connectingva.drpt.virginia.gov/rideshare/",
      },
    ],
  },
  {
    categoryKey: "walking" as const,
    items: [
      {
        key: "virginiaPaths" as const,
        url: "https://virginiapaths.org/",
      },
    ],
  },
];

export default async function InfoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("info");

  return (
    <div className="mx-auto max-w-3xl p-4 py-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-zinc-600">
        {t("subtitle")}
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {RESOURCES.map((section) => (
          <div key={section.categoryKey}>
            <h2 className="text-xl font-bold text-green-600">
              {t(section.categoryKey)}
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {section.items.map((item) => (
                <Card key={item.url}>
                  <CardContent>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-green-700 underline decoration-green-300 underline-offset-2 hover:decoration-green-600"
                    >
                      {t(`${item.key}.name`)}
                    </a>
                    <p className="mt-1 text-sm text-zinc-600">
                      {t(`${item.key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
