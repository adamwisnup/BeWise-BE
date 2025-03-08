const HistoryRepository = require("../repositories/history");
class HistoryService {
  async findAllHistories(userId, page = 1, limit = 10) {
    const validPage = Math.max(parseInt(page, 10) || 1, 1);
    const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

    const totalHistories = await HistoryRepository.countTotalHistories(userId);
    const totalPages = Math.max(Math.ceil(totalHistories / validLimit), 1);
    const currentPage = Math.min(validPage, totalPages);

    const skip = (currentPage - 1) * validLimit;

    const histories = await HistoryRepository.findAllHistories(userId, skip, validLimit);

    return {
      histories,
      totalData: totalHistories,
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
