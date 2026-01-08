import React from 'react';
import { Search, MapPin, Navigation, ScanLine, ArrowLeft, Bell, Car, Calendar, ArrowUpDown, Clock, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LocationAutocomplete from './LocationAutocomplete';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';


// Import assets
import carHero from '@/assets/CarHeroBanner.png';
import car1 from '@/assets/Car1.webp';
import car2 from '@/assets/Car2.png';
import car3 from '@/assets/Car3.png';
import car4 from '@/assets/Car4.webp';
import happinessLogo from '@/assets/Happiness-logo-removebg-preview.png';

const MobileHome = () => {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip' | 'local'>('oneWay');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [time, setTime] = useState('');
  const [localPackage, setLocalPackage] = useState('4hrs40km');
  const [fromData, setFromData] = useState<any>(null);
  const [toData, setToData] = useState<any>(null);

  const handleSearch = () => {
    navigate('/vihicle-search', {
      state: {
        serviceType: tripType, // 'oneWay' | 'roundTrip' | 'local'
        from: fromLocation,
        to: toLocation,
        pickupDate: date ? new Date(date).toISOString() : undefined,
        returnDate: returnDate ? new Date(returnDate).toISOString() : undefined,
        pickupTime: time,
        package: (tripType === 'local') ? localPackage : undefined,
        fromData,
        toData
      }
    });
  };

  // Mock nearby drivers
  const nearbyDrivers = [
    { id: 1, lat: 22.7196, lng: 75.8577, name: "Driver 1" }, // Indore center approx
    { id: 2, lat: 22.7220, lng: 75.8600, name: "Driver 2" },
    { id: 3, lat: 22.7150, lng: 75.8550, name: "Driver 3" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* 1. Curved Premium Header */}
      <div className="sticky top-0 z-20">
          <div className="bg-[#212c40] px-6 pt-10 pb-44 rounded-b-[3rem] shadow-xl relative z-10">
            {/* Top Row: Brand & Profile */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <img src={happinessLogo} alt="Logo" className="w-14 h-14 object-contain bg-white rounded-xl p-1 shadow-md" />
                    <div>
                        <h1 className="text-white text-xl font-bold tracking-wide leading-none mb-1">Happiness</h1>
                        <p className="text-[#f48432] text-xs font-medium tracking-wider uppercase">Comfort In Every Mile</p>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all">
                    <Bell className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Floating Search Widget - Image 3 Style */}
          <div className="px-6 -mt-40 relative z-20">
             <div className="bg-white rounded-3xl shadow-xl p-4 border border-gray-100/50 backdrop-blur-sm">
                
                {/* Trip Type Tabs */}
                <div className="flex bg-gray-50 p-1 rounded-xl mb-3 space-x-1">
                  <button 
                    onClick={() => setTripType('oneWay')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${tripType === 'oneWay' ? 'bg-[#212c40] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    One Way
                  </button>
                   <button 
                    onClick={() => setTripType('roundTrip')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${tripType === 'roundTrip' ? 'bg-[#212c40] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Round Trip
                  </button>
                   <button 
                    onClick={() => setTripType('local')}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${tripType === 'local' ? 'bg-[#212c40] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Local
                  </button>
                </div>

                {/* From Location */}
                <div className="mb-2 relative group">
                   <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#f48432]/20 focus-within:border-[#f48432] transition-all">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                         <Navigation className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                      </div>
                      <div className="flex-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">From</label>
                          <LocationAutocomplete
                            value={fromLocation}
                            onChange={setFromLocation}
                            onLocationSelect={setFromData}
                            placeholder="Current Location"
                            variant="minimal"
                            className="w-full bg-transparent border-none p-0 h-auto text-sm font-semibold text-[#212c40] placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none hover:bg-transparent hover:border-none hover:shadow-none"
                            icon={null}
                          />
                      </div>
                   </div>
                </div>

                {/* To Location (Hide for Local Trip if needed, but usually kept or replaced) 
                    For Local Trip, we might replace 'To' with 'Package' or just hide it. 
                    Based on HeroSection, Local Trip uses Package instead of To.
                */}
                {tripType !== 'local' && (
                  <>


                    <div className="mb-2">
                       <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#f48432]/20 focus-within:border-[#f48432] transition-all">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                             <MapPin className="w-4 h-4 text-[#f48432] fill-[#f48432]/20" />
                          </div>
                          <div className="flex-1">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">To</label>
                              <LocationAutocomplete
                                value={toLocation}
                                onChange={setToLocation}
                                onLocationSelect={setToData}
                                placeholder="Destination"
                                variant="minimal"
                                className="w-full bg-transparent border-none p-0 h-auto text-sm font-semibold text-[#212c40] placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none hover:bg-transparent hover:border-none hover:shadow-none"
                                icon={null}
                              />
                          </div>
                       </div>
                    </div>
                  </>
                )}



                {/* Date Selection */}
                <div className="mb-3 grid grid-cols-2 gap-2">
                   <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#f48432]/20 focus-within:border-[#f48432] transition-all">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                         <Calendar className="w-3 h-3 text-indigo-500" />
                      </div>
                      <div className="flex-1 relative min-w-0">
                          <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Pickup Date</label>
                          <input 
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent border-none p-0 h-auto text-xs font-semibold text-[#212c40] focus:ring-0 outline-none"
                          />
                      </div>
                   </div>
                   
                   {/* Return Date (Round Trip) OR Pickup Time (Others) */}
                   {tripType === 'roundTrip' ? (
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#f48432]/20 focus-within:border-[#f48432] transition-all">
                        <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                           <Calendar className="w-3 h-3 text-purple-500" />
                        </div>
                        <div className="flex-1 relative min-w-0">
                            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Return</label>
                            <input 
                              type="date"
                              value={returnDate}
                              onChange={(e) => setReturnDate(e.target.value)}
                              className="w-full bg-transparent border-none p-0 h-auto text-xs font-semibold text-[#212c40] focus:ring-0 outline-none"
                            />
                        </div>
                     </div>
                   ) : (
                      <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#f48432]/20 focus-within:border-[#f48432] transition-all">
                        <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                           <Clock className="w-3 h-3 text-pink-500" />
                        </div>
                        <div className="flex-1 relative min-w-0">
                            <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider block">Time</label>
                            <input 
                              type="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full bg-transparent border-none p-0 h-auto text-xs font-semibold text-[#212c40] focus:ring-0 outline-none"
                            />
                        </div>
                     </div>
                   )}
                </div>

                {/* Extra Row for Time if Round Trip */}
                {tripType === 'roundTrip' && (
                    <div className="mb-5">
                       <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#f48432]/20 focus-within:border-[#f48432] transition-all">
                          <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                             <Clock className="w-4 h-4 text-pink-500" />
                          </div>
                          <div className="flex-1 relative">
                              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pickup Time</label>
                              <input 
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-transparent border-none p-0 h-auto text-sm font-semibold text-[#212c40] focus:ring-0 outline-none"
                              />
                          </div>
                       </div>
                    </div>
                )}

                {/* Search Button */}
                <Button 
                   onClick={handleSearch}
                   className="w-full bg-[#212c40] hover:bg-[#1a2333] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
                >
                   Search
                </Button>

             </div>
          </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 2. Hero Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#212c40] text-white shadow-lg h-48">
            <div className="absolute top-0 right-0 w-40 h-full bg-[#f48432] rounded-l-full opacity-20 transform translate-x-10" />
            <div className="absolute top-0 right-0 w-32 h-full bg-[#f48432] rounded-l-full opacity-20 transform translate-x-20" />
            
            <div className="relative z-10 p-6 flex flex-col justify-center h-full max-w-[60%]">
                <h2 className="text-xl font-bold mb-1">Get Ready?</h2>
                <p className="text-gray-300 text-sm mb-4">Then Let's go now.</p>
                <Button 
                    className="bg-[#f48432] hover:bg-[#d66e22] text-white rounded-full px-6 w-fit text-xs h-9"
                    onClick={() => navigate('/vihicle-search')}
                >
                    Book Now
                </Button>
            </div>
            
            <img 
                src={carHero} 
                alt="Car" 
                className="absolute right-[-20px] bottom-[-10px] w-48 object-contain drop-shadow-xl"
            />
        </div>

        {/* 3. Top Cars */}
        <div>
            <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-[#212c40] text-lg">Top Cars</h3>
                <span className="text-xs text-[#f48432] font-semibold cursor-pointer" onClick={() => navigate('/vihicle-search')}>View All</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {[
                    { title: 'Mini', img: car1, price: '₹10/km' },
                    { title: 'Dizer', img: car3, price: '₹12/km' },
                    { title: 'Ertiga', img: car2, price: '₹15/km' },
                    { title: 'Innova', img: car4, price: '₹18/km' }
                ].map((item, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-32 flex flex-col items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
                        onClick={() => navigate('/vihicle-search')}
                    >
                        <div className="h-16 w-full flex items-center justify-center mb-2">
                            <img src={item.img} alt={item.title} className="max-h-full max-w-full object-contain drop-shadow-sm" />
                        </div>
                        <span className="text-sm font-bold text-[#212c40]">{item.title}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{item.price}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. Near By Drivers (Mobile Map View) */}
        {/* 4. Car Recommendations (Replacements for Map View) */}
        <div className="space-y-6">
            
            {/* Section 1: The most searched cars */}
            <div>
                <div className="flex justify-between items-center mb-3 px-1">
                    <h3 className="font-bold text-[#212c40] text-lg">The most searched cars</h3>
                    <span className="text-xs text-[#f48432] font-semibold cursor-pointer" onClick={() => navigate('/vihicle-search')}>View all</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { 
                            _id: '1',
                            brand: 'Hyundai',
                            model: 'i20',
                            price: 2500, // Number for calculation/display consistency
                            displayPrice: '₹7.03 - 11.54 Lakh*', // For the card display
                            subtitle: 'Avg. Ex-Showroom price',
                            image: car1, 
                            rating: 4.8,
                            seatingCapacity: 5,
                            fuelType: 'Petrol',
                            isAc: true,
                            totalTrips: 152,
                            pricingReference: { category: 'Hatchback' }
                        },
                        { 
                             _id: '2',
                            brand: 'Toyota',
                            model: 'Fortuner',
                            price: 5500,
                            displayPrice: '₹31.79 - 48.43 Lakh*',
                            subtitle: 'Avg. Ex-Showroom price',
                            image: car4,
                            rating: 4.9,
                            seatingCapacity: 7,
                            fuelType: 'Diesel',
                            isAc: true,
                            totalTrips: 210,
                            pricingReference: { category: 'SUV' }
                        }
                    ].map((car, index) => (
                        <div 
                            key={index}
                            className="bg-gray-100 rounded-3xl p-3 relative"
                            onClick={() => navigate(`/car-details/${car._id}`, { state: { car } })}
                        >
                            <div className="absolute top-3 right-3 z-10">
                                <Heart className={`w-5 h-5 ${index === 0 ? 'fill-[#f48432] text-[#f48432]' : 'text-black'}`} />
                            </div>
                            <div className="h-24 w-full flex items-center justify-center mb-2 mt-4">
                                <img src={car.image} alt={car.model} className="max-h-full max-w-full object-contain drop-shadow-md" />
                            </div>
                            <div className="mt-2 text-center md:text-left">
                                <h4 className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{car.brand} {car.model}</h4>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{car.displayPrice}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{car.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2: Recommended Cars For You */}
            <div>
                <div className="flex justify-between items-center mb-3 px-1">
                    <h3 className="font-bold text-[#212c40] text-lg">Recommended Cars For You</h3>
                    <span className="text-xs text-[#f48432] font-semibold cursor-pointer" onClick={() => navigate('/vihicle-search')}>View all</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { 
                             _id: '3',
                            brand: 'Hyundai',
                            model: 'Creta',
                            price: 2200,
                            displayPrice: '₹2200/day',
                            subtitle: 'Avg. Rental price',
                            image: car3,
                            rating: 4.6,
                            seatingCapacity: 5,
                            fuelType: 'Diesel',
                            isAc: true,
                            totalTrips: 180,
                            pricingReference: { category: 'SUV' }
                        },
                        { 
                             _id: '4',
                            brand: 'Tata',
                            model: 'Punch',
                            price: 1800,
                            displayPrice: '₹1800/day',
                            subtitle: 'Avg. Rental price',
                             image: car1, 
                             rating: 4.5,
                             seatingCapacity: 5,
                             fuelType: 'Petrol',
                             isAc: true,
                             totalTrips: 95,
                             pricingReference: { category: 'Compact SUV' }
                        }
                    ].map((car, index) => (
                        <div 
                            key={index}
                            className="bg-gray-100 rounded-3xl p-3 relative"
                            onClick={() => navigate(`/car-details/${car._id}`, { state: { car } })}
                        >
                             <div className="absolute top-3 right-3 z-10">
                                <Heart className={`w-5 h-5 ${index === 0 ? 'fill-[#f48432] text-[#f48432]' : 'text-black'}`} />
                            </div>
                            <div className="h-24 w-full flex items-center justify-center mb-2 mt-4">
                                <img src={car.image} alt={car.model} className="max-h-full max-w-full object-contain drop-shadow-md" />
                            </div>
                            <div className="mt-2 text-center md:text-left">
                                <h4 className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis">{car.brand} {car.model}</h4>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{car.displayPrice}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{car.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default MobileHome;
