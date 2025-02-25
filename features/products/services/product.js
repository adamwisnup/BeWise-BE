const ProductRepository = require("../repositories/product");
const HistoryRepository = require("../../histories/repositories/history");
const axios = require("axios");
const imagekit = require("../../../libs/imagekit");
const path = require("path");

class ProductService {
  async findAllProducts(page = 1, limit = 10) {
    const validPage = Math.max(parseInt(page, 10) || 1, 1);
    const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalProducts = await ProductRepository.countTotalProducts();
    const totalPages = Math.ceil(totalProducts / validLimit);
    const currentPage = Math.min(validPage, totalPages);

    const skip = Math.max((currentPage - 1) * validLimit, 0);

    const products = await ProductRepository.findAllProducts(skip, validLimit);

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
    const validPage = Math.max(parseInt(page, 10) || 1, 1);
    const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalProducts = await ProductRepository.countTotalProducts();
    const totalPages = Math.ceil(totalProducts / validLimit);
    const currentPage = Math.min(validPage, totalPages);

    const skip = Math.max((currentPage - 1) * validLimit, 0);

    const products = await ProductRepository.findProductByCategory(
      categoryProductId,
      skip,
      validLimit
    );

    // if (!products) {
    //   const error = new Error("Produk tidak ditemukan");
    //   error.statusCode = 404;
    //   throw error;
    // }

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

  async addFoodProduct(data, avatar) {
    try {
      const {
        name,
        brand,
        category_product_id,
        barcode,
        price_a,
        price_b,
        nutritionFact,
      } = data;

      if (!avatar) {
        throw new Error("File foto tidak ada!");
      }

      const fileBase64 = avatar.buffer.toString("base64");

      let folderPath;
      switch (parseInt(category_product_id, 10)) {
        case 1:
          folderPath = `BeWise/Products/Kopi`;
          break;
        case 2:
          folderPath = `BeWise/Products/Teh`;
          break;
        case 3:
          folderPath = `BeWise/Products/Isotonik`;
          break;
        case 4:
          folderPath = `BeWise/Products/Jus`;
          break;
        case 5:
          folderPath = `BeWise/Products/Air_Mineral`;
          break;
        case 6:
          folderPath = `BeWise/Products/Susu`;
          break;
        case 7:
          folderPath = `BeWise/Products/Roti`;
          break;
        case 8:
          folderPath = `BeWise/Products/Mie`;
          break;
        case 9:
          folderPath = `BeWise/Products/Frozen_Food`;
          break;
        case 10:
          folderPath = `BeWise/Products/Wafer_Biskuit`;
          break;
        default:
          folderPath = `BeWise/Products/Other`;
      }

      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(avatar.originalname),
        file: fileBase64,
        folder: folderPath,
      });

      const photoUrl = response.url;

      const mlResponse = await axios.post(
        "https://ml-bewise.up.railway.app/calculate-nutri-score/food",
        [{ nutritionFact }]
      );

      const { category: label_id, nutri_score } = mlResponse.data[0];

      const nutritionFactRecord = await ProductRepository.createNutritionFact(
        nutritionFact
      );

      const product = await ProductRepository.createProduct({
        name,
        brand,
        photo: photoUrl,
        category_product_id: parseInt(category_product_id, 10),
        barcode,
        price_a: parseFloat(price_a),
        price_b: parseFloat(price_b),
        nutri_score,
        label_id: parseInt(label_id, 10),
        nutrition_fact_id: nutritionFactRecord.id,
      });

      return product;
    } catch (error) {
      console.error("Error dalam addFoodProduct:", error);
      throw new Error("Gagal menambahkan produk: " + error.message);
    }
  }

  async addBeverageProduct(data, avatar) {
    try {
      const {
        name,
        brand,
        category_product_id,
        barcode,
        price_a,
        price_b,
        nutritionFact,
      } = data;

      if (!avatar) {
        throw new Error("File foto tidak ada!");
      }

      const fileBase64 = avatar.buffer.toString("base64");

      let folderPath;
      switch (parseInt(category_product_id, 10)) {
        case 1:
          folderPath = `BeWise/Products/Kopi`;
          break;
        case 2:
          folderPath = `BeWise/Products/Teh`;
          break;
        case 3:
          folderPath = `BeWise/Products/Isotonik`;
          break;
        case 4:
          folderPath = `BeWise/Products/Jus`;
          break;
        case 5:
          folderPath = `BeWise/Products/Air_Mineral`;
          break;
        case 6:
          folderPath = `BeWise/Products/Susu`;
          break;
        case 7:
          folderPath = `BeWise/Products/Roti`;
          break;
        case 8:
          folderPath = `BeWise/Products/Mie`;
          break;
        case 9:
          folderPath = `BeWise/Products/Frozen_Food`;
          break;
        case 10:
          folderPath = `BeWise/Products/Wafer_Biskuit`;
          break;
        default:
          folderPath = `BeWise/Products/Other`;
      }

      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(avatar.originalname),
        file: fileBase64,
        folder: folderPath,
      });

      const photoUrl = response.url;

      const mlResponse = await axios.post(
        "https://ml-bewise.up.railway.app/calculate-nutri-score/beverages",
        [{ nutritionFact }]
      );

      const { label_id, nutri_score } = mlResponse.data[0];

      const nutritionFactRecord = await ProductRepository.createNutritionFact(
        nutritionFact
      );

      const product = await ProductRepository.createProduct({
        name,
        brand,
        photo: photoUrl,
        category_product_id: parseInt(category_product_id, 10),
        barcode,
        price_a: parseFloat(price_a),
        price_b: parseFloat(price_b),
        nutri_score,
        label_id: parseInt(label_id, 10),
        nutrition_fact_id: nutritionFactRecord.id,
      });

      return product;
    } catch (error) {
      console.error("Error dalam addFoodProduct:", error);
      throw new Error("Gagal menambahkan produk: " + error.message);
    }
  }

  async findAllCategoryProduct() {
    const categories = await ProductRepository.findAllCategoryProduct();

    return { categories };
  }

  async deleteProductById(productId) {
    const product = await ProductRepository.deleteProductById(productId);

    if (!product) {
      const error = new Error("Produk tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return product;
  }
}
module.exports = new ProductService();
