const ProductService = require("../services/product");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const { products } = await ProductService.findAllProducts(
        pageNumber,
        limitNumber
      );

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: { products, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getProductByCategory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const { category } = req.params;
      const categoryProductId = parseInt(category);
      const { products } = await ProductService.findProductByCategory(
        categoryProductId,
        pageNumber,
        limitNumber
      );

      if (!products || products.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Produk tidak ditemukan",
          data: null,
        });
      }

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: { products, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
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
      return res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const { message } = await ProductService.deleteProduct(id);

      return res.json({
        status: true,
        message,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }

  async searchProducts(req, res) {
    try {
      const { page = 1, limit = 10, keyword } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const { products } = await ProductService.searchProducts(
        keyword,
        pageNumber,
        limitNumber
      );

      if (!products || products.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Produk tidak ditemukan",
          data: null,
        });
      }

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: { products, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(500).json({
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
          message: "Barcode tidak boleh kosong.",
          data: null,
        });
      }

      const product = await ProductService.scanProduct(userId, barcode);

      return res.json({
        status: true,
        message: "Data produk berhasil dimuat",
        data: { product },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new ProductController();
