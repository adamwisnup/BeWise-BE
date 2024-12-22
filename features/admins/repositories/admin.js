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

  async createProduct(data) {
    console.log("Data diterima di AdminRepository:", data);

    return await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        photo: data.photo,
        barcode: data.barcode,
        price_a: data.price_a,
        price_b: data.price_b,
        category_product_id: data.category_product_id,
        nutrition_fact_id: data.nutrition_fact_id,
        label_id: data.label_id,
      },
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
