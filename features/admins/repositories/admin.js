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

  async createNutritionFact(data) {
    return await prisma.nutritionFact.create({
      data,
    });
  }

  async createProduct(productData) {
    return prisma.product.create({
      data: productData,
    });
  }

  async updateProductWithNutriScoreAndLabel(productId, nutriScore, labelId) {
    return prisma.product.update({
      where: { id: productId },
      data: {
        nutri_score: nutriScore,
        label_id: labelId,
      },
    });
  }

  async findOrCreateLabel(labelName, labelLink) {
    let label = await prisma.label.findFirst({
      where: { name: labelName },
    });

    if (!label) {
      label = await prisma.label.create({
        data: {
          name: labelName,
          link: labelLink,
        },
      });
    }

    return label;
  }

  async findRecommendedProducts(
    currentLabelId,
    categoryProductId,
    scannedProductId
  ) {
    return await prisma.product.findMany({
      where: {
        label_id: {
          lte: currentLabelId, // Produk dengan label_id lebih kecil atau sama
        },
        category_product_id: categoryProductId, // Filter berdasarkan kategori produk
        NOT: {
          id: scannedProductId, // Kecualikan produk yang dipindai
        },
      },
      orderBy: {
        label_id: "asc",
      },
      select: {
        id: true,
        name: true,
        brand: true,
        photo: true,
        category_product_id: true,
        nutrition_fact_id: true,
        barcode: true,
        price_a: true,
        price_b: true,
        label_id: true,
        nutri_score: true,
        label: {
          select: {
            id: true,
            name: true,
            link: true,
          },
        },
      },
    });
  }
}

module.exports = new AdminRepository();
