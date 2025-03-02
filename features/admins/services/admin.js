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
    const validPage = Math.max(parseInt(page, 10) || 1, 1);
    const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalProducts = await AdminRepository.countTotalProducts();
    const totalPages = Math.ceil(totalProducts / validLimit);
    const currentPage = Math.min(validPage, totalPages);

    const skip = Math.max((currentPage - 1) * validLimit, 0);

    const products = await AdminRepository.findAllProducts(skip, validLimit);

    const productsWithQuantity = products.map((product) => ({
      ...product,
    }));

    return {
      products: productsWithQuantity,
      totalProducts,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
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

  async addProduct(productData) {
    const {
      name,
      brand,
      photo,
      category_product_id,
      nutrition_fact_data,
      barcode,
      price_a,
      price_b,
    } = productData;

    const nutritionFact = await AdminRepository.createNutritionFact(
      nutrition_fact_data
    );

    const product = await AdminRepository.createProduct({
      name,
      brand,
      photo,
      category_product_id,
      nutrition_fact_id: nutritionFact.id,
      barcode,
      price_a,
      price_b,
    });

    const mlResponse = await axios.post(
      "https://ml-api.example.com/nutri-score",
      nutrition_fact_data
    );
    const { nutri_score, label_name, label_link } = mlResponse.data;

    const label = await AdminRepository.findOrCreateLabel(
      label_name,
      label_link
    );

    await AdminRepository.updateProductWithNutriScoreAndLabel(
      product.id,
      nutri_score,
      label.id
    );

    return {
      ...product,
      nutri_score,
      label,
    };
  }
}

module.exports = new AdminService();
