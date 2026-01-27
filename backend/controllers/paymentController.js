const Payment = require('../models/Payment');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const { sendEmail, sendPaymentConfirmationSMS } = require('../utils/notifications');
const asyncHandler = require('../middleware/asyncHandler');
const PhonePeService = require('../services/phonePeService');
const { v4: uuidv4 } = require('uuid');

const normalizeMerchantOrderId = (data) => {
  return (
    data?.merchantOrderId ||
    data?.merchantTransactionId ||
    data?.orderId ||
    data?.transactionId ||
    null
  );
};


/**
 * @desc    Test payment endpoint
 * @route   GET /api/payments/test
 * @access  Public
 */
const testPaymentEndpoint = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Payment controller is working!',
    timestamp: new Date().toISOString(),
    data: {
      status: 'active',
      version: '2.0.0',
      provider: 'PhonePe'
    }
  });
});

/**
 * @desc    Initiate PhonePe payment
 * @route   POST /api/payments/initiate-phonepe
 * @access  Private (User/Driver)
 */
const initiatePhonePePayment = asyncHandler(async (req, res) => {
  const { amount, bookingId, paymentType = 'booking', redirectUrl } = req.body;

  console.log('=== [PaymentInitiate] Start ===');
  console.log(`[PaymentInitiate] Request body: amount=${amount}, bookingId=${bookingId}, type=${paymentType}`);

  // Get the current user
  const currentUser = req.user || req.driver;
  if (!currentUser) {
    console.error('[PaymentInitiate] ❌ No user authenticated');
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const userId = currentUser.id || currentUser._id;
  console.log(`[PaymentInitiate] Initiated by User/Driver ID: ${userId}, Email: ${currentUser.email}`);

  try {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    const merchantOrderId = `ORDER_${uuidv4().substring(0, 8)}_${Date.now()}`;
    console.log(`[PaymentInitiate] Using numeric amount: ${numericAmount} and ID: ${merchantOrderId}`);

    // Create a pending payment record
    const payment = await Payment.create({
      user: userId,
      amount: numericAmount,
      currency: 'INR',
      method: 'phonepe',
      status: 'pending',
      type: paymentType,
      paymentGateway: 'phonepe',
      paymentDetails: {
        phonePeMerchantOrderId: merchantOrderId
      },
      booking: (bookingId && !bookingId.toString().startsWith('temp_')) ? bookingId : undefined,
      temporaryBookingId: (bookingId && bookingId.toString().startsWith('temp_')) ? bookingId : undefined,
      metadata: {
        userModel: req.driver ? 'Driver' : 'User',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        deviceType: 'web'
      }
    });

    console.log(`[PaymentInitiate] Payment record created: ${payment._id}, Type: ${payment.type}`);

    const callbackUrl = `${process.env.BACKEND_URL || 'https://your-api.com'}/api/payments/phonepe-callback`;

    const paymentData = {
      amount: numericAmount,
      merchantOrderId,
      redirectUrl: redirectUrl || `${process.env.FRONTEND_URL}/payment-status?merchantOrderId=${merchantOrderId}`,
      callbackUrl,
      mobileNumber: currentUser.phone || '9999999999'
    };

    console.log('[PaymentInitiate] Initiating with PhonePeService...');
    const response = await PhonePeService.initiatePayment(paymentData);

    res.json({
      success: true,
      data: {
        ...response,
        paymentId: payment._id
      }
    });
  } catch (error) {
    console.error('[PaymentInitiate] ❌ PhonePe initiation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to initiate PhonePe payment',
      error: error.message,
    });
  }
});

/**
 * @desc    Handle PhonePe callback
 * @route   POST /api/payments/phonepe-callback
 * @access  Public
 */
const handlePhonePeCallback = asyncHandler(async (req, res) => {
  try {
    console.log('=== [Callback] PHONEPE CALLBACK START ===');
    const xVerify = req.headers['x-verify'];
    const responseBody = req.body;

    // Verify callback signature
    const isValid = await PhonePeService.verifyCallback(responseBody, xVerify);
    if (!isValid) {
      console.error('[Callback] ❌ Invalid PhonePe callback signature');
      return res.status(400).send('Invalid signature');
    }

    // Extract data from response
    // For V2 SDK, the response is usually the JSON if verification passed
    const paymentResponse = responseBody;
    const merchantOrderId = paymentResponse.merchantOrderId;
    const transactionId = paymentResponse.transactionId;
    const status = paymentResponse.code === 'PAYMENT_SUCCESS' ? 'completed' : 'failed';
    const amount = paymentResponse.amount / 100; // back to rupees

    console.log(`[Callback] Payment Status for ${merchantOrderId}: ${status}`);

    const payment = await Payment.findOne({ 'paymentDetails.phonePeMerchantOrderId': merchantOrderId });
    if (!payment) {
      console.error('[Callback] ❌ Payment record not found for Order:', merchantOrderId);
      return res.status(404).send('Payment not found');
    }

    if (payment.status === 'completed') {
      console.log('[Callback] Payment already completed independently.');
      return res.status(200).send('OK');
    }

    if (status === 'completed') {
      payment.status = 'completed';
      payment.transactionId = transactionId;
      payment.paymentDetails.phonePeTransactionId = transactionId;
      payment.paymentDetails.gatewayResponse = paymentResponse;
      payment.timestamps.completed = new Date();
      await payment.save();

      console.log('[Callback] ✅ Payment marked as completed in DB');

      // Update Booking if applicable
      if (payment.booking) {
        const booking = await Booking.findById(payment.booking);
        if (booking) {
          booking.payment.status = 'completed';
          booking.payment.transactionId = transactionId;
          booking.payment.completedAt = new Date();
          booking.payment.method = 'phonepe';
          booking.payment.amount = amount;

          // If it's a partial payment booking, update the online portion status
          if (booking.payment.isPartialPayment && booking.payment.partialPaymentDetails) {
            booking.payment.partialPaymentDetails.onlinePaymentStatus = 'completed';
            booking.payment.partialPaymentDetails.onlinePaymentAt = new Date();
            booking.payment.partialPaymentDetails.onlineTransactionId = transactionId;
            console.log('[Callback] 🧩 Booking partialPaymentDetails.onlinePaymentStatus updated to completed');
          }

          await booking.save();
          console.log('[Callback] Booking payment status updated');
        }
      }

      // Update Wallet if applicable
      if (payment.type === 'wallet_recharge') {
        const userId = String(payment.user);
        const userModel = payment.metadata?.userModel;
        console.log(`[Callback] 💰 Wallet Recharge for UserID: ${userId}, Model: ${userModel || 'Auto-detect'}`);

        let credited = false;

        // 1. Try specified model from metadata if available
        if (userModel === 'Driver') {
          const driver = await Driver.findById(userId);
          if (driver) {
            await creditDriverWallet(driver, amount, transactionId, `Wallet Recharge via PhonePe (Callback)`);
            credited = true;
          }
        } else if (userModel === 'User') {
          const user = await User.findById(userId);
          if (user) {
            await creditUserWallet(user, amount, transactionId, `Wallet Recharge via PhonePe (Callback)`);
            credited = true;
          }
        }

        // 2. Fallback to auto-detect if not credited yet
        if (!credited) {
          const driver = await Driver.findById(userId);
          if (driver) {
            await creditDriverWallet(driver, amount, transactionId, `Wallet Recharge via PhonePe (Callback)`);
          } else {
            const user = await User.findById(userId);
            if (user) {
              await creditUserWallet(user, amount, transactionId, `Wallet Recharge via PhonePe (Callback)`);
            } else {
              console.error(`[Callback] ❌ No User or Driver found for ID: ${userId}`);
            }
          }
        }
      }

      // Send confirmation notifications
      try {
        const userObj = await User.findById(payment.user) || await Driver.findById(payment.user);
        if (userObj && userObj.phone) {
          await sendPaymentConfirmationSMS(userObj.phone, merchantOrderId, amount);
        }
      } catch (notifyError) {
        console.error('[Callback] Notification failed:', notifyError.message);
      }
    } else {
      payment.status = 'failed';
      payment.timestamps.failed = new Date();
      payment.error = {
        message: paymentResponse.message || 'Payment failed'
      };
      await payment.save();
      console.log(`[Callback] Payment marked as failed: ${paymentResponse.message}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('[Callback] ❌ PhonePe callback handling failed:', error);
    res.status(500).send('Error');
  }
});

/**
 * @desc    Get PhonePe payment status
 * @route   GET /api/payments/status/:merchantOrderId
 * @access  Public
 */
const getPhonePePaymentStatus = asyncHandler(async (req, res) => {
  const { merchantOrderId } = req.params;

  console.log(`[PaymentStatus] 🔍 Checking status for MerchantOrderId: ${merchantOrderId}`);

  // 1. Validate merchantOrderId
  if (!merchantOrderId || merchantOrderId === '[object Object]') {
    console.error('[PaymentStatus] ❌ Invalid merchantOrderId received');
    return res.status(400).json({ success: false, message: 'Invalid Merchant Order ID' });
  }

  // 2. Find Payment Record
  let payment = await Payment.findOne({ 'paymentDetails.phonePeMerchantOrderId': merchantOrderId });

  if (!payment) {
    console.error(`[PaymentStatus] ❌ Payment record not found in DB for: ${merchantOrderId}`);
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  console.log(`[PaymentStatus] Found payment: ${payment._id}, Status: ${payment.status}, Amount: ${payment.amount}`);

  // 2.5 Ownership Check (Security & Bug prevention for shared sessions)
  const currentUser = req.user || req.driver;
  if (currentUser) {
    const requesterId = String(currentUser._id || currentUser.id);
    const ownerId = String(payment.user);

    if (requesterId !== ownerId) {
      console.warn(`[PaymentStatus] ⚠️ Unauthorized status check attempt. Payer: ${ownerId}, Requester: ${requesterId}`);
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to check this payment status'
      });
    }
  }
  // 3. Status API Check (Only poll if not already completed)
  if (payment.status !== 'completed') {
    try {
      console.log(`[PaymentStatus] 🔄 Polling PhonePe API...`);
      const rawResponse = await PhonePeService.checkStatus(merchantOrderId);

      console.log(`[PaymentStatus] 🔎 PhonePe API Response: ${JSON.stringify(rawResponse)}`);

      // Robust Status Parsing (Matches Webhook Logic)
      const code = rawResponse?.code;
      const state = rawResponse?.data?.state || rawResponse?.data?.transactionState;
      const transactionId = rawResponse?.data?.transactionId || rawResponse?.data?.providerReferenceId || rawResponse?.data?.paymentInstrument?.instrumentReferenceId;

      const isSuccess = (code === 'PAYMENT_SUCCESS' || code === 'TRANSACTION_COMPLETED' || state === 'COMPLETED');

      console.log(`[PaymentStatus] Computed Status -> Code: ${code}, State: ${state}, Success: ${isSuccess}`);

      if (isSuccess) {
        console.log(`[PaymentStatus] ✅ Payment Confirmed by Gateway. Updating DB...`);

        const amount = payment.amount;
        const finalTxnId = transactionId || `TXN_${Date.now()}`;

        // 5. Update Payment Status in DB
        payment.status = 'completed';
        payment.transactionId = finalTxnId;
        payment.paymentDetails.phonePeTransactionId = finalTxnId;
        payment.paymentDetails.gatewayResponse = rawResponse;
        payment.timestamps.completed = new Date();

        await payment.save();
        console.log('[PaymentStatus] Payment record updated to completed.');

        // 6. Update Wallet (Unified Logic)
        if (payment.type === 'wallet_recharge') {
          const userId = String(payment.user);
          const userModel = payment.metadata?.userModel;
          console.log(`[PaymentStatus] 💰 Crediting Wallet. UserID: ${userId}, Model: ${userModel || 'Auto'}`);

          let credited = false;
          if (userModel === 'Driver') {
            const driver = await Driver.findById(userId);
            if (driver) {
              await creditDriverWallet(driver, amount, finalTxnId, `Wallet Recharge via PhonePe (Status)`);
              credited = true;
            }
          } else if (userModel === 'User') {
            const user = await User.findById(userId);
            if (user) {
              await creditUserWallet(user, amount, finalTxnId, `Wallet Recharge via PhonePe (Status)`);
              credited = true;
            }
          }

          if (!credited) {
            const driver = await Driver.findById(userId);
            if (driver) {
              await creditDriverWallet(driver, amount, finalTxnId, `Wallet Recharge via PhonePe (Status)`);
            } else {
              const user = await User.findById(userId);
              if (user) await creditUserWallet(user, amount, finalTxnId, `Wallet Recharge via PhonePe (Status)`);
            }
          }
        }
      } else if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED') {
        console.log(`[PaymentStatus] Payment Gateway reported: ${code}`);
        if (process.env.NODE_ENV === 'production') {
          payment.status = 'failed';
          payment.error = { message: rawResponse?.message || 'Payment failed' };
          await payment.save();
        } else {
          console.log(`[PaymentStatus] ⚠️ Gateway error ignored in DEV mode to allow force-success override.`);
        }
      }
    } catch (err) {
      console.error('[PaymentStatus] ❌ Error polling PhonePe status:', err);
    }
  }

  // =============================
  // DEVELOPMENT / SANDBOX OVERRIDE (FORCE SUCCESS)
  // =============================
  if (process.env.NODE_ENV !== 'production' && payment && payment.status === 'pending') {
    const devTxnId = payment.paymentDetails.phonePeTransactionId || `TXN_DEV_${Date.now()}`;
    console.log(`[DEV MODE] ⚠️ Force completing payment for ${payment._id} with Txn: ${devTxnId}`);

    payment.status = 'completed';
    payment.timestamps.completed = new Date();
    payment.transactionId = devTxnId;
    await payment.save();

    // After saving payment, ensure we credit the wallet if it's a recharge
    if (payment.type === 'wallet_recharge') {
      const userId = String(payment.user);
      const amount = parseFloat(payment.amount);
      const userModel = payment.metadata?.userModel;

      console.log(`[DEV MODE] 💰 Wallet Credit. UserID: ${userId}, Model: ${userModel || 'Auto'}`);

      let credited = false;
      if (userModel === 'Driver') {
        const driver = await Driver.findById(userId);
        if (driver) {
          await creditDriverWallet(driver, amount, devTxnId, `Wallet Recharge (Dev Force Success)`);
          credited = true;
        }
      } else if (userModel === 'User') {
        const user = await User.findById(userId);
        if (user) {
          await creditUserWallet(user, amount, devTxnId, `Wallet Recharge (Dev Force Success)`);
          credited = true;
        }
      }

      if (!credited) {
        const driver = await Driver.findById(userId);
        if (driver) {
          await creditDriverWallet(driver, amount, devTxnId, `Wallet Recharge (Dev Force Success)`);
        } else {
          const user = await User.findById(userId);
          if (user) await creditUserWallet(user, amount, devTxnId, `Wallet Recharge (Dev Force Success)`);
        }
      }
    }
  }

  // Refetch payment to get latest status
  const updatedPayment = await Payment.findById(payment._id);

  res.json({
    success: true,
    data: {
      status: updatedPayment.status,
      amount: updatedPayment.amount,
      type: updatedPayment.type,
      transactionId: updatedPayment.transactionId,
      merchantOrderId: updatedPayment.paymentDetails.phonePeMerchantOrderId,
      paymentId: updatedPayment._id
    }
  });
});

/**
 * @desc    Get current user's payment history
 * @route   GET /api/payments/history
 * @access  Private (User/Driver)
 */
const getPaymentHistory = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.driver;
  const { page = 1, limit = 10, status } = req.query;

  const query = { user: currentUser.id || currentUser._id };
  if (status) query.status = status;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: 'booking'
  };

  const payments = await Payment.paginate(query, options);

  res.json({
    success: true,
    data: payments
  });
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private (User/Driver)
 */
const getPaymentById = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.driver;
  const payment = await Payment.findById(req.params.id)
    .populate('booking')
    .populate('user', 'firstName lastName email');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  const userId = currentUser.id || currentUser._id;
  if (payment.user._id.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this payment'
    });
  }

  res.json({
    success: true,
    data: payment
  });
});

/**
 * @desc    Get wallet balance
 * @route   GET /api/payments/wallet/balance
 * @access  Private (User/Driver)
 */
const getWalletBalance = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.driver;
  const id = currentUser.id || currentUser._id;

  let account = await User.findById(id).select('wallet');
  let balance = 0;

  if (account) {
    // It's a User
    balance = account.wallet ? account.wallet.balance : 0;
  } else {
    // Try Driver
    account = await Driver.findById(id).select('earnings');
    if (account) {
      // It's a Driver
      balance = account.earnings && account.earnings.wallet ? account.earnings.wallet.balance : 0;
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  }

  res.json({
    success: true,
    data: {
      balance,
      currency: 'INR'
    }
  });
});

/**
 * @desc    Get wallet transactions
 * @route   GET /api/payments/wallet/transactions
 * @access  Private (User/Driver)
 */
const getWalletTransactions = asyncHandler(async (req, res) => {
  const currentUser = req.user || req.driver;
  const { page = 1, limit = 20, type } = req.query;
  const id = currentUser.id || currentUser._id;

  let account = await User.findById(id).select('wallet');
  let transactions = [];

  if (account) {
    // It's a User
    transactions = account.wallet ? account.wallet.transactions : [];
  } else {
    // Try Driver
    account = await Driver.findById(id).select('earnings');
    if (account) {
      // It's a Driver
      transactions = account.earnings && account.earnings.wallet ? account.earnings.wallet.transactions : [];
    } else {
      // Return empty if user not found (or handle error)
      return res.json({
        success: true,
        data: {
          transactions: [],
          pagination: { page: 1, limit, total: 0, pages: 0 }
        }
      });
    }
  }

  if (type && type !== 'all') {
    transactions = transactions.filter(t => t.type === type);
  }

  // Sort by date desc
  transactions.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));

  // Paginate transactions
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      transactions: paginatedTransactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: transactions.length,
        pages: Math.ceil(transactions.length / parseInt(limit))
      }
    }
  });
});

/**
 * @desc    Handle PhonePe Webhook (S2S)
 * @route   POST /api/payments/webhook
 * @access  Public
 */
/**
 * @desc    Handle PhonePe Webhook (S2S)
 * @route   POST /api/payments/webhook
 * @access  Public
 */
const handlePhonePeWebhook = asyncHandler(async (req, res) => {
  console.log('=== [Webhook] PHONEPE WEBHOOK RECEIVED ===');
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('Body:', JSON.stringify(req.body));

  const xVerify = req.headers['x-verify'];
  const responseBody = req.body;

  // 1. Verify Signature (DEV MODE: Log invalid but allow processing)
  const isValid = PhonePeService.verifyWebhook(responseBody, xVerify);
  if (!isValid) {
    console.warn('[Webhook] ❌ Invalid Signature. LOGGING ONLY FOR DEV MODE. Processing anyway.');
  }

  // 2. Decode Payload
  let payload;
  try {
    const base64Response = responseBody.response; // Base64 encoded JSON
    const decodedBuffer = Buffer.from(base64Response, 'base64');
    const decodedString = decodedBuffer.toString('utf-8');
    payload = JSON.parse(decodedString);
    console.log('[Webhook] 📦 Decoded Payload:', JSON.stringify(payload, null, 2));
  } catch (err) {
    console.error('[Webhook] ❌ Failed to decode payload:', err);
    return res.status(400).json({ message: 'Invalid Payload' });
  }

  const { code, data } = payload;

  // 3. Robust Field Extraction (Sandbox/Dev fixes)
  const merchantOrderId = normalizeMerchantOrderId(data);
  const transactionId = data?.transactionId || data?.paymentInstrument?.instrumentReferenceId || merchantOrderId;

  // Amount comes in paise, usually in data.amount or data.paymentInstrument.amount
  let rawAmount = data?.amount || data?.paymentInstrument?.amount || 0;
  const amount = rawAmount / 100; // Convert to Rupees

  const state = data?.state || code;

  console.log(`[Webhook] Processing Order: ${merchantOrderId}, Status: ${code}, Amount: ${amount}`);

  if (!merchantOrderId) {
    console.error('[Webhook] ❌ Merchant Order ID missing in payload');
    return res.status(200).send('OK');
  }

  // 4. Find Payment Record
  const payment = await Payment.findOne({ 'paymentDetails.phonePeMerchantOrderId': merchantOrderId });

  if (!payment) {
    console.warn(`[Webhook] ⚠️ Payment record NOT FOUND for ${merchantOrderId}. Skipping update.`);
    return res.status(200).send('OK');
  }

  // 5. Check Success Condition (Broadened for Sandbox)
  const isSuccess = (code === 'PAYMENT_SUCCESS' || code === 'TRANSACTION_COMPLETED' || state === 'COMPLETED');

  // Idempotency Check
  if (payment.status === 'completed' && isSuccess) {
    console.log('[Webhook] Payment already completed. Skipping update.');
    return res.status(200).send('OK');
  }

  // 6. Update Payment & Wallet
  if (isSuccess) {
    payment.status = 'completed';
    payment.transactionId = transactionId || payment.transactionId;
    payment.paymentDetails.phonePeTransactionId = transactionId;
    payment.paymentDetails.webhookData = payload;
    payment.timestamps.completed = new Date();
    await payment.save();
    console.log('[Webhook] ✅ Payment marked as completed in DB.');

    // Wallet Recharge Logic
    if (payment.type === 'wallet_recharge') {
      const userId = String(payment.user);
      const userModel = payment.metadata?.userModel;
      console.log(`[Webhook] 💰 Wallet Credit. UserID: ${userId}, Model: ${userModel || 'Auto'}`);

      let credited = false;
      if (userModel === 'Driver') {
        const driver = await Driver.findById(userId);
        if (driver) {
          await creditDriverWallet(driver, amount, transactionId, `Wallet Recharge via PhonePe Webhook`);
          credited = true;
        }
      } else if (userModel === 'User') {
        const user = await User.findById(userId);
        if (user) {
          await creditUserWallet(user, amount, transactionId, `Wallet Recharge via PhonePe Webhook`);
          credited = true;
        }
      }

      if (!credited) {
        const driver = await Driver.findById(userId);
        if (driver) {
          await creditDriverWallet(driver, amount, transactionId, `Wallet Recharge via PhonePe Webhook`);
        } else {
          const user = await User.findById(userId);
          if (user) await creditUserWallet(user, amount, transactionId, `Wallet Recharge via PhonePe Webhook`);
        }
      }
    }
  } else if (code === 'PAYMENT_ERROR' || code === 'PAYMENT_DECLINED' || (payload.success === false)) {
    payment.status = 'failed';
    payment.timestamps.failed = new Date();
    payment.error = { message: payload.message || 'Webhook reported failure' };
    await payment.save();
    console.log('[Webhook] Payment marked as failed.');
  }

  res.status(200).send('OK');
});

module.exports = {
  testPaymentEndpoint,
  initiatePhonePePayment,
  handlePhonePeCallback,
  handlePhonePeWebhook,
  getPhonePePaymentStatus,
  getPaymentHistory,
  getPaymentById,
  getWalletBalance,
  getWalletTransactions,
  creditDriverWallet,
  creditUserWallet
};

// Helper functions for unified wallet crediting
async function creditDriverWallet(driver, amount, transactionId, baseDesc) {
  try {
    const desc = `${baseDesc} - ${transactionId}`;

    // Robust Idempotency check
    const alreadyExists = driver.earnings?.wallet?.transactions?.some(
      t => t.transactionId === transactionId || (t.description && t.description.includes(transactionId))
    );

    if (alreadyExists) {
      console.log(`[Wallet] Driver ${driver._id} already credited for ${transactionId}. Skipping.`);
      return false;
    }

    if (typeof driver.addEarnings === 'function') {
      await driver.addEarnings(amount, desc);
    } else {
      if (!driver.earnings) driver.earnings = {};
      if (!driver.earnings.wallet) driver.earnings.wallet = { balance: 0, transactions: [] };

      driver.earnings.wallet.balance += amount;
      driver.totalEarnings = (driver.totalEarnings || 0) + amount;
      driver.earnings.wallet.transactions.push({
        type: 'credit',
        amount: amount,
        description: desc,
        date: new Date(),
        transactionId: transactionId
      });
      await driver.save();
    }
    console.log(`[Wallet] ✅ Driver ${driver._id} wallet credited with ₹${amount}`);
    return true;
  } catch (err) {
    console.error(`[Wallet] ❌ Failed to credit Driver ${driver._id}:`, err);
    return false;
  }
}

async function creditUserWallet(user, amount, transactionId, baseDesc) {
  try {
    const desc = `${baseDesc} - ${transactionId}`;

    if (!user.wallet) user.wallet = { balance: 0, transactions: [] };

    const alreadyExists = user.wallet.transactions?.some(
      t => t.transactionId === transactionId || (t.description && t.description.includes(transactionId))
    );

    if (alreadyExists) {
      console.log(`[Wallet] User ${user._id} already credited for ${transactionId}. Skipping.`);
      return false;
    }

    if (typeof user.addToWallet === 'function') {
      await user.addToWallet(amount, desc);
    } else {
      user.wallet.balance += amount;
      user.wallet.transactions.push({
        type: 'credit',
        amount,
        description: desc,
        date: new Date(),
        transactionId: transactionId
      });
      await user.save();
    }
    console.log(`[Wallet] ✅ User ${user._id} wallet credited with ₹${amount}`);
    return true;
  } catch (err) {
    console.error(`[Wallet] ❌ Failed to credit User ${user._id}:`, err);
    return false;
  }
}
