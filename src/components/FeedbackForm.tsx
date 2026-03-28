"use client";

import { Button } from "@heroui/react";
import { submitFeedback } from "@/lib/actions/checkin";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function FeedbackForm({ checkInId }: { checkInId: string }) {
  const t = useTranslations("feedback");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;
    await submitFeedback(checkInId, feedback);
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="text-sm text-green-600 font-medium" aria-live="polite">{t("thanks")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="feedback" className="text-sm text-zinc-600">
        {t("label")}
      </label>
      <textarea
        id="feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        placeholder={t("placeholder")}
      />
      <Button type="submit" className="bg-zinc-100 text-zinc-700 self-start" size="sm">
        {t("submit")}
      </Button>
    </form>
  );
}
