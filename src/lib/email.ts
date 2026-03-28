import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { getCurrentWeekKey, getWeekDateRange } from "./weeks";

const hasSmtp = !!process.env.EMAIL_SERVER;

export const transporter = hasSmtp
  ? nodemailer.createTransport(process.env.EMAIL_SERVER)
  : null;

export const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@rideshiftrva.com";

export async function sendMail(options: nodemailer.SendMailOptions) {
  if (transporter) {
    await transporter.sendMail(options);
  } else {
    console.log("\n╔══════════════════════════════════════════════════════════════╗");
    console.log("║  EMAIL (no SMTP configured — set EMAIL_SERVER to send)     ║");
    console.log("╚══════════════════════════════════════════════════════════════╝");
    console.log(`  To:      ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    const urls = typeof options.html === "string" ? [...options.html.matchAll(/href="([^"]*)"/g)] : [];
    for (const match of urls) {
      console.log(`  Link:    ${match[1]}`);
    }
    console.log("");
  }
}

export async function sendCouponEmails(userId: string, weekKey: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.email) return;

  const { monday, sunday } = getWeekDateRange(weekKey);

  const rewards = await prisma.reward.findMany({
    where: {
      active: true,
      validFrom: { lte: sunday },
      validTo: { gte: monday },
    },
    include: { _count: { select: { redemptions: true } } },
  });

  for (const reward of rewards) {
    if (reward.maxRedemptions && reward._count.redemptions >= reward.maxRedemptions) {
      continue;
    }

    // Auto-create redemption (skip if already exists)
    try {
      await prisma.redemption.create({
        data: { userId, rewardId: reward.id, weekKey },
      });
    } catch {
      // unique constraint violation = already redeemed, that's fine
    }

    try {
      await sendMail({
        from: EMAIL_FROM,
        to: user.email,
        subject: `${reward.businessName} would like to thank you for your commitment to sustainability`,
        html: `
          <div style="max-width: 480px; margin: 0 auto; font-family: sans-serif;">
            <h2 style="color: #16a34a;">Ride Shift RVA</h2>
            <p>We're all in this together.</p>
            <p>
              <strong>${reward.businessName}</strong>, a local business dedicated to a
              sustainable RVA, would like to thank you for your dedication to our community.
            </p>
            <div style="background: #f4f4f5; border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
              <p style="font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">${reward.title}</p>
              <p style="color: #666; margin: 0 0 12px 0; font-size: 14px;">${reward.description}</p>
              ${reward.couponCode ? `<p style="font-size: 24px; font-weight: 700; letter-spacing: 2px; color: #16a34a; margin: 0;">${reward.couponCode}</p>` : ""}
            </div>
            <p style="color: #666; font-size: 14px;">
              Thank you for being part of a greener Richmond.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error(`Failed to send coupon email for ${reward.businessName} to ${user.email}:`, error);
    }
  }
}
