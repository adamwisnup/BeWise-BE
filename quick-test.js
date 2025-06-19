// test-insight.js - Test insight functionality
const axios = require('axios');

const baseURL = 'http://localhost:3000/api/v1';
const token = 'your-jwt-token-here'; // Ganti dengan token yang valid

// Test 1: Manual predict with insight
async function testManualPredictWithInsight() {
  try {
    console.log('🧪 Testing manual predict with insight...');
    
    const payload = {
      nutritionFacts: {
        energy: 400,
        saturated_fat: 8,
        sugar: 25,
        sodium: 1.2,
        protein: 3,
        fiber: 1,
        fruit_vegetable: 0
      },
      type: 'food'
    };

    console.log('📤 Sending payload:');
    console.log(JSON.stringify(payload, null, 2));
    
    const response = await axios.post(`${baseURL}/ocr/predict-nutriscore`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\n✅ Manual Predict with Insight Success!');
    console.log('📥 Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Extract key data
    const data = response.data.data;
    console.log('\n📊 Extracted Data:');
    console.log(`Grade: ${data.prediction.grade}`);
    console.log(`Label ID: ${data.prediction.label_id}`);
    console.log(`Insight: "${data.insight}"`);
    
    return true;
    
  } catch (error) {
    console.log('\n❌ Manual Predict Test Failed!');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

// Test 2: Test with different nutrition profiles
async function testDifferentNutritionProfiles() {
  console.log('\n🔬 Testing different nutrition profiles...\n');
  
  const testCases = [
    {
      name: "Healthy Product (Low calories, high fiber)",
      nutrition: {
        energy: 150,
        saturated_fat: 0.5,
        sugar: 2,
        sodium: 0.1,
        protein: 8,
        fiber: 6,
        fruit_vegetable: 50
      }
    },
    {
      name: "Processed Snack (High sugar, high fat)",
      nutrition: {
        energy: 500,
        saturated_fat: 12,
        sugar: 30,
        sodium: 1.5,
        protein: 4,
        fiber: 0,
        fruit_vegetable: 0
      }
    },
    {
      name: "Moderate Product",
      nutrition: {
        energy: 250,
        saturated_fat: 3,
        sugar: 8,
        sodium: 0.5,
        protein: 6,
        fiber: 3,
        fruit_vegetable: 10
      }
    },
    {
      name: "High Protein Low Carb",
      nutrition: {
        energy: 200,
        saturated_fat: 2,
        sugar: 1,
        sodium: 0.3,
        protein: 25,
        fiber: 0,
        fruit_vegetable: 0
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: ${testCase.name}`);
      
      const response = await axios.post(`${baseURL}/ocr/predict-nutriscore`, {
        nutritionFacts: testCase.nutrition,
        type: 'food'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = response.data.data;
      console.log(`Grade: ${data.prediction.grade} | Label: ${data.prediction.label_id}`);
      console.log(`Insight: "${data.insight}"`);
      console.log('---\n');
      
    } catch (error) {
      console.log(`Error for ${testCase.name}:`, error.response?.data || error.message);
      console.log('---\n');
    }
  }
}

// Test 3: Test OpenAI OCR with insight (mock base64)
async function testOpenAIInsightGeneration() {
  try {
    console.log('\n🤖 Testing OpenAI insight generation (manual call)...');
    
    // Test manual call to OpenAI extraction function
    const { extractNutritionFacts } = require('./libs/openai');
    
    // This is a very small 1x1 pixel PNG in base64 (will fail OCR but test the function)
    const testBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    console.log('📤 Testing OpenAI with dummy image...');
    
    const result = await extractNutritionFacts(testBase64);
    
    console.log('✅ OpenAI Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.insight) {
      console.log(`\n🎯 Insight Generated: "${result.insight}"`);
      return true;
    } else {
      console.log('\n⚠️ No insight in response');
      return false;
    }
    
  } catch (error) {
    console.log('\n❌ OpenAI Test Failed:');
    console.error(error.message);
    
    // This is expected to fail with dummy image, but we can see if API key works
    if (error.message.includes('API key')) {
      console.log('💡 Check your OPENAI_API_KEY in .env file');
    } else if (error.message.includes('Failed to parse')) {
      console.log('💡 OpenAI responded but JSON parsing failed (expected with dummy image)');
    }
    
    return false;
  }
}

// Test 4: Compare manual insight vs OpenAI insight
async function compareInsightGeneration() {
  console.log('\n🔍 Comparing manual vs OpenAI insight generation...\n');
  
  const testNutrition = {
    energy: 400,
    saturated_fat: 8,
    sugar: 25,
    sodium: 1.2,
    protein: 3,
    fiber: 1,
    fruit_vegetable: 0
  };
  
  try {
    // Test manual insight generation
    const OCRService = require('./features/ocr/services/ocr');
    const manualInsight = OCRService.generateNutritionInsight(testNutrition, 'D');
    
    console.log('🤖 Manual Generated Insight:');
    console.log(`"${manualInsight}"`);
    
    // Test via API (which should use OpenAI if available)
    const response = await axios.post(`${baseURL}/ocr/predict-nutriscore`, {
      nutritionFacts: testNutrition,
      type: 'food'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const apiInsight = response.data.data.insight;
    
    console.log('\n🌐 API Generated Insight:');
    console.log(`"${apiInsight}"`);
    
    console.log('\n📊 Comparison:');
    console.log(`Manual length: ${manualInsight.length} characters`);
    console.log(`API length: ${apiInsight.length} characters`);
    console.log(`Same insight: ${manualInsight === apiInsight ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.log('❌ Comparison failed:', error.message);
  }
}

// Main test runner
async function runInsightTests() {
  console.log('🚀 Testing OCR Insight Functionality\n');
  console.log('=' .repeat(60));
  
  // Test 1: Basic manual predict with insight
  const basicTest = await testManualPredictWithInsight();
  
  if (basicTest) {
    console.log('\n' + '=' .repeat(60));
    
    // Test 2: Different nutrition profiles
    await testDifferentNutritionProfiles();
    
    console.log('=' .repeat(60));
    
    // Test 3: OpenAI insight generation
    await testOpenAIInsightGeneration();
    
    console.log('\n' + '=' .repeat(60));
    
    // Test 4: Compare insights
    await compareInsightGeneration();
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Insight testing completed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Test with real nutrition image via Postman');
    console.log('   2. Check that insights are helpful and accurate');
    console.log('   3. Adjust OpenAI prompt if needed for better insights');
    
  } else {
    console.log('\n⚠️ Basic test failed. Fix the issues above first.');
  }
}

// Run the tests
runInsightTests();