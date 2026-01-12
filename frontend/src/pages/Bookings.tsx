import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { List, Clock, MapPin, Calendar, User, Home, HelpCircle, X, Car, CreditCard, Phone, Mail, Loader2, Download, Receipt, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TopNavigation from "@/components/TopNavigation";
import UserBottomNavigation from "@/components/UserBottomNavigation";
import { useUserAuth } from "@/contexts/UserAuthContext";
import apiService from "@/services/api";
import { toast } from "@/hooks/use-toast";
import LoginPrompt from "@/components/LoginPrompt";
import { formatDate, formatTime } from "@/lib/utils";
import { calculateDistance } from "@/lib/distanceUtils";

const sampleBookings = [
  {
    _id: "sample_1",
    bookingNumber: "BK-2024-001",
    status: "pending",
    tripDetails: {
      pickup: { address: "Indore, Madhya Pradesh", date: "2024-01-20", time: "10:00" },
      destination: { address: "Bhopal, Madhya Pradesh" },
      distance: 195,
      duration: "3h 45m"
    },
    vehicle: { type: "Sedan", brand: "Maruti", model: "Dzire", registrationNumber: "MP-09-AB-1234" },
    driver: { firstName: "Rajesh", lastName: "Kumar", phone: "+91 9876543210", rating: 4.8 },
    pricing: { totalAmount: 2500, ratePerKm: 12 },
    payment: { status: "pending", method: "cash" }
  },
  {
    _id: "sample_2",
    bookingNumber: "BK-2024-002",
    status: "completed",
    tripDetails: {
      pickup: { address: "Ujjain, Madhya Pradesh", date: "2023-12-15", time: "08:00" },
      destination: { address: "Indore, Madhya Pradesh" },
      distance: 55,
      duration: "1h 15m"
    },
    vehicle: { type: "SUV", brand: "Toyota", model: "Innova", registrationNumber: "MP-09-XY-9876" },
    driver: { firstName: "Suresh", lastName: "Singh", phone: "+91 9876543211", rating: 4.9 },
    pricing: { totalAmount: 1500, ratePerKm: 18 },
    payment: { status: "completed", method: "razorpay", transactionId: "pay_123456" }
  },
   {
    _id: "sample_3",
    bookingNumber: "BK-2024-003",
    status: "accepted",
    tripDetails: {
      pickup: { address: "Mumbai, Maharashtra", date: "2024-02-10", time: "06:00" },
      destination: { address: "Pune, Maharashtra" },
      distance: 150,
      duration: "3h 00m"
    },
    vehicle: { type: "SUV", brand: "Mahindra", model: "XUV700", registrationNumber: "MH-01-CD-4567" },
    driver: { firstName: "Amit", lastName: "Verma", phone: "+91 9876543212", rating: 4.7 },
    pricing: { totalAmount: 3000, ratePerKm: 15 },
    payment: { status: "pending", method: "cash" }
  }
];

const Bookings = () => {
  const { user, isAuthenticated } = useUserAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Real API Call Logic
      const response = await apiService.getUserBookings();

      if (process.env.NODE_ENV === 'development') {
        console.log('Bookings API response:', response);
      }

      if (response.success) {
        // Handle paginated response structure
        let bookingsData = [];
        if (response.data?.docs) {
          // New paginated structure
          bookingsData = response.data.docs;
        } else if (response.data?.bookings) {
          // Old structure
          bookingsData = response.data.bookings;
        } else if (Array.isArray(response.data)) {
          // Direct array
          bookingsData = response.data;
        } else {
          bookingsData = [];
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('Setting bookings data:', bookingsData);
          console.log('Sample booking cancellation data:', bookingsData[0]?.cancellation);
        }
        setBookings(bookingsData);
        setIsLoading(false);
      } else {
        setError(response.error?.message || response.message || 'Failed to fetch bookings');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(`Failed to fetch bookings: ${error.message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  // Refresh bookings when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated]);

  // Helper function to get date from booking
  const getBookingDate = (booking) => {
    if (!booking) return null;
    // Try different possible date fields in order of preference
    return booking.tripDetails?.date ||
           booking.tripDetails?.pickup?.date ||
           booking.date ||
           booking.pickupDate ||
           booking.departureDate ||
           booking.returnDate;
  };

  // Helper function to get pricing - use stored pricing from backend instead of recalculating
  const getBookingPricing = (booking) => {
    // Always use the stored pricing from backend as it's already calculated correctly
    // The backend calculates: 34 km × ₹7 = ₹238 and stores it in booking.pricing.totalAmount
    return booking.pricing || { totalAmount: 0, ratePerKm: 0, distance: 0 };
  };

  // Helper function to get time from booking
  const getBookingTime = (booking) => {
    if (!booking) return null;
    // Try different possible time fields in order of preference
    return booking.tripDetails?.time ||
           booking.tripDetails?.pickup?.time ||
           booking.time ||
           booking.pickupTime ||
           booking.departureTime;
  };

  // Helper function to get pickup address
  const getPickupAddress = (booking) => {
    if (!booking) return 'Pickup Location';
    return booking.tripDetails?.pickup?.address || 
           booking.pickupAddress || 
           booking.from || 
           'Pickup Location';
  };

  // Helper function to get destination address
  const getDestinationAddress = (booking) => {
    if (!booking) return 'Destination';
    return booking.tripDetails?.destination?.address || 
           booking.destinationAddress || 
           booking.to || 
           'Destination';
  };

  // Helper function to get return date from booking (for round trips)
  const getReturnDate = (booking) => {
    if (!booking) return null;
    // Try multiple possible return date fields
    return booking.tripDetails?.returnDate ||
           booking.returnDate ||
           booking.tripDetails?.return?.date ||
           booking.tripDetails?.destination?.returnDate ||
           booking.destinationReturnDate ||
           booking.returnTripDate ||
           booking.roundTripReturnDate ||
           booking.tripDetails?.roundTrip?.returnDate ||
           booking.tripDetails?.roundTripReturnDate ||
           null;
  };

  // Helper function to format duration from minutes to hours and minutes
  const formatDuration = (duration) => {
    if (!duration || duration === 0) return '--';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Helper function to get trip type
  const getTripType = (booking) => {
    if (!booking) return 'one-way';
    // Try multiple possible trip type fields
    return booking.tripType || 
           booking.tripDetails?.tripType || 
           booking.tripDetails?.type ||
           booking.serviceType ||
           booking.bookingType ||
           (getReturnDate(booking) ? 'return' : 'one-way');
  };

  // Helper function to check if it's a round trip
  const isRoundTrip = (booking) => {
    // Check multiple conditions for round trip
    const hasReturnDate = !!getReturnDate(booking);
    const isReturnType = getTripType(booking) === 'return';
    const hasRoundTripFlag = booking.isRoundTrip === true;
    
    // Additional checks for round trip indicators
    const hasRoundTripInDetails = booking.tripDetails?.isRoundTrip === true;
    const hasReturnInDetails = !!booking.tripDetails?.return;
    const hasDestinationReturn = !!booking.tripDetails?.destination?.returnDate;
    const hasServiceTypeReturn = booking.serviceType === 'return' || booking.serviceType === 'round_trip';
    const hasBookingTypeReturn = booking.bookingType === 'return' || booking.bookingType === 'round_trip';
    
    // Check for any text that might indicate round trip
    const hasRoundTripText = 
      (booking.tripDetails?.description && 
       (booking.tripDetails.description.toLowerCase().includes('round') || 
        booking.tripDetails.description.toLowerCase().includes('return'))) ||
      (booking.notes && 
       (booking.notes.toLowerCase().includes('round') || 
        booking.notes.toLowerCase().includes('return'))) ||
      (booking.comments && 
       (booking.comments.toLowerCase().includes('round') || 
        booking.comments.toLowerCase().includes('return')));
    
    // Check for any field that might contain round trip info
    const hasAnyRoundTripField = 
      booking.roundTrip === true ||
      booking.isRoundTrip === true ||
      booking.round_trip === true ||
      booking.returnTrip === true ||
      booking.twoWay === true ||
      booking.two_way === true;
    
    // Debug logging for round trip detection
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Round Trip Check for booking:', {
        bookingId: booking._id,
        bookingNumber: booking.bookingNumber,
        hasReturnDate,
        isReturnType,
        hasRoundTripFlag,
        hasServiceTypeReturn,
        hasBookingTypeReturn,
        returnDate: getReturnDate(booking),
        tripType: getTripType(booking),
        serviceType: booking.serviceType,
        bookingType: booking.bookingType
      });
    }
    
    return hasReturnDate || isReturnType || hasRoundTripFlag || hasRoundTripInDetails || 
           hasReturnInDetails || hasDestinationReturn || hasServiceTypeReturn || hasBookingTypeReturn ||
           hasRoundTripText || hasAnyRoundTripField;
  };

  // Filter bookings based on active tab
  const upcomingBookings = Array.isArray(bookings) ? bookings.filter(booking => 
    ['pending', 'accepted', 'started', 'cancellation_requested'].includes(booking.status)
  ) : [];

  const pastBookings = Array.isArray(bookings) ? bookings.filter(booking => 
    ['completed', 'cancelled'].includes(booking.status)
  ) : [];

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    try {
      if (!selectedBooking) return;
      
      // Request cancellation instead of direct cancellation
      const response = await apiService.requestCancellation(selectedBooking._id, 'User requested cancellation');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Cancellation response:', response);
      }
      
      if (response.success) {
        toast({
          title: "Cancellation Requested",
          description: "Your cancellation request has been submitted. Admin will review and process it.",
        });
        
        // Update local state to show cancellation requested
        setBookings(prevBookings => {
          const updatedBookings = prevBookings.map(booking => 
            booking._id === selectedBooking._id 
              ? { ...booking, status: 'cancellation_requested' }
              : booking
          );
          if (process.env.NODE_ENV === 'development') {
            console.log('Updated bookings state:', updatedBookings);
          }
          return updatedBookings;
        });
        
        setIsCancelModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedBooking(null);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to request cancellation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting cancellation:', error);
      toast({
        title: "Error",
        description: "Failed to request cancellation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Current bookings state:', bookings);
    console.log('Upcoming bookings:', upcomingBookings);
    console.log('Past bookings:', pastBookings);
    console.log('Active tab:', activeTab);
    console.log('Current bookings for display:', currentBookings);
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPrompt 
        title="Login to View Bookings"
        description="Please login to view your booking history and manage your trips"
      />
    );
  }

  // Helper function to get payment status display
  const getPaymentStatusDisplay = (booking) => {
    if (!booking.payment) return null;
    
    // Ensure payment object has required properties
    const payment = booking.payment || {};
    
    if (payment.isPartialPayment) {
      const { onlinePaymentStatus, cashPaymentStatus, onlineAmount, cashAmount } = payment.partialPaymentDetails || {};
      
      return (
        <div className="space-y-0.5">
          <div className="text-xs text-gray-600">Payment Status:</div>
          <div className="flex items-center space-x-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${
              onlinePaymentStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-xs text-gray-700">
              Online: ₹{onlineAmount} ({onlinePaymentStatus === 'completed' ? 'Paid' : 'Pending'})
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${
              cashPaymentStatus === 'collected' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-xs text-gray-700">
              Cash: ₹{cashAmount} ({cashPaymentStatus === 'collected' ? 'Collected' : 'Pending'})
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-0.5">
        <div className="text-xs text-gray-600">Payment Method:</div>
        <div className="text-xs text-gray-700 capitalize">
          {payment.method === 'razorpay' ? 'Online Payment' : 
           payment.method === 'cash' ? 'Cash Payment' : 
           payment.method || 'Unknown'}
        </div>
        <div className="text-xs text-gray-600">Payment Status:</div>
        <div className="flex items-center space-x-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            payment.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          <span className="text-xs text-gray-700">
            {payment.status === 'completed' ? 'Completed' : 'Pending'}
          </span>
        </div>
        {payment.transactionId && (
          <div className="text-xs text-gray-600">
            Transaction ID: {payment.transactionId}
          </div>
        )}
      </div>
    );
  };

  const downloadReceipt = async (booking) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('userToken') || localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/bookings/${booking._id}/receipt`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        const filename = response.headers.get('content-disposition')?.split('filename=')[1]?.replace(/"/g, '') || `receipt_${booking.bookingNumber}`;
        
        if (contentType && contentType.includes('application/pdf')) {
          // Handle PDF download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "PDF Receipt Downloaded",
            description: "Your booking receipt has been downloaded successfully.",
          });
        } else if (contentType && contentType.includes('text/html')) {
          // Handle HTML download
          const htmlContent = await response.text();
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "HTML Receipt Downloaded",
            description: "Your booking receipt has been downloaded. Open it in a browser and print.",
          });
        } else {
          // Fallback for unknown content type
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          toast({
            title: "Receipt Downloaded",
            description: "Your booking receipt has been downloaded.",
          });
        }
        } else {
          let errorMessage = "Failed to download receipt";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            // If response is not JSON, use status text
            errorMessage = response.statusText || errorMessage;
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: "Error",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="hidden md:block">
        <TopNavigation/>
      </div>
      {/* Header */}
      <div className="bg-[#212c40] text-white py-8 px-4 flex-shrink-0 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">My Bookings</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchBookings}
              className="hidden md:flex bg-white text-[#212c40] hover:bg-gray-100 border-none font-medium"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Refresh
            </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 flex border-b border-gray-200 bg-white flex-shrink-0 shadow-sm">
        <button
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${
            activeTab === "upcoming"
              ? "text-[#f48432] border-b-2 border-[#f48432]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Bookings
        </button>
        <button
          className={`flex-1 py-4 text-sm font-semibold transition-colors ${
            activeTab === "past"
              ? "text-[#f48432] border-b-2 border-[#f48432]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Bookings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 pb-24 md:p-6 md:pb-6 overflow-y-auto bg-gray-50/50">
        {isLoading ? (
          <div className="text-center py-6">
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-3 animate-spin" />
            <p className="text-muted-foreground text-sm">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 mb-2 text-sm">{error}</p>
                             <Button 
                 variant="outline" 
                 onClick={fetchBookings}
                 className="text-red-600 border-red-300 hover:bg-red-50 text-sm"
               >
                 Try Again
               </Button>
            </div>
          </div>
        ) : currentBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
            {currentBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
              {/* Header section with Route and Status */}
              <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        #{booking.bookingNumber.split('-').pop()}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(getBookingDate(booking))}</span>
                    </div>
                    <h3 className="font-bold text-[#212c40] text-lg leading-tight truncate">
                      {getPickupAddress(booking).split(',')[0]} 
                      <span className="mx-2 text-gray-300">→</span> 
                      {getDestinationAddress(booking).split(',')[0]}
                    </h3>
                  </div>
                  
                  <div className={`px-3 py-1 text-xs font-semibold rounded-full capitalize shadow-sm border ${
                    ['accepted', 'started'].includes(booking.status)
                      ? "bg-green-50 text-green-700 border-green-100" 
                      : booking.status === 'pending'
                      ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                      : booking.status === 'completed'
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : booking.status === 'cancellation_requested'
                      ? "bg-orange-50 text-orange-700 border-orange-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {booking.status === 'cancellation_requested' ? 'Cancel Requested' : booking.status}
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <div className="p-5 space-y-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  {/* Trip Type */}
                  <div className="flex items-center gap-2 text-gray-600">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        {isRoundTrip(booking) ? '↔' : '→'}
                     </div>
                     <div>
                       <p className="text-xs text-gray-400 font-medium uppercase">Trip Type</p>
                       <p className="font-medium text-[#212c40]">{isRoundTrip(booking) ? 'Round Trip' : 'One Way'}</p>
                     </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-gray-600">
                     <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#f48432]">
                        <Clock className="w-4 h-4" />
                     </div>
                     <div>
                       <p className="text-xs text-gray-400 font-medium uppercase">Pickup Time</p>
                       <p className="font-medium text-[#212c40]">{formatTime(getBookingTime(booking))}</p>
                     </div>
                  </div>

                  {/* Vehicle */}
                  <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-gray-50 mt-1">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <Car className="w-4 h-4" />
                     </div>
                     <div className="flex-1">
                       <p className="text-xs text-gray-400 font-medium uppercase">Vehicle</p>
                       <p className="font-medium text-[#212c40]">
                          {booking.vehicle?.brand} {booking.vehicle?.model} 
                          <span className="text-gray-400 font-normal ml-1">({booking.vehicle?.type})</span>
                       </p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-gray-400 font-medium uppercase">Amount</p>
                        <p className="text-lg font-bold text-[#f48432]">₹{getBookingPricing(booking).totalAmount}</p>
                     </div>
                  </div>
                </div>

                {/* Payment Status Compact */}
                <div className="flex items-center justify-between bg-gray-50/50 rounded-lg p-2 px-3 border border-gray-100">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        booking.payment?.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-xs font-medium text-gray-600">
                        Payment: {booking.payment?.method === 'razorpay' ? 'Online' : 'Cash'}
                      </span>
                   </div>
                   <span className={`text-xs font-semibold ${
                      booking.payment?.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                   }`}>
                      {booking.payment?.status === 'completed' ? 'Paid' : 'Pending'}
                   </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 pt-0 flex gap-3">
                <Button 
                  className="flex-1 bg-[#212c40] hover:bg-[#2d3a52] text-white h-10 rounded-lg shadow-sm transition-all text-sm font-medium"
                  onClick={() => handleViewDetails(booking)}
                >
                  View Details
                </Button>
                
                {['pending', 'accepted'].includes(booking.status) ? (
                  <Button 
                    variant="outline"
                    className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 h-10 rounded-lg text-sm font-medium"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsCancelModalOpen(true);
                    }}
                  >
                    Cancel
                  </Button>
                ) : booking.status === 'cancellation_requested' ? (
                   <Button 
                    variant="secondary"
                    className="flex-1 bg-orange-50 text-orange-600 border border-orange-100 h-10 rounded-lg text-sm font-medium opacity-100 cursor-not-allowed"
                    disabled
                  >
                    Requested
                  </Button>
                ) : <div className="hidden"></div>}
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <List className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No {activeTab} bookings found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === 'upcoming' 
                ? "You haven't made any upcoming bookings yet." 
                : "You don't have any past bookings."
              }
            </p>
          </div>
        )}
      </div>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md md:max-w-2xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-gray-50 sm:rounded-2xl">
          <DialogHeader className="bg-[#212c40] text-white p-4 shrink-0 shadow-sm z-10">
            <DialogTitle className="flex items-center justify-between text-lg font-bold tracking-wide">
              <span>Booking Details</span>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-full p-2 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {selectedBooking && (
            <>
               {/* 1. Status & Route Summary Card */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Booking ID</p>
                          <p className="font-mono text-sm font-medium text-[#212c40] bg-gray-50 px-2 py-1 rounded inline-block">
                            {selectedBooking.bookingNumber}
                          </p>
                       </div>
                       <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          ['accepted', 'started'].includes(selectedBooking.status) ? "bg-green-50 text-green-700 border-green-100" :
                          selectedBooking.status === 'completed' ? "bg-blue-50 text-blue-700 border-blue-100" :
                          selectedBooking.status === 'cancelled' ? "bg-red-50 text-red-700 border-red-100" :
                          selectedBooking.status === 'cancellation_requested' ? "bg-orange-50 text-orange-700 border-orange-100" :
                          "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}>
                          {selectedBooking.status === 'cancellation_requested' ? 'Cancel Req' : selectedBooking.status}
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <div className="flex flex-col items-center pt-1 h-full min-h-[80px]">
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                          <div className="w-0.5 flex-1 bg-gray-200 border-l-2 border-dotted border-gray-300 my-1 min-h-[30px]" />
                          <div className="w-3.5 h-3.5 rounded-full bg-orange-500 ring-4 ring-orange-50" />
                       </div>
                       <div className="flex-1 space-y-6">
                          <div>
                             <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Pickup</p>
                             <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">{getPickupAddress(selectedBooking)}</h3>
                             <div className="flex items-center text-xs text-gray-500 gap-2">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(getBookingDate(selectedBooking))}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatTime(getBookingTime(selectedBooking))}</span>
                             </div>
                          </div>
                          <div>
                             <p className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Destination</p>
                             <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1">{getDestinationAddress(selectedBooking)}</h3>
                             {getReturnDate(selectedBooking) && (
                               <p className="text-xs text-blue-600 mt-1 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded">
                                 Return: {formatDate(getReturnDate(selectedBooking))}
                               </p>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Download Receipt Action */}
               <Button 
                  onClick={() => downloadReceipt(selectedBooking)}
                  className="w-full bg-white border border-gray-200 text-[#212c40] hover:bg-gray-50 hover:border-gray-300 h-11 font-medium rounded-xl shadow-sm transition-all"
                  disabled={isDownloading}
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2 text-[#f48432]" />}
                  Download Receipt
                </Button>

               {/* Journey Stats Grid */}
               <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-xs text-gray-400 uppercase font-semibold">Total Distance</p>
                     <p className="text-lg font-bold text-[#212c40]">
                        {isRoundTrip(selectedBooking) ? (selectedBooking.tripDetails?.distance * 2).toFixed(1) : selectedBooking.tripDetails?.distance || 0}
                        <span className="text-xs text-gray-500 font-normal ml-1">km</span>
                     </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                     <p className="text-xs text-gray-400 uppercase font-semibold">Est. Duration</p>
                     <p className="text-lg font-bold text-[#212c40]">
                        {formatDuration(selectedBooking.tripDetails?.duration)}
                     </p>
                  </div>
               </div>

               {/* Details Grid: Vehicle & Driver */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vehicle Details */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
                     <h4 className="flex items-center gap-2 font-bold text-[#212c40] mb-4 text-sm border-b pb-2">
                        <Car className="w-4 h-4 text-[#f48432]" /> VEHICLE DETAILS
                     </h4>
                     <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                           <span className="text-gray-500">Type</span>
                           <span className="font-medium text-gray-900">{selectedBooking.vehicle?.type}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-500">Brand</span>
                           <span className="font-medium text-gray-900">{selectedBooking.vehicle?.brand}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-gray-500">Model</span>
                           <span className="font-medium text-gray-900">{selectedBooking.vehicle?.model}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                           <span className="text-gray-500">Reg. No</span>
                           <span className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">
                             {selectedBooking.vehicle?.registrationNumber}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Driver Details */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full">
                     <h4 className="flex items-center gap-2 font-bold text-[#212c40] mb-4 text-sm border-b pb-2">
                        <User className="w-4 h-4 text-[#f48432]" /> DRIVER DETAILS
                     </h4>
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#212c40]/5 flex items-center justify-center text-[#212c40] font-bold text-lg">
                           {selectedBooking.driver?.firstName?.[0]}{selectedBooking.driver?.lastName?.[0]}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">{selectedBooking.driver?.firstName} {selectedBooking.driver?.lastName}</p>
                           <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <span className="text-yellow-500 text-sm mr-1">★</span> 
                              <span className="font-medium text-gray-700">{selectedBooking.driver?.rating}</span>
                              <span className="mx-1">•</span>
                              <span>Driver Rating</span>
                           </div>
                        </div>
                     </div>
                     {selectedBooking.driver?.phone && (
                       <Button variant="outline" size="sm" className="w-full gap-2 border-gray-200 text-gray-600 hover:text-[#212c40] hover:bg-gray-50">
                          <Phone className="w-3.5 h-3.5" /> Call Driver
                       </Button>
                     )}
                  </div>
               </div>

               {/* Pricing Breakdown */}
               <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="flex items-center gap-2 font-bold text-[#212c40] mb-2 text-sm">
                     <Receipt className="w-4 h-4 text-[#f48432]" /> PRICING BREAKDOWN
                  </h4>
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between text-gray-600">
                        <span>Rate per km</span>
                        <span>₹{getBookingPricing(selectedBooking).ratePerKm}</span>
                     </div>
                     <div className="flex justify-between text-gray-600">
                        <span>Total Distance</span>
                        <span>{isRoundTrip(selectedBooking) ? (selectedBooking.tripDetails?.distance * 2).toFixed(1) : selectedBooking.tripDetails?.distance} km</span>
                     </div>
                     
                     <div className="border-t border-dashed border-gray-200 my-2"></div>
                     
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900">Total Amount</span>
                        <span className="font-bold text-[#f48432] text-xl">₹{getBookingPricing(selectedBooking).totalAmount}</span>
                     </div>
                  </div>
                  
                  {/* Payment Info Badge */}
                   <div className="bg-gray-50 rounded-lg p-3 text-xs flex justify-between items-center border border-gray-100">
                      <div className="flex gap-2 items-center">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500 font-medium">Payment via {selectedBooking.payment?.method === 'razorpay' ? 'Online' : 'Cash'}</span>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                         selectedBooking.payment?.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                         {selectedBooking.payment?.status || 'Pending'}
                      </div>
                   </div>
               </div>
            </>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-md w-[95vw] p-4 md:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg md:text-xl">Request Cancellation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Are you sure you want to request cancellation for your booking from {selectedBooking ? getPickupAddress(selectedBooking) : 'Pickup'} to {selectedBooking ? getDestinationAddress(selectedBooking) : 'Destination'}?
              </p>
              
              {selectedBooking && isRoundTrip(selectedBooking) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">↔</span>
                    </div>
                    <span className="text-blue-800 font-medium text-sm">Round Trip</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    {formatDate(getBookingDate(selectedBooking))} → {getReturnDate(selectedBooking) ? formatDate(getReturnDate(selectedBooking)) : 'N/A'}
                  </div>
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                This will submit a cancellation request for admin review. You'll be notified once it's processed.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Keep Booking
              </Button>
              <Button 
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
                onClick={confirmCancelBooking}
              >
                Request Cancellation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UserBottomNavigation />
    </div>
  );
};

export default Bookings; 