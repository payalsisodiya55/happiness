import React from 'react';
import TopNavigation from '../components/TopNavigation';
import Footer from '../components/Footer';
import UserBottomNavigation from '../components/UserBottomNavigation';
import { FileText, Shield, Users, Truck, CreditCard, Award, Copyright, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SLAPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavigation />

      {/* Hero Section */}
      <div className="bg-[#212c40] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f48432] rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-3xl transform -translate-x-16 translate-y-16"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Service Level Agreement</h1>
          <div className="w-24 h-1.5 bg-[#f48432] mx-auto rounded-full mb-8"></div>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            Please ensure that you read and understand this Service Level Agreement before you use Happiness Car Rental services.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 flex-grow -mt-10 relative z-20">
        
        <Card className="mb-12 border-none shadow-xl">
            <CardHeader className="bg-white border-b border-gray-100 p-8 rounded-t-xl">
                <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-[#f48432]" />
                    <CardTitle className="text-2xl font-bold text-[#212c40]">Agreement Overview</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-8 bg-white rounded-b-xl text-gray-700 leading-relaxed text-justify space-y-4">
                <p>
                    If you continue to browse and use our website and mobile apps, you are agreeing to comply with and be bound by the following Service Level Agreement that govern the relationship between Happiness Solutions India Private Limited / H.S. ENTERPRISES hereinafter referred to as "Happiness Car Rental", and you, hereinafter referred to as "Vendor/Driver".
                </p>
                
                <h3 className="text-lg font-bold text-[#212c40] mt-6 flex items-center gap-2">
                     1. Agree as follows:
                </h3>
                <p>
                    Happiness Car Rental provides services for the purpose of providing lead generation to tour and travels service providers. It receives requests from the users of Happiness Car Rental various applications such as the website, phone calls and other means. Happiness Car Rental transfers these requests to the authorized tour and travels provider/ "Vendor/Driver". The "Vendor/Driver" seek, receive and fulfil the requests provided to them from Happiness Car Rental.
                </p>
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-[#212c40] my-4">
                    <p className="text-sm md:text-base text-[#212c40]">
                        <strong>Acknowledgement:</strong> You acknowledge and agree that Happiness Car Rental is only a technology platform to provide various transportation or logistics services through its Vendors who are independent third party contractors not employed by Happiness Car Rental and that Happiness Car Rental does not provide transportation services or function as a transportation carrier or operate as an agent for the transportation of passengers.
                    </p>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8">
            
            {/* Definitions Section */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#212c40] mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#f48432]" /> Definitions
                </h3>
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-[#212c40] mb-2">Driver</h4>
                        <p className="text-gray-600 text-sm leading-relaxed text-justify">
                            Means a principal, agent, employee or contractor of the Vendor who fulfills the then-current Happiness Car Rental requirements to be an active driver using the Happiness Car Rental services; is authorized by Happiness Car Rental to access the services to provide transportation services on behalf of the Vendor or on own account; and is verified by the Vendor (except when acting on own account) and whose names are forwarded to Happiness Car Rental by the Vendors for passing off the leads to them directly.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#212c40] mb-2">Users</h4>
                        <p className="text-gray-600 text-sm leading-relaxed text-justify">
                            Means a customer end user, not being a minor (under the age of 18 years), of the various applications of Happiness Car Rental like the website, call centre numbers, for the purpose of obtaining transport services. If the User is below 18, they shall read these terms with their parent or legal guardian. We reserve the right to demand documented proof of consent.
                        </p>
                    </div>
                </div>
            </section>

             {/* Relationships Section */}
             <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#212c40] mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#f48432]" /> Relationship Terms
                </h3>
                <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
                    <div>
                        <h4 className="font-bold text-[#212c40] mb-2">Relationship with Users</h4>
                        <p className="text-sm mb-3">
                            Vendor acknowledges that provision of transportation services creates a legal and direct business relationship between Vendor and the User, to which Happiness Car Rental is not a party. Happiness Car Rental is not liable for actions of Users. Vendor bears sole responsibility for obligations to Users or third parties.
                        </p>
                        <p className="text-sm mb-3">
                            Vendor/Driver agrees to transport Users directly to their specified destination without unauthorized interruption. Vendor/Driver is free to take action against the User in case of disputes (misbehavior, damage, non-payment), and Happiness Car Rental shall be indemnified.
                        </p>
                    </div>
                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-bold text-[#212c40] mb-2">Vendor's Relationship with Happiness Car Rental</h4>
                        <p className="text-sm mb-3">
                            Vendor is an independent contractor. This agreement does not create any agency, partnership, or joint venture. Happiness Car Rental is not in direct control of Vendors or Drivers.
                        </p>
                        <p className="text-sm">
                           Happiness Car Rental retains the right to deactivate or restrict access to services in the event of a violation of this agreement or harm to the brand reputation.
                        </p>
                    </div>
                     <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-bold text-[#212c40] mb-2">Vendor's Responsibility to Drivers</h4>
                         <p className="text-sm">
                            Vendors have sole responsibility for obligations to Drivers, including compliance with all applicable laws (tax, social security, insurance, employment). Vendor is liable for acts and omissions of its Drivers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#212c40] mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#f48432]" /> Driver & Vehicle Requirements
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-[#212c40] mb-3">Driver Requirements</h4>
                        <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                            <li>Hold a valid Driver’s license with appropriate certification.</li>
                            <li>Valid third-party insurance and pollution certificate.</li>
                            <li>Possess appropriate training, expertise, and experience.</li>
                            <li>Maintain cleanliness, hygiene, and follow COVID-19 guidelines (masks, sanitization).</li>
                            <li>Maintain high standards of professionalism and courtesy.</li>
                            <li>Subject to background and driving record checks.</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-bold text-[#212c40] mb-3">Vehicle Requirements</h4>
                        <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                            <li>Properly registered and licensed to operate as a passenger transportation vehicle.</li>
                            <li>Maintained in good operating condition and consistent with safety standards.</li>
                            <li>Clean and sanitary condition.</li>
                            <li>Vendor is solely responsible for mechanical failure costs.</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h4 className="font-bold text-[#f48432] mb-2 text-sm">Documentation</h4>
                    <p className="text-xs text-gray-700">
                        Vendors must provide written copies of all licenses, permits, registrations, and certifications prior to providing services and upon renewal. Happiness Car Rental reserves the right to verify documentation independently.
                    </p>
                </div>
            </section>

             {/* Payment Policy */}
             <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-[#212c40] mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#f48432]" /> Payment Policy & Fare Adjustment
                </h3>
                <div className="space-y-4 text-sm text-gray-700 leading-relaxed text-justify">
                    <p>
                        Happiness Car Rental reserves the right to change its fare/pricing policy. Vendors will get prices for each transport request and reserve the right to accept or reject. Vendor is responsible for collecting payment from the customer at the end of the journey.
                    </p>
                    <p>
                        <strong>Fare Adjustments:</strong> Happiness Car Rental reserves the right to adjust fares for inappropriate services (long routes, poor vehicle condition, delays, etc.) or cancel fares for substantiated complaints.
                    </p>
                    <p>
                        <strong>Minimum Balance & Penalties:</strong> Vendors must maintain a non-refundable minimum balance. Happiness Car Rental reserves the right to charge a penalty of 0-25% of total fare for cancellation or delay after accepting a booking.
                    </p>
                    <p>
                         <strong>Inappropriate Services:</strong> Happiness Car Rental decision on inappropriate services is final. Penalties will be communicated via email. Grave offenses like sexual harassment will face legal action.
                    </p>
                </div>
            </section>

             {/* Membership & Taxes */}
             <section className="grid md:grid-cols-2 gap-8">
                 <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#212c40] mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#f48432]" /> Membership
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Membership fees are payable in advance and non-refundable. Membership does not guarantee a minimum number of bookings; it provides a better chance of accepting bookings. Happiness Car Rental reserves the right to modify membership features at any time.
                    </p>
                 </div>
                 <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-[#212c40] mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#f48432]" /> Taxes
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Vendor is responsible for all tax registration and remittance (including GST) related to transportation services. Vendors and Drivers are responsible for income taxes. Happiness Car Rental may collect and remit taxes if required by law.
                    </p>
                 </div>
             </section>

             {/* Intellectual Property & Term */}
             <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                 <div className="mb-6">
                    <h3 className="font-bold text-[#212c40] mb-3 flex items-center gap-2">
                        <Copyright className="w-5 h-5 text-[#f48432]" /> Intellectual Property
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed text-justify">
                        All Happiness Car Rental services, logos, data, and intellectual property remain the property of Happiness Car Rental. Vendor obtains no rights except a limited license to use the services. Vendor shall not claim ownership, reverse engineer, or misuse Happiness Car Rental marks.
                    </p>
                 </div>
                 <div>
                    <h3 className="font-bold text-[#212c40] mb-3 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-[#f48432]" /> Term
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        This agreement shall commence on the date that the agreement in any format is executed.
                    </p>
                 </div>
             </section>

        </div>
      </div>

      <Footer />
      <UserBottomNavigation />
    </div>
  );
};

export default SLAPage;
