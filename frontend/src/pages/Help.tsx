import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Phone, Mail, User, Home, List, HelpCircle, ChevronDown, X, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import UserBottomNavigation from "@/components/UserBottomNavigation";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);

  const helpTopics = [
    {
      id: 1,
      title: "How to book a ticket?",
      description: "Step by step guide to book your journey",
      content: "To book a ticket, follow these steps:\n\n1. Select your departure and destination cities\n2. Choose your travel date and time\n3. Select One Way or Round Trip\n4. Click 'Search buses' to see available options\n5. Choose your preferred bus and seat\n6. Enter passenger details and payment information\n7. Confirm your booking"
    },
    {
      id: 2,
      title: "Cancellation & Refund",
      description: "Learn about cancellation policies and refund process",
      content: "Cancellation Policy:\n\n• Free cancellation up to 2 hours before departure\n• 50% refund for cancellations 2-24 hours before departure\n• No refund for cancellations within 1 hour of departure\n\nRefund Process:\n• Refunds are processed within 3-5 business days\n• Amount is credited to your original payment method\n• You'll receive an email confirmation once processed"
    },
    {
      id: 3,
      title: "Payment methods",
      description: "Accepted payment options and security",
      content: "Accepted Payment Methods:\n\n• Credit/Debit Cards (Visa, MasterCard, RuPay)\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n• Digital Wallets\n• Cash on Board (selected routes)\n\nSecurity Features:\n• SSL encrypted transactions\n• PCI DSS compliant\n• Secure payment gateway\n• No card details stored"
    },
    {
      id: 4,
      title: "Booking modifications",
      description: "How to change or modify your booking",
      content: "Booking Modifications:\n\nYou can modify your booking up to 2 hours before departure:\n\n• Change travel date (subject to availability)\n• Modify passenger details\n• Update contact information\n• Change pickup location\n\nModification Charges:\n• ₹50 for date changes\n• Free for passenger detail updates\n• No charge for contact info changes"
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
      <div className="hidden md:block">
        <TopNavigation/>
      </div>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#212c40] to-[#2d3a52] text-white py-4 md:py-8 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Help & Support</h1>
          <p className="text-white/70">We're here to help you 24/7</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help topics..."
                className="w-full p-4 pl-12 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-[#f48432] focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#212c40]/50" />
            </div>

            {/* Help Topics */}
            <div>
              <h2 className="text-lg font-bold text-[#212c40] mb-4 flex items-center gap-2">
                Frequently Asked Questions
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
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{topic.description}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${expandedFAQ === topic.id ? 'bg-[#f48432]/10 rotate-180' : 'bg-gray-100'}`}>
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

          {/* Right Column - Contact & Emergency */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#212c40] mb-4">Contact Support</h2>
              <div className="space-y-4">
                {contactOptions.map((option) => (
                  <div key={option.id} className="group p-4 rounded-xl hover:bg-[#212c40]/5 transition-colors border border-gray-100 hover:border-[#212c40]/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#212c40]/10 rounded-full flex items-center justify-center group-hover:bg-[#212c40] transition-colors">
                        <option.icon className="w-5 h-5 text-[#212c40] group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#212c40]">{option.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{option.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={option.actionHandler}
                          className="w-full border-[#212c40] text-[#212c40] hover:bg-[#212c40] hover:text-white"
                        >
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm border border-red-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <Phone className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-red-700 text-lg">Emergency?</h3>
              </div>
              <p className="text-sm text-red-600/80 mb-4 leading-relaxed">
                Need urgent assistance during your ongoing journey? We're here to help 24/7.
              </p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200" 
                onClick={handleEmergencyContact}
              >
                Emergency Support
              </Button>
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