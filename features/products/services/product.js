const ProductRepository = require("../repositories/product");

class ProductService {
  //   async createProduct(data) {
  //     const { name, price, stock } = data;

  //     if (!name || !price || !stock) {
  //       throw new Error("Kolom yang wajib diisi tidak lengkap");
  //     }

  //     const product = await ProductRepository.createProduct({
  //       ...data,
  //     });

  //     return { product };
  //   }

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
      throw new Error("Produk tidak ditemukan");
    }

    return { products };
  }

  async findProductById(productId) {
    const product = await ProductRepository.findProductById(productId);

    if (!product) {
      throw new Error("Produk tidak ditemukan");
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
      throw new Error("Produk tidak ditemukan");
    }

    await ProductRepository.deleteProduct(productId);

    return { message: "Produk berhasil dihapus" };
  }
}

module.exports = new ProductService();
