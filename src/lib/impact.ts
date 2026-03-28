const AVG_COMMUTE_MILES = 12;
const CO2_LBS_PER_MILE = 0.89;

interface CheckInForImpact {
  response: string | null;
  goalSnapshot: Array<{ daysPerWeek: number }>;
}

export function calculateImpact(checkIns: CheckInForImpact[]) {
  let tripsAvoided = 0;
  for (const ci of checkIns) {
    if (ci.response !== "yes") continue;
    for (const g of ci.goalSnapshot) {
      tripsAvoided += g.daysPerWeek;
    }
  }
  const milesSaved = tripsAvoided * AVG_COMMUTE_MILES;
  const co2SavedLbs = Math.round(milesSaved * CO2_LBS_PER_MILE * 10) / 10;
  return { tripsAvoided, milesSaved, co2SavedLbs };
}
