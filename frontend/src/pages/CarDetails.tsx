import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Award, Phone, MessageSquare, MapPin, Calendar, Clock, Disc, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useUserAuth } from '../contexts/UserAuthContext';
import TopNavigation from '../components/TopNavigation';
import { calculateFare, getConsistentVehiclePrice } from '../utils/pricingUtils';
import { googleMapsService } from '../services/googleMapsService';
import VehicleApiService from '../services/vehicleApi';

// Create vehicle API service instance
const vehicleApi = new VehicleApiService(
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  // getAuthHeaders function - vehicle search is public, no auth required
  () => ({
    'Content-Type': 'application/json'
  })
);

const CarDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useUserAuth();
  const { id } = useParams();
  const { car: initialCar, searchParams } = state;

  // State declarations - we have initial data, no loading needed
  const [car, setCar] = useState<any>(initialCar);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(initialCar?.price || 0);
  const [tripDistance, setTripDistance] = useState<number | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // FAQ Data
  const faqItems = [
    {
      question: "How much before departure, I have to book the cab?",
      answer: "Although you can book the cab up to 1–2 hours prior to departure time, we suggest booking 1 day in advance to avoid last-minute rush."
    },
    {
      question: "I want to book cab without paying any advance amount. I will pay on boarding the cab?",
      answer: "Sorry, it is not possible. You need to pay a small 15–20% amount in advance to book the cab on Happiness Car Rental."
    },
    {
      question: "Can we pickup additional passengers on the way in one way trip?",
      answer: "One way trip includes only one pickup and one drop. Additional pickup or drop will attract additional charges."
    },
    {
      question: "Is local sightseeing included in outstation trip?",
      answer: "Round trip bookings include all the local sightseeing in destination cities."
    },
    {
      question: "How to change pickup date, time and return date?",
      answer: "Please click on Departure / Return date on booking page."
    },
    {
      question: "Are Driver charges / Driver Bata included in the price?",
      answer: "Yes, all driver charges are included in the price."
    },
    {
      question: "Do I need to arrange for Driver food and accommodation during the trip?",
      answer: "Driver will take care of his food and accommodation."
    },
    {
      question: "What are extra charges if I need to travel in night hours?",
      answer: "For driving between 10:30 PM to 06:00 AM, an additional Rs. 300 allowance will apply."
    },
    {
      question: "Any extra charge other than the price shown above?",
      answer: "Parking charges, if any, are extra and need to be paid as per actuals. Toll and State tax may vary."
    },
    {
      question: "Can I book cab by calling customer support?",
      answer: "You can get help via customer support, but bookings must be done via website or mobile app."
    },
    {
      question: "I need a one way cab for multiple destinations, is that possible?",
      answer: "One way trip allows one pickup and one drop. Please book separate one way trips for multiple destinations."
    },
    {
      question: "Do I need to pay both side Toll tax for one way trip?",
      answer: "No. Only one side Toll tax applies for one way trip."
    },
    {
      question: "Whether the cab will have FASTag?",
      answer: "Yes, all our cabs come with FASTag."
    },
    {
      question: "Can I travel with pets?",
      answer: "Yes. Driver may charge Rs. 500 for small cars and Rs. 1000 for bigger cars."
    },
    {
      question: "Where to mention the complete pickup address?",
      answer: "You can mention your complete pickup address on the booking screen."
    },
    {
      question: "When will I get car and driver details after booking?",
      answer: "Usually shared within minutes, but sometimes up to 2 hours before departure."
    },
    {
      question: "Will advance amount be refunded if I cancel the booking?",
      answer: "It may or may not be refunded. Please check our Cancellation and Refund Policy."
    },
    {
      question: "How can I make the advance payment? Which payment gateway should I choose?",
      answer: "You can pay via Netbanking, Debit/Credit card, UPI, PhonePe, Google Pay, Paytm, etc. Select the respective payment gateway accordingly."
    }
  ];

  // Fallback or redirection if no initial car data
  useEffect(() => {
    if (!initialCar) {
      navigate('/vihicle-search');
    }
  }, [initialCar, navigate]);

  if (!initialCar) return null;

  // Fetch fresh vehicle data from API to ensure we have full details including driver info
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!id) return;

      // Debug: Check current pricing
      console.log('CarDetails: Current car pricing:', car.computedPricing);

      // Check if we need to fetch fresh data
      // Only fetch if driver info is missing (pricing should be preserved from initial data)
      const needsDriver = !car.driver || typeof car.driver === 'string' || !car.driver.firstName;

      console.log('CarDetails: needsDriver:', needsDriver, 'hasPricing:', !!car.computedPricing);

      if (needsDriver) {
        try {
          const response = await vehicleApi.getVehicleById(id);

          if (response.success && response.data) {
             setCar(response.data);
          }
        } catch (error) {
          console.error('Error fetching fresh vehicle data:', error);
        }
      }
    };

    // Delay the API call slightly to prioritize initial rendering
    const timeoutId = setTimeout(fetchVehicleData, 100);

    return () => clearTimeout(timeoutId);
  }, [id]);

  // Calculate price based on trip distance
  useEffect(() => {
    const calculatePrice = async () => {
      if (searchParams?.fromData && searchParams?.toData) {
        try {
          // Get distance from search params
          const distanceResult = await googleMapsService.getDistanceAndDuration(
            {
              latitude: searchParams.fromData.lat,
              longitude: searchParams.fromData.lng
            },
            {
              latitude: searchParams.toData.lat,
              longitude: searchParams.toData.lng
            }
          );

          if (distanceResult && distanceResult.distance) {
            setTripDistance(distanceResult.distance);

            // Calculate price using consistent VehiclePricing API
            // Round distance to 1 decimal place to match display
            const roundedDistance = Math.round(distanceResult.distance * 10) / 10;
            const price = await getConsistentVehiclePrice(
              car,
              searchParams.pickupDate,
              searchParams.returnDate,
              roundedDistance
            );
            setCalculatedPrice(price);
          } else {
            setCalculatedPrice(car.price || 0);
          }
        } catch (error) {
          console.error('Error calculating distance and price:', error);
          setCalculatedPrice(car.price || 0);
        }
      } else {
        setCalculatedPrice(car.price || 0);
      }
    };

    calculatePrice();
  }, [car, searchParams]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { returnUrl: '/booking-summary', car: { ...car, calculatedPrice, tripDistance }, searchParams } });
      return;
    }
    navigate('/booking-summary', { state: { car: { ...car, calculatedPrice, tripDistance }, searchParams } });
  };

  // Extract real driver data from vehicle (populated from backend)
  // Ensure we handle cases where driver might still be loading or incomplete
  const hasDriverData = car.driver && typeof car.driver === 'object';
  
  const driver = hasDriverData ? {
    name: `${car.driver.firstName || ''} ${car.driver.lastName || ''}`.trim() || 'Verified Driver',
    rating: car.driver.rating || 4.5,
    trips: car.driver.totalTrips || car.statistics?.totalTrips || 0,
    experience: car.driver.experience ? `${car.driver.experience} Years` : '2+ Years', 
    image: car.driver.profilePicture || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    languages: car.driver.languages && car.driver.languages.length > 0 ? car.driver.languages : ["Hindi", "English"],
    joined: car.driver.createdAt ? new Date(car.driver.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : new Date().getFullYear().toString()
  } : {
    // Fallback if no driver attached to vehicle
    name: "Verified Driver",
    rating: 4.5,
    trips: car.totalTrips || car.statistics?.totalTrips || 0,
    experience: "2+ Years",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    languages: ["Hindi", "English"],
    joined: "2024"
  };

  // Use real vehicle images from backend
  const carImages = car.images && car.images.length > 0 
    ? car.images.map((img: any) => img.url) 
    : [car.image];
    
  // Ensure we don't duplicate the main image if it's already in the list
  if (car.image && !carImages.includes(car.image)) {
    carImages.unshift(car.image);
  }

  const [mainImage, setMainImage] = useState(carImages[0]);

  // Update main image when car data changes
  useEffect(() => {
    if (carImages.length > 0) {
      setMainImage(carImages[0]);
    }
  }, [car]);
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
                  <p className="text-gray-500 text-sm">
                    {tripDistance ? `For ${tripDistance.toFixed(1)} km` : 'Total Price'}
                  </p>
                  <p className="text-2xl font-bold text-[#212c40]">₹{calculatedPrice.toLocaleString('en-IN')}</p>
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
                <h3 className="font-semibold text-gray-800 mb-3">Fare Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Fare:</span>
                      <span>₹{Math.round(calculatedPrice / 1.05).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (5% of Base Fare):</span>
                      <span>₹{Math.round((calculatedPrice / 1.05) * 0.05).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total (Base Fare + GST):</span>
                        <span>₹{calculatedPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      * Fuel charges are separate and not included in GST calculation
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-3">Pricing Details</h3>
                {/* Show computedPricing if available */}
                {car.computedPricing && car.computedPricing.distancePricing && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Distance-based Pricing</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {car.computedPricing.distancePricing['50km'] && (
                        <div className="flex justify-between">
                          <span>50 km:</span>
                          <span className="font-semibold text-green-600">₹{car.computedPricing.distancePricing['50km']}</span>
                        </div>
                      )}
                      {car.computedPricing.distancePricing['100km'] && (
                        <div className="flex justify-between">
                          <span>100 km:</span>
                          <span className="font-semibold text-green-600">₹{car.computedPricing.distancePricing['100km']}</span>
                        </div>
                      )}
                      {car.computedPricing.distancePricing['150km'] && (
                        <div className="flex justify-between">
                          <span>150 km:</span>
                          <span className="font-semibold text-green-600">₹{car.computedPricing.distancePricing['150km']}</span>
                        </div>
                      )}
                      {car.computedPricing.distancePricing['200km'] && (
                        <div className="flex justify-between">
                          <span>200 km:</span>
                          <span className="font-semibold text-green-600">₹{car.computedPricing.distancePricing['200km']}</span>
                        </div>
                      )}
                      {car.computedPricing.distancePricing['250km'] && (
                        <div className="flex justify-between">
                          <span>250 km:</span>
                          <span className="font-semibold text-green-600">₹{car.computedPricing.distancePricing['250km']}</span>
                        </div>
                      )}
                      {car.computedPricing.distancePricing['300km'] && (
                        <div className="flex justify-between">
                          <span>300 km:</span>
                          <span className="font-semibold text-green-600">₹{car.computedPricing.distancePricing['300km']}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">* Prices are per kilometer for one-way trips</p>
                  </div>
                )}

                {/* Fallback to old pricing structure for backward compatibility */}
                {(!car.computedPricing || !car.computedPricing.distancePricing) && car.pricing && car.pricing.distancePricing && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Distance-based Pricing (Legacy)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {car.pricing.distancePricing['one-way'] && (
                        <>
                          {car.pricing.distancePricing['one-way']['50km'] && (
                            <div className="flex justify-between">
                              <span>50 km:</span>
                              <span className="font-semibold text-green-600">₹{car.pricing.distancePricing['one-way']['50km']}</span>
                            </div>
                          )}
                          {car.pricing.distancePricing['one-way']['100km'] && (
                            <div className="flex justify-between">
                              <span>100 km:</span>
                              <span className="font-semibold text-green-600">₹{car.pricing.distancePricing['one-way']['100km']}</span>
                            </div>
                          )}
                          {car.pricing.distancePricing['one-way']['150km'] && (
                            <div className="flex justify-between">
                              <span>150 km:</span>
                              <span className="font-semibold text-green-600">₹{car.pricing.distancePricing['150km']}</span>
                            </div>
                          )}
                          {car.pricing.distancePricing['one-way']['200km'] && (
                            <div className="flex justify-between">
                              <span>200 km:</span>
                              <span className="font-semibold text-green-600">₹{car.pricing.distancePricing['one-way']['200km']}</span>
                            </div>
                          )}
                          {car.pricing.distancePricing['one-way']['250km'] && (
                            <div className="flex justify-between">
                              <span>250 km:</span>
                              <span className="font-semibold text-green-600">₹{car.pricing.distancePricing['one-way']['250km']}</span>
                            </div>
                          )}
                          {car.pricing.distancePricing['one-way']['300km'] && (
                            <div className="flex justify-between">
                              <span>300 km:</span>
                              <span className="font-semibold text-green-600">₹{car.pricing.distancePricing['one-way']['300km']}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">* Prices are per kilometer for one-way trips (Legacy pricing)</p>
                  </div>
                )}

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
                    <span>{driver.trips} Trips</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
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
                <span className="text-gray-600">
                  {tripDistance ? `Price for ${tripDistance.toFixed(1)} km` : 'Total Price'}
                </span>
                <span className="text-2xl font-bold text-[#212c40]">₹{calculatedPrice.toLocaleString('en-IN')}</span>
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

        {/* FAQ Section */}
        <div className="mt-8 md:mt-12 bg-white px-4 py-6 md:p-8 md:rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-[#212c40] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#f48432]/30 transition-colors">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className={`font-semibold text-sm md:text-base pr-4 ${expandedFAQ === index ? 'text-[#f48432]' : 'text-[#212c40]'}`}>
                    {item.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedFAQ === index ? 'rotate-180 text-[#f48432]' : ''}`}
                  />
                </button>
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    expandedFAQ === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/30">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500">
              {tripDistance ? `${tripDistance.toFixed(1)} km` : 'Total Price'}
            </div>
            <div className="text-xl font-bold text-[#212c40]">₹{calculatedPrice.toLocaleString('en-IN')}</div>
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
