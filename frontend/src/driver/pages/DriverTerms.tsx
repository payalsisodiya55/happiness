import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const DriverTerms = () => {
  const navigate = useNavigate();

  const terms = [
    "Always use the driver app throughout the trip and share the opening and closing odometer readings with the customer.",
    "The car should be neat and clean. Seat belts, AC/heater, and music system must be in proper working condition.",
    "This trip has a kilometer limit. If usage exceeds this limit, the customer will be charged for the excess kilometers used. Kilometers will be calculated from the customer's pickup location to the drop location only. Garage-to-garage charges are not allowed. Do not collect state tax or toll tax.",
    "Airport entry charges, if applicable, are not included in the fare and must be charged extra from the customer as per actuals, only after showing the receipt. Always show receipts for parking charges and charge the customer strictly as per the receipt.",
    "Do not stop for fuel during the first two hours of the trip. Always take the guest's permission for CNG refueling and for tea or meal breaks. This trip includes one pickup in the pickup city and one drop in the destination city. It does not include within-city travel. If the trip involves hill climbs, the cab AC may be switched off during such climbs.",
    "In case of any query or confusion, always contact the Happiness Car Rental services team. Never argue with the customer."
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
          <h1 className="text-lg font-bold text-[#29354c]">Terms & Conditions</h1>
          <p className="text-xs text-gray-500">Last updated: January 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-0 max-w-3xl mx-auto w-full">
        <Card className="border-none shadow-sm rounded-xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#f48432]" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-[#29354c]">Driver Agreement</h2>
                 <p className="text-sm text-gray-500">Please read carefully</p>
              </div>
            </div>

            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {terms.map((term, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-6 h-6 rounded-full bg-blue-50 text-[#29354c] flex items-center justify-center text-sm font-bold border border-blue-100">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {term}
                    </p>
                  </div>
                ))}
              </div>

               <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold text-green-800 text-sm">Agreement Active</h4>
                   <p className="text-xs text-green-700 mt-1">You have accepted these terms and conditions upon joining.</p>
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

export default DriverTerms;
