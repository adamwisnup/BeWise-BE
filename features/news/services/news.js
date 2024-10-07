const NewsRepository = require("../repositories/news");
const imagekit = require("../../../libs/imagekit");
const path = require("path");
const { error } = require("console");

class NewsService {
  async createNews(title, content, image, author) {
    if (!title) {
      const error = new Error("Title tidak boleh kosong");
      error.statusCode = 400;
      throw error;
    }

    if (!content) {
      const error = new Error("Content tidak boleh kosong");
      error.statusCode = 400;
      throw error;
    }

    if (!image || !image.buffer) {
      const error = new Error("Image tidak boleh kosong");
      error.statusCode = 400;
      throw error;
    }

    if (!author) {
      const error = new Error("Author tidak boleh kosong");
      error.statusCode = 400;
      throw error;
    }

    const fileBase64 = image.buffer.toString("base64");

    const response = await imagekit.upload({
      fileName: Date.now() + path.extname(image.originalname),
      file: fileBase64,
      folder: "BeWise/News",
    });

    const news = await NewsRepository.createNews({
      title,
      content,
      image: response.url,
      author,
    });

    return news;
  }

  async findAllNews(page = 1, limit = 10) {
    const news = await NewsRepository.findAllNews(page, limit);

    return news;
  }

  async findNewsById(newsId) {
    const news = await NewsRepository.findNewsById(newsId);

    if (!news) {
      const error = new Error("Berita tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return news;
  }

  async updateNews(newsId, data) {
    const { title, content, image, author } = data;

    const existingInformation = await NewsRepository.findNewsById(newsId);
    if (!existingInformation) {
      const error = new Error("Berita tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    let updatedData = {
      title: title || existingInformation.title,
      content: content || existingInformation.content,
      image: image || existingInformation.image,
      author: author || existingInformation.author,
    };

    if (image && image.buffer) {
      const fileBase64 = image.buffer.toString("base64");

      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(image.originalname),
        file: fileBase64,
        folder: "BeWise/News",
      });

      updatedData.image = response.url;
    }

    const updateNews = await NewsRepository.updateNews(newsId, updatedData);

    return updateNews;
  }

  async deleteNews(newsId) {
    const news = await NewsRepository.findNewsById(newsId);

    if (!news) {
      const error = new Error("Berita tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    const deletedNews = await NewsRepository.deleteNews(newsId);

    return deletedNews;
  }
}

module.exports = new NewsService();
