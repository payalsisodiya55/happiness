import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import driverApiService from "@/services/driverApi";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import phonePeService from "@/services/phonePeService";

// Real data only - no mock/dummy data

const DriverWallet = () => {
  const navigate = useNavigate();
  const { driver, refreshDriverData } = useDriverAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Add Money State
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const pendingPayment = localStorage.getItem('phonepe_pending_payment');
      if (pendingPayment) {
        try {
          console.log("Found pending payment in localStorage:", pendingPayment);
          let parsed;
          try {
            parsed = JSON.parse(pendingPayment);
          } catch (err) {
            // If stored as raw string (rare legacy case)
            parsed = { merchantOrderId: pendingPayment };
          }
          console.log("Parsed pending payment:", parsed);

          let { merchantOrderId } = parsed || {};

          if (merchantOrderId && parsed.paymentType === 'wallet_recharge') {
            toast({ title: "Verifying Payment", description: "Verifying your transaction..." });

            // Handle object case if needed
            if (typeof merchantOrderId === 'object') {
              merchantOrderId = merchantOrderId.merchantOrderId || merchantOrderId.id;
            }

            const response = await phonePeService.verifyPaymentStatus(merchantOrderId);
            console.log("Payment Verification Response:", response);

            // Robust success check covering various API response shapes
            if (response.success && (response.data.status === 'completed' || response.data.status === 'PAYMENT_SUCCESS')) {
              toast({
                title: "Payment Successful",
                description: `₹${response.data.amount} has been added to your wallet`,
                className: "bg-green-500 text-white border-none"
              });
              // Clear pending status
              localStorage.removeItem('phonepe_pending_payment');
              // FORCE REFRESH WALLET DATA
              await refreshDriverData();
              return true;
            } else if (response.data && (response.data.status === 'failed' || response.data.status === 'PAYMENT_ERROR')) {
              toast({
                title: "Payment Failed",
                description: response.data.error?.message || "Payment transaction failed",
                variant: "destructive"
              });
              localStorage.removeItem('phonepe_pending_payment');
            } else {
              console.log("Payment status still pending/init...", response);
            }
          }
        } catch (e) {
          console.error("Error verifying payment:", e);
        }
      }
      return false;
    };

    const fetchWalletData = async () => {
      if (!driver) {
        setIsLoading(false);
        return;
      }

      // Check payment status first and wait for it to complete
      await checkPaymentStatus();

      try {
        // Get fresh wallet balance and transactions from API
        const balanceData = await driverApiService.getWalletBalance();
        setBalance(balanceData.balance || 0);

        const transactionsData = await driverApiService.getWalletTransactions();
        const walletTransactions = transactionsData.transactions || [];
        setTransactions(walletTransactions);

        // Calculate total income and withdrawal from transactions
        let income = 0;
        let withdrawal = 0;

        walletTransactions.forEach((tx: any) => {
          if (tx.type === 'credit') {
            income += tx.amount;
          } else if (tx.type === 'debit') {
            withdrawal += tx.amount;
          }
        });

        setTotalIncome(income);
        setTotalWithdrawal(withdrawal);

      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast({
          title: "Error",
          description: "Failed to load wallet data. Please try again.",
          variant: "destructive",
        });
        // Set empty data on error
        setTransactions([]);
        setTotalIncome(0);
        setTotalWithdrawal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [driver]);

  const handlePayment = async () => {
    const amountVal = parseFloat(amount);
    if (!amount || isNaN(amountVal) || amountVal < 1000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum amount to add is ₹1000",
        variant: "destructive",
      });
      return;
    }

    if (!driver?.email || !driver?.phone) {
      toast({
        title: "Missing Information",
        description: "Please update your email and phone number in profile to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await phonePeService.handlePaymentRedirect({
        amount: amountVal,
        paymentType: 'wallet_recharge',
        redirectUrl: `${window.location.origin}/driver/wallet`
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-40">
        {/* Header - Static with deep padding for overlap */}
        <div className="bg-[#29354c] text-white pt-6 pb-32 shadow-md relative z-0 rounded-b-[2.5rem]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-4">
              {/* Top Bar */}
              <div className="flex items-center">

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white tracking-wide">My Wallet</h1>
                  <p className="text-sm text-gray-300 font-light">Manage earnings & payouts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card - Sticky & Overlapping */}
        <div className="container mx-auto px-4 -mt-24 relative z-50">
          <Card className="bg-gradient-to-br from-[#1c2536] to-[#29354c] border-none text-white shadow-2xl rounded-[1.5rem] overflow-hidden relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#f48432]/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1 flex items-center">
                    <Wallet className="w-4 h-4 mr-2 text-[#f48432]" />
                    Available Balance
                  </p>
                  <h2 className="text-4xl font-bold tracking-tight text-white mt-2">
                    ₹{isLoading ? "..." : balance.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-8">
                <Button
                  onClick={() => setIsAddMoneyOpen(true)}
                  className="bg-[#f48432] hover:bg-[#d9732a] text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all w-full"
                >
                  Add Money
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 mt-6 z-30 space-y-6">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-lg rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Income</p>
              <p className="text-xl font-bold text-[#29354c] mt-1">₹{isLoading ? "..." : totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg rounded-2xl">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Withdraw</p>
              <p className="text-xl font-bold text-[#29354c] mt-1">₹{isLoading ? "..." : totalWithdrawal.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="pb-6">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-bold text-[#29354c]">Recent Transactions</h3>

          </div>

          <div className="space-y-3">
            {isLoading ? (
              // Skeleton loading
              [1, 2, 3].map((i) => (
                <Card key={i} className="border-none shadow-sm rounded-xl animate-pulse">
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              transactions.map((tx: any, index) => {
                // Format date for display
                const formatDate = (dateString: string) => {
                  try {
                    const date = new Date(dateString);
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - date.getTime());
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 0) {
                      return 'Today';
                    } else if (diffDays === 1) {
                      return 'Yesterday';
                    } else if (diffDays < 7) {
                      return `${diffDays} days ago`;
                    } else {
                      return date.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      });
                    }
                  } catch (error) {
                    return 'Unknown date';
                  }
                };

                return (
                  <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className={`w-6 h-6 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#29354c] text-sm line-clamp-1">{tx.description || 'Transaction'}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-lg ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700">
                        completed
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#29354c] text-xl font-bold">Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Amount (₹)</label>
              <Input
                type="number"
                placeholder="Enter amount (Min ₹1000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-bold border-[#29354c]/20 focus:border-[#f48432]"
              />
              <p className="text-xs text-gray-400">Minimum deposit allowed is ₹1000</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="py-2 px-1 text-sm bg-gray-50 hover:bg-[#29354c]/5 border border-gray-200 rounded-lg text-gray-600 transition-colors font-medium"
                >
                  + ₹{val}
                </button>
              ))}
            </div>

            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-[#f48432] hover:bg-[#d9732a] text-white font-bold h-12 text-base rounded-xl mt-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Pay"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DriverBottomNavigation />
    </div>
  );
};

export default DriverWallet;
