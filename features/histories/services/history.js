const HistoryRepository = require("../repositories/history");
const ProductRepository = require("../../products/repositories/product");
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

  async findHistoryWithRecommendationById(historyId) {
    const history = await HistoryRepository.findHistoryById(historyId);

    if (!history) {
      const error = new Error("Riwayat tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    if (!history.product) {
      const error = new Error("Produk pada riwayat tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    const {
      label_id,
      category_product_id,
      id: scannedProductId,
    } = history.product;

    const recommendedProducts =
      await ProductRepository.findRecommendedProducts(
        label_id,
        category_product_id,
        scannedProductId,
      );

    return { history, recommendedProducts };
  }
}

module.exports = new HistoryService();
