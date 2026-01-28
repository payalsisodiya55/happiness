const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    resolveComplaint
} = require('../controllers/complaintController');
const { protect, protectAdmin } = require('../middleware/auth');

// Public/User routes (Protected by user auth)
router.post('/', protect, createComplaint);
router.get('/my', protect, getMyComplaints);

// Admin routes (Protected by admin auth)
// Note: These routes are mounted at /api/complaints, so we must separate user/admin use carefully.
// GET /api/complaints -> Admin get all
router.get('/', protectAdmin, getAllComplaints);
router.put('/:id/resolve', protectAdmin, resolveComplaint);

module.exports = router;
