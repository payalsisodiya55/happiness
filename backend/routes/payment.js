const express = require('express');
const { body, param, query } = require('express-validator');
const {
  testPaymentEndpoint,
  initiatePhonePePayment,
  handlePhonePeCallback,
  getPhonePePaymentStatus,
  getPaymentHistory,
  getPaymentById,
  getWalletBalance,
  getWalletTransactions
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// Test endpoint (public)
router.get('/test', testPaymentEndpoint);

// Route to check PhonePe payment status (publicly accessible for redirects)
router.get('/status/:merchantOrderId', getPhonePePaymentStatus);

// Public PhonePe callback endpoint
router.post('/phonepe-callback', handlePhonePeCallback);

// Public PhonePe Webhook endpoint
router.post('/webhook', require('../controllers/paymentController').handlePhonePeWebhook);

// Apply authentication middleware to all routes BELOW this
router.use(protect);

/**
 * @route   POST /api/payments/initiate-phonepe
 * @desc    Initiate PhonePe payment redirect
 * @access  Private
 */
router.post('/initiate-phonepe', [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
  body('bookingId').optional().isString().withMessage('Invalid booking ID format'),
  body('paymentType').optional().isIn(['booking', 'wallet_recharge', 'partial_payment']).withMessage('Invalid payment type'),
  body('redirectUrl').optional().isString().withMessage('Redirect URL must be a string')
], validate, initiatePhonePePayment);

/**
 * @route   GET /api/payments/history
 * @desc    Get user payment history
 * @access  Private
 */
router.get('/history', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Invalid status')
], validate, getPaymentHistory);

/**
 * @route   GET /api/payments/wallet/balance
 * @desc    Get wallet balance
 * @access  Private
 */
router.get('/wallet/balance', getWalletBalance);

/**
 * @route   GET /api/payments/wallet/transactions
 * @desc    Get wallet transactions
 * @access  Private
 */
router.get('/wallet/transactions', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['credit', 'debit', 'all']).withMessage('Invalid transaction type')
], validate, getWalletTransactions);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid payment ID')
], validate, getPaymentById);

module.exports = router;
