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
        goalSnapshot: user.goal.items,
        confirmToken,
      },
    });

    const yesUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}&response=yes`;
    const noUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}&response=no`;

    const goalBullets = user.goal.items
      .map((g) => `<li>${getModeLabel(g.mode)} ${g.daysPerWeek} day${g.daysPerWeek !== 1 ? "s" : ""}</li>`)
      .join("");

    try {
      await sendMail({
        from: EMAIL_FROM,
        to: user.email,
        subject: "Did you meet your weekly travel sustainability goals?",
        html: `
          <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
            <h2 style="color: #16a34a;">RideShift RVA</h2>
            <p>Hey${user.name ? ` ${user.name}` : ""}!</p>
            <p>Did you meet your sustainable travel goals this week?</p>
            <p>Your weekly goals were:</p>
            <ul style="margin: 8px 0 16px 0; padding-left: 20px;">${goalBullets}</ul>
            <div style="margin: 20px 0;">
              <a href="${yesUrl}" style="display: inline-block; padding: 14px 28px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 8px;">
                Yes
              </a>
              <a href="${noUrl}" style="display: inline-block; padding: 14px 28px; background: #e4e4e7; color: #3f3f46; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                No
              </a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 16px;">
              Either way, we appreciate your commitment to a greener Richmond.
            </p>
            <p style="color: #666; font-size: 14px;">
              <a href="${baseUrl}/goal" style="color: #16a34a;">Want to change your goals?</a>
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
