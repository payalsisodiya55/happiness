import { toast } from '@/hooks/use-toast';

export interface PhonePeInitiateData {
    amount: number;
    bookingId?: string;
    paymentType?: 'booking' | 'wallet_recharge';
    redirectUrl?: string;
}

class PhonePeService {
    private apiBaseUrl: string;

    constructor() {
        const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
        this.apiBaseUrl = envUrl || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
    }

    /**
     * Initiate PhonePe payment
     */
    async initiatePayment(data: PhonePeInitiateData): Promise<{ redirectUrl: string; merchantOrderId: string }> {
        try {
            console.log('=== INITIATING PHONEPE PAYMENT ===');
            console.log('Payment data:', data);

            const token = localStorage.getItem('token') ||
                localStorage.getItem('userToken') ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('driverToken');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`${this.apiBaseUrl}/payments/initiate-phonepe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...data,
                    redirectUrl: data.redirectUrl || `${window.location.origin}/payment-status`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to initiate payment');
            }

            const responseData = await response.json();
            console.log('Payment initiated successfully:', responseData);

            if (responseData.success && responseData.data.redirectUrl) {
                return {
                    redirectUrl: responseData.data.redirectUrl,
                    merchantOrderId: responseData.data.merchantOrderId
                };
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('=== PHONEPE INITIATION FAILED ===');
            console.error('Error:', error);
            throw error;
        }
    }

    /**
     * Handle the redirect flow
     */
    async handlePaymentRedirect(data: PhonePeInitiateData): Promise<void> {
        try {
            const { redirectUrl, merchantOrderId } = await this.initiatePayment(data);

            // Save current status/context if needed before redirect
            localStorage.setItem('phonepe_pending_payment', JSON.stringify({
                merchantOrderId,
                bookingId: data.bookingId,
                paymentType: data.paymentType,
                timestamp: new Date().getTime()
            }));

            // Redirect to PhonePe
            window.location.href = redirectUrl;
        } catch (error) {
            toast({
                title: "Payment Initialization Failed",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            });
            throw error;
        }
    }

    /**
     * Verify payment status
     */
    async verifyPaymentStatus(merchantOrderId: string | any): Promise<any> {
        try {
            console.log('Checking Payment Status for Order ID:', merchantOrderId);

            let safeOrderId = merchantOrderId;

            // Fix: Handle case where merchantOrderId might be passed as object accidentally
            if (typeof merchantOrderId === 'object' && merchantOrderId !== null) {
                console.warn('⚠️ Warning: merchantOrderId passed as object:', merchantOrderId);
                if (merchantOrderId.merchantOrderId) {
                    safeOrderId = merchantOrderId.merchantOrderId;
                } else if (merchantOrderId.id) {
                    safeOrderId = merchantOrderId.id;
                } else {
                    console.error('❌ Could not extract string ID from object:', merchantOrderId);
                    throw new Error('Invalid Merchant Order ID format');
                }
            }

            console.log(`Calling API: ${this.apiBaseUrl}/payments/status/${safeOrderId}`);

            const response = await fetch(`${this.apiBaseUrl}/payments/status/${safeOrderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error verifying payment status:', error);
            throw error;
        }
    }
}

export const phonePeService = new PhonePeService();
export default phonePeService;
