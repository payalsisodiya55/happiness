const Complaint = require('../models/Complaint');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = asyncHandler(async (req, res) => {
    const { bookingId, category, description } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user.id
    });

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: 'Booking not found or not authorized'
        });
    }

    // Check if complaint already exists for this booking
    const existingComplaint = await Complaint.findOne({ booking: bookingId });
    if (existingComplaint) {
        return res.status(400).json({
            success: false,
            message: 'A complaint has already been submitted for this booking'
        });
    }

    const complaint = await Complaint.create({
        booking: bookingId,
        user: req.user.id,
        driver: booking.driver,
        category,
        description
    });

    res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: complaint
    });
});

// @desc    Get all complaints (for admin)
// @route   GET /api/complaints
// @access  Private (Admin)
exports.getAllComplaints = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: [
            { path: 'user', select: 'firstName lastName phone email' },
            { path: 'driver', select: 'firstName lastName phone email' },
            { path: 'booking', select: 'bookingNumber tripDetails' }
        ],
        sort: { createdAt: -1 }
    };

    // If using mongoose-paginate-v2 (assuming it's available as standard in this project)
    // If not, we fall back to standard find
    try {
        const complaints = await Complaint.find(query)
            .populate('user', 'firstName lastName phone email')
            .populate('driver', 'firstName lastName phone email')
            .populate('booking', 'bookingNumber tripDetails')
            .sort({ createdAt: -1 })
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        const total = await Complaint.countDocuments(query);

        res.json({
            success: true,
            data: {
                docs: complaints,
                totalDocs: total,
                page: options.page,
                limit: options.limit,
                totalPages: Math.ceil(total / options.limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get user's complaints
// @route   GET /api/complaints/my
// @access  Private (User)
exports.getMyComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ user: req.user.id })
        .populate('driver', 'firstName lastName')
        .populate('booking', 'bookingNumber')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        data: complaints
    });
});

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private (Admin)
exports.resolveComplaint = asyncHandler(async (req, res) => {
    const { actionTaken, adminNotes, penaltyData } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = 'resolved';
    complaint.adminNotes = adminNotes;
    complaint.resolution = {
        actionTaken: actionTaken || 'none',
        resolvedAt: Date.now(),
        resolvedBy: req.admin?.id // Assuming admin auth middleware attaches admin to req
    };

    // If penalty is applied
    if (actionTaken === 'penalty' && penaltyData) {
        const { amount, reason } = penaltyData;

        // Apply penalty to driver using the existing Driver method
        const driver = await Driver.findById(complaint.driver);
        if (driver) {
            // Use the existing applyPenalty method on the Driver model
            await driver.applyPenalty(
                'other', // Use 'other' or map category to penalty type
                parseFloat(amount),
                reason || `Penalty for complaint: ${complaint.category}`,
                complaint.booking,
                'admin'
            );

            complaint.resolution.penaltyAmount = amount;
        }
    }

    await complaint.save();

    res.json({
        success: true,
        message: 'Complaint resolved successfully',
        data: complaint
    });
});
