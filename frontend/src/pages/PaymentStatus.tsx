import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Home, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const PaymentStatus = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'completed' | 'failed' | 'processing'>('loading');
    const [paymentData, setPaymentData] = useState<any>(null);

    const merchantOrderId = searchParams.get('orderId') ||
        searchParams.get('merchantOrderId') ||
        JSON.parse(localStorage.getItem('phonepe_pending_payment') || '{}').merchantOrderId;

    useEffect(() => {
        if (!merchantOrderId) {
            setStatus('failed');
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/payments/status/${merchantOrderId}`);
                const result = await response.json();

                if (result.success) {
                    setPaymentData(result.data);
                    setStatus(result.data.status === 'completed' ? 'completed' :
                        result.data.status === 'failed' ? 'failed' : 'processing');

                    // If still processing, check again in 3 seconds
                    if (result.data.status === 'pending' || result.data.status === 'processing') {
                        setTimeout(checkStatus, 3000);
                    }
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setStatus('failed');
            }
        };

        checkStatus();
    }, [merchantOrderId]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
            case 'processing':
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Payment</h2>
                        <p className="text-gray-500 text-center max-w-xs">
                            Please wait while we confirm your transaction with PhonePe. Do not refresh or close this page.
                        </p>
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle2 className="h-16 w-16 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
                        <p className="text-gray-600">
                            Your transaction has been completed successfully.
                            {paymentData?.type === 'booking' ? ' Your ride is confirmed.' : ' Your wallet has been updated.'}
                        </p>
                        {paymentData?.amount && (
                            <div className="text-3xl font-bold text-[#212c40] mt-2">
                                ₹{paymentData.amount.toLocaleString()}
                            </div>
                        )}
                        <div className="text-sm text-gray-400 mt-1">
                            Transaction ID: {paymentData?.transactionId || 'N/A'}
                        </div>
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                        <div className="bg-red-100 p-4 rounded-full">
                            <XCircle className="h-16 w-16 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
                        <p className="text-gray-600">
                            We couldn't process your payment. If any amount was deducted, it will be refunded automatically within 5-7 business days.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => navigate(-1)}
                        >
                            Try Again
                        </Button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-xl border-none rounded-3xl overflow-hidden">
                <CardHeader className="bg-[#212c40] text-white text-center py-6">
                    <CardTitle className="text-xl">Transaction Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                    {renderContent()}
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 pb-8">
                    {status === 'completed' && paymentData?.type === 'booking' ? (
                        <Button
                            className="w-full bg-[#f48432] hover:bg-[#e07528] text-white py-6 rounded-2xl font-bold shadow-lg"
                            onClick={() => navigate('/bookings')}
                        >
                            <Calendar className="mr-2 h-5 w-5" />
                            View My Bookings
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button
                            className="w-full bg-[#212c40] hover:bg-[#2d3a52] text-white py-6 rounded-2xl font-bold shadow-lg"
                            onClick={() => navigate('/')}
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Return Home
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentStatus;
