import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";
import UserBottomNavigation from "@/components/UserBottomNavigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

const TermsConditions = () => {
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
          <h1 className="text-xl font-bold">Terms & Conditions</h1>
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
          <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
          <p className="text-gray-300 max-w-2xl text-sm">
            Please read these terms carefully before accessing or using our services.
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 md:py-12 mb-16 md:mb-0">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-6 md:p-10 text-gray-700 leading-relaxed text-sm md:text-base space-y-8">
              
              {/* Introduction */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6 text-[#f48432]" />
                  <h2 className="text-xl md:text-2xl font-bold text-[#29354c]">1. Terms of Use</h2>
                </div>
                <p className="mb-4">
                  1.1 These Terms of Use (Terms) govern the access or use by you, an individual, from within any country in the world of applications, websites, content, products, and services (the Services) made available by Happiness Car Rental.
                </p>
                <div className="bg-orange-50 border-l-4 border-[#f48432] p-4 rounded-r-lg">
                  <p className="font-semibold text-[#29354c] mb-2 uppercase">Terms Carefully Before Accessing or Using the Services</p>
                  <p className="text-sm">
                    1. Your access and use of the Services constitutes your agreement to be bound by these Terms, which establishes a contractual relationship between you and Happiness Car Rental. If you do not agree to these Terms, you may not access or use the Services. These Terms expressly supersede all prior agreements or arrangements with you.
                  </p>
                  <p className="text-sm mt-2">
                    Happiness Car Rental may immediately terminate these Terms or any Services with respect to you, or generally cease offering or deny access to the Services or any portion thereof, at any time for any reason. Supplemental terms may apply to certain Services, such as policies for a particular event, activity or promotion, and such supplemental terms will be disclosed to you in connection with the applicable Services.
                  </p>
                </div>
              </section>

              {/* 2. Services */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">2. Services</h2>
                <p className="mb-4">
                  The Services constitute a technology platform that enables users of websites or phone numbers provided as part of the Services (each, an Application) to arrange and schedule transportation with independent third party providers of such services, including independent third party transportation providers under agreement with Happiness Car Rental or certain of Happiness car rental affiliates. Unless otherwise agreed by Happiness Car Rental in a separate written agreement with you, the Services are made available solely for your personal, non-commercial use.
                </p>
                
                <h3 className="font-bold text-[#29354c] mt-4 mb-2">2.3 Restrictions (2.3.1)</h3>
                <p>
                  You may not: (i) remove any copyright, trademark or other proprietary notices from any portion of the Services; (ii) reproduce, modify, prepare derivative works based upon, distribute, license, lease, sell, resell, transfer, publicly display, publicly perform, transmit, stream, broadcast or otherwise exploit the Services except as expressly permitted by Happiness Car Rental; decompile, reverse engineer or disassemble the Services except as may be permitted by applicable law, link to, mirror or frame any portion of the Services; cause or launch any programs or scripts for the purpose of scraping, indexing, surveying, or otherwise data mining any portion of the Services or unduly burdening or hindering the operation and/or functionality of any aspect of the Services; or attempt to gain unauthorized access to or impair any aspect of the Services or its related systems or networks.
                </p>
              </section>

              {/* 3. Provision */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">3. Provision of the Services</h2>
                <p>
                  You acknowledge that the Services may be made available under request options by or in connection with: certain of Happiness Car Rental subsidiaries and affiliates; or independent Third Party Providers, including transportation network company drivers, transportation charter permit holders or holders of similar transportation permits, authorizations or licenses.
                </p>
              </section>

              {/* 4. Third Party */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">4. Third Party Services</h2>
                <p>
                  The Services may be made available or accessed in connection with third party services and content (including advertising) that Happiness Car Rental does not control. You acknowledge that different terms of use and privacy policies may apply to your use of such third party services and content. Happiness Car Rental does not endorse such third party services and content and in no event shall Happiness Car Rental be responsible or liable in any manner for any products or services of such third party providers.
                </p>
              </section>

              {/* 5. Ownership */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">5. Ownership</h2>
                <p>
                  The Services and all rights therein are and shall remain Happiness Car Rental property or the property of Happiness Car Rental licensors. Neither these Terms nor your use of the Services convey or grant to you any rights: (i) in or related to the Services except for the limited license granted above; or (ii) to use or reference in any manner Happiness Car Rental company names, logos, product and service names, trademarks or services marks or those of Happiness Car Rental licensors.
                </p>
              </section>

              {/* 6. User Accounts */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">6. Use of the Services & User Accounts</h2>
                <p>
                  In order to use most aspects of the Services, you must register for and maintain an active personal user Services account (Account). You must be at least 18 years of age to obtain an Account. Account registration requires you to submit to Happiness Car Rental certain personal information, such as your name, address, mobile phone number, and email. You agree to maintain accurate, complete, and up-to-date information in your Account. Your failure to maintain accurate, complete, and up-to-date Account information, may result in your inability to access and use the Services or Happiness Car Rental termination of these Terms with you. You are responsible for all activity that occurs under your Account, and also indemnifies the Happiness Car Rental from any claim or damages. You agree to maintain the security and secrecy of your Account password at all times.
                </p>
              </section>

              {/* 7. B2B */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">7. B2B Partner</h2>
                <p>
                  You may also register as B2B Partner in various available modes like affiliate partner or travel agent partner or API partner; wherein you will be generating business for Happiness Car Rental through your channels and get a sales commission in return. These terms equally apply to B2B partners and end users using services through B2B Partners.
                </p>
              </section>

              {/* 8. User Requirements */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">8. User Requirements and Conduct</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The Service is not available for use by persons under the age of 18.</li>
                  <li>You may not authorize third parties to use your Account, and you may not allow persons under the age of 18 to receive transportation services unless accompanied by you.</li>
                  <li>You agree to comply with all applicable laws when using the Services, and you may only use the Services for lawful purposes (e.g., no transport of unlawful or hazardous materials).</li>
                  <li>You cannot demand that the Services be used for another destination point(s) even if the included Kms in your price package are not fully exhausted.</li>
                  <li>For an outstation trip, the local destinations in the pick-up city are not included unless they are specifically mentioned in the itinerary.</li>
                  <li>For a one-way trip, only one pickup and one drop is included; any additional stops may incur additional charges.</li>
                  <li>AC will remain switched off in hilly areas or wherever required.</li>
                  <li>You will not use the Services to cause nuisance, annoyance, inconvenience, or property damage.</li>
                  <li>We do not guarantee specific car models/brands; vehicles are provided by category (Sedan, SUV, etc.).</li>
                  <li>In certain instances, you may be asked to provide proof of identity to access or use the Services.</li>
                </ul>
              </section>

              {/* 9. Messaging */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">9. Text Messaging</h2>
                <p>
                  By creating or activating an Account, you agree that the Services may send you text (SMS) messages as part of the normal business operation of your use of the Services.
                </p>
              </section>

              {/* 10. Promo Codes */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">10. Promotional Codes</h2>
                <p>
                  Happiness Car Rental’s sole discretion, create promotional codes that may be redeemed for Account credit, or other features or benefits related to the Services and/or a Third Party Provider’s services, subject to any additional terms that Happiness Car Rental establishes on a per promotional code basis (Promo Codes). You agree that Promo Codes must be used for the intended audience and purpose, and in a lawful manner may not be duplicated, sold, or transferred in any manner, or made available to the general public, unless expressly permitted. Promo Codes are not valid for cash and may expire prior to your use.
                </p>
              </section>

              {/* 11. Content */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">11. Content & User Submissions</h2>
                <p className="mb-3">
                  Happiness Car Rental may permit you to submit, upload, publish, or otherwise make available content and information (User Content). Any User Content provided by you remains your property. However, by providing User Content, you grant Happiness Car Rental a worldwide, perpetual, irrevocable, transferrable, royalty-free license to use, copy, modify, distribute, and display such content.
                </p>
                <p>
                  You agree to not provide User Content that is defamatory, libelous, hateful, violent, obscene, pornographic, unlawful, or otherwise offensive. Happiness Car Rental may review, monitor, or remove User Content at its sole discretion.
                </p>
              </section>

              {/* 12. Access */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">12. Access / Devices</h2>
                <p>
                  You are responsible for obtaining the data network access necessary to use the Services. Your mobile network’s data and messaging rates and fees may apply. Happiness Car Rental does not guarantee that the Services will function on any particular hardware or devices. The Services may be subject to malfunctions and delays inherent in the use of the Internet.
                </p>
              </section>

              {/* 13. Payment */}
              <section>
                <h2 className="text-xl font-bold text-[#29354c] mb-3">13. Payment / Charges</h2>
                <div className="space-y-4">
                  <p>
                    You understand that use of the Services may result in charges to you for the services or goods you receive from a Third Party Provider (Charges). Happiness Car Rental will facilitate your payment of the applicable Charges on behalf of the Third Party Provider. Charges will be inclusive of applicable taxes where required by law. Charges paid by you are final and non-refundable, unless otherwise determined by Happiness Car Rental at its sole discretion.
                  </p>
                  <p>
                    Happiness Car Rental reserves the right to establish, remove and/or revise Charges for any or all services. Charges in certain geographical areas may increase substantially during times of high demand.
                  </p>
                  <p>
                    <strong>Taxes & Tolls:</strong> Happiness Car Rental and Third Party Provider shall not be liable for any inter-state tax, Toll Tax, or parking ticket levied during the ride. You shall be responsible for paying these directly as per actuals.
                  </p>
                  <p>
                    <strong>Cancellation/Shortening:</strong> You are liable to pay the full trip package price in case you decide to shorten your trip for whatsoever reason. No refunds for unused Kms or days.
                  </p>
                  <p>
                    <strong>Repair or Cleaning Fee:</strong> You shall be responsible for the cost of repair for damage to, or necessary cleaning of, vehicles resulting from use of the Services in excess of normal wear and tear.
                  </p>
                </div>
              </section>

            </CardContent>
          </Card>
        </div>
      </div>
      
      <UserBottomNavigation />
    </div>
  );
};

export default TermsConditions;
