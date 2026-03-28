import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "../providers";
import { SiteHeader } from "@/components/SiteHeader";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <NextIntlClientProvider>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow">
        Skip to main content
      </a>
      <Providers>
        <SiteHeader />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <footer className="px-4 py-8 text-center border-t border-zinc-100">
          <div className="mx-auto max-w-xl">
            <p className="font-semibold text-zinc-700">
              {t("builtAt")}{" "}
              <a
                href="https://rvahacks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline underline-offset-2 hover:text-green-700"
              >
                {t("hackForRVA")}
              </a>
            </p>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {t("tagline")}
            </p>
          </div>
        </footer>
      </Providers>
    </NextIntlClientProvider>
  );
}
