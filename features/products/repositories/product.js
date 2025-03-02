const prisma = require("../../../configs/config");

class ProductRepository {
  async findAllProducts(page, limit) {
    const skip = Math.max((page - 1) * limit, 0);

    return await prisma.product.findMany({
      skip,
      take: limit,
      include: {
        label: true,
      },
    });
  }

  async countTotalProducts() {
    return await prisma.product.count();
  }

  async findProductByCategory(categoryProductId, page, limit) {
    const skip = Math.max((page - 1) * limit, 0);
    return await prisma.product.findMany({
      skip,
      take: limit,
      where: {
        category_product_id: categoryProductId,
      },
      include: {
        label: true,
      },
    });
  }

  async findProductById(productId) {
    return await prisma.product.findUnique({
      where: {
        id: parseInt(productId, 10),
      },
      include: {
        categoryProduct: true,
        nutritionFact: true,
        label: true,
      },
    });
  }

  async deleteProduct(productId) {
    return await prisma.product.delete({
      where: {
        id: parseInt(productId),
      },
    });
  }

  async searchProducts(name, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return await prisma.product.findMany({
      skip,
      take: limit,
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      include: {
        label: true,
      },
    });
  }

  async findProductByBarcode(barcode) {
    const product = await prisma.product.findFirst({
      where: {
        barcode: barcode,
      },
      include: {
        nutritionFact: true,
        categoryProduct: true,
        label: true,
      },
    });

    return product;
  }

  async findRecommendedProducts(
    currentLabelId,
    categoryProductId,
    scannedProductId
  ) {
    return await prisma.product.findMany({
      where: {
        label_id: {
          lte: currentLabelId,
        },
        category_product_id: categoryProductId,
        NOT: {
          id: scannedProductId,
        },
      },
      orderBy: {
        label_id: "asc",
      },
      include: {
        label: true,
      },
    });
  }

  async findTopChoiceProducts() {
    return await prisma.product.findMany({
      where: {
        label_id: 1,
      },
      orderBy: {
        label_id: "asc",
      },
      take: 5,
      include: {
        label: true,
      },
    });
  }

  async findLabelByName(name) {
    return prisma.label.findFirst({ where: { name } });
  }

  async createNutritionFact(nutritionFact) {
    return prisma.nutritionFact.create({ data: nutritionFact });
  }

  async createBeverageProduct(productData) {
    const { label_id, category_product_id, nutrition_fact_id, ...rest } =
      productData;

    // Pastikan ID valid
    if (
      isNaN(label_id) ||
      isNaN(category_product_id) ||
      isNaN(nutrition_fact_id)
    ) {
      throw new Error("Invalid IDs provided.");
    }

    return prisma.product.create({
      data: {
        ...rest,
        label: {
          connect: { id: label_id },
        },
        categoryProduct: {
          connect: { id: category_product_id },
        },
        nutritionFact: {
          connect: { id: nutrition_fact_id },
        },
      },
    });
  }

  async createProduct(productData) {
    return prisma.product.create({ data: productData });
  }

  async findAllCategoryProduct() {
    return prisma.categoryProduct.findMany();
  }

 async updateProduct(productId, updateData) {
    return await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: updateData,
    });
  }

  async deleteProductById(productId) {
    return await prisma.product.delete({
      where: { id: parseInt(productId, 10) },
    });
  }

  async updateNutritionFact(id, nutritionFact) {
    return prisma.nutritionFact.update({
      where: { id: parseInt(id, 10) },
      data: nutritionFact,
    });
  }
}

module.exports = new ProductRepository();
