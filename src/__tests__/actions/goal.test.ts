import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    goal: { upsert: vi.fn() },
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { upsertGoal } from "@/lib/actions/goal";
import { auth } from "@/lib/auth";

const mockAuth = vi.mocked(auth);

function makeFormData(goals: unknown): FormData {
  const fd = new FormData();
  fd.set("goals", JSON.stringify(goals));
  return fd;
}

describe("upsertGoal", () => {
  it("throws when not authenticated", async () => {
    mockAuth.mockResolvedValueOnce(null as never);
    const fd = makeFormData([{ mode: "bike", daysPerWeek: 3 }]);
    await expect(upsertGoal(fd)).rejects.toThrow("Not authenticated");
  });

  it("throws on invalid mode", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const fd = makeFormData([{ mode: "skateboard", daysPerWeek: 3 }]);
    await expect(upsertGoal(fd)).rejects.toThrow("Invalid mode: skateboard");
  });

  it("throws on daysPerWeek outside 1-7 range (too low)", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const fd = makeFormData([{ mode: "bike", daysPerWeek: 0 }]);
    await expect(upsertGoal(fd)).rejects.toThrow("Days must be 1-7");
  });

  it("throws on daysPerWeek outside 1-7 range (too high)", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const fd = makeFormData([{ mode: "bike", daysPerWeek: 8 }]);
    await expect(upsertGoal(fd)).rejects.toThrow("Days must be 1-7");
  });

  it("throws on duplicate modes", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const fd = makeFormData([
      { mode: "bike", daysPerWeek: 3 },
      { mode: "bike", daysPerWeek: 2 },
    ]);
    await expect(upsertGoal(fd)).rejects.toThrow("Duplicate mode: bike");
  });

  it("throws on empty goals array", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "u1" } } as never);
    const fd = makeFormData([]);
    await expect(upsertGoal(fd)).rejects.toThrow(
      "At least one goal is required",
    );
  });
});
