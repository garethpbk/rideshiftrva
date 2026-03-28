"use client";

import { Card, CardHeader, CardContent, Input, Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

function SignInFormInner() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const confirmed = searchParams.get("confirmed");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("nodemailer", { email, callbackUrl: "/dashboard" });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 pb-0">
        <h1 className="text-2xl font-bold text-green-600">{t("signInTitle")}</h1>
        <p className="text-sm text-zinc-500">{t("signInSubtitle")}</p>
      </CardHeader>
      <CardContent>
        {confirmed && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {t("goalConfirmed")}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="email" className="sr-only">Email address</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" isDisabled={loading} className="bg-green-600 text-white font-semibold">
            {loading ? t("sending") : t("sendMagicLink")}
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
