const AdminRepository = require("../repositories/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

class AdminService {
  async login(data) {
    const { email, password } = data;

    if (!email) {
      throw new Error("Email wajib diisi");
    }

    if (!password) {
      throw new Error("Password wajib diisi");
    }

    const admin = await AdminRepository.findAdminByEmail(email);
    if (!admin) {
      throw new Error("Email atau password salah");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("Email atau password salah");
    }

    delete admin.password;

    const token = jwt.sign(
      { userId: admin.id, email: admin.email },
      JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return { token, admin };
  }

  async findAllProducts(page = 1, limit = 10) {
    const products = await AdminRepository.findAllProducts(page, limit);

    return { products };
  }

  async findProductByCategory(categoryProductId, page = 1, limit = 10) {
    const products = await AdminRepository.findProductByCategory(
      categoryProductId,
      page,
      limit
    );

    if (!products) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return { products };
  }

  async findProductById(productId) {
    const product = await AdminRepository.findProductById(productId);

    if (!product) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return { product };
  }

  async createProduct(data) {
    console.log("Data diterima di ProductService:", data);

    const requiredFields = [
      "name",
      "brand",
      "photo",
      "barcode",
      "price_a",
      "price_b",
      "category_product_id",
      "nutrition_fact_id",
      "label_id",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} wajib diisi`);
      }
    }

    const existingProduct = await AdminRepository.findProductByBarcode(
      data.barcode
    );
    if (existingProduct) {
      throw new Error("Produk dengan barcode tersebut sudah ada.");
    }

    const product = await AdminRepository.createProduct(data);

    return product;
  }

  // async updateProduct(productId, data) {
  //   const product = await AdminRepository.findProductById(productId);

  //   if (!product) {
  //     throw new Error("Produk tidak ditemukan");
  //   }

  //   const updatedProduct = await AdminRepository.updateProduct(productId, {
  //     ...data,
  //   });

  //   return { updatedProduct };
  // }
}

module.exports = new AdminService();
