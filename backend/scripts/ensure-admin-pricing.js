const mongoose = require('mongoose');
const VehiclePricing = require('../models/VehiclePricing');
const Admin = require('../models/Admin');

async function ensureAdminPricing() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chalo-sawari');
    console.log('✅ Connected to database');

    // Get admin user
    const admin = await Admin.findOne({ isActive: true });
    if (!admin) {
      console.log('❌ No active admin found');
      return;
    }

    console.log('🎯 Ensuring EXACT admin pricing for all vehicle models...\n');

    // SUV Pricing - EXACT rates as set by admin
    const suvPricing = [
      {
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
          '300km': 6
        }
      },
      {
        category: 'car',
        vehicleType: 'SUV',
        vehicleModel: 'XUV 3x0',
        tripType: 'return',
        distancePricing: {
          '50km': 10,
          '100km': 8,
          '150km': 6,
          '200km': 5,
          '250km': 4,
          '300km': 4
        }
      },
      {
        category: 'car',
        vehicleType: 'SUV',
        vehicleModel: 'XUV 700',
        tripType: 'one-way',
        distancePricing: {
          '50km': 12,
          '100km': 10,
          '150km': 8,
          '200km': 7,
          '250km': 6,
          '300km': 6
        }
      },
      {
        category: 'car',
        vehicleType: 'SUV',
        vehicleModel: 'XUV 700',
        tripType: 'return',
        distancePricing: {
          '50km': 10,
          '100km': 8,
          '150km': 6,
          '200km': 5,
          '250km': 4,
          '300km': 4
        }
      },
      // Add more SUV models as needed...
      {
        category: 'car',
        vehicleType: 'SUV',
        vehicleModel: 'Tata Harrier',
        tripType: 'one-way',
        distancePricing: {
          '50km': 12,
          '100km': 10,
          '150km': 8,
          '200km': 7,
          '250km': 6,
          '300km': 6
        }
      }
    ];

    // Insert/Update pricing
    for (const pricingData of suvPricing) {
      const existing = await VehiclePricing.findOne({
        category: pricingData.category,
        vehicleType: pricingData.vehicleType,
        vehicleModel: pricingData.vehicleModel,
        tripType: pricingData.tripType
      });

      if (existing) {
        // Update existing
        existing.distancePricing = pricingData.distancePricing;
        existing.isActive = true;
        existing.createdBy = admin._id;
        await existing.save();
        console.log(`✅ Updated pricing for ${pricingData.vehicleModel} (${pricingData.tripType})`);
      } else {
        // Create new
        const newPricing = new VehiclePricing({
          ...pricingData,
          isActive: true,
          isDefault: false,
          createdBy: admin._id,
          notes: `Admin-set pricing for ${pricingData.vehicleModel} ${pricingData.tripType} trips`
        });
        await newPricing.save();
        console.log(`✅ Created pricing for ${pricingData.vehicleModel} (${pricingData.tripType})`);
      }
    }

    // Verify XUV 3x0 pricing exists
    const xuvPricing = await VehiclePricing.find({
      vehicleModel: 'XUV 3x0',
      isActive: true
    });

    console.log('\n🎯 XUV 3x0 Pricing Verification:');
    xuvPricing.forEach(pricing => {
      console.log(`${pricing.tripType}: ${JSON.stringify(pricing.distancePricing)}`);
    });

    console.log('\n✅ Admin pricing setup complete!');
    console.log('🚗 अब सभी vehicles के लिए EXACT admin-set rates का use होगा!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the script
ensureAdminPricing();
