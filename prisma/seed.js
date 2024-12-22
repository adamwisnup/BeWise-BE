const { seedCategoryProducts } = require("./seeds/categoryProduct.seed");
const { seedLabelProducts } = require("./seeds/labelProduct.seed");
const {
  seedNutritionfactProducts,
} = require("./seeds/nutritionfactProduct.seed");
const { seedProducts } = require("./seeds/product.seed");
const { seedSubscriptions } = require("./seeds/subscription.seed");
const { seedAdmin } = require("./seeds/admin.seed");
const { seedNews } = require("./seeds/news.seed");
// const truncateTables = require("./seeds/truncateTables");
// const resetDatabase = require("./seeds/resetDatabase");
const prisma = require("../configs/config");

async function main() {
  try {
    // console.log("Menghapus semua data di database...");
    // await truncateTables();

    // console.log("Mereset database dan migrasi...");
    // await resetDatabase();

    console.log("Seeding Admin...");
    await seedAdmin();

    console.log("Seeding Category Products...");
    await seedCategoryProducts();

    console.log("Seeding Label Products...");
    await seedLabelProducts();

    console.log("Seeding Nutritionfact Products...");
    await seedNutritionfactProducts();

    console.log("Seeding Products...");
    await seedProducts();

    console.log("Seeding Subscriptions...");
    await seedSubscriptions();

    console.log("Seeding News...");
    await seedNews();

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error saat seeding:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
