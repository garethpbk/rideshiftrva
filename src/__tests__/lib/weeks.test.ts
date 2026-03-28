import { describe, it, expect } from "vitest";
import {
  getCurrentWeekKey,
  getWeekDateRange,
  getModeLabel,
  calculateStreak,
} from "@/lib/weeks";

describe("getCurrentWeekKey", () => {
  it("returns string matching format YYYY-WNN", () => {
    const key = getCurrentWeekKey();
    expect(key).toMatch(/^\d{4}-W\d{2}$/);
  });
});

describe("getWeekDateRange", () => {
  it("returns monday that is a Monday", () => {
    const { monday } = getWeekDateRange("2026-W01");
    expect(monday.getUTCDay()).toBe(1);
  });

  it("returns sunday that is a Sunday", () => {
    const { sunday } = getWeekDateRange("2026-W01");
    expect(sunday.getDay()).toBe(0);
  });

  it("monday is before sunday", () => {
    const { monday, sunday } = getWeekDateRange("2026-W01");
    expect(monday.getTime()).toBeLessThan(sunday.getTime());
  });
});

describe("getModeLabel", () => {
  it('returns "Bike" for "bike"', () => {
    expect(getModeLabel("bike")).toBe("Bike");
  });

  it('returns "Bus" for "bus"', () => {
    expect(getModeLabel("bus")).toBe("Bus");
  });

  it('returns "Carpool" for "carpool"', () => {
    expect(getModeLabel("carpool")).toBe("Carpool");
  });

  it('returns "Walk" for "walk"', () => {
    expect(getModeLabel("walk")).toBe("Walk");
  });

  it('returns "Scooter" for "scooter"', () => {
    expect(getModeLabel("scooter")).toBe("Scooter");
  });

  it("returns raw string for unknown mode", () => {
    expect(getModeLabel("skateboard")).toBe("skateboard");
  });
});

describe("calculateStreak", () => {
  it("returns 0 for empty array", () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 0 when most recent check-in is "no"', () => {
    expect(calculateStreak([{ weekKey: "2026-W13", response: "no" }])).toBe(0);
  });

  it('returns 1 for single "yes" check-in', () => {
    expect(calculateStreak([{ weekKey: "2026-W13", response: "yes" }])).toBe(1);
  });

  it('returns 3 for three consecutive "yes" weeks', () => {
    const checkIns = [
      { weekKey: "2026-W13", response: "yes" },
      { weekKey: "2026-W12", response: "yes" },
      { weekKey: "2026-W11", response: "yes" },
    ];
    expect(calculateStreak(checkIns)).toBe(3);
  });

  it('breaks streak on "no" response', () => {
    const checkIns = [
      { weekKey: "2026-W13", response: "yes" },
      { weekKey: "2026-W12", response: "no" },
      { weekKey: "2026-W11", response: "yes" },
    ];
    expect(calculateStreak(checkIns)).toBe(1);
  });

  it("breaks streak on gap in weeks", () => {
    const checkIns = [
      { weekKey: "2026-W13", response: "yes" },
      { weekKey: "2026-W11", response: "yes" },
    ];
    expect(calculateStreak(checkIns)).toBe(1);
  });
});
