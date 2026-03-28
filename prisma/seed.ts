import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing seed rewards
  await prisma.reward.deleteMany({});

  // Seed rewards spanning the current month and next month
  const now = new Date();
  const validFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const validTo = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const rewards = [
    {
      title: "50% off your first recording sessions",
      description:
        "Get 50% off your first recording session at West Broad Studios. Mention RideShift RVA when you book.",
      businessName: "West Broad Studios",
      couponCode: "RIDESHIFT-WBS50",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "10% off",
      description:
        "10% off your purchase at Rushing Blooms. Show your RideShift confirmation at checkout.",
      businessName: "Rushing Blooms",
      couponCode: "RIDESHIFT-BLOOMS10",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "10% off",
      description:
        "10% off your purchase at Moulton Hot Natives. Show your RideShift confirmation at checkout.",
      businessName: "Moulton Hot Natives",
      couponCode: "RIDESHIFT-MOULTON10",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "$50 gift card raffle",
      description:
        "You're entered in a raffle for a $100 gift card. Winners drawn weekly.",
      businessName: "$50 gift card raffle",
      couponCode: null,
      validFrom,
      validTo,
      active: true,
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.create({ data: reward });
  }

  console.log(
    `Seeded ${rewards.length} rewards (valid ${validFrom.toLocaleDateString()} - ${validTo.toLocaleDateString()})`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
