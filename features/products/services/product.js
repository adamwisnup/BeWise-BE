const ProductRepository = require("../repositories/product");
const HistoryRepository = require("../../histories/repositories/history");

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
}
module.exports = new ProductService();
