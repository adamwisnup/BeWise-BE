const prisma = require("../../../configs/config");

class ProductRepository {
  //   async createProduct(data) {
  //     return await prisma.product.create({
  //       data: {
  //         ...data,
  //       },
  //     });
  //   }

  async findAllProducts(page, limit) {
    const skip = (page - 1) * limit;
    return await prisma.product.findMany({
      skip,
      take: limit,
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
      },
    });
  }

  //   async updateProduct(productId, updateData) {
  //     return await prisma.product.update({
  //       where: {
  //         id: parseInt(productId),
  //       },
  //       data: updateData,
  //     });
  //   }

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
        nutritionFact: true,
        categoryProduct: true,
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
      },
    });

    return product;
  }
}

module.exports = new ProductRepository();
