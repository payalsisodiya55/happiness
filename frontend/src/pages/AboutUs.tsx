import React from 'react';
import { Users, Shield, Award, MapPin } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Footer from '../components/Footer';
import UserBottomNavigation from '../components/UserBottomNavigation';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavigation />

      {/* Hero Section */}
      <div className="bg-[#212c40] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f48432] rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-3xl transform -translate-x-16 translate-y-16"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">About Us</h1>
          <div className="w-20 h-1 bg-[#f48432] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Providing reliable cars & tempo travellers for your comfortable and pleasing journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 flex-grow">
        {/* Intro Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold text-[#212c40] relative inline-block">
                Welcome to Happiness
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#f48432]/30 rounded-full"></span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify">
                Happiness Car Rental Service (travel Vertical) is the division of Happiness Car Rental Services Private Limited, And H.S. ENTERPRISES an Indian Company. Our firm, Happiness Car Rental, situated at Chakan, Pune, Maharashtra, is a reputed name for providing reliable cars & tempo travellers on hire. We aim to offer individuals as well as corporates with superlative car and tempo travellers hiring services. Our fleet consists of standard as well as most premium cars with an established network extending through major cities across the country.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                We have well maintained & luxurious cars which help to make your travel comfortable and pleasing. Over time our firm has made a mark in the self-drive car rental segment. Our establishment has provided impeccable services to a large number of customers. We believe in offering quality services at reasonable price points. We are taking conscientious strides at achieving customer satisfaction through maintaining impeccable standards in our service offerings. We are passionate & professional at the same time which help us to deliver outstanding results to our clients.
              </p>
              <div className="pt-4">
                <blockquote className="border-l-4 border-[#f48432] pl-4 italic text-gray-700 font-medium">
                  "Get in touch with us to get the best travelling solution."
                </blockquote>
              </div>
            </div>
            
            {/* Visual Element relating to cars/travel */}
            <div className="flex-1 w-full flex justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Shield className="w-6 h-6 text-[#212c40]" />
                  </div>
                  <h3 className="font-bold text-gray-800">Reliable</h3>
                  <p className="text-xs text-gray-500 mt-1">Trusted by thousands</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl flex flex-col items-center text-center transform translate-y-8 hover:translate-y-6 transition-transform">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Award className="w-6 h-6 text-[#f48432]" />
                  </div>
                  <h3 className="font-bold text-gray-800">Premium</h3>
                  <p className="text-xs text-gray-500 mt-1">Top class fleet</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center transform hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Users className="w-6 h-6 text-[#212c40]" />
                  </div>
                  <h3 className="font-bold text-gray-800">Customer Focus</h3>
                  <p className="text-xs text-gray-500 mt-1">Satisfaction first</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center text-center transform translate-y-8 hover:translate-y-6 transition-transform">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <MapPin className="w-6 h-6 text-[#f48432]" />
                  </div>
                  <h3 className="font-bold text-gray-800">Pan India</h3>
                  <p className="text-xs text-gray-500 mt-1">Major cities covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#212c40] mb-3">Our Management Team</h2>
            <div className="w-16 h-1 bg-[#f48432] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mr. Sachin Lahudkar", role: "Founder & CEO", color: "from-blue-500 to-blue-700" },
              { name: "Mr. Vilas Lahudkar", role: "Founder & CEO", color: "from-[#212c40] to-[#3a4b66]" },
              { name: "Ms. Priya Lahudkar", role: "Chief Finance Officer (CFO)", color: "from-[#f48432] to-[#e06d1b]" },
              { name: "Mr. Padurag Khanzode", role: "Relationship Manager", color: "from-green-500 to-green-700" }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center group">
                 <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                    {member.name.split(' ')[1].charAt(0)}
                 </div>
                 <h3 className="text-lg font-bold text-[#212c40] mb-1">{member.name}</h3>
                 <p className="text-[#f48432] text-sm font-medium uppercase tracking-wide">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-[#212c40] rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 flex items-center">
              WHY <span className="text-[#f48432] ml-2">Happiness Car Rental Service</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6 text-gray-300 leading-relaxed text-justify">
                <p>
                  We specialize in cab service / Flight booking / Train booking / Domestic and International Hotels, Adventure tourism, Luxury events like destination weddings, corporate events, corporate seminars & tours offering you the advantage of best pricing and experience. We help and guide you to make your itinerary and events memorable based on your preference and create customized plans.
                </p>
                <p>
                  That said, we don't want to be remembered as just another Car Rental company. Our mission is to 'Make every Indian fall in love with Road Travel'.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-gray-200 italic leading-relaxed">
                  "Roaming on serpentine roads of India, where ancient mountains whisper tales of time and saree-clad silhouettes pirouette in marigold sunsets. The air vibrates with manifold dialects, harmonized by sweet symphonies of hymns. Vendors sell spicy chaat, bazaars burst with kaleidoscopic trinkets, while incense from far-off temples paints the journey in divine hues. What better way to experience these sights, sounds, smells and tastes than in a chauffeur-driven car?"
                </p>
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

export default AboutUs;
