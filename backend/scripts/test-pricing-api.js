const mongoose = require('mongoose');
const VehiclePricing = require('../models/VehiclePricing');

async function testPricingAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/happiness');

    console.log('=== Testing Pricing API Data ===');

    // Test 1: Get all brands
    const brands = await VehiclePricing.distinct('vehicleModel', {
      isActive: true,
      category: 'car'
    });

    console.log(`\n1. Total vehicle models found: ${brands.length}`);
    console.log('Sample models:', brands.slice(0, 5));

    // Test 2: Extract brands from models
    const uniqueBrands = [...new Set(
      brands.map(model => {
        const commonBrands = ['Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Renault', 'Volkswagen', 'Ford', 'Skoda', 'MG', 'Nissan', 'Jeep', 'Audi', 'BMW', 'Mercedes-Benz', 'Jaguar', 'Land Rover', 'Volvo', 'Lexus'];

        for (const brand of commonBrands) {
          if (model.toLowerCase().includes(brand.toLowerCase().replace(' ', '').replace('-', ''))) {
            return brand;
          }
        }

        return model.split(' ')[0];
      }).filter(Boolean)
    )].sort();

    console.log(`\n2. Extracted brands: ${uniqueBrands.length}`);
    console.log('Brands:', uniqueBrands);

    // Test 3: Get types for first brand
    if (uniqueBrands.length > 0) {
      const firstBrand = uniqueBrands[0];
      console.log(`\n3. Testing types for brand: ${firstBrand}`);

      const modelsForBrand = await VehiclePricing.find({
        isActive: true,
        category: 'car',
        vehicleModel: { $regex: firstBrand, $options: 'i' }
      }).distinct('vehicleType');

      console.log(`Types for ${firstBrand}:`, modelsForBrand);
    }

    // Test 4: Get models for first brand + type
    if (uniqueBrands.length > 0) {
      const firstBrand = uniqueBrands[0];
      const types = await VehiclePricing.find({
        isActive: true,
        category: 'car',
        vehicleModel: { $regex: firstBrand, $options: 'i' }
      }).distinct('vehicleType');

      if (types.length > 0) {
        const firstType = types[0];
        console.log(`\n4. Testing models for ${firstBrand} + ${firstType}`);

        const models = await VehiclePricing.find({
          isActive: true,
          category: 'car',
          vehicleModel: { $regex: firstBrand, $options: 'i' },
          vehicleType: firstType
        }).distinct('vehicleModel');

        console.log(`Models for ${firstBrand} (${firstType}):`, models.slice(0, 5));
      }
    }

    await mongoose.disconnect();
    console.log('\n=== Test Complete ===');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPricingAPI();
