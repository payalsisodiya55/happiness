import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const DriverSLA = () => {
  const navigate = useNavigate();

  const slaSections = [
    {
      title: "1. Agreement",
      content: "Happiness Car Rental provides services for the purpose of lead generation to tour and travel service providers. It receives requests from users through various applications such as the website, phone calls, and other means, and transfers these requests to authorized tour and travel providers (“Vendor/Driver”). The Vendor/Driver seeks, receives, and fulfills the requests provided by Happiness Car Rental.\nThe Vendor/Driver acknowledges and agrees that Happiness Car Rental is only a technology platform providing access to transportation or logistics services through independent third-party Vendors. Happiness Car Rental does not provide transportation services, does not act as a transportation carrier, and does not operate as an agent for passenger transportation.\nHappiness Car Rental and the Vendor/Driver mutually agree to be bound by the terms and conditions set forth in this Agreement.",
      subSections: [
        {
          title: "Definitions",
          content: "Driver means a principal, agent, employee, or contractor of the Vendor who fulfills the current requirements of Happiness Car Rental to be an active driver, is authorized to access the platform, and is verified by the Vendor. The Driver’s details are shared with Happiness Car Rental for lead allocation."
        },
        {
          title: "Users",
          content: "Users mean customers who are not minors (below 18 years) and who use the Happiness Car Rental website, applications, or call center to obtain transportation services. If a User is below 18 years, the agreement shall be deemed to be with the User’s parent or legal guardian, and Happiness Car Rental may request proof of consent."
        }
      ]
    },
    {
      title: "Relationship with Users",
      content: `The Vendor acknowledges that providing transportation services creates a direct legal relationship between the Vendor and the User. Happiness Car Rental is not a party to this relationship and is not responsible for the actions or inactions of Users, Vendors, Drivers, or Vehicles.
The Vendor/Driver is solely responsible for compliance with all applicable laws, maintaining necessary documentation, insurance, and vehicle papers. Any fines, penalties, or damages arising from non-compliance shall be borne by the Vendor/Driver.
Happiness Car Rental may disclose Vendor or Driver contact and insurance information to Users upon reasonable request. Only authorized Users may be transported, and all journeys must be completed directly to the User’s specified destination without unauthorized stops.
Any disputes between Vendor/Driver and User shall be resolved directly between them. Happiness Car Rental shall not be liable for such disputes but may assist at its discretion.`
    },
    {
      title: "Vendor’s Relationship with Happiness Car Rental",
      content: `The Vendor is an independent contractor and this Agreement does not create any partnership, agency, or joint venture. Happiness Car Rental does not control Vendor operations, Drivers, or Vehicles.
Happiness Car Rental reserves the right to deactivate or restrict access to its platform for any violation of this Agreement or any act that harms its brand, reputation, or business. Upon termination, the Vendor must stop using the Happiness Car Rental name, logo, or branding.
The Vendor is solely responsible for obligations toward its Drivers and must comply with all applicable laws including tax, insurance, and employment laws. The Vendor is liable for all acts and omissions of its Drivers.`
    },
    {
      title: "Ratings and Feedback",
      content: "Users and Drivers may be prompted to provide ratings and feedback after services are completed. All feedback must be given in good faith."
    },
    {
      title: "Drivers and Vehicle Requirements",
      subSections: [
        {
          title: "Driver Requirements",
          content: "Each Driver must hold a valid driving license, permits, approvals, insurance, and pollution certificates as required by law. Drivers must be professionally trained, well-groomed, hygienic, and courteous.\nDrivers must follow all government guidelines, including COVID-19 safety protocols such as wearing masks, maintaining hygiene, and sanitizing vehicles."
        },
        {
          title: "Vehicle Requirements",
          content: "Each Vehicle must be properly registered, licensed, insured, clean, sanitary, and maintained in good operating condition. The Vendor bears all costs related to vehicle maintenance or mechanical failures."
        }
      ]
    },
    {
      title: "Documentation",
      content: "Vendors must submit copies of all required licenses, permits, registrations, and certifications to Happiness Car Rental and provide updates upon renewal. Failure to do so constitutes a material breach. Happiness Car Rental may independently verify documentation."
    },
    {
      title: "Payment Policy and Fare Adjustment",
      content: `Vendors agree to Happiness Car Rental’s pricing and payment policies. Fare policies may be modified from time to time. All payments shall be in Indian Rupees.
Vendors may accept or reject service requests and are responsible for collecting payment from Users upon completion of the journey.
Happiness Car Rental may adjust, reduce, or cancel fares in cases of inappropriate services, delays, incorrect routes, or complaints. Such decisions will be made reasonably.
Vendors must maintain a non-refundable minimum balance as defined by Happiness Car Rental. Failure to do so may attract penalties.
Happiness Car Rental may charge penalties of up to 25% of the total fare for cancellations or delays after accepting bookings. Penalties for inappropriate services will be communicated separately and Happiness Car Rental’s decision shall be final.
In cases of grave offenses, including sexual harassment, Happiness Car Rental reserves the right to take appropriate legal action.`
    },
    {
      title: "Membership",
      content: `Happiness Car Rental may offer paid memberships. Membership fees are non-refundable. Membership does not guarantee bookings or revenue but provides improved access to booking opportunities.
Membership features may be modified or terminated at any time. Unused membership fees may be refunded at Happiness Car Rental’s discretion.`
    },
    {
      title: "Taxes",
      content: "The Vendor is responsible for all tax registrations, filings, and payments, including GST. Happiness Car Rental may collect or remit taxes as required by law."
    },
    {
      title: "Intellectual Property",
      content: "All intellectual property, including the Happiness Car Rental name, logo, applications, and data, remain the exclusive property of Happiness Car Rental. Vendors and Drivers are granted only limited usage rights and may not copy, modify, or misuse any intellectual property."
    },
    {
      title: "Term",
      content: "This Agreement shall commence from the date it is executed in any form."
    }
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
          <h1 className="text-lg font-bold text-[#29354c]">Service Level Agreement</h1>
          <p className="text-xs text-gray-500">SLA Terms & Conditions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-0 max-w-3xl mx-auto w-full">
        {/* Intro Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-xs md:text-sm text-blue-900 leading-relaxed flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p>
            PLEASE ENSURE THAT YOU READ AND UNDERSTAND THIS SERVICE LEVEL AGREEMENT BEFORE YOU USE HAPPINESS CAR RENTAL. If you continue to browse and use our website and mobile apps, you agree to comply with and be bound by the following Service Level Agreement.
          </p>
        </div>

        <Card className="border-none shadow-sm rounded-xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-[#f48432]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#29354c]">SLA Document</h2>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-gray-500 border-gray-200">Legal Binding</Badge>
                </div>
              </div>
            </div>

            <ScrollArea className="h-full pr-4">
              <div className="space-y-8">
                {slaSections.map((section, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="font-bold text-[#29354c] text-sm md:text-base border-b border-gray-100 pb-1 inline-block">
                      {section.title}
                    </h3>
                    {section.content && (
                       <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                        {section.content}
                      </div>
                    )}
                    
                    {/* Render subsections if any */}
                    {section.subSections && (
                      <div className="pl-4 border-l-2 border-gray-100 space-y-4 mt-3">
                        {section.subSections.map((sub, subIndex) => (
                          <div key={subIndex}>
                            <h4 className="font-semibold text-gray-700 text-xs md:text-sm mb-1">{sub.title}</h4>
                            <div className="text-gray-500 text-xs md:text-sm leading-relaxed text-justify">
                              {sub.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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

export default DriverSLA;
