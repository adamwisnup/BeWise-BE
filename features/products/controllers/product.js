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
        success: true,
        message: "Data produk berhasil dimuat",
        data: { products, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
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
          success: false,
          message: "Produk tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        message: "Data produk berhasil dimuat",
        data: { products, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);
      const { product } = await ProductService.findProductById(productId);

      return res.json({
        success: true,
        message: "Data produk berhasil dimuat",
        data: { product },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const { message } = await ProductService.deleteProduct(id);

      return res.json({
        success: true,
        message,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProductController();
