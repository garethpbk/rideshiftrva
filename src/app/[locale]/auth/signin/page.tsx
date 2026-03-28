import type { Metadata } from "next";
import { SignInForm } from "@/components/SignInForm";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
