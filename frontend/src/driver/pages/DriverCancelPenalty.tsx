import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Clock, CircleDollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import driverApiService from "@/services/driverApi";
import { Loader2 } from "lucide-react";

interface Penalty {
  _id: string;
  amount: number;
  reason: string;
  type: string;
  status: 'active' | 'paid' | 'waived';
  appliedAt: string;
  bookingId?: string;
}

const DriverCancelPenalty = () => {
  const navigate = useNavigate();
  const [myPenalties, setMyPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);

  const penaltyRules = [
    "Cancellation 12 hours before departure – ₹300 fine",
    "Cancellation within 12 hours of departure – ₹300 fine",
    "Cancellation within 3 hours of departure – ₹500 fine",
    "Cancellation within 30 minutes of acceptance – ₹100 fine",
    "Sending a car different from the one selected in the app – ₹200 fine",
    "Sending a different driver to the customer than the one selected in the driver app – ₹200 fine",
    "If a CNG car is provided in the sedan category, it must have a carrier. Adequate boot space in the trunk must be ensured – ₹200 fine",
    "Driver did not complete the journey in the app and it was not completed through the customer – ₹100 fine",
    "Car is not clean – ₹200 fine",
    "Car is not in good condition – ₹250 fine",
    "Driver misbehaves with the customer – ₹200 fine"
  ];

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        const data = await driverApiService.getPenalties();
        setMyPenalties(data);
      } catch (error) {
        console.error("Failed to fetch penalties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-[#29354c]">My Penalties & Rules</h1>
          <p className="text-xs text-gray-500">Track fines and service guidelines</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-0 max-w-3xl mx-auto w-full space-y-6">

        {/* My Penalties Section */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-[#29354c] flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-[#f48432]" />
            Recent Penalties
          </h2>

          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : myPenalties.length > 0 ? (
            <div className="space-y-3">
              {myPenalties.map((penalty) => (
                <Card key={penalty._id} className="border-l-4 border-l-red-500 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{penalty.reason}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(penalty.appliedAt).toLocaleDateString()} • {new Date(penalty.appliedAt).toLocaleTimeString()}
                        </p>
                        {penalty.type && (
                          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                            {penalty.type}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-red-600">-₹{penalty.amount}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${penalty.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {penalty.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-dashed border-gray-200 text-center">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">No penalties applied</p>
              <p className="text-xs text-gray-500">Keep up the great work!</p>
            </div>
          )}
        </div>

        {/* Penalty Rules Section */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#29354c]">Penalty Structure</h2>
                <p className="text-sm text-gray-500">Effective from Jan 2026</p>
              </div>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed border border-gray-100">
                  <p className="mb-3 font-semibold text-[#29354c]">Dear Friends,</p>
                  <p className="mb-3">
                    As you know, our business success depends on the quality of services provided to customers. A few cases have come to our attention where applicable services are provided by our partners. Therefore, at Happiness Car Rental, we have ensured a Service Labor Agreement (SLA) for our partners to define penalties for various inappropriate services.
                  </p>
                  <p>
                    Please follow the instructions below carefully and fulfill our responsibility to provide good services to our customers, so that our partners do not have to face any kind of penalty.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-[#29354c] mb-4 text-base mt-2">Cancellation & Violations</h3>
                  <div className="space-y-3">
                    {penaltyRules.map((penalty, index) => (
                      <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-5 h-5 rounded-full bg-[#29354c] text-white flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm font-medium">
                          {penalty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg text-xs text-blue-800 leading-relaxed border border-blue-100 italic">
                  Happiness Car Rental will ensure that no one is unfairly penalized during these events. Happiness Car Rental reserves the right to make final decisions.
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-[10px] text-gray-400 font-medium">Happiness Car Rental</p>
      </div>
    </div>
  );
};

import { CheckCircle } from "lucide-react";

export default DriverCancelPenalty;
