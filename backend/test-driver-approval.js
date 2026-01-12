const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');
const VehiclePricing = require('./models/VehiclePricing');
const Admin = require('./models/Admin');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/happiness', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

/**
 * Test function to verify tiered pricing calculation
 */
const testTieredPricingCalculation = () => {
  try {
    console.log('🧮 Testing Tiered Pricing Calculation...\n');

    // Create a mock VehiclePricing instance
    const mockPricing = {
      category: 'car',
      vehicleType: 'Sedan',
      vehicleModel: 'Honda City',
      tripType: 'one-way',
      autoPrice: 0,
      distancePricing: {
        '50km': 12,   // ₹12 per km for first 50km
        '100km': 10,  // ₹10 per km for 51-100km
        '150km': 8,   // ₹8 per km for 101-150km
        '200km': 7,   // ₹7 per km for 151-200km
        '250km': 6,   // ₹6 per km for 201-250km
        '300km': 5    // ₹5 per km for 251km+
      },
      calculateFare: function(distance) {
        let totalFare = 0;

        if (this.category === 'auto') {
          totalFare = this.autoPrice * distance;
        } else {
          if (distance <= 50) {
            totalFare = distance * this.distancePricing['50km'];
          } else if (distance <= 100) {
            totalFare = (50 * this.distancePricing['50km']) +
                       ((distance - 50) * this.distancePricing['100km']);
          } else if (distance <= 150) {
            totalFare = (50 * this.distancePricing['50km']) +
                       (50 * this.distancePricing['100km']) +
                       ((distance - 100) * this.distancePricing['150km']);
          } else if (distance <= 200) {
            totalFare = (50 * this.distancePricing['50km']) +
                       (50 * this.distancePricing['100km']) +
                       (50 * this.distancePricing['150km']) +
                       ((distance - 150) * this.distancePricing['200km']);
          } else if (distance <= 250) {
            totalFare = (50 * this.distancePricing['50km']) +
                       (50 * this.distancePricing['100km']) +
                       (50 * this.distancePricing['150km']) +
                       (50 * this.distancePricing['200km']) +
                       ((distance - 200) * this.distancePricing['250km']);
          } else {
            totalFare = (50 * this.distancePricing['50km']) +
                       (50 * this.distancePricing['100km']) +
                       (50 * this.distancePricing['150km']) +
                       (50 * this.distancePricing['200km']) +
                       (50 * this.distancePricing['250km']) +
                       ((distance - 250) * this.distancePricing['300km']);
          }
        }

        return Math.round(totalFare);
      }
    };

    // Test different distances
    const testDistances = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300];

    console.log('📊 Tiered Pricing Test Results:');
    console.log('Distance | Expected Fare | Calculation Breakdown');
    console.log('---------|---------------|----------------------');

    testDistances.forEach(distance => {
      const fare = mockPricing.calculateFare(distance);

      let breakdown = '';
      if (distance <= 50) {
        breakdown = `${distance}km × ₹${mockPricing.distancePricing['50km']}`;
      } else if (distance <= 100) {
        const first50 = 50 * mockPricing.distancePricing['50km'];
        const remaining = distance - 50;
        const remainingCost = remaining * mockPricing.distancePricing['100km'];
        breakdown = `50km × ₹${mockPricing.distancePricing['50km']} + ${remaining}km × ₹${mockPricing.distancePricing['100km']}`;
      } else if (distance <= 150) {
        breakdown = `100km × tiered + ${(distance - 100)}km × ₹${mockPricing.distancePricing['150km']}`;
      } else {
        breakdown = `${distance}km × tiered rates`;
      }

      console.log(`${distance.toString().padStart(8)} | ₹${fare.toString().padStart(6)} | ${breakdown}`);
    });

    console.log('\n✅ Tiered pricing calculation test completed');
    console.log('💡 Key insight: Pricing now uses proper distance slabs instead of flat rates!');

  } catch (error) {
    console.error('❌ Error testing tiered pricing:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🚀 Testing Vehicle Pricing System...\n');

  try {
    // Test the tiered pricing calculation
    testTieredPricingCalculation();

    // Connect to database for further testing
    await connectDB();

    console.log('\n🔍 Checking database for pricing data...');

    // Check if pricing data exists
    const pricingCount = await VehiclePricing.countDocuments();
    console.log(`📊 Total pricing records: ${pricingCount}`);

    if (pricingCount > 0) {
      // Show sample pricing
      const samplePricing = await VehiclePricing.findOne().limit(1);
      if (samplePricing) {
        console.log('💰 Sample pricing record:');
        console.log(`   Category: ${samplePricing.category}`);
        console.log(`   Vehicle: ${samplePricing.vehicleType} ${samplePricing.vehicleModel}`);
        console.log(`   Distance pricing:`, samplePricing.distancePricing);

        // Test fare calculation
        console.log('\n🧮 Testing fare calculations:');
        [50, 100, 150, 200].forEach(distance => {
          const fare = samplePricing.calculateFare(distance);
          console.log(`   ${distance}km: ₹${fare}`);
        });
      }
    } else {
      console.log('⚠️ No pricing data found in database');
    }

    // Check vehicles
    const vehicleCount = await Vehicle.countDocuments();
    console.log(`🚗 Total vehicles: ${vehicleCount}`);

  } catch (error) {
    console.error('❌ Error in testing:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📪 Database connection closed');
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  testTieredPricingCalculation
};