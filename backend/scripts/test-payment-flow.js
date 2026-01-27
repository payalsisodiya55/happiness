const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models and services
const User = require('../models/User');
const Payment = require('../models/Payment');
const PhonePeService = require('../services/phonePeService');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI_PROD || process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const getTestToken = async () => {
  try {
    // Find test user
    const testUser = await User.findOne({ phone: '9589579906' }) || await User.findOne({});
    if (!testUser) {
      console.error('❌ No users found in database.');
      return null;
    }

    // Generate JWT token
    const token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    console.log('✅ Test token generated for user:', testUser.firstName, testUser.lastName);
    return { token, user: testUser };
  } catch (error) {
    console.error('❌ Failed to generate test token:', error.message);
    return null;
  }
};

const testPhonePeInitiation = async (token) => {
  console.log('\n=== TESTING PHONEPE INITIATION ===');

  try {
    const paymentData = {
      amount: 100, // ₹100
      bookingId: `test_booking_${Date.now()}`,
      paymentType: 'booking',
      redirectUrl: 'http://localhost:8080/payment-status'
    };

    const response = await fetch('http://localhost:5000/api/payments/initiate-phonepe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Initiation failed:', result);
      return null;
    }

    console.log('✅ PhonePe initiation successful');
    console.log('Redirect URL:', result.data.redirectUrl);
    console.log('Merchant Order ID:', result.data.merchantOrderId);
    return result.data;
  } catch (error) {
    console.error('❌ Initiation error:', error.message);
    return null;
  }
};

const runPaymentFlowTest = async () => {
  console.log('🚀 Testing Complete PhonePe Payment Flow...\n');

  // Connect to database
  await connectDB();

  // Get test token
  const authData = await getTestToken();
  if (!authData) {
    console.error('❌ Cannot proceed without test token');
    process.exit(1);
  }

  const { token, user } = authData;

  // Test PhonePe initiation
  const initiationData = await testPhonePeInitiation(token);
  if (!initiationData) {
    console.error('❌ Initiation failed, stopping test');
  } else {
    console.log('\n=== PAYMENT FLOW TEST SUMMARY ===');
    console.log('✅ Database Connection: Working');
    console.log('✅ Authentication: Working');
    console.log('✅ PhonePe Initiation: Working');
    console.log('✅ User:', user.firstName, user.lastName, `(${user.phone})`);
    console.log('✅ Merchant Order ID:', initiationData.merchantOrderId);
    console.log('✅ Provider:', initiationData.provider);
  }

  // Close database connection
  await mongoose.connection.close();
};

// Run the test
runPaymentFlowTest().catch(console.error);
