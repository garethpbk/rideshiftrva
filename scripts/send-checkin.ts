/**
 * Send a weekly check-in email to a specific email address.
 * Looks up the user's actual goals from the database.
 *
 * Usage:
 *   npx tsx scripts/send-checkin.ts <email>            # send for real
 *   npx tsx scripts/send-checkin.ts <email> --dry-run  # print email content
 */

import "dotenv/config";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const email = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!email) {
  console.error("Usage: npx tsx scripts/send-checkin.ts <email> [--dry-run]");
  process.exit(1);
}

const prisma = new PrismaClient();
const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const emailFrom = process.env.EMAIL_FROM || "noreply@rideshiftrva.com";

const MODE_LABELS: Record<string, string> = {
  carpool: "Carpool",
  bike: "Bike",
  bus: "Bus",
  walk: "Walk",
  scooter: "Scooter",
};

async function main() {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { goal: true },
  });

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  if (!user.goal || !user.goal.items.length) {
    console.error(`User ${email} has no goals set.`);
    process.exit(1);
  }

  const confirmToken = crypto.randomBytes(32).toString("hex");
  const yesUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}&response=yes`;
  const noUrl = `${baseUrl}/checkin/confirm?token=${confirmToken}&response=no`;

  const goalBullets = user.goal.items
    .map((g) => `<li>${MODE_LABELS[g.mode] || g.mode} ${g.daysPerWeek} day${g.daysPerWeek !== 1 ? "s" : ""}</li>`)
    .join("");

  const goalSummary = user.goal.items
    .map((g) => `${MODE_LABELS[g.mode] || g.mode} ${g.daysPerWeek}x/week`)
    .join(", ");

  const subject = "Did you meet your weekly travel sustainability goals?";
  const html = `
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
`;

  if (dryRun) {
    console.log("=== DRY RUN — email would be sent as follows ===\n");
    console.log(`From:    ${emailFrom}`);
    console.log(`To:      ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Name:    ${user.name || "(none)"}`);
    console.log(`Goals:   ${goalSummary}`);
    console.log(`Token:   ${confirmToken}`);
    console.log(`Yes:     ${yesUrl}`);
    console.log(`No:      ${noUrl}`);
    console.log(`\n--- HTML body ---\n`);
    console.log(html);
    process.exit(0);
  }

  if (!process.env.EMAIL_SERVER) {
    console.error("EMAIL_SERVER is not set. Use --dry-run to preview without sending.");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

  console.log(`Sending check-in email to ${email} (${goalSummary})...`);

  await transporter.sendMail({ from: emailFrom, to: email, subject, html });

  console.log("Sent!");
  console.log(`\nYes link: ${yesUrl}`);
  console.log(`No link:  ${noUrl}`);
  console.log(`(Note: this token is not in the database — the confirm page will show "Already responded")`);
}

main()
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
