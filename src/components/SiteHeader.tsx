"use client";

import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { Link, usePathname } from "@/i18n/navigation";
import NextLink from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function SiteHeader() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin ?? false;

export function SiteHeader() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === "en" ? "es" : "en";

  return (
    <header className="border-b border-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-green-600">
          {t("brand")}
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link href="/info">
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              {t("transitResources")}
            </Button>
          </Link>
          <Link href="/plans">
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              {t("transitPlans")}
            </Button>
          </Link>
          <Link href="/goal">
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              {t("myGoal")}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-green-600 text-white font-semibold" size="sm">
              {t("dashboard")}
            </Button>
          </Link>
          <NextLink href={`/${otherLocale}${pathname}`}>
            <Button className="bg-transparent text-zinc-600 hover:text-zinc-900" size="sm">
              {t("language")}
            </Button>
          </NextLink>
        </nav>
      </div>
    </header>
  );
}
