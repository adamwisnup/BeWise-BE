const prisma = require("../../../configs/config");

class NewsRepository {
  async createNews(data) {
    return await prisma.news.create({
      data: {
        ...data,
      },
    });
  }

  async findAllNews(data) {
    return await prisma.news.findMany();
  }

  async findNewsById(newsId) {
    return await prisma.news.findUnique({
      where: { id: newsId },
    });
  }

  async updateNews(newsId, data) {
    return await prisma.news.update({
      where: { id: newsId },
      data: {
        ...data,
      },
    });
  }

  async deleteNews(newsId) {
    return await prisma.news.delete({
      where: { id: newsId },
    });
  }
}

module.exports = new NewsRepository();
