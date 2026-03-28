import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  return (
    <div className="mx-auto max-w-5xl p-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-green-600">Admin</h1>
          <nav className="flex gap-2">
            <Link href="/admin">
              <Button className="bg-zinc-100 text-zinc-700" size="sm">
                Stats
              </Button>
            </Link>
            <Link href="/admin/rewards">
              <Button className="bg-zinc-100 text-zinc-700" size="sm">
                Rewards
              </Button>
            </Link>
          </nav>
        </div>
        <Link href="/">
          <Button className="bg-zinc-100 text-zinc-700" size="sm">
            Back to App
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
