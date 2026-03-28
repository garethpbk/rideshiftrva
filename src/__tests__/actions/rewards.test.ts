import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    weeklyCheckIn: { findUnique: vi.fn() },
    reward: { findUnique: vi.fn() },
    redemption: { create: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/weeks", () => ({
  getCurrentWeekKey: vi.fn(() => "2026-W13"),
}));

import { claimReward } from "@/lib/actions/rewards";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockCheckIn = vi.mocked(prisma.weeklyCheckIn.findUnique);
const mockReward = vi.mocked(prisma.reward.findUnique);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("claimReward", () => {
  it("throws when session is null", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    await expect(claimReward("r1")).rejects.toThrow("Not authenticated");
  });

  it("throws when no check-in response exists", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCheckIn.mockResolvedValueOnce(null as never);
    await expect(claimReward("r1")).rejects.toThrow(
      "You must respond to your weekly check-in before claiming rewards",
    );
  });

  it("throws when reward is not found", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCheckIn.mockResolvedValueOnce({ response: "yes" } as never);
    mockReward.mockResolvedValueOnce(null as never);
    await expect(claimReward("r1")).rejects.toThrow("Reward not found");
  });

  it("throws when reward is inactive", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCheckIn.mockResolvedValueOnce({ response: "yes" } as never);
    mockReward.mockResolvedValueOnce({ active: false } as never);
    await expect(claimReward("r1")).rejects.toThrow("Reward not found");
  });

  it("throws when max redemptions reached", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    mockCheckIn.mockResolvedValueOnce({ response: "yes" } as never);
    mockReward.mockResolvedValueOnce({
      active: true,
      maxRedemptions: 5,
      _count: { redemptions: 5 },
    } as never);
    await expect(claimReward("r1")).rejects.toThrow(
      "This reward has been fully claimed",
    );
  });
});
