import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { sendCouponEmails } from "@/lib/email";
import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Confirm Check-In",
};

interface Props {
  searchParams: Promise<{ token?: string; response?: string }>;
}

export default async function ConfirmPage({ searchParams }: Props) {
  const { token, response } = await searchParams;

  if (!token || !response || (response !== "yes" && response !== "no")) {
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
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="flex flex-col pb-0">
            <h1 className="text-xl font-bold text-green-600">Already Responded</h1>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-600">This check-in has already been recorded.</p>
            <Link href="/dashboard" className="mt-4 inline-block text-green-600 underline">
              Go to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Record the response
  await prisma.weeklyCheckIn.update({
    where: { id: checkIn.id },
    data: {
      response,
      respondedAt: new Date(),
      confirmToken: null,
    },
  });

  // Send coupon emails (don't block on failure)
  try {
    await sendCouponEmails(checkIn.userId, checkIn.weekKey);
  } catch (error) {
    console.error("Failed to send coupon emails:", error);
  }

  const userCount = await prisma.user.count();

  if (response === "yes") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader className="flex flex-col pb-0">
            <h1 className="text-2xl font-bold text-green-600">Great work!</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-zinc-600">
              You&apos;re one of {userCount.toLocaleString()} Richmond residents committed to
              a more sustainable city. Check your email for a thank you from one
              of our local business partners!
            </p>
            <Link href="/goal">
              <Button className="bg-zinc-100 text-zinc-700">
                Need to change your goals?
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // response === "no"
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-col pb-0">
          <h1 className="text-2xl font-bold text-green-600">
            You&apos;re still on the right path
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-zinc-600">
            Goals set a direction — they&apos;re not a destination. You&apos;re one
            of {userCount.toLocaleString()} Richmond residents committed to a more sustainable
            city. Check your email for a thank you from one of our local business partners!
          </p>
          <FeedbackForm checkInId={checkIn.id} />
          <Link href="/goal">
            <Button className="bg-zinc-100 text-zinc-700">
              Need to change your goals?
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
