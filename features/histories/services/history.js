const HistoryRepository = require("../repositories/history");
class HistoryService {
  async findAllHistories(userId, page = 1, limit = 10) {
    const validPage = Math.max(parseInt(page, 10) || 1, 1);
    const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalProducts = await HistoryRepository.countTotalHistories();
    const totalPages = Math.ceil(totalProducts / validLimit);
    const currentPage = Math.min(validPage, totalPages);

    const skip = Math.max((currentPage - 1) * validLimit, 0);

    const histories = await HistoryRepository.findAllHistories(
      userId,
      skip,
      validLimit
    );

    const historiesWithQuantity = histories.map((history) => {
      return {
        ...history,
      };
    });

    return {
      histories: historiesWithQuantity,
        totalData: totalProducts,
        totalPage: totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };
  }

  async findHistoryById(historyId) {
    const history = await HistoryRepository.findHistoryById(historyId);

    if (!history) {
      const error = new Error("Riwayat tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    return history;
  }

  async deleteHistory(historyId) {
    const existingHistory = await HistoryRepository.findHistoryById(historyId);

    if (!existingHistory) {
      const error = new Error("Riwayat tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    const deleteHistory = await HistoryRepository.deleteHistory(historyId);

    return deleteHistory;
  }
}

module.exports = new HistoryService();
