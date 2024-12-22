const prisma = require("../../../configs/config");

class AdminRepository {
  async findAdminByEmail(email) {
    return await prisma.admin.findUnique({
      where: { email },
    });
  }

  async findAllProducts(page, limit) {
    const skip = (page - 1) * limit;
    return await prisma.product.findMany({
      skip,
      take: limit,
      include: {
        label: true,
        nutritionFact: true,
        categoryProduct: true,
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
        nutritionFact: true,
        categoryProduct: true,
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

  async findProductByBarcode(barcode) {
    return await prisma.product.findUnique({
      where: {
        barcode: barcode,
      },
    });
  }

  async createProduct(data) {
    console.log("Data diterima di AdminRepository:", data);

    const { id, ...newData } = data;

    return await prisma.product.create({
      data: newData,
    });
  }

  // async updateProduct(productId, updateData) {
  //   return await prisma.product.update({
  //     where: {
  //       id: parseInt(productId),
  //     },
  //     data: updateData,
  //   });
  // }
}

module.exports = new AdminRepository();
