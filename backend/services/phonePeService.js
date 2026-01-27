const axios = require('axios');
const qs = require('querystring');
const {
    StandardCheckoutClient,
    StandardCheckoutPayRequest,
    Env
} = require('pg-sdk-node');
const { v4: uuidv4 } = require('uuid');

/**
 * PhonePe Service Layer for Standard Checkout Integration
 * USES PG-SDK-NODE V2.0.3 + Manual OAuth Fallback
 */
class PhonePeService {
    constructor() {
        this.merchantId = process.env.PHONEPE_MERCHANT_ID;
        this.clientId = process.env.PHONEPE_CLIENT_ID;
        this.clientSecret = process.env.PHONEPE_CLIENT_SECRET;
        this.clientVersion = process.env.PHONEPE_CLIENT_VERSION || '1';
        this.env = process.env.PHONEPE_ENV || 'SANDBOX';

        // Base URLs
        this.baseUrl = this.env === 'PRODUCTION'
            ? 'https://api.phonepe.com/apis/hermes'
            : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

        this.accessToken = null;
        this.tokenExpiry = null;

        // Initialize PhonePe Client (Keep for initiatePayment)
        try {
            if (this.clientId && this.clientSecret) {
                this.standardCheckoutClient = StandardCheckoutClient.getInstance(
                    this.clientId,
                    this.clientSecret,
                    parseInt(this.clientVersion),
                    this.env === 'PRODUCTION' ? Env.PRODUCTION : Env.SANDBOX
                );
                console.log('✅ PhonePe Client initialized');
            } else {
                console.warn('⚠️ PhonePe credentials missing. Client not initialized.');
                this.initializationError = new Error('PhonePe credentials missing in .env file');
            }
        } catch (error) {
            console.error('❌ Failed to initialize PhonePe Client:', error.message);
            this.initializationError = error;
        }
    }

    /**
     * Check if PhonePe is properly configured
     */
    isConfigured() {
        return !!this.standardCheckoutClient;
    }

    /**
     * Initiate a payment and get redirect URL
     */
    async initiatePayment(paymentData) {
        try {
            const { amount, merchantOrderId, redirectUrl, mobileNumber } = paymentData;

            // Amount in paise
            const amountInPaise = Math.round(amount * 100);

            if (!this.standardCheckoutClient) {
                if (this.initializationError) {
                    throw new Error(`PhonePe initialization failed: ${this.initializationError.message}`);
                }
                throw new Error('PhonePe client not initialized. Please check your credentials in .env file.');
            }

            const request = StandardCheckoutPayRequest.builder()
                .merchantOrderId(merchantOrderId || uuidv4())
                .amount(amountInPaise)
                .redirectUrl(redirectUrl)
                .build();

            console.log('Initiating PhonePe payment for Order:', merchantOrderId);

            const response = await this.standardCheckoutClient.pay(request);

            if (response && response.redirectUrl) {
                return {
                    success: true,
                    redirectUrl: response.redirectUrl,
                    merchantOrderId: merchantOrderId,
                    amount: amountInPaise
                };
            } else {
                throw new Error('Failed to get redirect URL from PhonePe');
            }
        } catch (error) {
            console.error('PhonePe initiatePayment error:', error);
            throw error;
        }
    }

    /**
     * Get OAuth Access Token
     * Implements: POST /v1/oauth/token
     */
    async getAccessToken() {
        // Return cached token if valid (buffer of 60s)
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        console.log('Generating new PhonePe Access Token...');
        try {
            const data = {
                client_id: this.clientId,
                client_version: this.clientVersion,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials'
            };

            const response = await axios.post(
                `${this.baseUrl}/v1/oauth/token`,
                qs.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (response.data && response.data.access_token) {
                this.accessToken = response.data.access_token;
                // expires_in is seconds
                const expiresIn = response.data.expires_in || 3600;
                this.tokenExpiry = new Date(new Date().getTime() + (expiresIn - 60) * 1000);
                console.log('✅ PhonePe Access Token generated');
                return this.accessToken;
            } else {
                throw new Error('No access_token in response');
            }
        } catch (error) {
            console.error('❌ Custom OAuth Token Error:', error.response?.data || error.message);
            throw new Error('Failed to generate PhonePe Access Token');
        }
    }

    /**
     * Check payment status using Raw API
     * Implements: GET /checkout/v2/order/{merchantOrderId}/status
     */
    async checkStatusRaw(merchantOrderId) {
        try {
            const token = await this.getAccessToken();

            const url = `${this.baseUrl}/checkout/v2/order/${merchantOrderId}/status?details=false`;
            console.log(`Calling Raw Status API: ${url}`);

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `O-Bearer ${token}`,
                    'X-MERCHANT-ID': this.merchantId,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('❌ Raw Status Check Failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Check payment status using Order ID
     * Uses Manual Raw implementation to bypass SDK issues
     */
    async checkStatus(merchantOrderId) {
        try {
            console.log('Checking PhonePe status (RAW API) for Order:', merchantOrderId);
            return await this.checkStatusRaw(merchantOrderId);
        } catch (error) {
            console.error('PhonePe checkStatus error:', error);
            // Fallback to empty/fail response so controller doesn't crash
            return { code: 'PAYMENT_ERROR', message: error.message };
        }
    }

    /**
     * Verify Webhook Signature
     * @param {Object} responseBody - The JSON body received (containing base64 'response')
     * @param {String} xVerify - The X-VERIFY header received
     */
    verifyWebhook(responseBody, xVerify) {
        try {
            // For webhooks, the payload is usually inside 'response' (Base64)
            // Signature = SHA256(response + saltKey) + ### + saltIndex

            if (!responseBody || !responseBody.response) {
                console.warn('⚠️ Webhook body missing "response" field');
                return false;
            }

            const base64Response = responseBody.response; // The actual payload we singed
            // Use clientSecret as Salt Key if typical setup, or check env
            const saltKey = this.clientSecret || process.env.PHONEPE_SALT_KEY;
            const saltIndex = process.env.PHONEPE_SALT_INDEX || '1';

            if (!saltKey) {
                console.error('❌ Missing Salt Key for verification');
                return false;
            }

            const crypto = require('crypto');
            const dataToHash = base64Response + saltKey;
            const calculatedChecksum = crypto.createHash('sha256').update(dataToHash).digest('hex') + '###' + saltIndex;

            if (calculatedChecksum === xVerify) {
                return true;
            } else {
                console.warn(`❌ Signature Mismatch! Expected: ${calculatedChecksum}, Got: ${xVerify}`);
                return false;
            }
        } catch (error) {
            console.error('❌ Webhook Verification Error:', error);
            return false;
        }
    }

    async verifyCallback(responseBody, xVerify) {
        return this.verifyWebhook(responseBody, xVerify);
    }
}

module.exports = new PhonePeService();
