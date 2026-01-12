import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, ClipboardCheck, Car, Wallet, ChevronRight } from "lucide-react";

const DriverLegalDocuments = () => {
  const navigate = useNavigate();

  const documents = [
    {
      title: "Terms & Conditions",
      description: "Rules and guidelines for using the driver app",
      icon: FileText,
      path: "/driver/profile/legal/terms",
    },
    {
      title: "Privacy Policy",
      description: "How your data is collected and used",
      icon: Shield,
      path: "/privacy", // Placeholder path
    },
    {
      title: "Service Level Agreement (SLA)",
      description: "Performance standards, penalties and expectations",
      icon: ClipboardCheck,
      path: "/sla", // Placeholder path
    },
    {
      title: "Lease Agreement",
      description: "Vehicle lease terms between driver and company",
      icon: Car,
      status: "Accepted",
      path: "/lease-agreement", // Placeholder path
    },
    {
      title: "Commission Policy",
      description: "Platform commission and payout structure",
      icon: Wallet,
      path: "/commission-policy", // Placeholder path
    },
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
          <h1 className="text-lg font-bold text-[#29354c]">Legal & Documents</h1>
          <p className="text-xs text-gray-500">Important policies and agreements</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-3">
        {documents.map((doc, index) => (
          <Card 
            key={index} 
            className="border-none shadow-sm rounded-xl overflow-hidden active:scale-[0.99] transition-transform cursor-pointer"
            onClick={() => navigate(doc.path)}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <doc.icon className="w-5 h-5 text-[#f48432]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#29354c] text-sm truncate">{doc.title}</h3>
                    {doc.status === "Accepted" && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-medium border border-green-200">
                        {doc.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{doc.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 ml-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-[10px] text-gray-400 font-medium">App Version 1.0.0</p>
        <p className="text-[10px] text-gray-400">© 2026 DriveOn Technologies</p>
      </div>
    </div>
  );
};

export default DriverLegalDocuments;
