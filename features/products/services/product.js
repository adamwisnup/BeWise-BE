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
    const totalPages = Math.max(Math.ceil(totalProducts / validLimit), 1);
    const currentPage = Math.min(validPage, totalPages);
    const skip = (currentPage - 1) * validLimit;

    const products = await ProductRepository.findAllProducts(skip, validLimit);

    return {
        products,
        totalData: totalProducts,
        totalPage: totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };
  }

  async findProductByCategory(categoryProductId, page = 1, limit = 10) {
    const validPage = Math.max(parseInt(page, 10) || 1, 1);
    const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalProducts = await ProductRepository.countProductsByCategory(categoryProductId);
    const totalPages = Math.max(Math.ceil(totalProducts / validLimit), 1);
    const currentPage = Math.min(validPage, totalPages);
    const skip = (currentPage - 1) * validLimit;

    const products = await ProductRepository.findProductByCategory(categoryProductId, skip, validLimit);

    return {
      products,
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

      const folderPath = `BeWise/Products/${parseInt(category_product_id, 10)}`;

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

      const folderPath = `BeWise/Products/${parseInt(category_product_id, 10)}`;

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

  async updateFoodProduct(productId, data, avatar) {
    try {
        const existingProduct = await ProductRepository.findProductById(productId);
        if (!existingProduct) {
            throw new Error("Produk tidak ditemukan!");
        }

        let photoUrl = existingProduct.photo;
        if (avatar) {
            const fileBase64 = avatar.buffer.toString("base64");
            const folderPath = `BeWise/Products/${existingProduct.category_product_id || "Other"}`;

            const response = await imagekit.upload({
                fileName: `${Date.now()}${path.extname(avatar.originalname)}`,
                file: fileBase64,
                folder: folderPath,
            });

            photoUrl = response.url;
        }

        let { nutri_score, label_id, nutrition_fact_id } = existingProduct;

        if (data.nutritionFact) {
            if (nutrition_fact_id) {
                await ProductRepository.updateNutritionFact(nutrition_fact_id, {
                    energy: data.nutritionFact.energy ?? existingProduct.energy,
                    saturated_fat: data.nutritionFact.saturated_fat ?? existingProduct.saturated_fat,
                    sugar: data.nutritionFact.sugar ?? existingProduct.sugar,
                    sodium: data.nutritionFact.sodium ?? existingProduct.sodium,
                    protein: data.nutritionFact.protein ?? existingProduct.protein,
                    fiber: data.nutritionFact.fiber ?? existingProduct.fiber,
                    fruit_vegetable: data.nutritionFact.fruit_vegetable ?? existingProduct.fruit_vegetable,
                });
            } else {
                const newNutritionFact = await ProductRepository.createNutritionFact({
                    energy: data.nutritionFact.energy || 0,
                    saturated_fat: data.nutritionFact.saturated_fat || 0,
                    sugar: data.nutritionFact.sugar || 0,
                    sodium: data.nutritionFact.sodium || 0,
                    protein: data.nutritionFact.protein || 0,
                    fiber: data.nutritionFact.fiber || 0,
                    fruit_vegetable: data.nutritionFact.fruit_vegetable || 0,
                });
                nutrition_fact_id = newNutritionFact.id;
            }

            const mlResponse = await axios.post(
                "https://ml-bewise.up.railway.app/calculate-nutri-score/food",
                [{ nutritionFact: data.nutritionFact }]
            );

            nutri_score = mlResponse.data[0].nutri_score;
            label_id = parseInt(mlResponse.data[0].category, 10);
        }

        const updateData = {
            name: data.name ?? existingProduct.name,
            brand: data.brand ?? existingProduct.brand,
            photo: photoUrl,
            category_product_id: data.category_product_id ? parseInt(data.category_product_id, 10) : existingProduct.category_product_id,
            barcode: data.barcode ?? existingProduct.barcode,
            price_a: data.price_a ? parseFloat(data.price_a) : existingProduct.price_a,
            price_b: data.price_b ? parseFloat(data.price_b) : existingProduct.price_b,
            nutri_score,
            label_id,
            nutrition_fact_id,
        };

        return await ProductRepository.updateProduct(productId, updateData);
    } catch (error) {
        throw new Error(`Gagal memperbarui produk: ${error.message}`);
    }
  }

  async updateBeverageProduct(productId, data, avatar) {
    try {
     const existingProduct = await ProductRepository.findProductById(productId);
      if (!existingProduct) {
        throw new Error("Produk tidak ditemukan!");
      }

      let photoUrl = existingProduct.photo;

      if (avatar) {
        const fileBase64 = avatar.buffer.toString("base64");
        const folderPath = `BeWise/Products/${category_product_id || "Other"}`;

        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(avatar.originalname),
          file: fileBase64,
          folder: folderPath,
        });

        photoUrl = response.url;
      }

      let nutri_score = existingProduct.nutri_score;
      let label_id = existingProduct.label_id;
      let nutrition_fact_id = existingProduct.nutrition_fact_id;

      if (data.nutritionFact) {
        const mlResponse = await axios.post(
          "https://ml-bewise.up.railway.app/calculate-nutri-score/beverages",
          [{ nutritionFact: data.nutritionFact }]
        );

          ({ category: label_id, nutri_score } = mlResponse.data[0]);
            if (nutrition_fact_id) {
                await ProductRepository.updateNutritionFact(
                    existingProduct.nutrition_fact_id,
                    data.nutritionFact
                );
            }
      }

      const updateData = {
        name: data.name || existingProduct.name,
        brand: data.brand || existingProduct.brand,
        photo: photoUrl,
        category_product_id: parseInt(data.category_product_id, 10) || existingProduct.category_product_id,
        barcode: data.barcode || existingProduct.barcode,
        price_a: parseFloat(data.price_a) || existingProduct.price_a,
        price_b: parseFloat(data.price_b) || existingProduct.price_b,
        nutri_score: data.nutri_score ? parseFloat(data.nutri_score) : nutri_score,
        label_id: parseInt(label_id, 10),
      };

      const updatedProduct = await ProductRepository.updateProduct(productId, updateData);

      return updatedProduct;
    } catch (error) {
      throw new Error("Gagal memperbarui produk: " + error.message);
    }
  }
}
module.exports = new ProductService();