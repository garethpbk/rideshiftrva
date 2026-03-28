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
      title: "Free drip coffee with any pastry",
      description:
        "Show your RideShift confirmation to get a free drip coffee when you buy any pastry. Valid at all Richmond locations.",
      businessName: "Lamplighter Coffee",
      couponCode: "RIDESHIFT-LAMP",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "10% off bike tune-up",
      description:
        "Get 10% off any bike tune-up or repair service. Just mention RideShift RVA when you drop off your bike.",
      businessName: "Carytown Bicycle Co.",
      couponCode: "RIDESHIFT-BIKE10",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "$5 off brunch",
      description:
        "$5 off any brunch entree, Saturday or Sunday. Cannot be combined with other offers.",
      businessName: "Can Can Brasserie",
      couponCode: "RIDESHIFT-BRUNCH5",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "Free skate rental",
      description:
        "One free skate rental session (up to 2 hours). Show your confirmation at the front desk.",
      businessName: "River City Roll",
      couponCode: "RIDESHIFT-SKATE",
      validFrom,
      validTo,
      active: true,
    },
    {
      title: "Buy one get one free gelato",
      description:
        "Buy any size gelato and get one free. Valid at the Carytown location.",
      businessName: "Gelati Celesti",
      couponCode: "RIDESHIFT-BOGO",
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
