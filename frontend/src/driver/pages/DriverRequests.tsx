import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";
import { CheckCircle, XCircle, Clock, MapPin, User, Car, Calendar, Clock as ClockIcon, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import apiService from "@/services/api.js";
import { toast } from "@/hooks/use-toast";
import { calculateDistance } from "@/lib/distanceUtils";

interface BookingRequest {
  _id: string;
  bookingNumber: string;
  user?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  vehicle?: {
    type: string;
    brand: string;
    model: string;
    color: string;
  };
  tripDetails: {
    pickup: {
      address: string;
    };
    destination: {
      address: string;
    };
    date: string;
    time: string;
    passengers: number;
    distance: number;
    tripType: string;
    returnDate?: string;
  };
  pricing: {
    totalAmount: number;
    ratePerKm: number;
  };
  status: string;
  createdAt: string;
  payment: {
    method: string;
    status: string;
    isPartialPayment: boolean;
    partialPaymentDetails?: {
      onlineAmount: number;
      cashAmount: number;
      onlinePaymentStatus: string;
      cashPaymentStatus: string;
    };
  };
}

const DUMMY_BOOKINGS: BookingRequest[] = [
  {
    _id: "dummy1",
    bookingNumber: "BK-2024-001",
    user: {
      firstName: "Rahul",
      lastName: "Sharma",
      phone: "+91 98765 43210"
    },
    vehicle: {
      type: "car",
      brand: "Maruti Suzuki",
      model: "Swift Dzire",
      color: "White"
    },
    tripDetails: {
      pickup: { address: "Terminal 2, Mumbai International Airport" },
      destination: { address: "Oberoi Trident, Nariman Point, Mumbai" },
      date: new Date().toISOString(),
      time: "14:30",
      passengers: 2,
      distance: 24.5,
      tripType: "one-way"
    },
    pricing: {
      totalAmount: 850,
      ratePerKm: 18
    },
    status: "pending",
    createdAt: new Date().toISOString(),
    payment: {
      method: "cash",
      status: "pending",
      isPartialPayment: false
    }
  },
  {
    _id: "dummy2",
    bookingNumber: "BK-2024-002",
    user: {
      firstName: "Priya",
      lastName: "Verma",
      phone: "+91 98765 43211"
    },
    vehicle: {
      type: "car",
      brand: "Toyota",
      model: "Innova Crysta",
      color: "Silver"
    },
    tripDetails: {
      pickup: { address: "Hinjewadi Phase 1, Pune" },
      destination: { address: "Pune Railway Station" },
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "09:00",
      passengers: 4,
      distance: 18.2,
      tripType: "one-way"
    },
    pricing: {
      totalAmount: 1200,
      ratePerKm: 22
    },
    status: "accepted",
    createdAt: new Date().toISOString(),
    payment: {
      method: "online",
      status: "paid",
      isPartialPayment: true,
      partialPaymentDetails: {
        onlineAmount: 500,
        cashAmount: 700,
        onlinePaymentStatus: "paid",
        cashPaymentStatus: "pending"
      }
    }
  }
];

const DriverRequests = () => {
  const navigate = useNavigate();

  // Helper function to get pricing - use stored booking price instead of recalculating
  const getBookingPricing = (booking) => {
    // Use the stored booking price instead of recalculating
    // This ensures consistency with the original booking amount
    if (booking.pricing && booking.pricing.totalAmount) {
      return {
        ...booking.pricing,
        totalAmount: booking.pricing.totalAmount,
        ratePerKm: booking.pricing.ratePerKm || 0,
        distance: booking.tripDetails?.distance || 0,
        tripType: booking.tripDetails?.tripType || 'one-way'
      };
    }
    
    // Fallback: return safe default if no pricing data
    return {
      totalAmount: 0,
      ratePerKm: 0,
      distance: booking.tripDetails?.distance || 0,
      tripType: booking.tripDetails?.tripType || 'one-way'
    };
  };
  const { driver, isLoggedIn } = useDriverAuth();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchDriverBookings();
    }
  }, [isLoggedIn]);

  const fetchDriverBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDriverBookings();
      // Combine API data with dummy data for display purposes if API returns empty
      const apiBookings = data?.data?.docs || [];
      setBookings(apiBookings.length > 0 ? apiBookings : DUMMY_BOOKINGS);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to dummy data on error for UI preview
      setBookings(DUMMY_BOOKINGS);
      toast({
        title: "Notice",
        description: "Showing demo data due to connection issue",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId);
      await apiService.updateDriverBookingStatus(bookingId, newStatus);

      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));

      toast({
        title: "Success",
        description: `Booking ${newStatus} successfully`,
      });

      // Refresh bookings to get updated data
      fetchDriverBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const collectCashPayment = async (bookingId: string) => {
    try {
      setUpdatingStatus(bookingId);
      // Use generic booking endpoint via apiService to ensure auth headers
      const resp = await apiService.request(`/bookings/${bookingId}/collect-cash-payment`, { method: 'PUT' }, 'driver');
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId 
          ? {
              ...booking,
              payment: {
                ...booking.payment,
                partialPaymentDetails: {
                  ...booking.payment.partialPaymentDetails,
                  cashPaymentStatus: 'collected'
                }
              }
            }
          : booking
      ));

      toast({
        title: "Success",
        description: "Cash payment marked as collected successfully",
      });

      // Refresh bookings to get updated data
      fetchDriverBookings();
    } catch (error) {
      console.error('Error collecting cash payment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to collect cash payment",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Accepted</Badge>;
      case 'started':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Started</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-600 text-white">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusActions = (booking: BookingRequest) => {
    switch (booking.status) {
      case 'pending':
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              onClick={() => updateBookingStatus(booking._id, 'accepted')}
              disabled={updatingStatus === booking._id}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 w-full sm:w-auto"
              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
              disabled={updatingStatus === booking._id}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </div>
        );
      case 'accepted':
        return (
          <Button
            size="sm"
            className="bg-[#29354c] hover:bg-[#1e2a3b] w-full sm:w-auto shadow-md"
            onClick={() => updateBookingStatus(booking._id, 'started')}
            disabled={updatingStatus === booking._id}
          >
            <Clock className="w-4 h-4 mr-1" />
            Start Trip
          </Button>
        );
      case 'started':
        return (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            onClick={() => updateBookingStatus(booking._id, 'completed')}
            disabled={updatingStatus === booking._id}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Complete Trip
          </Button>
        );
      case 'completed':
        // Show payment collection button for partial payment bookings
        if (booking.payment?.isPartialPayment && 
            booking.payment.partialPaymentDetails?.cashPaymentStatus === 'pending') {
          return (
            <Button
              size="sm"
              className="bg-[#f48432] hover:bg-[#e07528] w-full sm:w-auto shadow-md"
              onClick={() => collectCashPayment(booking._id)}
              disabled={updatingStatus === booking._id}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Collect Cash Payment
            </Button>
          );
        }
        return null;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Rendering is protected by the route guard; avoid early return that can cause blank screen during auth state transitions

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* Header - Fixed/Sticky */}
      <div className="bg-[#29354c] text-white pt-8 pb-14 shadow-md relative z-30 rounded-b-[2.5rem] flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">

            <div className="flex-1">
              <h1 className="text-xl font-bold text-white tracking-wide">Booking Requests</h1>
              <p className="text-xs text-gray-300 font-light">Manage your incoming rides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50 relative z-20">
        <div className="container mx-auto px-3 sm:px-4 py-4 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="text-center py-12 shadow-lg rounded-2xl border-none">
            <CardContent>
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Booking Requests</h3>
              <p className="text-gray-500">You don't have any pending booking requests at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <Card 
                key={booking._id} 
                className={`border-none shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white ring-1 ring-gray-100 ${
                  booking.tripDetails.tripType === 'return' 
                    ? 'border-l-4 border-l-[#f48432]' 
                    : ''
                }`}
              >
                {/* Card Header: ID & Status */}
                <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-start bg-gray-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center ring-1 ring-gray-100">
                      <Car className="w-5 h-5 text-[#29354c]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Booking ID</p>
                      <h3 className="text-base font-bold text-[#29354c]">#{booking.bookingNumber}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(booking.status)}
                    <span className="text-[10px] text-gray-400 mt-1">{formatDate(booking.createdAt)}</span>
                  </div>
                </div>

                <CardContent className="p-0">
                  {/* Price & Trip Info */}
                  <div className="px-5 py-4">
                    <div className="flex justify-between items-baseline mb-6">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Trip Earning</p>
                        <h2 className="text-3xl font-bold text-[#29354c] mt-1">
                          ₹{getBookingPricing(booking).totalAmount.toLocaleString()}
                        </h2>
                         {/* Show partial payment info for bus/car with cash method */}
                        {booking.payment?.isPartialPayment && (
                          <div className="mt-1 flex items-center gap-2 text-xs">
                             <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 font-normal">
                               Online: ₹{booking.payment.partialPaymentDetails?.onlineAmount}
                             </Badge>
                             <Badge variant="outline" className="text-[#f48432] border-orange-200 bg-orange-50 font-normal">
                               Cash: ₹{booking.payment.partialPaymentDetails?.cashAmount}
                             </Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                         <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100">
                            {booking.tripDetails.tripType === 'return' ? 'Round Trip' : 'One Way'}
                         </Badge>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-4 space-y-8 mb-6">
                      {/* Vertical connector line */}
                      <div className="absolute left-[23px] top-3 bottom-8 w-0.5 bg-gray-200 border-l border-dashed border-gray-300"></div>

                      {/* Pickup */}
                      <div className="relative flex items-start group">
                        <div className="absolute left-0 top-1 p-1 bg-white">
                          <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-500 box-border"></div>
                        </div>
                         <div className="ml-8 w-full">
                          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 block">Pickup</label>
                          <p className="text-sm font-medium text-gray-900 leading-snug">{booking.tripDetails.pickup.address}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(booking.tripDetails.date)} • {formatTime(booking.tripDetails.time)}
                          </p>
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="relative flex items-start group">
                        <div className="absolute left-0 top-1 p-1 bg-white">
                          <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-[#f48432] box-border"></div>
                        </div>
                        <div className="ml-8 w-full">
                          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5 block">Destination</label>
                          <p className="text-sm font-medium text-gray-900 leading-snug">{booking.tripDetails.destination.address}</p>
                           {/* Return Date display */}
                          {booking.tripDetails.tripType === 'return' && booking.tripDetails.returnDate && (
                            <p className="text-xs text-blue-600 mt-1 flex items-center font-medium">
                              <Calendar className="w-3 h-3 mr-1" />
                              Return: {formatDate(booking.tripDetails.returnDate)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-dashed border-gray-200">
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-xs text-gray-500 mb-1">Distance</p>
                        <p className="font-semibold text-[#29354c]">{booking.tripDetails.distance.toFixed(1)} km</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                         <p className="text-xs text-gray-500 mb-1">Passengers</p>
                         <p className="font-semibold text-[#29354c]">{booking.tripDetails.passengers}</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                         <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                         <p className="font-semibold text-[#29354c] truncate px-1" title={booking.vehicle?.model}>{booking.vehicle?.model || 'Car'}</p>
                      </div>
                    </div>

                    {/* Passenger Row */}
                    <div className="flex items-center space-x-3 mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                       <div className="w-10 h-10 rounded-full bg-[#29354c] text-white flex items-center justify-center text-sm font-bold">
                          {booking.user.firstName.charAt(0)}{booking.user.lastName.charAt(0)}
                       </div>
                       <div>
                          <p className="text-xs text-gray-500 font-medium">Passenger</p>
                          <p className="text-sm font-bold text-[#29354c]">{booking.user.firstName} {booking.user.lastName}</p>
                       </div>
                       {booking.status === 'accepted' && (
                         <div className="ml-auto">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full">
                               <Phone className="w-4 h-4" />
                            </Button>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {getStatusActions(booking) && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      {getStatusActions(booking)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </div>

      <DriverBottomNavigation />
    </div>
  );
};

export default DriverRequests; 