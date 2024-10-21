const prisma = require("../../../configs/config");

class HistoryRepository {
  async createHistory(userId, productId) {
    const history = await prisma.history.create({
      data: {
        userId: userId,
        productId: productId,
      },
    });

    return history;
  }

  async findAllHistories(data) {
    return await prisma.history.findMany();
  }

  async findHistoryById(historyId) {
    return await prisma.history.findUnique({
      where: { id: historyId },
    });
  }

  async deleteHistory(historyId) {
    return await prisma.history.delete({
      where: { id: historyId },
    });
  }
}

module.exports = new HistoryRepository();
