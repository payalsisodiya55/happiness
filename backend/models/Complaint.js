const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    category: {
        type: String,
        enum: [
            'driver_misbehavior',
            'wrong_vehicle',
            'car_cleanliness',
            'ac_not_working',
            'rash_driving',
            'overcharging',
            'other'
        ],
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    adminNotes: {
        type: String
    },
    resolution: {
        actionTaken: {
            type: String,
            enum: ['none', 'warning', 'penalty', 'driver_suspended'],
            default: 'none'
        },
        penaltyAmount: Number,
        penaltyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver' // Actually references a penalty subdoc, but storing ID helps traceability
        },
        resolvedAt: Date,
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
