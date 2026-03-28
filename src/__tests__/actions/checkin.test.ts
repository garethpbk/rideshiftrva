import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    weeklyCheckIn: { update: vi.fn() },
  },
}));

import { submitFeedback } from "@/lib/actions/checkin";
import { prisma } from "@/lib/prisma";

const mockUpdate = vi.mocked(prisma.weeklyCheckIn.update);

describe("submitFeedback", () => {
  it("calls prisma.weeklyCheckIn.update with correct params", async () => {
    mockUpdate.mockResolvedValueOnce({} as never);
    await submitFeedback("checkin-123", "Great week!");
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "checkin-123" },
      data: { feedback: "Great week!" },
    });
  });
});
