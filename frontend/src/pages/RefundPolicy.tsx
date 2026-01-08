import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";
import UserBottomNavigation from "@/components/UserBottomNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <TopNavigation />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-[#29354c] text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="text-white hover:bg-white/10 -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Refund Policy</h1>
        </div>
      </div>

      {/* Hero Section (Desktop) */}
      <div className="hidden md:block bg-[#29354c] text-white py-6">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="text-white hover:bg-white/10 mb-2 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
          <p className="text-gray-300 max-w-2xl text-sm">
            Details regarding cancellations, refunds, and vouchers.
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 md:py-12 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-10 text-gray-700 leading-relaxed text-sm md:text-base space-y-8">
              
              {/* Main Policy Statement */}
              <div className="bg-orange-50 border-l-4 border-[#f48432] p-4 rounded-r-lg">
                <p className="mb-2">
                  You may cancel your booking with us any time before the schedule date and time of your pick-up only by calling us on our 24×7 Customer Care helpline number <strong>8178710350</strong>.
                </p>
                <p className="text-sm">
                  If you cancel when the driver and/or car details provided you will be charged a cancellation fee. No cancellation fee shall be payable unless Happiness Car Rental confirms the cancellation of your ride in accordance with the terms of use and Cancellation and refund policy.
                </p>
              </div>

              {/* 1. Cancellation Fees */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-[#f48432]" />
                  <h2 className="text-xl md:text-2xl font-bold text-[#29354c]">1. Cancellation Fees</h2>
                </div>
                <p className="mb-4">
                  If a booking request is cancelled for any reason whatsoever when the driver and/or car details provided, you’ll be charged a cancellation fee as forfeiture of the complete advance amount paid by you for the booking.
                </p>
                <p className="mb-4">
                  Drivers are also able to cancel a ride request if they’ve waited 45 minutes at the pickup location and/or for any reason whatsoever you have provided wrong details of pickup location or you are not reachable at phone, mobile number and email address you have provided. You may be charged either a cancellation fee as forfeiture of the complete advance amount paid by you for the booking or:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4 font-medium text-[#29354c]">
                  <li>Rs. 4.10 per minute for Hatchback / Sedan car</li>
                  <li>Rs. 5 per minute for SUV / Innova car</li>
                  <li>Rs. 12 per minute for Tempo Traveller</li>
                </ul>
                <p>
                  ...after 45 minutes completed at the sole discretion of the Happiness Car Rental.
                </p>
                <p className="mt-4 text-sm text-gray-600 italic">
                  In case cancellation is due to external factors (epidemic, tornadoes, earthquakes, floods, strikes, war, etc.) or force majeure leading to road closures, a voucher for the complete advance amount paid by you shall be issued without expiry to use in future, at Happiness Car Rental's sole discretion.
                </p>
              </section>

              {/* 2. Refund Policy */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="w-6 h-6 text-[#f48432]" />
                  <h2 className="text-xl md:text-2xl font-bold text-[#29354c]">2. Refund Policy</h2>
                </div>
                <p className="mb-4">
                  As per the cancellation and refund policy, the refund will be processed. It may take <strong>7 to 15 business days</strong> for the refund to reflect into your account. In case wrong or incorrect banking details/account details provided by you, Happiness Car Rental shall not be responsible for any loss and/or damages whatsoever.
                </p>
                
                <h3 className="font-bold text-[#29354c] mt-6 mb-3">Vouchers without Expiry</h3>
                <p className="mb-3">
                  You shall be entitled for the vouchers without expiry to use in future in Happiness Car Rental sole discretion in the following cases:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="min-w-2 h-2 rounded-full bg-[#f48432] mt-2"></div>
                    <p>Where the allocated driver cancels the ride without assigning any valid and reasonable reason at the last hour and the Happiness Car Rental fails to arrange another ride in a reasonable time.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="min-w-2 h-2 rounded-full bg-[#f48432] mt-2"></div>
                    <p>Where the car breaks down during the trip and the Happiness Car Rental or driver does not rectify it within reasonable time.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="min-w-2 h-2 rounded-full bg-[#f48432] mt-2"></div>
                    <p>In case cancellation is due to external factors which human being cannot avoid (natural disasters, strikes, riots, etc.) or force majeure leading to road closures.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="min-w-2 h-2 rounded-full bg-[#f48432] mt-2"></div>
                    <p>Where you want to change car type or want to increase/decrease trip duration or need some correction in itinerary (must inform well in advance and subject to confirmation).</p>
                  </li>
                </ul>

                <h3 className="font-bold text-[#29354c] mt-6 mb-3">General Terms</h3>
                <p className="mb-3 text-sm">
                  Happiness Car Rental shall not be responsible to refund and/or to provide voucher in any case where you give any money or goods to the Driver except as mentioned in the invoice.
                </p>
                <p className="mb-3 text-sm">
                  Happiness Car Rental shall not be liable to pay any damages, if any, arises from any loss accrued to you. Happiness Car Rental shall not be held responsible for any loss or damage happened during the ride on account of the driver who is a third party agency. However, Happiness Car Rental shall assist you in all the reasonable manner to recover your loss or damage.
                </p>
                <p className="mb-3 text-sm">
                  Happiness Car Rental reserves the right to withhold the complete advance amount paid by you for the booking on account of any misbehave or misconduct, physically, orally or mentally with the driver. Happiness Car Rental also reserves the right jointly and/or severally with the driver to take any action against you as available as per the law applicable at the time of the incident.
                </p>
              </section>

            </CardContent>
          </Card>
        </div>
      </div>
      
      <UserBottomNavigation />
    </div>
  );
};

export default RefundPolicy;
