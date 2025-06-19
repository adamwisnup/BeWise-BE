const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  openai,
  
  // Function untuk OCR nutrition facts
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
                text: `Please extract nutrition facts from this image and return ONLY a JSON object with the following structure:
                {
                  "energy": number (in kcal per 100g),
                  "saturated_fat": number (in grams per 100g),
                  "sugar": number (in grams per 100g),
                  "sodium": number (in grams per 100g),
                  "protein": number (in grams per 100g),
                  "fiber": number (in grams per 100g),
                  "fruit_vegetable": number (percentage, usually 0 unless specified)
                }
                
                Important notes:
                - Convert all values to per 100g serving
                - Convert sodium from mg to grams (divide by 1000)
                - If a value is not found, use 0
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
        max_tokens: 500
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
        
        const nutritionFacts = JSON.parse(cleanContent);
        return nutritionFacts;
      } catch (parseError) {
        console.error("OpenAI Response:", content);
        throw new Error("Failed to parse OpenAI response as JSON");
      }
      
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(`OCR extraction failed: ${error.message}`);
    }
  }
};