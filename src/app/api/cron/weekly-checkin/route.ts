import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail, EMAIL_FROM } from "@/lib/email";
import { getCurrentWeekKey, getModeLabel } from "@/lib/weeks";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekKey = getCurrentWeekKey();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const usersWithGoals = await prisma.user.findMany({
    where: { goal: { isNot: null } },
    include: { goal: true },
  });

  let sent = 0;
  let skipped = 0;

  for (const user of usersWithGoals) {
    if (!user.goal || !user.email) {
      skipped++;
      continue;
    }

    const confirmToken = crypto.randomBytes(32).toString("hex");

    // Upsert: skip if already exists for this user+week
    const existing = await prisma.weeklyCheckIn.findUnique({
      where: { userId_weekKey: { userId: user.id, weekKey } },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const checkIn = await prisma.weeklyCheckIn.create({
      data: {
        userId: user.id,
        weekKey,
        goalMode: user.goal.mode,
        goalDaysPerWeek: user.goal.daysPerWeek,
        confirmToken,
      },
    });

    const confirmUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}`;
    const modeLabel = getModeLabel(user.goal.mode);

    try {
      await sendMail({
        from: EMAIL_FROM,
        to: user.email,
        subject: `Did you ${modeLabel.toLowerCase()} ${user.goal.daysPerWeek} days this week?`,
        html: `
          <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
            <h2 style="color: #16a34a;">Ride Shift RVA</h2>
            <p>Hey${user.name ? ` ${user.name}` : ""}!</p>
            <p>
              Your goal this week: <strong>${modeLabel} ${user.goal.daysPerWeek} days</strong>
            </p>
            <p>Did you do it?</p>
            <a href="${confirmUrl}" style="display: inline-block; padding: 14px 28px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Yes, I did it!
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 16px;">
              Confirming unlocks this week's rewards from local Richmond businesses.
            </p>
          </div>
        `,
      });

      await prisma.weeklyCheckIn.update({
        where: { id: checkIn.id },
        data: { sentAt: new Date() },
      });

      sent++;
    } catch (error) {
      console.error(`Failed to send check-in email to ${user.email}:`, error);
      skipped++;
    }
  }

  return NextResponse.json({ weekKey, sent, skipped });
}
