import type { Metadata } from "next";
import { SignInForm } from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
