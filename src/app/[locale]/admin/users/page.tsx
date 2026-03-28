import { prisma } from "@/lib/prisma";
import { getCurrentWeekKey } from "@/lib/weeks";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UserListItem } from "@/components/admin/UserListItem";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("admin.users");
  const weekKey = getCurrentWeekKey();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      goal: true,
      checkIns: {
        where: { weekKey },
        take: 1,
      },
    },
  });

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{t("title")}</h2>

      {users.length === 0 ? (
        <p className="text-sm text-zinc-500">{t("noUsers")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <UserListItem
              key={user.id}
              user={{
                id: user.id,
                email: user.email ?? "",
                name: user.name,
                hasGoal: !!user.goal,
                alreadySentThisWeek: user.checkIns.length > 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
