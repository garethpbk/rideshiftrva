"use client";

import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import { upsertGoal, clearGoal } from "@/lib/actions/goal";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ALL_MODES = ["bike", "bus", "carpool", "walk", "scooter"] as const;

interface GoalFormProps {
  existingGoal?: { items: Array<{ mode: string; daysPerWeek: number }> } | null;
}

export function GoalForm({ existingGoal }: GoalFormProps) {
  const t = useTranslations("goal");
  const tModes = useTranslations("modes");
  const [goals, setGoals] = useState<Array<{ mode: string; daysPerWeek: number }>>(
    existingGoal?.items ?? [{ mode: "bike", daysPerWeek: 3 }]
  );

  const usedModes = new Set(goals.map((g) => g.mode));

  function updateGoal(index: number, field: "mode" | "daysPerWeek", value: string | number) {
    setGoals((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  }

  function removeGoal(index: number) {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  }

  function addGoal() {
    const available = ALL_MODES.find((m) => !usedModes.has(m));
    if (available) {
      setGoals((prev) => [...prev, { mode: available, daysPerWeek: 2 }]);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-col gap-1 pb-0">
        <h2 className="text-xl font-bold">
          {existingGoal ? t("updateTitle") : t("setTitle")}
        </h2>
        <p className="text-sm text-zinc-500">
          {t("subtitle")}
        </p>
      </CardHeader>
      <CardContent>
        <form action={upsertGoal} className="flex flex-col gap-4">
          <input type="hidden" name="goals" value={JSON.stringify(goals)} />

          {goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
              <label htmlFor={`mode-${index}`} className="sr-only">Transport mode</label>
              <select
                id={`mode-${index}`}
                value={goal.mode}
                onChange={(e) => updateGoal(index, "mode", e.target.value)}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
              >
                {ALL_MODES.filter(
                  (m) => m === goal.mode || !usedModes.has(m)
                ).map((m) => (
                  <option key={m} value={m}>
                    {tModes(m)}
                  </option>
                ))}
              </select>

              <div className="flex flex-1 items-center gap-2">
                <label htmlFor={`days-${index}`} className="sr-only">Days per week</label>
                <input
                  id={`days-${index}`}
                  type="range"
                  min={1}
                  max={7}
                  value={goal.daysPerWeek}
                  onChange={(e) => updateGoal(index, "daysPerWeek", parseInt(e.target.value, 10))}
                  className="flex-1 accent-green-600"
                />
                <span className="w-16 text-sm font-medium text-zinc-700">
                  {goal.daysPerWeek === 1
                    ? t("days", { count: goal.daysPerWeek })
                    : t("daysPlural", { count: goal.daysPerWeek })}
                </span>
              </div>

              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="text-zinc-400 hover:text-red-500 text-lg leading-none"
                  aria-label={t("removeLabel")}
                >
                  &times;
                </button>
              )}
            </div>
          ))}

          {usedModes.size < ALL_MODES.length && (
            <button
              type="button"
              onClick={addGoal}
              className="rounded-lg border-2 border-dashed border-zinc-200 px-4 py-2 text-sm text-zinc-500 hover:border-green-300 hover:text-green-600"
            >
              {t("addMode")}
            </button>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="bg-green-600 text-white font-semibold">
              {existingGoal ? t("updateGoals") : t("setGoals")}
            </Button>
          </div>
        </form>
        {existingGoal && (
          <form action={clearGoal} className="mt-2">
            <Button type="submit" className="bg-red-100 text-red-700">
              {t("clearGoals")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
