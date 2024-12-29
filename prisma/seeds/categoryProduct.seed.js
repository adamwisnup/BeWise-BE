const prisma = require("../../configs/config");

const seedCategoryProducts = async () => {
  await prisma.categoryProduct.createMany({
    data: [
      {
        id: 1,
        name: "Kopi",
        type: "BEVERAGE",
      },
      {
        id: 2,
        name: "Teh",
        type: "BEVERAGE",
      },
      {
        id: 3,
        name: "Isotonik",
        type: "BEVERAGE",
      },
      {
        id: 4,
        name: "Jus",
        type: "BEVERAGE",
      },
      {
        id: 5,
        name: "Air Mineral",
        type: "BEVERAGE",
      },
      {
        id: 6,
        name: "Susu",
        type: "BEVERAGE",
      },
      {
        id: 7,
        name: "Roti",
        type: "FOOD",
      },
      {
        id: 8,
        name: "Mie",
        type: "FOOD",
      },
      {
        id: 9,
        name: "Frozen Food",
        type: "FOOD",
      },
      {
        id: 10,
        name: "Wafer & Biskuit",
        type: "FOOD",
      },
      {
        id: 11,
        name: "Snack",
        type: "FOOD",
      },
    ],
  });
};

module.exports = { seedCategoryProducts };
