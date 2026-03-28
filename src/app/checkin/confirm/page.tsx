import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent } from "@heroui/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confirm Check-In",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent>
            <p className="text-zinc-500">Invalid confirm link.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkIn = await prisma.weeklyCheckIn.findUnique({
    where: { confirmToken: token },
  });

  if (!checkIn) {
    const session = await auth();
    if (session?.user) {
      redirect("/");
    }
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="flex flex-col pb-0">
            <h1 className="text-xl font-bold text-green-600">Already Confirmed</h1>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">This check-in has already been confirmed.</p>
            <Link href="/auth/signin" className="mt-4 inline-block text-green-600 underline">
              Sign in to view your rewards
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  await prisma.weeklyCheckIn.update({
    where: { id: checkIn.id },
    data: {
      confirmed: true,
      confirmedAt: new Date(),
      confirmToken: null,
    },
  });

  const session = await auth();
  if (session?.user) {
    redirect("/");
  } else {
    redirect("/auth/signin?confirmed=1");
  }
}
