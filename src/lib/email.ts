import nodemailer from "nodemailer";

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
    const urlMatch = typeof options.html === "string" ? options.html.match(/href="([^"]*)"/) : null;
    if (urlMatch) {
      console.log(`  Link:    ${urlMatch[1]}`);
    }
    console.log("");
  }
}
