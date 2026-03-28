"use client";

import { Button } from "@heroui/react";
import { submitFeedback } from "@/lib/actions/checkin";
import { useState } from "react";

export function FeedbackForm({ checkInId }: { checkInId: string }) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;
    await submitFeedback(checkInId, feedback);
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="text-sm text-green-600 font-medium">Thanks for your feedback!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm text-zinc-600">
        Was there anything that made meeting your goals difficult?
      </label>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
        className="rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Optional — share what got in the way"
      />
      <Button type="submit" className="bg-zinc-100 text-zinc-700 self-start" size="sm">
        Send Feedback
      </Button>
    </form>
  );
}
