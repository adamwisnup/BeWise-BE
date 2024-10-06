const NewsService = require("../services/news");

class NewsController {
  async createNews(req, res, next) {
    try {
      const { title, content, author } = req.body;
      const image = req.file;

      const response = await NewsService.createNews(
        title,
        content,
        image,
        author
      );

      return res.status(201).json({
        status: true,
        message: "Berita berhasil dibuat",
        data: response,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  }

  async getAllNews(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const news = await NewsService.findAllNews(pageNumber, limitNumber);

      return res.status(200).json({
        status: true,
        message: "Berita berhasil ditemukan",
        data: news,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async getNewsById(req, res, next) {
    try {
      const { id } = req.params;
      const newsId = parseInt(id, 10);

      const news = await NewsService.findNewsById(newsId);

      return res.status(200).json({
        status: true,
        message: "Berita berhasil ditemukan",
        data: news,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async updateNews(req, res, next) {
    try {
      const { id } = req.params;
      const newsId = parseInt(id, 10);
      const { title, content, author } = req.body;
      const image = req.file;

      const response = await NewsService.updateNews(newsId, {
        title,
        content,
        image,
        author,
      });

      return res.status(200).json({
        status: true,
        message: "Berita berhasil diperbarui",
        data: response,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async deleteNews(req, res, next) {
    try {
      const { id } = req.params;
      const newsId = parseInt(id, 10);

      const deletenews = await NewsService.deleteNews(newsId);

      return res.status(200).json({
        status: true,
        message: "Berita berhasil dihapus",
        data: null,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new NewsController();
