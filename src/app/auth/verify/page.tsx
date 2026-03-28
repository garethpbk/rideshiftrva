import type { Metadata } from "next";
import { Card, CardHeader, CardContent } from "@heroui/react";

export const metadata: Metadata = {
  title: "Check Your Email",
};

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col gap-1 pb-0">
          <h1 className="text-2xl font-bold text-green-600">Check Your Email</h1>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-600">
            We sent you a magic link. Click it to sign in.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            If you don&apos;t see it, check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
