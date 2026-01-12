const mongoose = require('mongoose');
const VehiclePricing = require('./models/VehiclePricing');

// Test pricing calculation
async function testPricing() {
  console.log('🧮 Testing VehiclePricing calculateFare...\n');

  // Create pricing instance
  const pricing = new VehiclePricing({
    category: 'car',
    vehicleType: 'SUV',
    vehicleModel: 'XUV 3x0',
    tripType: 'one-way',
    distancePricing: {
      '50km': 12,
      '100km': 10,
      '150km': 8,
      '200km': 7,
      '250km': 6,
      '300km': 5
    }
  });

  // Test with 191.85km (from user's logs)
  const distance = 191.85;
  const fare = pricing.calculateFare(distance);

  console.log(`Distance: ${distance}km`);
  console.log(`Calculated fare: ₹${fare}`);
  console.log('\nExpected breakdown:');
  console.log('0-50km: 50 × ₹12 = ₹600');
  console.log('51-100km: 50 × ₹10 = ₹500');
  console.log('101-150km: 50 × ₹8 = ₹400');
  console.log('151-191.85km: 40.85 × ₹7 = ₹286');
  console.log('Total: ₹600 + ₹500 + ₹400 + ₹286 = ₹1,786');

  console.log('\n✅ Test completed!');
}

// Run test
testPricing().catch(console.error);
