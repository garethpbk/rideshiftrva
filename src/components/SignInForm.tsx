"use client";

import { Card, CardHeader, CardContent, Input, Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function SignInFormInner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("nodemailer", { email, callbackUrl: "/" });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 pb-0">
        <h1 className="text-2xl font-bold text-green-600">RideShift RVA</h1>
        <p className="text-sm text-zinc-500">Sign in with your email</p>
      </CardHeader>
      <CardContent>
        {confirmed && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Goal confirmed! Sign in to claim your rewards.
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" isDisabled={loading} className="bg-green-600 text-white font-semibold">
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SignInForm() {
  return (
    <Suspense>
      <SignInFormInner />
    </Suspense>
  );
}
