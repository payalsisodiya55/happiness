import React, { useState, useEffect, useCallback } from 'react';
import { googleMapsService } from '../services/googleMapsService';
import { useIsMobile } from '../hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import UserBottomNavigation from '../components/UserBottomNavigation';
import FilterSidebar from '../components/FilterSidebar';
import { VehicleFilters } from '../components/FilterSidebar';
import { Car, Users, Fuel, Star, Heart, MapPin, Calendar } from 'lucide-react';

// Dummy car data
const DUMMY_CARS = [
  {
    _id: '1',
    brand: 'Toyota',
    model: 'Innova Crysta',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    isAc: true,
    rating: 4.8,
    totalTrips: 152,
    price: 2500,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
    pricingReference: {
      category: 'SUV',
      vehicleType: 'car',
      vehicleModel: 'Innova Crysta'
    }
  },
  {
    _id: '2',
    brand: 'Maruti',
    model: 'Ertiga',
    seatingCapacity: 7,
    fuelType: 'Petrol',
    isAc: true,
    rating: 4.5,
    totalTrips: 98,
    price: 1800,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
    pricingReference: {
      category: 'MUV',
      vehicleType: 'car',
      vehicleModel: 'Ertiga'
    }
  },
  {
    _id: '3',
    brand: 'Honda',
    model: 'City',
    seatingCapacity: 4,
    fuelType: 'Petrol',
    isAc: true,
    rating: 4.7,
    totalTrips: 215,
    price: 1500,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop',
    pricingReference: {
      category: 'Sedan',
      vehicleType: 'car',
      vehicleModel: 'City'
    }
  },
  {
    _id: '4',
    brand: 'Hyundai',
    model: 'Creta',
    seatingCapacity: 5,
    fuelType: 'Diesel',
    isAc: true,
    rating: 4.6,
    totalTrips: 178,
    price: 2200,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
    pricingReference: {
      category: 'SUV',
      vehicleType: 'car',
      vehicleModel: 'Creta'
    }
  },
  {
    _id: '5',
    brand: 'Maruti',
    model: 'Swift Dzire',
    seatingCapacity: 4,
    fuelType: 'Petrol',
    isAc: true,
    rating: 4.4,
    totalTrips: 134,
    price: 1200,
    image: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=600&h=400&fit=crop',
    pricingReference: {
      category: 'Sedan',
      vehicleType: 'car',
      vehicleModel: 'Swift Dzire'
    }
  },
  {
    _id: '6',
    brand: 'Mahindra',
    model: 'Scorpio',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    isAc: true,
    rating: 4.5,
    totalTrips: 89,
    price: 2800,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
    pricingReference: {
      category: 'SUV',
      vehicleType: 'car',
      vehicleModel: 'Scorpio'
    }
  }
];

const VihicleSearch = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(!isMobile);
  const selectedType = 'car';
  const [filters, setFilters] = useState<VehicleFilters>({
    priceRange: { min: 0, max: 10000 },
    seatingCapacity: [],
    isAc: [],
    isSleeper: [],
    fuelType: [],
    carBrand: [],
    carModel: [],
    busBrand: [],
    busModel: [],
    autoType: [],
    sortBy: ''
  });

  // State to store vehicle data for filters
  const [vehicleData, setVehicleData] = useState<any[]>(DUMMY_CARS);
  const [filteredCars, setFilteredCars] = useState<any[]>(DUMMY_CARS);

  // Get search parameters from hero section
  const searchParams = location.state || {};
  const { from, to, pickupDate, pickupTime, serviceType, returnDate, fromData, toData } = searchParams;

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  // State to store actual trip distance from Google Maps API
  const [tripDistance, setTripDistance] = useState<number | null>(null);

  // Fetch actual trip distance when location data is available
  useEffect(() => {
    const fetchDistance = async () => {
      if (fromData && toData && fromData.lat && fromData.lng && toData.lat && toData.lng) {
        try {
          const result = await googleMapsService.getDistanceAndDuration(
            { latitude: fromData.lat, longitude: fromData.lng },
            { latitude: toData.lat, longitude: toData.lng }
          );

          if (result && result.distance) {
            setTripDistance(result.distance);
          }
        } catch (error) {
          console.error('Error fetching distance:', error);
        }
      }
    };

    fetchDistance();
  }, [fromData, toData]);

  // Apply filters to cars
  useEffect(() => {
    let filtered = [...DUMMY_CARS];

    // Filter by seating capacity
    if (filters.seatingCapacity.length > 0) {
      filtered = filtered.filter(car => filters.seatingCapacity.includes(car.seatingCapacity));
    }

    // Filter by fuel type
    if (filters.fuelType.length > 0) {
      filtered = filtered.filter(car => filters.fuelType.includes(car.fuelType));
    }

    // Filter by brand
    if (filters.carBrand.length > 0) {
      filtered = filtered.filter(car => filters.carBrand.includes(car.brand));
    }

    // Filter by AC
    if (filters.isAc.length > 0) {
      filtered = filtered.filter(car => {
        const hasAC = car.isAc;
        return filters.isAc.includes(hasAC ? 'AC' : 'Non-AC');
      });
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating-high':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'seating-low':
          filtered.sort((a, b) => a.seatingCapacity - b.seatingCapacity);
          break;
        case 'seating-high':
          filtered.sort((a, b) => b.seatingCapacity - a.seatingCapacity);
          break;
      }
    }

    setFilteredCars(filtered);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="hidden md:block">
        <TopNavigation />
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#212c40] to-[#2d3a52] py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Available Cars
              </h1>
              {from && to && (
                <div className="flex items-center gap-2 text-gray-200">
                  <MapPin className="w-4 h-4 text-[#f48432]" />
                  <span className="text-sm">{from} → {to}</span>
                </div>
              )}
            </div>
            {pickupDate && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Calendar className="w-5 h-5 text-[#f48432]" />
                <span className="text-white text-sm">
                  {new Date(pickupDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-gray-600 text-sm">
          Showing <span className="font-semibold text-[#212c40]">{filteredCars.length}</span> cars
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 pb-24 md:pb-6">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Filter Sidebar for Mobile */}
            <div className="mb-2">
              <FilterSidebar
                isOpen={isFilterOpen}
                onToggle={toggleFilter}
                selectedType={selectedType}
                onFiltersChange={handleFiltersChange}
                filters={filters}
                vehicles={vehicleData}
              />
            </div>
            {/* Car Cards for Mobile */}
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <CarCard key={car._id} car={car} isMobile={isMobile} searchParams={searchParams} />
              ))}
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <FilterSidebar
                isOpen={isFilterOpen}
                onToggle={toggleFilter}
                selectedType={selectedType}
                onFiltersChange={handleFiltersChange}
                filters={filters}
                vehicles={vehicleData}
              />
            </div>
            {/* Car Cards Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCars.map((car) => (
                  <CarCard key={car._id} car={car} isMobile={isMobile} searchParams={searchParams} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <UserBottomNavigation />
    </div>
  );
};

// Car Card Component
const CarCard = ({ car, isMobile, searchParams }: { car: any; isMobile: boolean; searchParams: any }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/car-details/${car._id}`, { state: { car, searchParams } });
  };

  return (
    <div 
      onClick={handleDetailsClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={car.image} 
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-800 text-sm">{car.rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#212c40] mb-1 line-clamp-1">
            {car.brand} {car.model}
          </h3>
          <p className="text-xs text-gray-500">{car.pricingReference.category}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#f48432] flex-shrink-0" />
            <span className="text-xs text-gray-700">{car.seatingCapacity} Seater</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-[#f48432] flex-shrink-0" />
            <span className="text-xs text-gray-700">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#f48432] flex-shrink-0" />
            <span className="text-xs text-gray-700">{car.isAc ? 'AC' : 'Non-AC'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#f48432] flex-shrink-0" />
            <span className="text-xs text-gray-700">{car.totalTrips} Trips</span>
          </div>
        </div>

        {/* Footer - Price and Button */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
              <p className="text-xl font-bold text-[#212c40]">
                ₹{car.price.toLocaleString('en-IN')}
                <span className="text-xs text-gray-500 font-normal">/day</span>
              </p>
            </div>
          </div>
          <button 
            className="w-full bg-gradient-to-r from-[#212c40] to-[#2d3a52] hover:from-[#1a2333] hover:to-[#212c40] text-white px-4 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VihicleSearch;
