const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PenaltySchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  type: {
    type: String,
    enum: [
      'cancellation_12h_before',
      'cancellation_12h_within',
      'cancellation_3h_within',
      'cancellation_30min_after_acceptance',
      'wrong_car_assigned',
      'wrong_driver_assigned',
      'cng_car_no_carrier',
      'journey_not_completed_in_app',
      'car_not_clean',
      'car_not_good_condition',
      'driver_misbehaved'
    ],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'waived', 'paid'],
    default: 'active'
  },
  appliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  waivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: false
  },
  waivedReason: {
    type: String,
    required: false
  },
  waivedAt: {
    type: Date,
    required: false
  },
  paymentReference: {
    type: String,
    required: false // Reference to payment transaction if penalty was paid
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for penalty description
PenaltySchema.virtual('description').get(function() {
  const descriptions = {
    'cancellation_12h_before': 'Cancellation 12 hours before departure',
    'cancellation_12h_within': 'Cancellation within 12 hours of departure',
    'cancellation_3h_within': 'Cancellation within 3 hours of departure',
    'cancellation_30min_after_acceptance': 'Cancellation within 30 minutes of acceptance',
    'wrong_car_assigned': 'Wrong car assigned to customer',
    'wrong_driver_assigned': 'Wrong driver assigned to customer',
    'cng_car_no_carrier': 'CNG car without carrier for sedan category',
    'journey_not_completed_in_app': 'Journey not completed through app',
    'car_not_clean': 'Car not clean',
    'car_not_good_condition': 'Car not in good condition',
    'driver_misbehaved': 'Driver misbehaved with customer'
  };
  return descriptions[this.type] || this.reason;
});

// Index for better query performance
PenaltySchema.index({ driver: 1, status: 1 });
PenaltySchema.index({ appliedBy: 1 });
PenaltySchema.index({ createdAt: -1 });

// Static method to get penalty amounts by type
PenaltySchema.statics.getPenaltyAmount = function(type) {
  const penaltyAmounts = {
    'cancellation_12h_before': 300,
    'cancellation_12h_within': 300,
    'cancellation_3h_within': 500,
    'cancellation_30min_after_acceptance': 100,
    'wrong_car_assigned': 200,
    'wrong_driver_assigned': 200,
    'cng_car_no_carrier': 200,
    'journey_not_completed_in_app': 100,
    'car_not_clean': 200,
    'car_not_good_condition': 250,
    'driver_misbehaved': 200
  };
  return penaltyAmounts[type] || 0;
};

// Method to waive penalty
PenaltySchema.methods.waivePenalty = function(adminId, reason) {
  this.status = 'waived';
  this.waivedBy = adminId;
  this.waivedReason = reason;
  this.waivedAt = new Date();
  return this.save();
};

// Method to mark penalty as paid
PenaltySchema.methods.markAsPaid = function(paymentReference = null) {
  this.status = 'paid';
  if (paymentReference) {
    this.paymentReference = paymentReference;
  }
  return this.save();
};

PenaltySchema.plugin(mongoosePaginate);

const Penalty = mongoose.model('Penalty', PenaltySchema);

module.exports = Penalty;

