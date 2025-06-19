const { extractNutritionFacts } = require("../../../libs/openai");
const axios = require("axios");

class OCRService {
  // Extract nutrition facts dari gambar menggunakan OpenAI
  async extractNutritionFromImage(imageBuffer, productType = 'food') {
    try {
      // Convert buffer to base64
      const imageBase64 = imageBuffer.toString('base64');
      
      // Extract nutrition facts using OpenAI (now includes insight)
      const nutritionData = await extractNutritionFacts(imageBase64);
      
      // Separate nutrition facts from insight
      const { insight, ...nutritionFacts } = nutritionData;
      
      // Validate extracted data (without insight)
      this.validateNutritionFacts(nutritionFacts);
      
      return {
        nutritionFacts,
        insight
      };
    } catch (error) {
      throw new Error(`Gagal mengekstrak informasi nutrisi: ${error.message}`);
    }
  }

  // Predict nutri-score berdasarkan nutrition facts
  async predictNutriScore(nutritionFacts, productType = 'food') {
    try {
      // Endpoint yang benar
      const endpoint = 'https://ml-bewise.up.railway.app/predict-nutriscore';

      const payload = {
        features: {
          energy: nutritionFacts.energy,
          saturated_fat: nutritionFacts.saturated_fat,
          sugar: nutritionFacts.sugar,
          sodium: nutritionFacts.sodium,
          protein: nutritionFacts.protein,
          fiber: nutritionFacts.fiber,
          fruit_vegetable: nutritionFacts.fruit_vegetable
        }
      };

      console.log('Sending to ML API:', JSON.stringify(payload, null, 2)); // Debug log

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 seconds timeout
      });

      console.log('ML API Response:', response.data); // Debug log
      
      if (!response.data) {
        throw new Error('Invalid response from ML service');
      }

      // Parse response dari ML API - FORMAT YANG BENAR
      const result = response.data;
      
      // Response ML API: {"nutriscore_label": "2"}
      const label_id = parseInt(result.nutriscore_label, 10);
      const grade = this.convertLabelIdToGrade(label_id);
      
      return {
        nutri_score: null, // ML API tidak return nutri_score value
        label_id: label_id,
        grade: grade,
        nutritionFacts
      };
    } catch (error) {
      if (error.response) {
        console.error('ML API Error Response:', error.response.data);
        throw new Error(`ML Service Error: ${error.response.data?.message || error.response.statusText}`);
      }
      throw new Error(`Gagal memprediksi nutri-score: ${error.message}`);
    }
  }

  // Convert label_id (1,2,3,4,5) to grade (A,B,C,D,E)
  convertLabelIdToGrade(labelId) {
    const labelMap = {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
      5: 'E'
    };
    return labelMap[labelId] || 'E';
  }

  // Convert grade (A,B,C,D,E) to label_id (1,2,3,4,5) - untuk fallback
  convertGradeToLabelId(grade) {
    const gradeMap = {
      'A': 1,
      'B': 2, 
      'C': 3,
      'D': 4,
      'E': 5
    };
    return gradeMap[grade] || 5;
  }

  // Complete OCR + Prediction pipeline
  async processNutritionImage(imageBuffer, productType = 'food') {
    try {
      // Step 1: Extract nutrition facts from image (with insight)
      const extractResult = await this.extractNutritionFromImage(imageBuffer, productType);
      const { nutritionFacts, insight } = extractResult;
      
      // Step 2: Predict nutri-score
      const prediction = await this.predictNutriScore(nutritionFacts, productType);
      
      return {
        extractedNutrition: nutritionFacts,
        insight: insight, // Add insight to response
        prediction: {
          nutri_score: prediction.nutri_score,
          label_id: prediction.label_id,
          grade: prediction.grade
        },
        success: true
      };
    } catch (error) {
      throw new Error(`Gagal memproses gambar nutrisi: ${error.message}`);
    }
  }

  // Generate insight manually from nutrition facts (fallback function)
  generateNutritionInsight(nutritionFacts, grade = null) {
    try {
      const { energy, saturated_fat, sugar, sodium, protein, fiber } = nutritionFacts;
      
      let insights = [];
      
      // Analisis kalori
      if (energy > 400) {
        insights.push("Tinggi kalori");
      } else if (energy < 100) {
        insights.push("Rendah kalori");
      } else {
        insights.push("Kalori sedang");
      }
      
      // Analisis lemak jenuh
      if (saturated_fat > 5) {
        insights.push("tinggi lemak jenuh");
      } else if (saturated_fat < 1) {
        insights.push("rendah lemak jenuh");
      }
      
      // Analisis gula
      if (sugar > 15) {
        insights.push("tinggi gula");
      } else if (sugar < 5) {
        insights.push("rendah gula");
      }
      
      // Analisis sodium
      if (sodium > 1) {
        insights.push("tinggi sodium");
      } else if (sodium < 0.3) {
        insights.push("rendah sodium");
      }
      
      // Analisis protein
      if (protein > 10) {
        insights.push("tinggi protein");
      } else if (protein < 3) {
        insights.push("rendah protein");
      }
      
      // Analisis serat
      if (fiber > 6) {
        insights.push("tinggi serat");
      } else if (fiber < 2) {
        insights.push("rendah serat");
      }
      
      // Rekomendasi berdasarkan grade
      let recommendation = "";
      if (grade === 'A' || grade === 'B') {
        recommendation = "Produk ini relatif sehat dan dapat dikonsumsi secara teratur.";
      } else if (grade === 'C') {
        recommendation = "Produk ini dapat dikonsumsi sesekali dengan moderasi.";
      } else if (grade === 'D' || grade === 'E') {
        recommendation = "Produk ini sebaiknya dibatasi konsumsinya atau dihindari.";
      }
      
      const insightText = `Produk ini ${insights.join(', ')}. ${recommendation}`;
      
      return insightText;
    } catch (error) {
      return "Tidak dapat menganalisis insight nutrisi untuk produk ini.";
    }
  }

  // Validate nutrition facts structure
  validateNutritionFacts(nutritionFacts) {
    const requiredFields = ['energy', 'saturated_fat', 'sugar', 'sodium', 'protein', 'fiber', 'fruit_vegetable'];
    
    for (const field of requiredFields) {
      if (nutritionFacts[field] === undefined || nutritionFacts[field] === null) {
        throw new Error(`Missing required field: ${field}`);
      }
      
      if (typeof nutritionFacts[field] !== 'number' || isNaN(nutritionFacts[field])) {
        throw new Error(`Invalid value for ${field}: must be a number`);
      }
      
      if (nutritionFacts[field] < 0) {
        throw new Error(`Invalid value for ${field}: cannot be negative`);
      }
    }
    
    return true;
  }

  // Format nutrition facts untuk display
  formatNutritionDisplay(nutritionFacts) {
    return {
      energy: `${nutritionFacts.energy} kcal`,
      saturated_fat: `${nutritionFacts.saturated_fat}g`,
      sugar: `${nutritionFacts.sugar}g`,
      sodium: `${(nutritionFacts.sodium * 1000).toFixed(0)}mg`, // Convert back to mg for display
      protein: `${nutritionFacts.protein}g`,
      fiber: `${nutritionFacts.fiber}g`,
      fruit_vegetable: `${nutritionFacts.fruit_vegetable}%`
    };
  }
}

module.exports = new OCRService();