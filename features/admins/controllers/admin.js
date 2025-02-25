const AdminService = require("../services/admin");

class AdminController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email tidak boleh kosong",
          data: null,
        });
      }

      if (!password) {
        return res.status(400).json({
          status: false,
          message: "Password tidak boleh kosong",
          data: null,
        });
      }

      const { admin, token } = await AdminService.login({ email, password });

      return res.status(200).json({
        status: true,
        message: "Login berhasil",
        data: { admin, token },
      });
    } catch (error) {
      console.error("Error saat login:", error);

      return res.status(401).json({
        status: false,
        message: error.message || "Tidak diizinkan",
        data: null,
      });
    }
  }

  async findAllProducts(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const {
        products,
        totalProducts,
        totalPages,
        currentPage,
        hasNextPage,
        hasPreviousPage,
      } = await AdminService.findAllProducts(page, limit);

      return res.status(200).json({
        status: true,
        message: "Berhasil mendapatkan data produk",
        data: {
          products,
          page: currentPage,
          limit: parseInt(limit, 10) || 10,
          totalProducts,
          totalPages,
          hasNextPage,
          hasPreviousPage,
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

  async findProductByCategory(req, res) {
    try {
      const { category } = req.params;
      const categoryProductId = parseInt(category);
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const { products } = await AdminService.findProductByCategory(
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

      return res.status(200).json({
        status: true,
        message: "Berhasil mendapatkan data produk",
        data: { products, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  }

  async findProductById(req, res) {
    try {
      const { id } = req.params;
      const { product } = await AdminService.findProductById(id);

      return res.status(200).json({
        status: true,
        message: "Berhasil mendapatkan data produk",
        data: product,
      });
    } catch (error) {
      console.error("Error saat findProductById:", error);

      return res.status(error.statusCode || 500).json({
        status: false,
        message: error.message || "Terjadi kesalahan",
        data: null,
      });
    }
  }

  async createProduct(req, res) {
    try {
      const { id, ...productData } = req.body;

      const product = await AdminService.createProduct(productData);

      return res.status(201).json({
        status: true,
        message: "Produk berhasil dibuat",
        data: product,
      });
    } catch (error) {
      console.error("Error saat membuat produk:", error.message);

      return res.status(400).json({
        status: false,
        message: error.message || "Gagal membuat produk",
        data: null,
      });
    }
  }

  // async updateProduct(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const { name, price, stock, description, category_product_id } = req.body;
  //     const { file } = req;

  //     const updateData = {
  //       name,
  //       price,
  //       stock,
  //       description,
  //       category_product_id,
  //       image: file ? file.filename : undefined,
  //     };

  //     const { updatedProduct } = await AdminService.updateProduct(
  //       id,
  //       updateData
  //     );

  //     return res.status(200).json({
  //       status: true,
  //       message: "Berhasil mengupdate produk",
  //       data: updatedProduct,
  //     });
  //   } catch (error) {
  //     console.error("Error saat updateProduct:", error);

  //     return res.status(error.statusCode || 500).json({
  //       status: false,
  //       message: error.message || "Terjadi kesalahan",
  //       data: null,
  //     });
  //   }
  // }

  async addProductController(req, res) {
    try {
      const productData = req.body;

      const newProduct = await AdminService.addProduct(productData);

      return res.json({
        status: true,
        message: "Produk berhasil ditambahkan",
        data: newProduct,
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
}

module.exports = new AdminController();
