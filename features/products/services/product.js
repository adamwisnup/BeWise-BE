const ProductRepository = require("../repositories/product");
const HistoryRepository = require("../../histories/repositories/history");
const axios = require("axios");
const imagekit = require("../../../libs/imagekit");
const path = require("path");

class ProductService {
  async findAllProducts(page = 1, limit = 10) {
    const products = await ProductRepository.findAllProducts(page, limit);

    return { products };
  }

  async findProductByCategory(categoryProductId, page = 1, limit = 10) {
    const products = await ProductRepository.findProductByCategory(
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
    const product = await ProductRepository.findProductById(productId);

    if (!product) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return { product };
  }

  //   async updateProduct(productId, data) {
  //     const product = await ProductRepository.findProductById(productId);

  //     if (!product) {
  //       throw new Error("Produk tidak ditemukan");
  //     }

  //     const updatedProduct = await ProductRepository.updateProduct(productId, {
  //       ...data,
  //     });

  //     return { updatedProduct };
  //   }

  async deleteProduct(productId) {
    const product = await ProductRepository.findProductById(productId);

    if (!product) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    await ProductRepository.deleteProduct(productId);

    return { message: "Produk berhasil dihapus" };
  }

  async searchProducts(name, page = 1, limit = 10) {
    if (!name) {
      const error = new Error("Nama produk tidak boleh kosong");
      error.statusCode = 400;
      throw error;
    }

    const products = await ProductRepository.searchProducts(name, page, limit);

    if (products.length === 0) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return products;
  }

  async scanProduct(userId, barcode) {
    if (!barcode) {
      const error = new Error("Barcode tidak boleh kosong");
      error.statusCode = 400;
      throw error;
    }

    const product = await ProductRepository.findProductByBarcode(barcode);

    if (!product) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    await HistoryRepository.createHistory(userId, product.id);

    const recommendedProducts = await ProductRepository.findRecommendedProducts(
      product.label_id,
      product.category_product_id,
      product.id
    );

    return { product, recommendedProducts };
  }

  async getTopChoiceProducts() {
    const products = await ProductRepository.findTopChoiceProducts();

    if (!products || products.length === 0) {
      const error = new Error("Tidak ada produk dengan label_id 1.");
      error.statusCode = 404;
      throw error;
    }

    return products.sort(() => Math.random() - 0.5).slice(0, 5);
  }

  async addFoodProduct(data) {
    const {
      name,
      brand,
      photo,
      category_product_id,
      barcode,
      price_a,
      price_b,
      nutritionFact,
    } = data;

    // Step 1: Hit API ML untuk mendapatkan nutri_score dan category
    const mlResponse = await axios.post(
      "https://ml-bewise.up.railway.app/calculate-nutri-score/food",
      [{ nutritionFact }]
    );

    const { category: label_id, nutri_score } = mlResponse.data[0];

    // Step 2: Simpan nutritionFact ke tabel NutritionFact
    const nutritionFactRecord = await ProductRepository.createNutritionFact(
      nutritionFact
    );

    // Step 3: Simpan produk ke tabel Product
    const product = await ProductRepository.createProduct({
      name,
      brand,
      photo,
      category_product_id,
      barcode,
      price_a,
      price_b,
      nutri_score,
      label_id: parseInt(label_id, 10),
      nutrition_fact_id: nutritionFactRecord.id,
    });

    return product;
  }

  async addBeverageProduct(data) {
    const {
      name,
      brand,
      photo,
      category_product_id,
      barcode,
      price_a,
      price_b,
      nutritionFact,
    } = data;

    // Step 1: Hit API ML untuk mendapatkan nutri_score dan category
    const mlResponse = await axios.post(
      "https://ml-bewise.up.railway.app/calculate-nutri-score/beverages",
      [{ nutritionFact }]
    );

    const { label_id, nutri_score } = mlResponse.data[0];

    // Step 2: Simpan nutritionFact ke tabel NutritionFact
    const nutritionFactRecord = await ProductRepository.createNutritionFact(
      nutritionFact
    );

    // Step 3: Simpan produk ke tabel Product
    const product = await ProductRepository.createProduct({
      name,
      brand,
      photo,
      category_product_id,
      barcode,
      price_a,
      price_b,
      nutri_score,
      label_id: parseInt(label_id, 10),
      nutrition_fact_id: nutritionFactRecord.id,
    });

    return product;
  }

  // async addProduct(data, avatar) {
  //   const fileBase64 = avatar.buffer.toString("base64");
  //   const {
  //     name,
  //     brand,
  //     category_product_id,
  //     barcode,
  //     price_a,
  //     price_b,
  //     nutritionFact,
  //   } = data;

  //   const response = await imagekit.upload({
  //     fileName: Date.now() + path.extname(avatar.originalname),
  //     file: fileBase64,
  //     folder: "BeWise/Products",
  //   });
  //   const fileUrl = response.url;

  //   // Step 1: Hit API ML untuk mendapatkan nutri_score dan category
  //   const mlResponse = await axios.post(
  //     "https://ml-bewise.up.railway.app/calculate-nutri-score/food",
  //     [{ nutritionFact }]
  //   );

  //   const { category: label_id, nutri_score } = mlResponse.data[0];

  //   // Step 2: Simpan nutritionFact ke tabel NutritionFact
  //   const nutritionFactRecord = await ProductRepository.createNutritionFact(
  //     nutritionFact
  //   );

  //   // Step 3: Simpan produk ke tabel Product
  //   const product = await ProductRepository.createProduct({
  //     name,
  //     brand,
  //     photo: fileUrl, // Menggunakan URL foto yang diunggah
  //     category_product_id,
  //     barcode,
  //     price_a,
  //     price_b,
  //     nutri_score,
  //     label_id: parseInt(label_id, 10),
  //     nutrition_fact_id: nutritionFactRecord.id,
  //   });

  //   return product;
  // }

  async findAllCategoryProduct() {
    const categories = await ProductRepository.findAllCategoryProduct();

    return { categories };
  }
}
module.exports = new ProductService();
