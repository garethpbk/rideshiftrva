import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-3xl p-4 py-8">
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-green-600">{t("title")}</h1>
          <AdminNav />
        </div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700">
          &larr; {t("backToApp")}
        </Link>
      </div>
      {children}
    </div>
  );
}
