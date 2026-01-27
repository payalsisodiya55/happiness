const express = require('express');
const { body, param, query } = require('express-validator');
const {
  adminSignup,
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUser,
  deleteUser,
  toggleUserVerification,
  bulkUpdateUserStatus,
  bulkDeleteUsers,
  getAllDrivers,
  getDriverById,
  updateDriverStatus,
  createDriver,
  deleteDriver,
  bulkDeleteDrivers,
  getAllVehicles,
  getPendingVehicleApprovals,
  approveVehicle,
  rejectVehicle,
  deleteVehicle,
  getVehicleApprovalStats,
  getAllBookings,
  getAllBookingsForExport,
  getBookingById,
  updateBookingStatus,
  processRefund,
  getBookingPaymentDetails,
  updateCashPaymentStatus,
  approveCancellationRequest,
  rejectCancellationRequest,
  initiateRefund,
  completeRefund,
  applyPenalty,
  getDriverPenalties,
  waivePenalty,
  getAllPenalties,
  getPenaltyStats,
  getSystemAnalytics,
  getActivityLog,
  uploadDriverDocument,
  uploadDriverInsuranceDocument,
  deleteDriverDocument,
  deleteDriverInsuranceDocument
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { uploadDocumentWithErrorHandling } = require('../utils/driverDocumentUpload');

const router = express.Router();

// Public admin auth routes (no authentication required)
router.post('/signup', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password and confirm password do not match');
    }
    return true;
  }).withMessage('Password and confirm password do not match')
], validate, adminSignup);

router.post('/login', [
  body('phone').isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number'),
  body('password').notEmpty().withMessage('Password is required')
], validate, adminLogin);

// Apply authentication middleware to all protected routes
router.use(protectAdmin);

// Profile routes
router.get('/profile', getAdminProfile);
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number')
], validate, updateAdminProfile);

router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], validate, changeAdminPassword);

// Dashboard and analytics routes
router.get('/dashboard', [
  query('period').optional().isIn(['week', 'month', 'year']).withMessage('Period must be week, month, or year')
], validate, getDashboardStats);

router.get('/analytics', [
  query('period').optional().isIn(['week', 'month', 'year']).withMessage('Period must be week, month, or year')
], validate, getSystemAnalytics);

// User management routes
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('status').optional().isIn(['active', 'inactive', 'suspended', 'pending']).withMessage('Invalid status'),
  query('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean'),
  query('sortBy').optional().isString().withMessage('Sort by must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], validate, getAllUsers);

router.get('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], validate, getUserById);

router.put('/users/:id/status', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('status').isIn(['active', 'inactive', 'suspended', 'pending']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], validate, updateUserStatus);

router.put('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number'),
  body('address.city').optional().isString().withMessage('City must be a string'),
  body('address.state').optional().isString().withMessage('State must be a string'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isVerified').optional().isBoolean().withMessage('isVerified must be a boolean'),
  body('totalBookings').optional().isInt({ min: 0 }).withMessage('Total bookings must be a non-negative integer'),
  body('totalSpent').optional().isFloat({ min: 0 }).withMessage('Total spent must be a non-negative number')
], validate, updateUser);

router.delete('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], validate, deleteUser);

router.put('/users/:id/verification', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('isVerified').isBoolean().withMessage('isVerified must be a boolean')
], validate, toggleUserVerification);

router.put('/users/bulk/status', [
  body('userIds').isArray({ min: 1 }).withMessage('User IDs array is required'),
  body('userIds.*').isMongoId().withMessage('Invalid user ID'),
  body('status').isIn(['active', 'inactive', 'suspended', 'pending']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], validate, bulkUpdateUserStatus);

router.delete('/users/bulk', [
  body('userIds').isArray({ min: 1 }).withMessage('User IDs array is required'),
  body('userIds.*').isMongoId().withMessage('Invalid user ID')
], validate, bulkDeleteUsers);

// Driver management routes
router.get('/drivers', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('status').optional().isIn(['active', 'inactive', 'suspended', 'pending', 'verified']).withMessage('Invalid status'),
  query('isOnline').optional().isIn(['true', 'false']).withMessage('isOnline must be true or false'),
  query('sortBy').optional().isString().withMessage('Sort by must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], validate, getAllDrivers);

router.post('/drivers', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('phone').isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validate, createDriver);

router.get('/drivers/:id', [
  param('id').isMongoId().withMessage('Invalid driver ID')
], validate, getDriverById);

router.put('/drivers/:id/status', [
  param('id').isMongoId().withMessage('Invalid driver ID'),
  body('status').isIn(['active', 'inactive', 'suspended', 'pending', 'verified']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], validate, updateDriverStatus);

router.delete('/drivers/:id', [
  param('id').isMongoId().withMessage('Invalid driver ID')
], validate, deleteDriver);

router.delete('/drivers/bulk', [
  body('driverIds').isArray({ min: 1 }).withMessage('Driver IDs array is required'),
  body('driverIds.*').isMongoId().withMessage('Invalid driver ID')
], validate, bulkDeleteDrivers);

// Driver document upload routes
router.post('/drivers/:id/documents/rc-card', [
  param('id').isMongoId().withMessage('Invalid driver ID')
], validate, uploadDocumentWithErrorHandling, uploadDriverDocument);

router.post('/drivers/:id/documents/insurance', [
  param('id').isMongoId().withMessage('Invalid driver ID')
], validate, uploadDocumentWithErrorHandling, uploadDriverInsuranceDocument);

router.delete('/drivers/:id/documents/rc-card', [
  param('id').isMongoId().withMessage('Invalid driver ID')
], validate, deleteDriverDocument);

router.delete('/drivers/:id/documents/insurance', [
  param('id').isMongoId().withMessage('Invalid driver ID')
], validate, deleteDriverInsuranceDocument);

// Vehicle management routes
router.get('/vehicles', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('type').optional().isIn(['car', 'bike', 'auto', 'bus', 'truck']).withMessage('Invalid vehicle type'),
  query('isAvailable').optional().isIn(['true', 'false']).withMessage('isAvailable must be true or false'),
  query('approvalStatus').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid approval status'),
  query('sortBy').optional().isString().withMessage('Sort by must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], validate, getAllVehicles);

router.get('/vehicles/pending', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validate, getPendingVehicleApprovals);

router.get('/vehicles/approval-stats', getVehicleApprovalStats);

router.put('/vehicles/:id/approve', [
  param('id').isMongoId().withMessage('Invalid vehicle ID'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, approveVehicle);

router.put('/vehicles/:id/reject', [
  param('id').isMongoId().withMessage('Invalid vehicle ID'),
  body('reason').notEmpty().withMessage('Rejection reason is required'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, rejectVehicle);

router.delete('/vehicles/:id', [
  param('id').isMongoId().withMessage('Invalid vehicle ID')
], validate, deleteVehicle);

// Booking management routes
router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'accepted', 'started', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('sortBy').optional().isString().withMessage('Sort by must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], validate, getAllBookings);

router.get('/bookings/export', [
  query('status').optional().isIn(['pending', 'accepted', 'started', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  query('sortBy').optional().isString().withMessage('Sort by must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], validate, getAllBookingsForExport);

router.get('/bookings/:id', [
  param('id').isMongoId().withMessage('Invalid booking ID')
], validate, getBookingById);

router.put('/bookings/:id/status', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('status').isIn(['pending', 'accepted', 'started', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, updateBookingStatus);

router.post('/bookings/:id/refund', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('refundMethod').isIn(['phonepe', 'manual']).withMessage('Refund method must be phonepe or manual'),
  body('refundReason').optional().isString().withMessage('Refund reason must be a string'),
  body('adminNotes').optional().isString().withMessage('Admin notes must be a string')
], validate, processRefund);

router.get('/bookings/:id/payment', [
  param('id').isMongoId().withMessage('Invalid booking ID')
], validate, getBookingPaymentDetails);

router.put('/bookings/:id/cash-collected', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, updateCashPaymentStatus);

// Approve cancellation request
router.put('/bookings/:id/approve-cancellation', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, approveCancellationRequest);

// Reject cancellation request
router.put('/bookings/:id/reject-cancellation', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, rejectCancellationRequest);

// Initiate refund for cancelled booking
router.post('/bookings/:id/initiate-refund', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('refundMethod').optional().isIn(['phonepe', 'manual']).withMessage('Invalid refund method'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, initiateRefund);

// Complete refund for cancelled booking
router.put('/bookings/:id/complete-refund', [
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('notes').optional().isString().withMessage('Notes must be a string')
], validate, completeRefund);

// Penalty Management Routes
router.post('/drivers/:id/penalty', [
  param('id').isMongoId().withMessage('Invalid driver ID'),
  body('type').isIn([
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
  ]).withMessage('Invalid penalty type'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('reason').isString().notEmpty().withMessage('Reason is required'),
  body('bookingId').optional().isMongoId().withMessage('Invalid booking ID')
], validate, applyPenalty);

router.get('/drivers/:id/penalties', [
  param('id').isMongoId().withMessage('Invalid driver ID'),
  query('page').optional().isNumeric().withMessage('Page must be a number'),
  query('limit').optional().isNumeric().withMessage('Limit must be a number'),
  query('status').optional().isIn(['active', 'waived', 'paid']).withMessage('Invalid status')
], validate, getDriverPenalties);

router.put('/penalties/:id/waive', [
  param('id').isMongoId().withMessage('Invalid penalty ID'),
  body('reason').isString().notEmpty().withMessage('Waive reason is required')
], validate, waivePenalty);

router.get('/penalties', [
  query('page').optional().isNumeric().withMessage('Page must be a number'),
  query('limit').optional().isNumeric().withMessage('Limit must be a number'),
  query('status').optional().isIn(['active', 'waived', 'paid']).withMessage('Invalid status'),
  query('type').optional().isIn([
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
  ]).withMessage('Invalid penalty type'),
  query('driver').optional().isMongoId().withMessage('Invalid driver ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], validate, getAllPenalties);

router.get('/penalties/stats', [
  query('period').optional().isIn(['week', 'month', 'year']).withMessage('Invalid period')
], validate, getPenaltyStats);

// Activity log routes
router.get('/activity-log', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validate, getActivityLog);

module.exports = router;
