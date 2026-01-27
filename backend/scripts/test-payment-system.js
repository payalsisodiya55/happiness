const mongoose = require('mongoose');
const PhonePeService = require('../services/phonePeService');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PROD);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const testPhonePeService = async () => {
  console.log('\n=== TESTING PHONEPE SERVICE ===');

  // Check environment variables
  console.log('PHONEPE_MERCHANT_ID:', process.env.PHONEPE_MERCHANT_ID ? '✅ Configured' : '❌ Missing');
  console.log('PHONEPE_CLIENT_ID:', process.env.PHONEPE_CLIENT_ID ? '✅ Configured' : '❌ Missing');
  console.log('PHONEPE_ENV:', process.env.PHONEPE_ENV || 'SANDBOX');

  // Check if service is configured (we can check credentials)
  const isConfigured = !!(process.env.PHONEPE_MERCHANT_ID && process.env.PHONEPE_CLIENT_ID);
  console.log('PhonePe Credentials Present:', isConfigured ? '✅ Yes' : '❌ No');

  if (!isConfigured) {
    console.error('❌ PhonePe service is not configured properly in .env');
    return false;
  }

  // Test payment initiation (mock call or real sandbox call)
  console.log('\n=== TESTING PAYMENT INITIATION ===');
  try {
    const paymentData = {
      amount: 100, // ₹100
      merchantOrderId: `test_${Date.now()}`,
      redirectUrl: 'http://localhost:3000/payment-status',
      callbackUrl: 'http://localhost:5000/api/payments/phonepe-callback',
      mobileNumber: '9999999999'
    };

    console.log('Initiating test payment...');
    const response = await PhonePeService.initiatePayment(paymentData);
    console.log('✅ Payment initiated successfully');
    console.log('Redirect URL:', response.redirectUrl);
    console.log('Merchant Order ID:', response.merchantOrderId);

    return true;
  } catch (error) {
    console.error('❌ Payment initiation failed:', error.message);
    if (error.response) {
      console.error('Error Details:', JSON.stringify(error.response, null, 2));
    }
    return false;
  }
};

const testPaymentModels = async () => {
  console.log('\n=== TESTING PAYMENT MODELS ===');

  try {
    const Payment = require('../models/Payment');

    // Test creating a payment record
    const testPayment = {
      user: new mongoose.Types.ObjectId(), // Dummy user ID
      amount: 100,
      currency: 'INR',
      method: 'upi',
      status: 'pending',
      type: 'booking',
      paymentGateway: 'phonepe',
      paymentDetails: {
        phonePeMerchantOrderId: `test_merchant_${Date.now()}`
      }
    };

    const payment = await Payment.create(testPayment);
    console.log('✅ Payment record created successfully');
    console.log('Payment ID:', payment._id);

    // Clean up test payment
    await Payment.findByIdAndDelete(payment._id);
    console.log('✅ Test payment cleaned up');

    return true;
  } catch (error) {
    console.error('❌ Payment model test failed:', error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('🚀 Starting PhonePe Payment System Tests...\n');

  // Connect to database
  await connectDB();

  // Test PhonePe service
  const phonePeTest = await testPhonePeService();

  // Test payment models
  const paymentModelTest = await testPaymentModels();

  // Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log('PhonePe Service:', phonePeTest ? '✅ PASS' : '❌ FAIL');
  console.log('Payment Models:', paymentModelTest ? '✅ PASS' : '❌ FAIL');

  if (phonePeTest && paymentModelTest) {
    console.log('\n🎉 All tests passed! PhonePe system is working.');
  } else {
    console.log('\n❌ Some tests failed. Check the logs above.');
  }

  // Close database connection
  await mongoose.connection.close();
  console.log('Database connection closed.');
};

// Run tests
runTests().catch(console.error);
