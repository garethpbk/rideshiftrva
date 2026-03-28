"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations("admin.nav");

  const links = [
    { href: "/admin" as const, label: t("stats"), exact: true },
    { href: "/admin/rewards" as const, label: t("rewards"), exact: false },
    { href: "/admin/users" as const, label: t("users"), exact: false },
  ];

  return (
    <nav className="flex gap-6">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
              isActive
                ? "border-green-600 text-green-600"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
