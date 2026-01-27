const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' }); // Adjust path as needed

const PORT = 5001; // Your backend port
const SALT_KEY = process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'; // Use sandbox default if missing
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

const simulateWebhook = async (merchantOrderId, amount = 1000) => {
    // 1. Construct Payload
    const payload = {
        code: 'PAYMENT_SUCCESS',
        date: new Date().toISOString(), // PhonePe format might differ slightly but this usually works
        data: {
            merchantId: 'PGTESTPAYUAT',
            merchantOrderId: merchantOrderId,
            transactionId: `TXN_${Date.now()}`,
            amount: amount * 100, // paise
            providerReferenceId: `PROV_${Date.now()}`,
            paymentState: 'COMPLETED',
            payResponseCode: 'SUCCESS',
            transactionState: 'COMPLETED', // Added for robustness
            state: 'COMPLETED'
        }
    };

    // 2. Encode to Base64
    const jsonString = JSON.stringify(payload);
    const base64Response = Buffer.from(jsonString).toString('base64');

    // 3. Generate X-VERIFY
    // Formula: SHA256(response + saltKey) + ### + saltIndex
    const dataToHash = base64Response + SALT_KEY;
    const checksum = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const xVerify = `${checksum}###${SALT_INDEX}`;

    console.log(`[Simulate] Sending Webhook for Order: ${merchantOrderId}`);
    console.log(`[Simulate] X-VERIFY: ${xVerify}`);
    console.log(`[Simulate] Payload:`, payload);

    try {
        const response = await axios.post(`http://localhost:${PORT}/api/payments/webhook`,
            { response: base64Response },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-verify': xVerify
                }
            }
        );
        console.log('[Simulate] Response:', response.data);
    } catch (error) {
        console.error('[Simulate] Failed:', error.response ? error.response.data : error.message);
    }
};

// Get ID from command line
const orderId = process.argv[2];
if (!orderId) {
    console.log('Usage: node simulate-webhook.js <merchantOrderId>');
    console.log('Example: node simulate-webhook.js ORDER_12345');
    process.exit(1);
}

simulateWebhook(orderId);
