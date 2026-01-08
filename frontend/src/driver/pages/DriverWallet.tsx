import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import driverApiService from "@/services/driverApi";
import { toast } from "@/hooks/use-toast";

// Dummy Transaction Data for UI dev
const DUMMY_TRANSACTIONS = [
  { id: 1, type: 'credit', amount: 850, description: 'Trip Payment - BK-2024-001', date: 'Today, 2:30 PM', status: 'completed' },
  { id: 2, type: 'credit', amount: 420, description: 'Trip Payment - BK-2024-002', date: 'Yesterday, 5:15 PM', status: 'completed' },
  { id: 3, type: 'debit', amount: 2000, description: 'Payout to Bank Account', date: 'Jan 4, 10:00 AM', status: 'completed' },
  { id: 4, type: 'credit', amount: 1200, description: 'Trip Payment - BK-2024-003', date: 'Jan 3, 11:20 AM', status: 'completed' },
  { id: 5, type: 'credit', amount: 150, description: 'Tip from Passenger', date: 'Jan 3, 11:25 AM', status: 'completed' },
];

const DriverWallet = () => {
  const navigate = useNavigate();
  const { driver } = useDriverAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real scenario, we'd fetch from API
        // const data = await driverApiService.getWalletData();
        // setBalance(data.balance);
        
        // Using driver data or dummy for now
        setBalance(driver?.earnings?.wallet?.balance || 3450);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [driver]);

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Request Sent",
      description: "Your payout will be processed within 24 hours.",
    });
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/driver')}
                  className="hover:bg-white/10 text-white p-0 h-auto self-start mr-3"
                >
                  <ArrowLeft className="w-6 h-6" />
                </Button>
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
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Button 
                  onClick={handleWithdraw}
                  className="bg-[#f48432] hover:bg-[#d9732a] text-white py-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Withdraw
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white py-6 rounded-xl text-lg backdrop-blur-sm transition-all"
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
                <p className="text-xl font-bold text-[#29354c] mt-1">₹4,250</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg rounded-2xl">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                  <ArrowUpRight className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Withdraw</p>
                <p className="text-xl font-bold text-[#29354c] mt-1">₹800</p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="pb-6">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-lg font-bold text-[#29354c]">Recent Transactions</h3>
              <Button variant="ghost" size="sm" className="text-[#f48432] hover:text-[#d9732a] hover:bg-orange-50 p-0 h-auto font-medium">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
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
                transactions.map((tx) => (
                  <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className={`w-6 h-6 ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[#29354c] text-sm line-clamp-1">{tx.description}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-lg ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
      </div>
      
      <DriverBottomNavigation />
    </div>
  );
};

export default DriverWallet;
