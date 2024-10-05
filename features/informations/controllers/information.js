const InformationService = require("../services/information");

class InformationController {
  async createInformation(req, res) {
    try {
      const { title, content } = req.body;
      const image = req.file;

      if (!title) {
        return res.status(400).json({
          status: false,
          message: "Title tidak boleh kosong",
          data: null,
        });
      }

      if (!content) {
        return res.status(400).json({
          status: false,
          message: "Content tidak boleh kosong",
          data: null,
        });
      }

      if (!image) {
        return res.status(400).json({
          status: false,
          message: "Image tidak boleh kosong",
          data: null,
        });
      }

      const { information } = await InformationService.createInformation(
        title,
        content,
        image
      );

      return res.status(201).json({
        status: true,
        message: "Informasi berhasil dibuat",
        data: { information },
      });
    } catch (error) {
      console.error("Error saat membuat informasi:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  }

  async getAllInformations(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      const informations = await InformationService.findAllInformation(
        pageNumber,
        limitNumber
      );

      return res.json({
        status: true,
        message: "Data informasi berhasil dimuat",
        data: { informations, page: pageNumber, limit: limitNumber },
      });
    } catch (error) {
      console.error("Error saat mengambil data informasi:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Terjadi kesalahan pada server",
        data: null,
      });
    }
  }

  async getInformationById(req, res) {
    try {
      const { id } = req.params;
      const informationId = parseInt(id, 10);
      const information = await InformationService.findInformationById(
        informationId
      );

      if (!information || information.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Information tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Information berhasil dimuat",
        data: information,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async updateInformation(req, res) {
    try {
      const { id } = req.params;
      const informationId = parseInt(id, 10);

      const { title, content } = req.body;
      const image = req.file;

      const data = { title, content, image };

      const updatedInformation = await InformationService.updateInformation(
        informationId,
        data
      );

      return res.status(200).json({
        success: true,
        message: "Informasi berhasil diupdate",
        data: updatedInformation,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }

  async deleteInformation(req, res) {
    try {
      const { id } = req.params;
      const informationId = parseInt(id, 10);

      const deletedInformation = await InformationService.deleteInformation(
        informationId
      );

      return res.json({
        success: true,
        message: "Informasi berhasil dihapus",
        data: null,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  }
}

module.exports = new InformationController();
