const prisma = require("../../../configs/config");

class HistoryRepository {
  async createHistory(userId, productId) {
    const history = await prisma.history.create({
      data: {
        user_id: userId,
        product_id: productId,
      },
    });

    return history;
  }

  async findAllHistories(userId, page, limit) {
    const skip = Math.max((page - 1) * limit, 0);

    return await prisma.history.findMany({
      skip,
      take: limit,
      where: {
        user_id: userId,
      },
      include: {
        product: {
          include: {
            label: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async countTotalHistories(userId) {
    return await prisma.history.count({
      where: {
        user_id: userId,
      },
    });
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
