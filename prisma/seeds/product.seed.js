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
        name: "So Good Crispy Chicken Nugget 400g",
        brand: "So Good",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/So%20Good%20Chicken%20Nugget%20Original%20400G.png?updatedAt=1729941840193",
        category_product_id: 9,
        nutrition_fact_id: 4,
        barcode: "8993110002960",
        price_a: 30000,
        price_b: 35000,
        label_id: 1,
      },
      {
        id: 4,
        name: "Hanzel Sosis Cheese Cocktail 360G",
        brand: "Hanzel",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Hanzel%20Sosis%20Cheese%20Cocktail%20360G.jpeg?updatedAt=1729942165965",
        category_product_id: 9,
        nutrition_fact_id: 5,
        barcode: "8997009740421",
        price_a: 32000,
        price_b: 35000,
        label_id: 1,
      },
      {
        id: 5,
        name: "Chitato Snack Potato Chips Mi Goreng 68G",
        brand: "Chitato",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Chitato%20Snack%20Potato%20Chips%20Mi%20Goreng%2068G.png?updatedAt=1729942723508",
        category_product_id: 7,
        nutrition_fact_id: 6,
        barcode: "89686599008",
        price_a: 7000,
        price_b: 9000,
        label_id: 3,
      },
      {
        id: 6,
        name: "Sari Roti Sobek Coklat",
        brand: "Sari Roti",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Roti/Sari%20Roti%20Sobek%20Coklat.jpg?updatedAt=1735108811062",
        category_product_id: 2,
        nutrition_fact_id: 7,
        barcode: "8992907710019",
        price_a: 17000,
        price_b: 19000,
        label_id: 1,
      },
      {
        id: 7,
        name: "Garuda Kacang Atom Pedas 100G",
        brand: "Garuda",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Snack/Garuda%20Kacang%20Atom%20Pedas%20100G.png?updatedAt=1735058568325",
        category_product_id: 5,
        nutrition_fact_id: 8,
        barcode: "8992775210222",
        price_a: 22000,
        price_b: 24000,
        label_id: 1,
      },
      {
        id: 8,
        name: "Ultra Susu Cair Low Fat Hi-Calcium Plain 250mL",
        brand: "Ultra Milk",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Susu/Ultra%20Susu%20Cair%20Low%20Fat%20Hi-Calcium%20Plain%20250mL.png?updatedAt=1735059277279",
        category_product_id: 10,
        nutrition_fact_id: 9,
        barcode: "8998009010262",
        price_a: 8000,
        price_b: 9000,
        label_id: 1,
      },
      {
        id: 9,
        name: "Good Day Coffee Drink Cappuccino 250mL",
        brand: "Good Day",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Kopi/Good%20Day%20Coffee%20Drink%20Cappuccino%20250mL.jpeg?updatedAt=1735059917611",
        category_product_id: 7,
        nutrition_fact_id: 10,
        barcode: "8991002121089",
        price_a: 6000,
        price_b: 8000,
        label_id: 1,
      },
      {
        id: 10,
        name: "Pucuk Harum Minuman Teh Less Sugar 350mL",
        brand: "Pucuk Harum",
        photo:
          "https://ik.imagekit.io/awp2705/BeWise/Products/Teh/Pucuk%20Harum%20Minuman%20Teh%20Less%20Sugar%20350mL.png?updatedAt=1735088835191",
        category_product_id: 2,
        nutrition_fact_id: 11,
        barcode: "8996001600252",
        price_a: 4000,
        price_b: 5000,
        label_id: 1,
      },
    ],
  });
};

module.exports = { seedProducts };
