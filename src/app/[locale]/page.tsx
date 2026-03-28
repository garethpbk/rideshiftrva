import { prisma } from "@/lib/prisma";
import { Card, CardContent, Button } from "@heroui/react";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface Business {
  name: string;
  logo: string | null;
  url: string | null;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("landing");

  const rewards = await prisma.reward.findMany({
    where: { active: true },
    select: { businessName: true, businessLogo: true, businessUrl: true },
    distinct: ["businessName"],
  });

  const businesses: Business[] = rewards.map((r) => ({
    name: r.businessName,
    logo: r.businessLogo ?? null,
    url: r.businessUrl ?? null,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          {t("hero.title")}{" "}
          <span className="text-green-600">{t("hero.titleHighlight")}</span>
        </h1>
        <p className="max-w-xl text-xl text-zinc-600">{t("hero.subtitle")}</p>
        <p className="max-w-2xl text-lg text-zinc-500">
          {t("hero.description")}
        </p>
        <div className="mt-4 flex gap-4">
          <Link href="/auth/signin">
            <Button className="bg-green-600 text-white font-semibold text-lg px-8 py-3">
              {t("hero.getStarted")}
            </Button>
          </Link>
          <Link href="/info">
            <Button className="bg-zinc-100 text-zinc-700 font-semibold text-lg px-8 py-3">
              {t("hero.transitResources")}
            </Button>
          </Link>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">{t("problem.title")}</h2>
          <p className="mt-4 text-lg text-zinc-600">
            {t("problem.description")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-4 text-center">
            <div>
              <p className="text-3xl font-bold text-red-600">~75%</p>
              <p className="text-sm text-zinc-500">{t("problem.driveAlone")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600">~9%</p>
              <p className="text-sm text-zinc-500">{t("problem.carpool")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">~1.5%</p>
              <p className="text-sm text-zinc-500">
                {t("problem.publicTransit")}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">~3%</p>
              <p className="text-sm text-zinc-500">
                {t("problem.walkBikeScooter")}
              </p>
            </div>
          </div>
          <p className="mt-6 text-sm text-zinc-500 leading-relaxed">
            {t("problem.systemicContext")}
          </p>
        </div>
      </section>

      {/* The Solution */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">{t("solution.title")}</h2>
          <p className="mt-4 text-lg text-zinc-600">
            {t("solution.description")}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center">
            {t("howItWorks.title")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-green-600">1</p>
                <h3 className="mt-2 text-lg font-semibold">
                  {t("howItWorks.step1Title")}
                </h3>
                <p className="text-sm text-zinc-500">
                  {t("howItWorks.step1Description")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-green-600">2</p>
                <h3 className="mt-2 text-lg font-semibold">
                  {t("howItWorks.step2Title")}
                </h3>
                <p className="text-sm text-zinc-500">
                  {t("howItWorks.step2Description")}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-green-600">3</p>
                <h3 className="mt-2 text-lg font-semibold">
                  {t("howItWorks.step3Title")}
                </h3>
                <p className="text-sm text-zinc-500">
                  {t("howItWorks.step3Description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Every Richmonder / For Local Businesses */}
      <section className="px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold">
                {t("forEveryone.residentsTitle")}
              </h3>
              <p className="mt-2 text-zinc-600">
                {t("forEveryone.residentsDescription")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-xl font-bold">
                {t("forEveryone.businessTitle")}
              </h3>
              <p className="mt-2 text-zinc-600">
                {t("forEveryone.businessDescription")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Built on Trust */}
      <section className="bg-green-50 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-green-800">
            {t("trust.title")}
          </h2>
          <p className="mt-3 text-green-700">{t("trust.description")}</p>
          <p className="mt-4 text-sm text-green-600">
            {t("independence.note")}
          </p>
        </div>
      </section>

      {/* Participating Businesses */}
      <section className="bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">{t("businesses.title")}</h2>
          <p className="mt-2 text-zinc-500">{t("businesses.subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {businesses.map((biz) => {
              const inner = biz.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={biz.logo}
                  alt={biz.name}
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              ) : (
                <p className="text-lg font-semibold">{biz.name}</p>
              );

              return biz.url ? (
                <a
                  key={biz.name}
                  href={biz.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-20 w-32 items-center justify-center transition-opacity hover:opacity-80"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={biz.name}
                  className="flex h-20 w-32 items-center justify-center"
                >
                  {inner}
                </div>
              );
            })}
            {businesses.length === 0 && (
              <p className="text-zinc-400">{t("businesses.comingSoon")}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
