import React, { useState, useEffect, useCallback } from 'react';
import { googleMapsService } from '../services/googleMapsService';
import { useIsMobile } from '../hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import UserBottomNavigation from '../components/UserBottomNavigation';
import FilterSidebar from '../components/FilterSidebar';
import { VehicleFilters } from '../components/FilterSidebar';
import { Car, Users, Fuel, Star, Heart, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import VehicleApiService from '../services/vehicleApi';
import VehiclePricingApiService from '../services/vehiclePricingApi';
import { calculateFare, getConsistentVehiclePrice } from '../utils/pricingUtils';

// Create vehicle API service instance
const vehicleApi = new VehicleApiService(
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  // getAuthHeaders function - vehicle search is public, no auth required
  () => ({
    'Content-Type': 'application/json'
  })
);

// Create vehicle pricing API service instance
const vehiclePricingApi = new VehiclePricingApiService(
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  // getAuthHeaders function - vehicle search is public, no auth required
  () => ({
    'Content-Type': 'application/json'
  })
);

const VihicleSearch = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
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

  // Get search parameters from hero section
  const searchParams = location.state || {};
  const { from, to, pickupDate, pickupTime, serviceType, returnDate, fromData, toData } = searchParams;

  // State for API data
  const [vehicleData, setVehicleData] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to store actual trip distance from Google Maps API
  const [tripDistance, setTripDistance] = useState<number | null>(null);

  // Function to load vehicles from API
  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams: any = {
        vehicleType: 'car',
        passengers: 1,
        page: 1,
        limit: 50
      };

      // Add date if available
      if (pickupDate) {
        searchParams.date = pickupDate;
        if (returnDate) {
          searchParams.returnDate = returnDate;
        }
      }

      // Add location data if available
      if (from && to) {
        searchParams.pickup = from;
        searchParams.destination = to;
      }

      console.log('Searching vehicles with params:', searchParams);

      const response = await vehicleApi.searchVehicles(searchParams);

      if (response.success && response.data) {
        // Transform API response to match UI expectations
        const vehiclesArray = (response.data as any).docs || (response.data as any);
        // Process vehicles asynchronously to calculate prices
        const transformedVehicles = Array.isArray(vehiclesArray) ? await Promise.all(vehiclesArray.map(async (vehicle: any) => {
          // Round distance to 1 decimal place to match display
          const roundedDistance = tripDistance ? Math.round(tripDistance * 10) / 10 : undefined;
          const price = await getVehiclePrice(vehicle, pickupDate, returnDate, roundedDistance);
          console.log('🚗 Vehicle fuel type:', vehicle.brand, vehicle.model, 'fuel:', vehicle.fuelType);
          return {
            _id: vehicle._id,
            brand: vehicle.brand || 'Unknown',
            model: vehicle.pricingReference?.vehicleModel || vehicle.model || 'Unknown',
            seatingCapacity: vehicle.seatingCapacity || 4,
            fuelType: vehicle.fuelType || 'petrol',
            isAc: vehicle.isAc || false,
            rating: vehicle.driver?.rating || vehicle.rating?.average || 4.0,
            totalTrips: vehicle.statistics?.totalTrips || vehicle.totalTrips || 0,
            // Get price from pricing data using actual trip distance
            price: price,
            image: vehicle.images?.length > 0 ? vehicle.images.find((img: any) => img.isPrimary)?.url || vehicle.images[0].url : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
            pricingReference: vehicle.pricingReference || {
              category: 'car',
              vehicleType: 'car',
              vehicleModel: vehicle.model || 'Unknown'
            },
            // Keep original API data for additional functionality
            driver: vehicle.driver,
            pricing: vehicle.pricing,
            isAvailable: vehicle.isAvailable
          };
        })) : [];

        console.log('Loaded vehicles:', transformedVehicles.length);
        setVehicleData(transformedVehicles);
        setFilteredCars(transformedVehicles);
      } else {
        console.error('Failed to load vehicles:', response);
        setError('Failed to load vehicles. Please try again.');
        setVehicleData([]);
        setFilteredCars([]);
      }
    } catch (error: any) {
      console.error('Error loading vehicles:', error);
      setError(error.message || 'Failed to load vehicles');
      setVehicleData([]);
      setFilteredCars([]);
    } finally {
      setIsLoading(false);
    }
  }, [pickupDate, returnDate, from, to, tripDistance]);

  // Helper function to get vehicle price - now uses consistent pricing utility
  const getVehiclePrice = async (vehicle: any, pickupDate: string, returnDate?: string, distance?: number): Promise<number> => {
    return await getConsistentVehiclePrice(vehicle, pickupDate, returnDate, distance);
  };

  // Update vehicle prices when trip distance changes
  useEffect(() => {
    if (vehicleData.length > 0 && tripDistance !== null) {
      console.log('🔄 Updating vehicle prices with new distance:', tripDistance);
      const updatePrices = async () => {
        const updatedVehicles = await Promise.all(vehicleData.map(async (vehicle) => {
          // Round distance to 1 decimal place to match display
          const roundedDistance = Math.round(tripDistance * 10) / 10;
          const newPrice = await getVehiclePrice(vehicle, pickupDate, returnDate, roundedDistance);
          console.log('💰 Updated price for vehicle', vehicle._id, ':', newPrice);
          return {
            ...vehicle,
            price: newPrice
          };
        }));
        console.log('✅ Updated all vehicle prices, setting vehicleData...');
        setVehicleData(updatedVehicles);
      };
      updatePrices();
    }
  }, [tripDistance, pickupDate, returnDate]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFiltersChange = (newFilters: VehicleFilters) => {
    setFilters(newFilters);
  };

  // Load vehicles when component mounts or search params change
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

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

  // Apply filters to vehicles
  useEffect(() => {
    let filtered = [...vehicleData];

    console.log('🔍 Applying filters:', filters);
    console.log('📊 Original vehicles count:', vehicleData.length);
    console.log('🚗 Sample vehicle fuel types:', vehicleData.slice(0, 3).map(v => ({ brand: v.brand, fuel: v.fuelType })));

    // Filter by seating capacity
    if (filters.seatingCapacity.length > 0) {
      console.log('🎯 Filtering by seating capacity:', filters.seatingCapacity);
      const beforeCount = filtered.length;
      filtered = filtered.filter(vehicle => {
        // Handle both string and number comparisons
        const vehicleCapacity = vehicle.seatingCapacity;
        const matches = filters.seatingCapacity.some(capacity => {
          const filterCapacity = typeof capacity === 'string' ? parseInt(capacity) : capacity;
          return vehicleCapacity === filterCapacity;
        });
        if (matches) {
          console.log('✅ Vehicle matches:', vehicle.brand, vehicle.model, 'capacity:', vehicleCapacity);
        }
        return matches;
      });
      console.log('📈 Seating capacity filter: before', beforeCount, 'after', filtered.length);
    }

    // Filter by fuel type
    if (filters.fuelType.length > 0) {
      console.log('🔍 Filtering by fuel type:', filters.fuelType);
      const beforeCount = filtered.length;
      filtered = filtered.filter(vehicle => {
        const vehicleFuel = (vehicle.fuelType || '').toLowerCase();
        const matches = filters.fuelType.some(filterFuel =>
          filterFuel.toLowerCase() === vehicleFuel
        );
        if (matches) {
          console.log('✅ Fuel match:', vehicle.brand, vehicle.model, 'fuel:', vehicle.fuelType);
        }
        return matches;
      });
      console.log('⛽ Fuel type filter: before', beforeCount, 'after', filtered.length);
    }

    // Filter by brand
    if (filters.carBrand.length > 0) {
      filtered = filtered.filter(vehicle => filters.carBrand.includes(vehicle.brand));
    }

    // Filter by AC
    if (filters.isAc.length > 0) {
      filtered = filtered.filter(vehicle => {
        const hasAC = vehicle.isAc;
        return filters.isAc.includes(hasAC ? 'AC' : 'Non-AC');
      });
    }

    // Filter by price range
    if (filters.priceRange.min > 0 || filters.priceRange.max < 10000) {
      filtered = filtered.filter(vehicle =>
        vehicle.price >= filters.priceRange.min && vehicle.price <= filters.priceRange.max
      );
    }

    // Filter by sleeper option (only buses have sleeper)
    if (filters.isSleeper.length > 0) {
      filtered = filtered.filter(vehicle => {
        const isSleeper = vehicle.pricingReference?.category === 'bus';
        return filters.isSleeper.includes(isSleeper ? 'Sleeper' : 'Non-Sleeper');
      });
    }

    // Filter by car model
    if (filters.carModel.length > 0) {
      filtered = filtered.filter(vehicle =>
        vehicle.pricingReference?.category === 'car' &&
        filters.carModel.includes(vehicle.model)
      );
    }

    // Filter by bus brand
    if (filters.busBrand.length > 0) {
      filtered = filtered.filter(vehicle =>
        vehicle.pricingReference?.category === 'bus' &&
        filters.busBrand.includes(vehicle.brand)
      );
    }

    // Filter by bus model
    if (filters.busModel.length > 0) {
      filtered = filtered.filter(vehicle =>
        vehicle.pricingReference?.category === 'bus' &&
        filters.busModel.includes(vehicle.model)
      );
    }

    // Filter by auto type
    if (filters.autoType.length > 0) {
      filtered = filtered.filter(vehicle =>
        vehicle.pricingReference?.category === 'auto' &&
        filters.autoType.includes(vehicle.pricingReference?.vehicleType || 'auto')
      );
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
  }, [filters, vehicleData]);

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
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-white"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Available Cars
                </h1>
              </div>
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
        {isLoading ? (
          <p className="text-gray-600 text-sm">Loading vehicles...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={loadVehicles}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold text-[#212c40]">{filteredCars.length}</span> vehicles
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 pb-24 md:pb-6">
        {isLoading ? (
          /* Loading State */
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f48432] mx-auto mb-4"></div>
              <p className="text-gray-600">Finding available vehicles...</p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Car className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadVehicles}
                className="bg-[#f48432] text-white px-6 py-2 rounded-lg hover:bg-[#e67e22] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          /* Vehicle Display */
          <>
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
                {/* Vehicle Cards for Mobile */}
                <div className="space-y-4">
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No vehicles available matching your criteria</p>
                    </div>
                  ) : (
                    filteredCars.map((car) => (
                      <CarCard key={car._id} car={car} isMobile={isMobile} searchParams={searchParams} tripDistance={tripDistance} />
                    ))
                  )}
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
                {/* Vehicle Cards Grid */}
                <div className="lg:col-span-3">
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-12">
                      <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No vehicles available matching your criteria</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredCars.map((car) => (
                        <CarCard key={car._id} car={car} isMobile={isMobile} searchParams={searchParams} tripDistance={tripDistance} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <UserBottomNavigation />
    </div>
  );
};

// Car Card Component
const CarCard = ({ car, isMobile, searchParams, tripDistance }: { car: any; isMobile: boolean; searchParams: any; tripDistance: number | null }) => {
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
            <span className="text-xs text-gray-700 capitalize">{car.fuelType}</span>
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
              <p className="text-xs text-gray-500 mb-0.5">Total Trip Price</p>
              <div className="text-sm font-medium text-[#212c40] leading-tight">
                {car.price === 0 || car.computedPricing?.pricingUnavailable ? (
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-medium">Pricing Not Set</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Admin must set rates for {car.pricingReference?.vehicleModel || car.model}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xl font-bold text-[#212c40]">
                      ₹{car.price?.toLocaleString('en-IN') || '0'}
                    </p>
                    {car.pricing?.distancePricing?.['one-way'] && (
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {Math.round(tripDistance || 100)}km distance
                      </p>
                    )}
                  </>
                )}
              </div>
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
