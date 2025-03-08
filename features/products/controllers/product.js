const ProductService = require("../services/product");

class ProductController {
  async getAllProducts(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

        const result = await ProductService.findAllProducts(pageNumber, limitNumber);

        return res.status(200).json({
            status: true,
            message: "Data produk berhasil dimuat",
            data: result.products,
            pagination: {
                totalData: result.totalData,
                totalPage: result.totalPage,
                currentPage: result.currentPage,
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPreviousPage,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "Terjadi kesalahan pada server",
            data: null,
        });
    }
  }

  async getProductByCategory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { category } = req.params;

      const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
      const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
      const categoryProductId = parseInt(category, 10);

      if (isNaN(categoryProductId)) {
        return res.status(400).json({
          status: false,
          message: "Kategori produk tidak valid",
          data: null,
        });
      }

      const result = await ProductService.findProductByCategory(categoryProductId, pageNumber, limitNumber);

      if (!result.products.length) {
        return res.status(404).json({
          status: false,
          message: "Produk tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: result.products,
        pagination: {
          totalProducts: result.totalProducts,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNextPage: result.hasNextPage,
          hasPreviousPage: result.hasPreviousPage,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan",
        data: null,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      const { product } = await ProductService.findProductById(productId);

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: { product },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async searchProducts(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (!name) {
        return res.status(400).json({
          status: false,
          message: "Nama produk tidak boleh kosong",
          data: null,
        });
      }

      const products = await ProductService.searchProducts(
        name,
        pageNumber,
        limitNumber
      );

      const product_quantity = products.length;

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: {
          products,
          product_quantity,
          page: pageNumber,
          limit: limitNumber,
        },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async scanProduct(req, res) {
    try {
      const { barcode } = req.body;
      const { userId } = req.user;

      if (!barcode) {
        return res.status(400).json({
          status: false,
          message: "Barcode tidak boleh kosong",
          data: null,
        });
      }

      const { product, recommendedProducts } = await ProductService.scanProduct(
        userId,
        barcode
      );

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: {
          product,
          rekomendasi: recommendedProducts,
        },
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getTopChoices(req, res) {
    try {
      const products = await ProductService.getTopChoiceProducts();

      return res.status(200).json({
        status: true,
        message: "Berhasil memuat pilihan terbaik",
        data: products,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async addFoodProduct(req, res) {
    try {
      const avatar = req.file;
      if (!avatar) {
        return res.status(400).json({ message: "File foto wajib diunggah." });
      }

      const nutritionFact = {
        energy: parseFloat(req.body["nutritionFact.energy"]),
        saturated_fat: parseFloat(req.body["nutritionFact.saturated_fat"]),
        sugar: parseFloat(req.body["nutritionFact.sugar"]),
        sodium: parseFloat(req.body["nutritionFact.sodium"]),
        protein: parseFloat(req.body["nutritionFact.protein"]),
        fiber: parseFloat(req.body["nutritionFact.fiber"]),
        fruit_vegetable: parseFloat(req.body["nutritionFact.fruit_vegetable"]),
      };

      const productData = { ...req.body, nutritionFact };

      const product = await ProductService.addFoodProduct(productData, avatar);

      res.status(201).json({
        message: "Produk berhasil ditambahkan.",
        data: product,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({
        message: "Gagal menambahkan produk.",
        error: error.message,
      });
    }
  }

  async addBeverageProduct(req, res) {
    try {
      const avatar = req.file;
      if (!avatar) {
        return res.status(400).json({ message: "File foto wajib diunggah." });
      }

      const nutritionFact = {
        energy: parseFloat(req.body["nutritionFact.energy"]),
        saturated_fat: parseFloat(req.body["nutritionFact.saturated_fat"]),
        sugar: parseFloat(req.body["nutritionFact.sugar"]),
        sodium: parseFloat(req.body["nutritionFact.sodium"]),
        protein: parseFloat(req.body["nutritionFact.protein"]),
        fiber: parseFloat(req.body["nutritionFact.fiber"]),
        fruit_vegetable: parseFloat(req.body["nutritionFact.fruit_vegetable"]),
      };

      const productData = { ...req.body, nutritionFact };

      const product = await ProductService.addBeverageProduct(
        productData,
        avatar
      );

      res.status(201).json({
        message: "Produk berhasil ditambahkan.",
        data: product,
      });
    } catch (error) {
      console.error("Error adding product:", error.message);
      res.status(500).json({
        message: "Gagal menambahkan produk.",
        error: error.message,
      });
    }
  }

  async getAllCategoryProduct(req, res) {
    try {
      const categoryProducts = await ProductService.findAllCategoryProduct();
      return res.json({
        status: true,
        message: "Data kategori produk berhasil dimuat",
        data: categoryProducts,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      const deletedProduct = await ProductService.deleteProductById(productId);

      return res.json({
        status: true,
        message: "Produk berhasil dihapus",
        data: null,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async updateFoodProduct(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const avatar = req.file;

      const updatedProduct = await ProductService.updateFoodProduct(id, data, avatar);
      console.log("Updated product:", updatedProduct);
      

      return res.status(200).json({
        status: true,
        message: "Produk berhasil diperbarui",
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan",
        data: null,
      });
    }
  }

  async updateBeverageProduct(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const avatar = req.file;

      const updatedProduct = await ProductService.updateBeverageProduct(id, data, avatar);

      return res.status(200).json({
        status: "success",
        message: "Produk berhasil diperbarui",
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
