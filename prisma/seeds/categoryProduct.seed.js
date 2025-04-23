const prisma = require("../../configs/config");

const seedCategoryProducts = async () => {
  await prisma.categoryProduct.createMany({
    data: [
      {
        id: 1,
        name: "Roti",
        type: "FOOD",
      },
      {
        id: 2,
        name: "Wafer & Biskuit",
        type: "FOOD",
      },
      {
        id: 3,
        name: "Frozen Food",
        type: "FOOD",
      },
      {
        id: 4,
        name: "Mie",
        type: "FOOD",
      },
      {
        id: 5,
        name: "Snack",
        type: "FOOD",
      },
      {
        id: 6,
        name: "Sereal",
        type: "FOOD",
      },
      {
        id: 7,
        name: "Soda",
        type: "BEVERAGE",
      },
      {
        id: 8,
        name: "Kopi",
        type: "BEVERAGE",
      },
      {
        id: 9,
        name: "Yogurt",
        type: "BEVERAGE",
      },
      {
        id: 10,
        name: "Susu",
        type: "BEVERAGE",
      },
      {
        id: 11,
        name: "Jus",
        type: "BEVERAGE",
      },
      {
        id: 12,
        name: "Isotonik",
        type: "BEVERAGE",
      },
      {
        id: 13,
        name: "Air Mineral",
        type: "BEVERAGE",
      },
      {
        id: 14,
        name: "Teh",
        type: "BEVERAGE",
      },
    ],
  });
};

module.exports = { seedCategoryProducts };
