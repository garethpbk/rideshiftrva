"use client";

import { Card, CardContent, Chip, Button } from "@heroui/react";
import { sendCheckInEmail } from "@/lib/actions/admin";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface UserListItemProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    hasGoal: boolean;
    alreadySentThisWeek: boolean;
  };
}

export function UserListItem({ user }: UserListItemProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle"
  );
  const t = useTranslations("admin.users");

  async function handleSend() {
    setStatus("sending");
    try {
      const result = await sendCheckInEmail(user.id);
      setStatus(result.success ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">
            {user.name ?? user.email}
          </p>
          {user.name && (
            <p className="text-sm text-zinc-500">{user.email}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!user.hasGoal && (
            <Chip className="bg-zinc-100 text-zinc-500" size="sm">
              {t("noGoalSet")}
            </Chip>
          )}
          {user.alreadySentThisWeek && status === "idle" && (
            <span className="text-xs text-amber-600">{t("alreadySent")}</span>
          )}
          {status === "sent" && (
            <Chip className="bg-green-100 text-green-700" size="sm">
              {t("sent")}
            </Chip>
          )}
          {status === "failed" && (
            <Chip className="bg-red-100 text-red-700" size="sm">
              {t("failed")}
            </Chip>
          )}
          <Button
            className="bg-green-600 text-white font-semibold"
            size="sm"
            isDisabled={!user.hasGoal || status === "sending"}
            onPress={handleSend}
          >
            {status === "sending" ? t("sending") : t("sendEmail")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
