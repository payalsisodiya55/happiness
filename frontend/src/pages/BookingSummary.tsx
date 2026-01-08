import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, ShieldCheck, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import TopNavigation from '../components/TopNavigation';

const BookingSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');

  // Fallback if accessed directly without state
  if (!state?.car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Session Expired</h2>
          <button onClick={() => navigate('/')} className="text-[#f48432] font-semibold">Return Home</button>
        </div>
      </div>
    );
  }

  const { car, searchParams = {} } = state;
  const { from, to, pickupDate, pickupTime } = searchParams;

  // Calculate costs based on payment method
  const totalAmount = car.price;
  const advancePercentage = 20;
  
  // Dynamic amounts based on selection
  const currentAdvanceAmount = paymentMethod === 'online' 
    ? Math.round((totalAmount * advancePercentage) / 100) 
    : 0;
    
  const currentPayToDriver = totalAmount - currentAdvanceAmount;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-12">
      <div className="hidden md:block">
        <TopNavigation />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Complete Booking</h1>
      </div>

      <div className="container mx-auto px-4 pt-4 md:pt-8 mt-14 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Trip & Car Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Trip Details Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#212c40] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#f48432]" />
                Trip Details
              </h2>
              
              <div className="space-y-6">
                <div className="flex flex-col gap-4 relative">
                  {/* Connector Line */}
                  <div className="absolute left-[11px] top-6 bottom-4 w-0.5 bg-gray-200 border-l border-dashed border-gray-300"></div>
                  
                  {/* From */}
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full border-4 border-green-500 bg-white z-10 flex-shrink-0 mt-0.5"></div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">From</div>
                      <div className="font-semibold text-gray-800 text-lg leading-tight mt-0.5">{from || 'Origin Location'}</div>
                    </div>
                  </div>

                  {/* To */}
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full border-4 border-red-500 bg-white z-10 flex-shrink-0 mt-0.5"></div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">To</div>
                      <div className="font-semibold text-gray-800 text-lg leading-tight mt-0.5">{to || 'Destination Location'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-sm text-[#212c40]">
                    <Calendar className="w-4 h-4 text-[#f48432]" />
                    {pickupDate ? new Date(pickupDate).toLocaleDateString() : 'Date not selected'}
                  </div>
                  {pickupTime && (
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-sm text-[#212c40]">
                      <Clock className="w-4 h-4 text-[#f48432]" />
                      {pickupTime}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Card */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-[#212c40] text-lg">{car.brand} {car.model}</h3>
                <div className="text-sm text-gray-500 mt-1">{car.pricingReference.category} • {car.seatingCapacity} Seater • {car.fuelType}</div>
                <div className="flex items-center gap-1 mt-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Verified Vehicle & Driver</span>
                </div>
              </div>
            </div>

             {/* Payment Method */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#212c40] mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPaymentMethod('online')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'online' ? 'border-[#f48432] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'online' ? 'text-[#f48432]' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${paymentMethod === 'online' ? 'text-[#212c40]' : 'text-gray-600'}`}>Pay Online</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'cash' ? 'border-[#f48432] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <Wallet className={`w-6 h-6 mb-2 ${paymentMethod === 'cash' ? 'text-[#f48432]' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${paymentMethod === 'cash' ? 'text-[#212c40]' : 'text-gray-600'}`}>Cash</span>
                </button>
              </div>
              
              {paymentMethod === 'online' ? (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Pay <span className="font-bold">₹{currentAdvanceAmount}</span> now to confirm your booking. The remaining amount can be paid to the driver.
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-green-50 rounded-lg flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">
                    You can pay the full amount of <span className="font-bold">₹{totalAmount}</span> directly to the driver after the trip.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column - Billing */}
          <div className="space-y-6 lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#212c40] mb-4">Fare Breakdown</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Base Rate (per day)</span>
                  <span>₹{car.price}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Driver Charges</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Taxes & Fees</span>
                  <span>₹0</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-[#212c40] text-lg">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#212c40] font-medium">
                    {paymentMethod === 'online' ? 'Advance Payment (20%)' : 'Pay Now'}
                  </span>
                  <span className={`font-bold ${paymentMethod === 'online' ? 'text-[#f48432]' : 'text-gray-800'}`}>
                    ₹{currentAdvanceAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Pay to Driver</span>
                  <span>₹{currentPayToDriver}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-[#f48432] to-[#ff9a56] hover:from-[#e67728] hover:to-[#f48432] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-100 transition-all hover:shadow-xl hover:-translate-y-0.5">
                {paymentMethod === 'online' ? `Pay ₹${currentAdvanceAmount} & Confirm` : 'Confirm Cash Booking'}
              </button>
            </div>
            </div>
          </div>

        </div>
      </div>

       {/* Mobile Sticky Booking Bar */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500">
              {paymentMethod === 'online' ? 'Pay Now (20%)' : 'Pay to Driver'}
            </div>
            <div className="text-xl font-bold text-[#212c40]">
              {paymentMethod === 'online' ? `₹${currentAdvanceAmount}` : `₹${currentPayToDriver}`}
            </div>
          </div>
          <button className="flex-[2] bg-gradient-to-r from-[#f48432] to-[#ff9a56] text-white py-2.5 rounded-lg font-bold shadow-lg">
            {paymentMethod === 'online' ? 'Pay & Book' : 'Confirm Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
