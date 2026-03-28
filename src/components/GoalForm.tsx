"use client";

import { Card, CardHeader, CardContent, Button } from "@heroui/react";
import { upsertGoal, clearGoal } from "@/lib/actions/goal";
import { useState } from "react";

const MODES = [
  { value: "bike", label: "Bike" },
  { value: "bus", label: "Bus" },
  { value: "carpool", label: "Carpool" },
  { value: "walk", label: "Walk" },
];

interface GoalFormProps {
  existingGoal?: { mode: string; daysPerWeek: number } | null;
}

export function GoalForm({ existingGoal }: GoalFormProps) {
  const [mode, setMode] = useState(existingGoal?.mode || "bike");
  const [days, setDays] = useState(existingGoal?.daysPerWeek || 3);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-col gap-1 pb-0">
        <h2 className="text-xl font-bold">
          {existingGoal ? "Update Your Goal" : "Set Your Weekly Goal"}
        </h2>
        <p className="text-sm text-zinc-500">How will you commute this week?</p>
      </CardHeader>
      <CardContent>
        <form action={upsertGoal} className="flex flex-col gap-6">
          <fieldset>
            <legend className="text-sm font-medium mb-2">Commute mode</legend>
            <div className="flex gap-2">
              {MODES.map((m) => (
                <label
                  key={m.value}
                  className={`flex-1 cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-colors ${
                    mode === m.value
                      ? "border-green-600 bg-green-50 text-green-700 font-semibold"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={m.value}
                    checked={mode === m.value}
                    onChange={() => setMode(m.value)}
                    className="sr-only"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label className="block text-sm font-medium mb-2">
              Days per week: {days}
            </label>
            <input
              type="range"
              min={1}
              max={7}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
            </div>
            <input type="hidden" name="daysPerWeek" value={days} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-green-600 text-white font-semibold">
              {existingGoal ? "Update Goal" : "Set Goal"}
            </Button>
            {existingGoal && (
              <form action={clearGoal}>
                <Button type="submit" className="bg-red-100 text-red-700">
                  Clear Goal
                </Button>
              </form>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
