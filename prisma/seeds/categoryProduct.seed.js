const prisma = require("../../configs/config");

const seedCategoryProducts = async () => {
  await prisma.categoryProduct.createMany({
    data: [
      {
        id: 1,
        name: "Kopi",
      },
      {
        id: 2,
        name: "Teh",
      },
      {
        id: 3,
        name: "Isotonik",
      },
      {
        id: 4,
        name: "Jus",
      },
      {
        id: 5,
        name: "Snack",
      },
      {
        id: 6,
        name: "Wafer & Biskuit",
      },
      {
        id: 7,
        name: "Roti",
      },
      {
        id: 8,
        name: "Mie",
      },
      {
        id: 9,
        name: "Frozen Food",
      },
      {
        id: 10,
        name: "Susu",
      },
      {
        id: 11,
        name: "Air Mineral",
      },
    ],
  });
};

module.exports = { seedCategoryProducts };
