import { useNavigate } from "react-router-dom";
import { ArrowLeft, Car, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const DriverLeaseAgreement = () => {
  const navigate = useNavigate();

  const agreementSections = [
    {
      title: "1. B2B Partner",
      content: "You may register as a B2B Partner in various available modes such as affiliate partner, travel agent partner, or API partner. In this arrangement, you generate business for Happiness Car Rental through your channels and receive a sales commission in return. These terms apply equally to B2B Partners and to end users who use services through B2B Partners."
    },
    {
      title: "2. User Requirements and Conduct",
      content: `The Service is not available to persons under the age of 18. You may not authorize third parties to use your account, and you may not allow persons under 18 to receive transportation services unless accompanied by you. You may not assign or transfer your account to any other person or entity.
You agree to comply with all applicable laws while using the Services and to use the Services only for lawful purposes and for the destinations specified. You cannot demand use of the Services for destinations other than those included in your booking, even if included kilometers are not fully exhausted, and no compensation will be provided.
For outstation trips, local destinations in the pickup city are not included unless specifically mentioned in the itinerary. If you end the trip early or do not use the Services for all destinations or days included in the package, you must still pay the full trip price. For one-way trips, only one pickup and one drop are included; additional stops or pickups/drops may incur extra charges. AC may be switched off in hilly areas or where required.
You shall not cause nuisance, annoyance, inconvenience, or property damage to the Third Party Provider or any other party.
You do not have the right to determine or classify Services based on fuel type or specific car model, brand, manufacturer, or registration number. Any 4+1 seater vehicle may be provided for the Sedan category and any 6+1 seater vehicle for the SUV category. Cancellation on these grounds will result in forfeiture of the entire advance amount. Luggage is allowed only as per applicable safety standards. You may be required to provide proof of identity, and refusal may result in denial of Services.`
    },
    {
      title: "3. Demand / Cancellation",
      content: "Any demand for cancellation, refund, or compensation shall not be entertained based on the conduct of a third party unless the matter is grave in nature, such as sexual harassment. Happiness Car Rental reserves the sole right to evaluate such situations independently on a case-by-case basis. However, Happiness Car Rental will always endeavor to make your ride dignified, hassle-free, and smooth."
    },
    {
      title: "4. Text Messaging",
      content: "By creating or activating an account, you agree that the Services may send you SMS messages as part of normal business operations."
    },
    {
      title: "5. Promotional Codes",
      content: "Happiness Car Rental may create promotional codes that provide account credits or other benefits. Promo codes must be used only for their intended purpose, lawfully, and may not be duplicated, sold, transferred, or made public unless expressly permitted. Promo codes may be disabled at any time and are not redeemable for cash. They may expire before use. Happiness Car Rental reserves the right to withhold or deduct benefits obtained through misuse, fraud, or violation of terms."
    },
    {
      title: "6. Content",
      content: `You may submit content such as feedback, comments, or other material (“User Content”). While you retain ownership of your content, you grant Happiness Car Rental a worldwide, perpetual, irrevocable, transferable, royalty-free license to use, modify, distribute, and display such content in any manner.
You confirm that you have all necessary rights to the User Content and that it does not violate any laws or third-party rights. You agree not to submit defamatory, obscene, unlawful, or offensive content. Happiness Car Rental may remove or review content at its discretion.`
    },
    {
      title: "7. Access / Devices",
      content: "You are responsible for obtaining the necessary data network access and compatible devices to use the Services. Data and messaging charges may apply. Happiness Car Rental does not guarantee uninterrupted or error-free operation of the Services."
    },
    {
      title: "8. Payment / Charges",
      content: `Use of the Services may result in charges payable to Third Party Providers. Happiness Car Rental facilitates payment as a limited payment collection agent. Charges include applicable taxes and are final and non-refundable unless otherwise decided by Happiness Car Rental.
All charges are due immediately upon completion of services, and a receipt will be provided by email. You may request a lower charge directly from the Third Party Provider, but Happiness Car Rental is not bound by such requests.
Happiness Car Rental reserves the right to revise charges at any time. Charges may increase during high-demand periods. Promotional discounts may apply to some users and not others and do not affect standard charges. Wallet balances or vouchers apply only against advance booking amounts, not the total trip price.`
    },
    {
      title: "9. Gratuity and Additional Charges",
      content: `Payments are intended to fully compensate Third Party Providers. Tipping is voluntary and not mandatory. Happiness Car Rental does not guarantee or include gratuities in payments.
Happiness Car Rental is not responsible if a driver demands money during the ride that is not adjusted against the payable amount. Toll tax, state tax, parking fees, and similar charges are not included unless specified and must be paid by you as per actuals. You are responsible for collecting receipts. If FASTag is used, you must request debit details from the driver.
You are liable to pay the full trip package price even if you shorten the trip or do not use all included kilometers. No refunds, cashbacks, vouchers, or alternative destination usage will be permitted.`
    },
    {
      title: "10. Repair or Cleaning Fee",
      content: "You are responsible for the cost of repair or cleaning of Third Party Provider vehicles or property caused by damage beyond normal wear and tear. If such a request is verified by Happiness Car Rental, the applicable charges shall be payable by you."
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
          <h1 className="text-lg font-bold text-[#29354c]">Lease Agreement</h1>
          <p className="text-xs text-gray-500">Vehicle lease terms</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 pb-0 max-w-3xl mx-auto w-full">
        <Card className="border-none shadow-sm rounded-xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-[#f48432]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#29354c]">Lease Agreement</h2>
                  <p className="text-sm text-gray-500">Official document</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Accepted</Badge>
            </div>

            <ScrollArea className="h-full pr-4">
              <div className="space-y-8">
                {agreementSections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-bold text-[#29354c] text-sm">{section.title}</h3>
                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-justify">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

               <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="font-semibold text-green-800 text-sm">Agreement Signed</h4>
                   <p className="text-xs text-green-700 mt-1">You signed this agreement electronically when you joined.</p>
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

export default DriverLeaseAgreement;
