const prisma = require("../../../configs/config");

class ProductRepository {
  //   async createProduct(data) {
  //     return await prisma.product.create({
  //       data: {
  //         ...data,
  //       },
  //     });
  //   }

  async findAllProducts() {
    return await prisma.product.findMany();
  }

  async findProductByCategory(categoryProductId) {
    return await prisma.product.findMany({
      where: {
        category_product_id: categoryProductId,
      },
    });
  }

  async findProductById(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
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
}

module.exports = new ProductRepository();
