const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const VehiclePricingSchema = new mongoose.Schema({
  // Vehicle Category (auto, car, bus)
  category: {
    type: String,
    enum: ['auto', 'car', 'bus'],
    required: [true, 'Vehicle category is required']
  },

  // Vehicle Type (e.g., Auto, Sedan, Hatchback, SUV for cars)
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true
  },

  // Vehicle Model (e.g., Standard Auto, Honda City, Swift Dzire for cars)
  vehicleModel: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },

  // Trip Type (one-way or return)
  tripType: {
    type: String,
    enum: ['one-way', 'return'],
    required: [true, 'Trip type is required']
  },

  // Auto price (required for auto category only)
  autoPrice: {
    type: Number,
    required: function () { return this.category === 'auto'; },
    min: [0, 'Auto price cannot be negative'],
    default: 0
  },

  // Simple per km rate for the entire model (new approach)
  perKmRate: {
    type: Number,
    min: [0, 'Per km rate cannot be negative'],
    default: 0
  },

  // Distance-based pricing (legacy - kept for backward compatibility)
  distancePricing: {
    '50km': {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    '100km': {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    '150km': {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    '200km': {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    '250km': {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    '300km': {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    }
  },

  // Additional charges
  nightCharge: {
    type: Number,
    default: 0,
    min: [0, 'Night charge cannot be negative']
  },

  acCharge: {
    type: Number,
    default: 0,
    min: [0, 'AC charge cannot be negative']
  },

  waitingCharge: {
    type: Number,
    default: 0,
    min: [0, 'Waiting charge cannot be negative']
  },

  // Status and metadata
  isActive: {
    type: Boolean,
    default: true
  },

  isDefault: {
    type: Boolean,
    default: false
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Admin who created this pricing is required']
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },

  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
VehiclePricingSchema.index({
  category: 1,
  vehicleType: 1,
  vehicleModel: 1,
  tripType: 1
}, { unique: true });

// Index for active pricing
VehiclePricingSchema.index({ isActive: 1 });

// Method to calculate fare based on distance
VehiclePricingSchema.methods.calculateFare = function (distance) {
  let totalFare = 0;

  // For auto, use fixed auto price per km
  if (this.category === 'auto') {
    totalFare = this.autoPrice * distance;
  } else {
    // For car and bus, use simple perKmRate if available (new approach)
    if (this.perKmRate && this.perKmRate > 0) {
      totalFare = this.perKmRate * distance;
    } else {
      // Fallback to tiered pricing for backward compatibility
      // Distance slabs: 0-50km, 51-100km, 101-150km, 151-200km, 201-250km, 251km+

      let ratePerKm = this.getRateForDistance(distance);
      totalFare = distance * ratePerKm;
    }
  }

  // Round to whole rupees (no decimal places)
  return Math.round(totalFare);
};

// Method to get rate per km based on distance
VehiclePricingSchema.methods.getRateForDistance = function (distance) {
  if (this.category === 'auto') {
    return this.autoPrice || 0;
  }

  // For car and bus
  if (this.perKmRate && this.perKmRate > 0) {
    return this.perKmRate;
  }

  // Use distance slabs to determine the flat rate
  if (distance <= 50) {
    return this.distancePricing['50km'] || 0;
  } else if (distance <= 100) {
    return this.distancePricing['100km'] || 0;
  } else if (distance <= 150) {
    return this.distancePricing['150km'] || 0;
  } else if (distance <= 200) {
    return this.distancePricing['200km'] || 0;
  } else if (distance <= 250) {
    return this.distancePricing['250km'] || 0;
  } else {
    // For distances > 250km, use the 300km rate (or highest available)
    return this.distancePricing['300km'] || this.distancePricing['250km'] || 0;
  }
};

// Static method to get pricing by vehicle details
VehiclePricingSchema.statics.getPricing = function (category, vehicleType, vehicleModel, tripType) {
  return this.findOne({
    category,
    vehicleType,
    vehicleModel,
    tripType,
    isActive: true
  });
};

// Static method to get all pricing for a category
VehiclePricingSchema.statics.getCategoryPricing = function (category, tripType) {
  return this.find({
    category,
    tripType,
    isActive: true
  }).sort({ vehicleType: 1, vehicleModel: 1 });
};

// Static method to get default pricing
VehiclePricingSchema.statics.getDefaultPricing = function (category, vehicleType, tripType) {
  return this.findOne({
    category,
    vehicleType,
    tripType: tripType || 'one-way',
    isDefault: true,
    isActive: true
  });
};

// Add pagination plugin
VehiclePricingSchema.plugin(mongoosePaginate);

const VehiclePricing = mongoose.model('VehiclePricing', VehiclePricingSchema);

module.exports = VehiclePricing;
