import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone, Mail, User, Home, List, HelpCircle, ChevronDown, X, MessageCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import UserBottomNavigation from "@/components/UserBottomNavigation";

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);

  const helpTopics = [
    {
      id: 1,
      title: "How much before departure, I have to book the cab?",
      description: "Booking timing recommendations",
      content: "Although you can book the cab up to 1–2 hours prior to departure time, we suggest booking 1 day in advance to avoid last-minute rush."
    },
    {
      id: 2,
      title: "I want to book cab without paying any advance amount. I will pay on boarding the cab?",
      description: "Advance payment policy",
      content: "Sorry, it is not possible. You need to pay a small 15–20% amount in advance to book the cab on Happiness Car Rental."
    },
    {
      id: 3,
      title: "Can we pickup additional passengers on the way in one way trip?",
      description: "One way trip policy",
      content: "One way trip includes only one pickup and one drop. Additional pickup or drop will attract additional charges."
    },
    {
      id: 4,
      title: "Is local sightseeing included in outstation trip?",
      description: "Round trip sightseeing details",
      content: "Round trip bookings include all the local sightseeing in destination cities."
    },
    {
      id: 5,
      title: "How to change pickup date, time and return date?",
      description: "Modifying booking details",
      content: "Please click on Departure / Return date on booking page."
    },
    {
      id: 6,
      title: "Are Driver charges / Driver Bata included in the price?",
      description: "Inclusions in pricing",
      content: "Yes, all driver charges are included in the price."
    },
    {
      id: 7,
      title: "Do I need to arrange for Driver food and accommodation during the trip?",
      description: "Driver amenities policy",
      content: "Driver will take care of his food and accommodation."
    },
    {
      id: 8,
      title: "What are extra charges if I need to travel in night hours?",
      description: "Night driving allowance",
      content: "For driving between 10:30 PM to 06:00 AM, an additional Rs. 300 allowance will apply."
    },
    {
      id: 9,
      title: "Any extra charge other than the price shown above?",
      description: "Additional charges info",
      content: "Parking charges, if any, are extra and need to be paid as per actuals. Toll and State tax may vary."
    },
    {
      id: 10,
      title: "Can I book cab by calling customer support?",
      description: "Booking channels",
      content: "You can get help via customer support, but bookings must be done via website or mobile app."
    },
    {
      id: 11,
      title: "I need a one way cab for multiple destinations, is that possible?",
      description: "Multiple destination rules",
      content: "One way trip allows one pickup and one drop. Please book separate one way trips for multiple destinations."
    },
    {
      id: 12,
      title: "Do I need to pay both side Toll tax for one way trip?",
      description: "Toll tax policy",
      content: "No. Only one side Toll tax applies for one way trip."
    },
    {
      id: 13,
      title: "Whether the cab will have FASTag?",
      description: "FASTag availability",
      content: "Yes, all our cabs come with FASTag."
    },
    {
      id: 14,
      title: "Can I travel with pets?",
      description: "Pet policy and charges",
      content: "Yes. Driver may charge Rs. 500 for small cars and Rs. 1000 for bigger cars."
    },
    {
      id: 15,
      title: "Where to mention the complete pickup address?",
      description: "Pickup address input",
      content: "You can mention your complete pickup address on the booking screen."
    },
    {
      id: 16,
      title: "When will I get car and driver details after booking?",
      description: "Allocation timeline",
      content: "Usually shared within minutes, but sometimes up to 2 hours before departure."
    },
    {
      id: 17,
      title: "Will advance amount be refunded if I cancel the booking?",
      description: "Refund policy summary",
      content: "It may or may not be refunded. Please check our Cancellation and Refund Policy."
    },
    {
      id: 18,
      title: "How can I make the advance payment? Which payment gateway should I choose?",
      description: "Payment options",
      content: "You can pay via Netbanking, Debit/Credit card, UPI, PhonePe, Google Pay, Paytm, etc. Select the respective payment gateway accordingly."
    }
  ];

  const contactOptions = [
    {
      id: 1,
      title: "Call Support",
      icon: Phone,
      description: "Speak with our customer care",
      action: "Call Now",
      actionHandler: () => {
        window.location.href = "tel:+919171838260";
      }
    },
    {
      id: 2,
      title: "Email Support",
      icon: Mail,
      description: "Send us an email",
      action: "Send Email",
      actionHandler: () => {
        window.location.href = "mailto:chalosawariofficial@gmail.com?subject=Support Request";
      }
    }
  ];

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleEmergencyContact = () => {
    setShowEmergencyContact(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="hidden md:block sticky top-0 z-[60] bg-white">
        <TopNavigation/>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#212c40] to-[#2d3a52] text-white py-4 md:py-8 px-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1">Trip Details</h1>
            <p className="text-white/70 text-sm">Frequently Asked Questions & Support</p>
          </div>
        </div>
      </div>
      


      {/* Content */}
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="col-span-3 space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQ..."
                className="w-full p-4 pl-12 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#f48432] focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#212c40]/50" />
            </div>

            {/* Help Topics */}
            <div>
              <h2 className="text-lg font-bold text-[#212c40] mb-4 flex items-center gap-2">
                FAQ
                {searchQuery && (
                  <span className="text-sm font-normal text-gray-500 ml-auto bg-gray-100 px-3 py-1 rounded-full">
                    {filteredTopics.length} results
                  </span>
                )}
              </h2>
              <div className="space-y-3">
                {filteredTopics.map((topic) => (
                  <div key={topic.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50/50 transition-colors flex items-center justify-between"
                      onClick={() => toggleFAQ(topic.id)}
                    >
                      <div className="flex-1 pr-4">
                        <h3 className={`font-semibold transition-colors ${expandedFAQ === topic.id ? 'text-[#f48432]' : 'text-[#212c40]'}`}>
                          {topic.title}
                        </h3>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${expandedFAQ === topic.id ? 'bg-[#f48432]/10 rotate-180' : 'bg-gray-100'}`}>
                        <ChevronDown className={`w-5 h-5 ${expandedFAQ === topic.id ? 'text-[#f48432]' : 'text-gray-500'}`} />
                      </div>
                    </div>
                    
                    <div className={`grid transition-all duration-300 ease-in-out ${expandedFAQ === topic.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="px-4 pb-5 pt-0">
                          <div className="border-t border-gray-100 pt-4">
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{topic.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTopics.length === 0 && searchQuery && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No results found</h3>
                  <p className="text-gray-500 mb-6">We couldn't find any help topics for "{searchQuery}"</p>
                  <Button 
                    variant="outline" 
                    className="border-[#f48432] text-[#f48432] hover:bg-[#f48432] hover:text-white"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>

      {/* Emergency Contact Modal */}
      {showEmergencyContact && (
        <div className="fixed inset-0 bg-[#212c40]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#212c40]">Emergency Contact</h3>
                  <p className="text-xs text-red-500 font-medium">24/7 Priority Support</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmergencyContact(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm font-semibold text-red-800 mb-1">When to use this?</p>
                <p className="text-sm text-red-600/90 leading-relaxed">
                  Only use this for critical issues like breakdowns, accidents, or safety concerns during an active trip.
                </p>
              </div>

              <div className="grid gap-3">
                <button 
                  onClick={() => window.location.href = "tel:+919171838260"}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#212c40] hover:bg-[#212c40]/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Phone className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[#212c40]">Call Emergency Line</p>
                      <p className="text-xs text-gray-500">Wait time: &lt; 1 min</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#212c40]" />
                </button>

                <button 
                  onClick={() => window.open("https://wa.me/919171838260", "_blank")}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-[#212c40] hover:bg-[#212c40]/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <MessageCircle className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-[#212c40]">WhatsApp Support</p>
                      <p className="text-xs text-gray-500">Share live location</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#212c40]" />
                </button>
              </div>

              <Button 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 mt-2" 
                onClick={() => setShowEmergencyContact(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <UserBottomNavigation />
    </div>
  );
};

export default Help;