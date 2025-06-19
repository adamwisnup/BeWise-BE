const OCRService = require("../services/ocr");

class OCRController {
  // Extract nutrition facts dari gambar
  async extractNutrition(req, res) {
    try {
      const { file } = req;
      const { type = 'food' } = req.body; // 'food' or 'beverages'

      if (!file) {
        return res.status(400).json({
          status: false,
          message: "File gambar wajib diunggah",
          data: null,
        });
      }

      // Validate product type
      if (!['food', 'beverages'].includes(type)) {
        return res.status(400).json({
          status: false,
          message: "Tipe produk harus 'food' atau 'beverages'",
          data: null,
        });
      }

      const nutritionFacts = await OCRService.extractNutritionFromImage(file.buffer, type);
      const formattedNutrition = OCRService.formatNutritionDisplay(nutritionFacts);

      return res.status(200).json({
        status: true,
        message: "Berhasil mengekstrak informasi nutrisi",
        data: {
          rawNutrition: nutritionFacts,
          formattedNutrition: formattedNutrition
        },
      });
    } catch (error) {
      console.error("OCR Extract Error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Gagal mengekstrak informasi nutrisi",
        data: null,
      });
    }
  }

  // Extract nutrition + predict nutri-score
  async processNutritionImage(req, res) {
    try {
      const { file } = req;
      const { type = 'food' } = req.body; // 'food' or 'beverages'

      if (!file) {
        return res.status(400).json({
          status: false,
          message: "File gambar wajib diunggah",
          data: null,
        });
      }

      // Validate product type
      if (!['food', 'beverages'].includes(type)) {
        return res.status(400).json({
          status: false,
          message: "Tipe produk harus 'food' atau 'beverages'",
          data: null,
        });
      }

      const result = await OCRService.processNutritionImage(file.buffer, type);
      const formattedNutrition = OCRService.formatNutritionDisplay(result.extractedNutrition);

      return res.status(200).json({
        status: true,
        message: "Berhasil memproses gambar nutrisi",
        data: {
          extractedNutrition: {
            raw: result.extractedNutrition,
            formatted: formattedNutrition
          },
          prediction: result.prediction,
        },
      });
    } catch (error) {
      console.error("OCR Process Error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Gagal memproses gambar nutrisi",
        data: null,
      });
    }
  }

  // Predict nutri-score dari nutrition facts manual
  async predictFromNutrition(req, res) {
    try {
      const { nutritionFacts, type = 'food' } = req.body;

      if (!nutritionFacts) {
        return res.status(400).json({
          status: false,
          message: "Data nutrisi wajib diisi",
          data: null,
        });
      }

      // Validate product type
      if (!['food', 'beverages'].includes(type)) {
        return res.status(400).json({
          status: false,
          message: "Tipe produk harus 'food' atau 'beverages'",
          data: null,
        });
      }

      // Validate nutrition facts
      OCRService.validateNutritionFacts(nutritionFacts);

      const prediction = await OCRService.predictNutriScore(nutritionFacts, type);

      return res.status(200).json({
        status: true,
        message: "Berhasil memprediksi nutri-score",
        data: {
          nutritionFacts,
          prediction: {
            nutri_score: prediction.nutri_score,
            label_id: prediction.label_id,
            grade: prediction.grade
          },
        },
      });
    } catch (error) {
      console.error("Prediction Error:", error);
      return res.status(400).json({
        status: false,
        message: error.message || "Gagal memprediksi nutri-score",
        data: null,
      });
    }
  }
}

module.exports = new OCRController();