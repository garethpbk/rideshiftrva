import { describe, it, expect } from "vitest";
import { calculateImpact } from "@/lib/impact";

describe("calculateImpact", () => {
  it("returns all zeros for empty array", () => {
    expect(calculateImpact([])).toEqual({
      tripsAvoided: 0,
      milesSaved: 0,
      co2SavedLbs: 0,
    });
  });

  it('returns all zeros when all responses are "no"', () => {
    const result = calculateImpact([
      { response: "no", goalSnapshot: [{ daysPerWeek: 3 }] },
    ]);
    expect(result).toEqual({
      tripsAvoided: 0,
      milesSaved: 0,
      co2SavedLbs: 0,
    });
  });

  it("returns all zeros when all responses are null", () => {
    const result = calculateImpact([
      { response: null, goalSnapshot: [{ daysPerWeek: 3 }] },
    ]);
    expect(result).toEqual({
      tripsAvoided: 0,
      milesSaved: 0,
      co2SavedLbs: 0,
    });
  });

  it('single "yes" check-in with one goal of 3 days/week', () => {
    const result = calculateImpact([
      { response: "yes", goalSnapshot: [{ daysPerWeek: 3 }] },
    ]);
    expect(result.tripsAvoided).toBe(3);
    expect(result.milesSaved).toBe(36);
    expect(result.co2SavedLbs).toBe(32);
  });

  it('multiple "yes" check-ins accumulate correctly', () => {
    const result = calculateImpact([
      { response: "yes", goalSnapshot: [{ daysPerWeek: 3 }] },
      { response: "yes", goalSnapshot: [{ daysPerWeek: 2 }] },
    ]);
    expect(result.tripsAvoided).toBe(5);
    expect(result.milesSaved).toBe(60);
  });

  it('mixed responses: only counts "yes" check-ins', () => {
    const result = calculateImpact([
      { response: "yes", goalSnapshot: [{ daysPerWeek: 3 }] },
      { response: "no", goalSnapshot: [{ daysPerWeek: 5 }] },
      { response: "yes", goalSnapshot: [{ daysPerWeek: 2 }] },
    ]);
    expect(result.tripsAvoided).toBe(5);
    expect(result.milesSaved).toBe(60);
  });
});
