const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  openai,
  
  // Function untuk OCR nutrition facts dengan insight
  extractNutritionFacts: async (imageBase64) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this image and extract nutrition facts if they exist. Return ONLY a JSON object with the following structure:

                If nutrition facts are found:
                {
                  "has_nutrition_facts": true,
                  "energy": number (in kcal per 100g),
                  "saturated_fat": number (in grams per 100g),
                  "sugar": number (in grams per 100g),
                  "sodium": number (in grams per 100g),
                  "protein": number (in grams per 100g),
                  "fiber": number (in grams per 100g),
                  "fruit_vegetable": number (percentage, usually 0 unless specified),
                  "insight": "string (detailed nutritional analysis and recommendation in Indonesian)"
                }

                If NO nutrition facts are detected:
                {
                  "has_nutrition_facts": false,
                  "message": "No nutrition facts detected in this image"
                }
                
                For the insight field (when nutrition facts exist), provide a comprehensive analysis in Indonesian including:
                - Analisis kandungan nutrisi (tinggi/rendah kalori, lemak, gula, sodium, dll)
                - Apakah produk ini sehat atau tidak
                - Rekomendasi konsumsi (boleh dimakan sering/sesekali/dihindari)
                - Tips untuk pola makan sehat
                - Peringatan khusus jika ada (untuk diabetes, hipertensi, dll)
                
                Important notes:
                - First determine if there are any nutrition facts visible in the image
                - If no nutrition facts table/label is visible, return has_nutrition_facts: false
                - Convert all values to per 100g serving
                - Convert sodium from mg to grams (divide by 1000)
                - If a nutrition value is not found, use 0
                - Make insight detailed but concise (2-3 sentences)
                - Use Indonesian language for insight
                - Return only the JSON object, no additional text`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 800 // Increase tokens for insight
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON response
      try {
        // Clean the response - remove any markdown formatting
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.replace(/```\n?/, '').replace(/\n?```$/, '');
        }
        
        const response = JSON.parse(cleanContent);
        
        // Check if nutrition facts were detected
        if (!response.has_nutrition_facts) {
          throw new Error("Tidak ada informasi nutrisi yang terdeteksi pada gambar ini.");
        }
        
        // Extract nutrition facts (remove has_nutrition_facts flag)
        const { has_nutrition_facts, ...nutritionFacts } = response;
        
        // Validate that insight exists
        if (!nutritionFacts.insight) {
          nutritionFacts.insight = "Tidak dapat menganalisis insight nutrisi dari gambar ini.";
        }
        
        return nutritionFacts;
      } catch (parseError) {
        // Check if it's our specific nutrition detection error
        if (parseError.message === "Tidak ada informasi nutrisi yang terdeteksi pada gambar ini.") {
          throw parseError; // Re-throw the nutrition detection error
        }
        console.error("OpenAI Response:", content);
        throw new Error("Failed to parse OpenAI response as JSON");
      }
      
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(`OCR extraction failed: ${error.message}`);
    }
  }
};