const prisma = require("../../configs/config");

const seedSubscriptions = async () => {
  await prisma.subscription.createMany({
    data: [
      {
        id: 1,
        plan_name: "Monthly",
        price: 15000,
        duration: 30,
      },
    ],
  });
};

module.exports = { seedSubscriptions };
