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

  async findAllHistories(data) {
    return await prisma.history.findMany({
      where: {
        user_id: data.userId,
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
