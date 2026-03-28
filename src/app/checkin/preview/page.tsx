import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Check-In Preview (Dev)",
};

interface Props {
  searchParams: Promise<{ response?: string }>;
}

export default async function CheckInPreviewPage({ searchParams }: Props) {
  const { response } = await searchParams;
  const userCount = await prisma.user.count();

  if (!response || (response !== "yes" && response !== "no")) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold">Check-In Preview</h1>
        <p className="text-zinc-500">Pick a response to preview:</p>
        <div className="flex gap-4">
          <Link href="/checkin/preview?response=yes">
            <Button className="bg-green-600 text-white font-semibold px-8 py-3">
              Preview &quot;Yes&quot;
            </Button>
          </Link>
          <Link href="/checkin/preview?response=no">
            <Button className="bg-zinc-200 text-zinc-700 font-semibold px-8 py-3">
              Preview &quot;No&quot;
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <FeedbackForm checkInId="preview" />
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
