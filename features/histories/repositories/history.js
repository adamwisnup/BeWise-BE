const prisma = require("../../../configs/config");

class HistoryRepository {
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
