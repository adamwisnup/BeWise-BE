const prisma = require("../../configs/config");

const seedProducts = async () => {
  await prisma.product.createMany({
    data: [
      {
        id: 1,
        name: "Sari Roti Roti Tawar Jumbo Special",
        brand: "Sari Roti",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Sari%20Roti%20Roti%20Tawar%20Jumbo%20Special.png?updatedAt=1729147397045",
        category_product_id: 7,
        nutrition_fact_id: 1,
        barcode: "8992907953270",
        price_a: 17000,
        price_b: 19000,
        label_id: 2,
      },
      {
        id: 2,
        name: "Sari Roti Sandwich Coklat",
        brand: "Sari Roti",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Sari%20Roti%20Sandwich%20Coklat.png?updatedAt=1729147637007",
        category_product_id: 7,
        nutrition_fact_id: 2,
        barcode: "8992907952327",
        price_a: 5000,
        price_b: 7000,
        label_id: 3,
      },
      {
        id: 3,
        name: "Sari Roti Sobek Coklat",
        brand: "Sari Roti",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Sari%20Roti%20Sobek%20Coklat.png?updatedAt=1729147839693",
        category_product_id: 7,
        nutrition_fact_id: 3,
        barcode: "8992907710019",
        price_a: 17000,
        price_b: 19000,
        label_id: 3,
      },
    ],
  });
};

module.exports = { seedProducts };
