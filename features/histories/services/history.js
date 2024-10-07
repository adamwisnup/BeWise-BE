const HistoryRepository = require("../repositories/history");
class HistoryService {
  async findAllHistories(page = 1, limit = 10) {
    const histories = await HistoryRepository.findAllHistories(page, limit);

    return histories;
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
