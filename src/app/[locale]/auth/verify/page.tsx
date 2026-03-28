import type { Metadata } from "next";
import { Card, CardHeader, CardContent } from "@heroui/react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Check Your Email",
};

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col gap-1 pb-0">
          <h1 className="text-2xl font-bold text-green-600">{t("checkEmail")}</h1>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600">
            {t("magicLinkSent")}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {t("checkSpam")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
