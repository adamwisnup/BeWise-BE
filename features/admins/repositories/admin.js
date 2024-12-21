const prisma = require("../../../configs/config");

class AdminRepository {
  async findAdminByEmail(email) {
    return await prisma.admin.findUnique({
      where: { email },
    });
  }

  async findProductById(productId) {
    return await prisma.product.findUnique({
      where: { id: productId },
    });
  }
}

module.exports = new AdminRepository();
