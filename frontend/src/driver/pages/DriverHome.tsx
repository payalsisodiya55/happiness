import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DriverTopNavigation from "@/driver/components/DriverTopNavigation";
import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";
import DriverHeroSection from "@/driver/components/DriverHeroSection";
import DriverAgreementForm from "@/driver/components/DriverAgreementForm";
import { Home, MessageSquare, Car, User, LogOut, Loader2, Banknote, TrendingUp, Clock, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import driverApiService from "@/services/driverApi";

import { toast } from "@/hooks/use-toast";

const DriverHome = () => {
  const navigate = useNavigate();
  const { driver, isLoggedIn, logout, refreshDriverData } = useDriverAuth();
  const [activeTab, setActiveTab] = useState("home");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    activeRequests: 0,
    totalVehicles: 0,
    completedRides: 0,
    totalEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Sync local online state with driver data
  useEffect(() => {
    if (driver?.availability?.isOnline !== undefined) {
      setIsOnline(driver.availability.isOnline);
    }
  }, [driver]);

  // Check if driver has accepted the agreement
  const hasAcceptedAgreement = driver?.agreement?.isAccepted || false;

  // Fetch dashboard data on component mount
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchDashboardData = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        setError(null);
        
        const summary = await driverApiService.getDashboardSummary();
        
        if (!isMounted) return;
        
        // Use fallback values if data is missing
        const fallbackData = {
          activeRequests: summary.activeRequests || 0,
          totalVehicles: summary.totalVehicles || 1, // At least 1 vehicle
          completedRides: summary.completedRides || 0,
          totalEarnings: summary.totalEarnings || 0
        };
        
        setDashboardData(fallbackData);
        
      } catch (err) {
        if (!isMounted) return;
        
        console.error('DriverHome: Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setDashboardData({
          activeRequests: 0,
          totalVehicles: 1, // Assume driver has at least 1 vehicle
          completedRides: 0,
          totalEarnings: 0
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (driver) {
      // Add a small delay to prevent rapid API calls
      timeoutId = setTimeout(fetchDashboardData, 500);
    } else {
      // Set fallback data even when no driver is found
      setDashboardData({
        activeRequests: 0,
        totalVehicles: 1,
        completedRides: 0,
        totalEarnings: 0
      });
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [driver]);

  useEffect(() => {
    if (isLoggedIn) {
      // Add a small delay for animation effect
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/driver-auth');
  };

  const handleAgreementAccepted = async () => {
    // Refresh driver data to get updated agreement status
    await refreshDriverData();
  };

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      await driverApiService.toggleStatus();
      await refreshDriverData();
      
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      
      toast({
        title: newStatus ? "You are now Online" : "You are now Offline",
        description: newStatus 
          ? "You will start receiving ride requests." 
          : "You will not receive any new requests.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error toggling status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "requests":
        navigate('/driver/requests');
        break;
      case "myvehicle":
        navigate('/driver/myvehicle');
        break;
      case "profile":
        navigate('/driver/profile');
        break;
      default:
        navigate('/driver');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  // Show agreement form if driver hasn't accepted it yet
  if (!hasAcceptedAgreement) {
    return (
      <DriverAgreementForm 
        onAgreementAccepted={handleAgreementAccepted}
        driverName={driver ? `${driver.firstName} ${driver.lastName}` : "Driver"}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <DriverTopNavigation />
      
      {/* Sticky Header Group: Profile + Stats Cards (Overlapping) */}
      <div className="sticky top-16 z-40">
        {/* Dark Theme Header Section */}
        <div className="bg-[#29354c] pt-6 pb-24 px-4 rounded-b-[2rem] shadow-lg relative z-0">
          <div className="container mx-auto">
            {/* User Info & Profile */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center">
                  Hello, {driver?.firstName || "Partner"} <span className="ml-2 text-2xl">👋</span>
                </h1>
                <div className="flex items-center bg-[#3a4860] px-3 py-1 rounded-full w-fit">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
                  <span className="text-gray-300 text-xs">{isOnline ? 'Online' : 'Offline'} • Indore, Madison Pradesh</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-[#f48432] p-0.5 relative">
                <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            {/* Offline/Online Toggle Card - Interactive */}
            <div 
              onClick={handleToggleStatus}
              className={`rounded-xl p-4 flex items-center justify-between mb-2 cursor-pointer transition-colors duration-300 ${isOnline ? 'bg-green-600/20 border border-green-500/30' : 'bg-[#3a4860]'}`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 transition-colors duration-300 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}></div>
                <div>
                  <h3 className="text-white font-semibold">{isOnline ? 'You are Online' : 'You are Offline'}</h3>
                  <p className="text-gray-400 text-xs">{isOnline ? 'Receiving ride requests' : 'Go online to start earning'}</p>
                </div>
              </div>
              {/* Toggle Switch UI */}
              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isOnline ? 'left-7' : 'left-1'}`}>
                  {isToggling && (
                     <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Sticky & Overlapping */}
        {activeTab === "home" && (
          <div className="container mx-auto px-4 -mt-16 relative z-50">
             <div className="grid grid-cols-2 gap-4">
              <Card className="shadow-lg border-none rounded-xl overflow-hidden relative">
                <CardContent className="p-4 relative z-10">
                  <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Total Earnings</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#29354c]">
                      ₹{isLoading ? "..." : dashboardData.totalEarnings.toLocaleString()}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#29354c] flex items-center justify-center text-white">
                      <Banknote className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-green-500 text-xs font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>+12% vs yest</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-none rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">Rides Completed</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#29354c]">
                      {isLoading ? "..." : dashboardData.completedRides}
                    </span>
                     <div className="w-10 h-10 rounded-lg bg-[#f48432] flex items-center justify-center text-white">
                      <Car className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-blue-500 text-xs font-bold bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>On Time 98%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Main Scrollable Content */}
      <div className="container mx-auto px-4 mt-6 z-30">
        {activeTab === "home" && (
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="text-[#29354c] font-bold text-lg mb-4 flex items-center">
                <Zap className="w-5 h-5 text-[#f48432] mr-2 fill-current" />
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-4 gap-3">
                {/* My Vehicle */}
                <div 
                  onClick={() => handleTabChange("myvehicle")} 
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
                    <Car className="w-7 h-7 text-[#29354c]" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">My Vehicle</span>
                </div>

                {/* Requests */}
                <div 
                  onClick={() => handleTabChange("requests")} 
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
                     <div className="relative">
                      <MessageSquare className="w-7 h-7 text-green-600" />
                      {dashboardData.activeRequests > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                      )}
                     </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">Requests</span>
                </div>

                {/* Ratings */}
                <div 
                  onClick={() => navigate('/driver/profile')} // Redirect to profile for ratings
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
                    <Star className="w-7 h-7 text-yellow-500 fill-current" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">Ratings</span>
                </div>

                {/* Support */}
                <div 
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
                    <Shield className="w-7 h-7 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center">Support</span>
                </div>
              </div>
            </div>

            {/* Online/Offline Status Card bottom */}
            <Card className={`mt-6 border-none shadow-lg overflow-hidden relative min-h-[200px] flex flex-col items-center justify-center text-center p-6 ${isOnline ? 'bg-green-50' : 'bg-white'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Zap className={`w-6 h-6 ${isOnline ? 'text-green-600 fill-current' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-lg font-bold text-[#29354c] mb-2">
                {isOnline ? 'You are currently Online' : 'You are currently Offline'}
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                {isOnline 
                  ? 'Great! You are visible to customers and will receive ride requests.' 
                  : 'Go online to start receiving ride requests in your area.'}
              </p>
              <Button 
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-[#29354c] hover:bg-[#1a2233]'} text-white px-8 py-6 rounded-full text-lg w-full max-w-sm shadow-xl transition-transform active:scale-95`}
              >
                {isToggling ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  isOnline ? 'Go Offline' : 'Go Online Now'
                )}
              </Button>
            </Card>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mt-4">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 hover:bg-red-700 text-xs h-8"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <DriverBottomNavigation />
    </div>
  );
};

export default DriverHome; 