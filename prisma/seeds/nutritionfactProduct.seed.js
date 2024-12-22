const prisma = require("../../configs/config");

const seedNutritionfactProducts = async () => {
  await prisma.nutritionFact.createMany({
    data: [
      {
        id: 1,
        energy: 200,
        saturated_fat: 1.5,
        sugar: 4,
        sodium: 0.28,
        protein: 6,
        fiber: 0,
        fruit_vegetable: 0,
      },
      {
        id: 2,
        energy: 150,
        saturated_fat: 2.5,
        sugar: 4,
        sodium: 0.125,
        protein: 3,
        fiber: 0,
        fruit_vegetable: 0,
      },
      {
        id: 3,
        energy: 350,
        saturated_fat: 5,
        sugar: 19,
        sodium: 0.29,
        protein: 8,
        fiber: 0,
        fruit_vegetable: 0,
      },
    ],
  });
};

module.exports = { seedNutritionfactProducts };
