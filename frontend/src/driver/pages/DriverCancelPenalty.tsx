import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const DriverCancelPenalty = () => {
  const navigate = useNavigate();

  const penalties = [
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
          <h1 className="text-lg font-bold text-[#29354c]">Cancellation & Penalties</h1>
          <p className="text-xs text-gray-500">Service quality guidelines</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-0 max-w-3xl mx-auto w-full">
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

            <ScrollArea className="h-full pr-4">
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
                    {penalties.map((penalty, index) => (
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

export default DriverCancelPenalty;
