import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Award, Phone, MessageSquare, MapPin, Calendar, Clock, Disc, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useUserAuth } from '../contexts/UserAuthContext';
import TopNavigation from '../components/TopNavigation';

const CarDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useUserAuth();
  const { id } = useParams();

  // Fallback or redirection if no state provided
  useEffect(() => {
    if (!state?.car) {
      // In a real app, you might fetch data by ID here
      navigate('/vihicle-search');
    }
  }, [state, navigate]);

  if (!state?.car) return null;

  const { car, searchParams } = state;

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { returnUrl: '/booking-summary', car, searchParams } });
      return;
    }
    navigate('/booking-summary', { state: { car, searchParams } });
  };

  // Mock driver data (since it wasn't in the original car object)
  const driver = {
    name: "Rajesh Kumar",
    rating: 4.9,
    trips: 1240,
    experience: "5 Years",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    languages: ["Hindi", "English"],
    joined: "2021"
  };

  // Mock Additional Images for gallery
  const carImages = [
    car.image,
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop",

    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop"
  ];

  const [mainImage, setMainImage] = useState(carImages[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setSelectedImageIndex(index);
  };

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    const newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : carImages.length - 1;
    setMainImage(carImages[newIndex]);
    setSelectedImageIndex(newIndex);
    
    // Auto-scroll to thumbnail
    if (scrollContainerRef.current) {
        const thumbnail = scrollContainerRef.current.children[newIndex] as HTMLElement;
        if (thumbnail) {
            thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  };

  const scrollRight = () => {
    const newIndex = selectedImageIndex < carImages.length - 1 ? selectedImageIndex + 1 : 0;
    setMainImage(carImages[newIndex]);
    setSelectedImageIndex(newIndex);

    // Auto-scroll to thumbnail
    if (scrollContainerRef.current) {
        const thumbnail = scrollContainerRef.current.children[newIndex] as HTMLElement;
        if (thumbnail) {
            thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="hidden md:block">
        <TopNavigation />
      </div>
      
      {/* Mobile Back Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 line-clamp-1">{car.brand} {car.model}</h1>
      </div>

      <div className="container mx-auto px-0 md:px-4 py-0 md:py-8 mt-14 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Car Image Gallery */}
            <div className="bg-white md:rounded-2xl shadow-sm overflow-hidden relative">
              <div className="h-72 md:h-auto md:aspect-video relative">
                <img 
                  src={mainImage} 
                  alt={car.model}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-[#212c40] shadow-sm">
                  {car.pricingReference.category}
                </div>
              </div>

               {/* Thumbnails */}
               <div className="p-4 border-t border-gray-100 relative group">
                <button onClick={scrollLeft} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white transition-all active:scale-95">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {carImages.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleThumbnailClick(img, idx)}
                        className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 snap-start ${
                        selectedImageIndex === idx 
                            ? 'border-[#f48432] shadow-sm transform scale-105' 
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                    ))}
                </div>
                <button onClick={scrollRight} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1.5 rounded-full shadow-md hover:bg-white transition-all active:scale-95">
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white px-4 py-6 md:p-6 md:rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#212c40] mb-2">{car.brand} {car.model}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-blue-50 text-[#212c40] px-2 py-1 rounded text-xs font-medium">
                      {car.seatingCapacity} Seater
                    </span>
                    <span className="flex items-center gap-1">
                      <Disc className="w-4 h-4 text-[#f48432]" />
                      {car.fuelType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      {car.rating} ({car.totalTrips} Trips)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Per Day</p>
                  <p className="text-2xl font-bold text-[#212c40]">₹{car.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-[#f48432] font-semibold mb-1">AC</div>
                  <div className="text-xs text-gray-500">{car.isAc ? 'Available' : 'Non-AC'}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-[#f48432] font-semibold mb-1">Fuel</div>
                  <div className="text-xs text-gray-500">{car.fuelType}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-[#f48432] font-semibold mb-1">Seats</div>
                  <div className="text-xs text-gray-500">{car.seatingCapacity} Persons</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-[#f48432] font-semibold mb-1">Type</div>
                  <div className="text-xs text-gray-500">{car.pricingReference.category}</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Vehicle Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Experience a comfortable ride with our premium {car.brand} {car.model}. 
                  Perfect for family trips and outstation travel. Well-maintained interiors, 
                  ample legroom, and verified drivers ensure a safe journey.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Driver Profile & Booking */}
          <div className="space-y-6">
            
            {/* Driver Profile Card */}
            <div className="bg-white p-6 md:rounded-2xl shadow-sm border border-blue-100">
              <h3 className="font-bold text-[#212c40] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#f48432]" />
                Your Driver
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={driver.image} 
                    alt={driver.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{driver.name}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span>{driver.rating}</span>
                    <span className="text-gray-300">•</span>
                    <span>{driver.trips} Trips</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50/50 p-3 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Experience</div>
                  <div className="font-semibold text-[#212c40] text-sm">{driver.experience}</div>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-lg">
                  <div className="text-gray-500 text-xs mb-1">Joined</div>
                  <div className="font-semibold text-[#212c40] text-sm">{driver.joined}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Award className="w-4 h-4 text-[#f48432]" />
                  <span>Verified & Background Checked</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 text-[#f48432]" />
                  <span>Speaks {driver.languages.join(", ")}</span>
                </div>
              </div>


            </div>

            {/* Booking Summary Box */}
            <div className="bg-white p-6 md:rounded-2xl shadow-sm border border-gray-100 hidden md:block">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Price</span>
                <span className="text-2xl font-bold text-[#212c40]">₹{car.price}</span>
              </div>
              <button 
                onClick={handleBookNow}
                className="w-full bg-gradient-to-r from-[#f48432] to-[#ff9a56] hover:from-[#e67728] hover:to-[#f48432] text-white py-3 rounded-lg font-bold shadow-lg shadow-orange-100 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500">Total Price</div>
            <div className="text-xl font-bold text-[#212c40]">₹{car.price}</div>
          </div>
          <button 
            onClick={handleBookNow}
            className="flex-[2] bg-gradient-to-r from-[#f48432] to-[#ff9a56] text-white py-2.5 rounded-lg font-bold shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
