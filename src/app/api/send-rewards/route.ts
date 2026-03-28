import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCouponEmails } from "@/lib/email";
import { getCurrentWeekKey } from "@/lib/weeks";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("user");
  if (!email) {
    return NextResponse.json({ error: "Missing ?user= parameter" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { goal: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.goal) {
    return NextResponse.json({ error: "User has no goal set" }, { status: 400 });
  }

  const weekKey = getCurrentWeekKey();

  try {
    await sendCouponEmails(user.id, weekKey);
    return NextResponse.json({ success: true, email, weekKey });
  } catch (error) {
    console.error(`Failed to send reward email to ${email}:`, error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
