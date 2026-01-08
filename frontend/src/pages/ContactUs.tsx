import React from 'react';
import TopNavigation from '../components/TopNavigation';
import Footer from '../components/Footer';
import UserBottomNavigation from '../components/UserBottomNavigation';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactUs = () => {
  const contactDetails = [
    {
      icon: MapPin,
      title: "Our Location",
      details: ["Near Rajratna Hotel, TATA Company,", "Pune Nashik Highway, Chakan,", "Pune, Maharashtra 410501"],
      color: "bg-blue-50 text-blue-600",
      delay: "0"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@happinesscarrental.com", "support@happinesscarrental.com"],
      color: "bg-orange-50 text-orange-600",
      delay: "100"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 7058928801", "+91 8178710350"],
      color: "bg-green-50 text-green-600",
      delay: "200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavigation />

      {/* Hero Section */}
      <div className="bg-[#212c40] text-white py-16 md:py-24 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f48432] rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl transform -translate-x-16 translate-y-16"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Get in Touch</h1>
          <div className="w-24 h-1.5 bg-[#f48432] mx-auto rounded-full mb-8"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Have questions about our services or need assistance? We're here to help you with your comfortable journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 flex-grow -mt-16 relative z-20">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactDetails.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#212c40] mb-4">{item.title}</h3>
              <div className="space-y-1.5">
                {item.details.map((line, i) => (
                  <p key={i} className="text-gray-600 font-medium">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Operating Hours Card - Centered */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#212c40] rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f48432] rounded-full opacity-20 blur-2xl transform translate-x-20 -translate-y-20"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                      <Clock className="w-8 h-8 text-[#f48432]" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">Operating Hours</h3>
                      <p className="text-gray-300 mt-1">We are available 24/7 for support</p>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Our dedicated team is always ready to assist you. Whether it's a booking inquiry, support request, or just a general question, we're here around the clock to ensure your journey is smooth and hassle-free.
                  </p>
                </div>

                <div className="flex-1 w-full md:w-auto bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="font-medium text-gray-300">Monday - Friday</span>
                      <span className="font-bold text-[#f48432]">24 Hours</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <span className="font-medium text-gray-300">Saturday</span>
                      <span className="font-bold text-[#f48432]">24 Hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Sunday</span>
                      <span className="font-bold text-[#f48432]">24 Hours</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>

      </div>

      <Footer />
      <UserBottomNavigation />
    </div>
  );
};

export default ContactUs;
