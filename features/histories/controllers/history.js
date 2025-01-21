const HistoryService = require("../services/history");

class HistoryController {
  async getAllHistories(req, res) {
    try {
      const { userId } = req.user;
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const histories = await HistoryService.findAllHistories(
        userId,
        pageNumber,
        limitNumber
      );

      return res.status(200).json({
        status: true,
        message: "Riwayat berhasil dimuat",
        data: { histories, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  }

  async getHistoryById(req, res) {
    try {
      const { id } = req.params;
      const historyId = parseInt(id, 10);

      const history = await HistoryService.findHistoryById(historyId);

      if (!history || history.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Riwayat tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Riwayat berhasil dimuat",
        data: history,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  }

  async deleteHistory(req, res) {
    try {
      const { id } = req.params;
      const historyId = parseInt(id, 10);

      const deleteHistory = await HistoryService.deleteHistory(historyId);

      return res.status(200).json({
        status: true,
        message: "Riwayat berhasil dihapus",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || "Internal server error",
        data: null,
      });
    }
  }
}

module.exports = new HistoryController();
