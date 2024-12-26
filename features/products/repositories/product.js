const prisma = require("../../../configs/config");

class ProductRepository {
  async findAllProducts(page, limit) {
    const skip = (page - 1) * limit;
    return await prisma.product.findMany({
      skip,
      take: limit,
      include: {
        label: true,
      },
    });
  }

  async findProductByCategory(categoryProductId, page, limit) {
    const skip = (page - 1) * limit;
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
}

module.exports = new ProductRepository();
