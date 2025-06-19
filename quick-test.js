// quick-test.js - Test cepat ML endpoint
const axios = require('axios');

// Test ML API langsung
async function testMLEndpoint() {
  try {
    console.log('🧪 Testing ML API endpoint...');
    
    const payload = {
      features: {
        energy: 200,
        saturated_fat: 1.5,
        sugar: 4,
        sodium: 0.28,
        protein: 6,
        fiber: 0,
        fruit_vegetable: 0
      }
    };

    console.log('📤 Sending payload:');
    console.log(JSON.stringify(payload, null, 2));
    
    const response = await axios.post(
      'https://ml-bewise.up.railway.app/predict-nutriscore', 
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    console.log('\n✅ ML API Response Success!');
    console.log('📥 Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Extract key values
    const { nutri_score, grade, label_id } = response.data;
    console.log('\n📊 Extracted values:');
    console.log(`Nutri Score: ${nutri_score}`);
    console.log(`Grade: ${grade}`);
    console.log(`Label ID: ${label_id}`);
    
    return true;
    
  } catch (error) {
    console.log('\n❌ ML API Test Failed!');
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else if (error.request) {
      console.log('No response received. Network error or timeout.');
    } else {
      console.log('Error:', error.message);
    }
    
    return false;
  }
}

// Test beberapa contoh nutrition facts
async function testMultipleExamples() {
  const examples = [
    {
      name: "Healthy Product",
      features: {
        energy: 150,
        saturated_fat: 0.5,
        sugar: 2,
        sodium: 0.1,
        protein: 8,
        fiber: 5,
        fruit_vegetable: 50
      }
    },
    {
      name: "High Sugar Snack",
      features: {
        energy: 400,
        saturated_fat: 5,
        sugar: 25,
        sodium: 0.5,
        protein: 3,
        fiber: 1,
        fruit_vegetable: 0
      }
    },
    {
      name: "Processed Food",
      features: {
        energy: 350,
        saturated_fat: 8,
        sugar: 15,
        sodium: 1.2,
        protein: 4,
        fiber: 0,
        fruit_vegetable: 0
      }
    }
  ];

  console.log('\n🔬 Testing multiple nutrition examples...\n');
  
  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    console.log(`Test ${i + 1}: ${example.name}`);
    console.log('Features:', JSON.stringify(example.features, null, 2));
    
    try {
      const response = await axios.post(
        'https://ml-bewise.up.railway.app/predict-nutriscore',
        { features: example.features },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      console.log('Result:', JSON.stringify(response.data, null, 2));
      console.log('---\n');
      
    } catch (error) {
      console.log('Error:', error.response?.data || error.message);
      console.log('---\n');
    }
  }
}

// Main test function
async function runQuickTest() {
  console.log('🚀 Quick Test - ML Endpoint\n');
  console.log('Endpoint: https://ml-bewise.up.railway.app/predict-nutriscore');
  console.log('=' .repeat(60));
  
  // Test 1: Basic test
  const basicTest = await testMLEndpoint();
  
  if (basicTest) {
    // Test 2: Multiple examples
    await testMultipleExamples();
    
    console.log('🎉 All tests completed! ML endpoint is working.');
    console.log('\n💡 Next step: Test your internal API with this endpoint.');
    console.log('   Run: node test-new-endpoint.js');
  } else {
    console.log('\n⚠️ Basic test failed. Check ML endpoint availability.');
  }
}

// Run the test
runQuickTest();