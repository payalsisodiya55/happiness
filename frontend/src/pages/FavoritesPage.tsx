import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Car as CarIcon, MapPin, Navigation, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VehicleApiService from '@/services/vehicleApi';
import favoritesApi from '@/services/favoritesApi';
import { getConsistentVehiclePrice } from '@/utils/pricingUtils';
import { useToast } from '@/components/ui/use-toast';

// Create vehicle API service instance
const vehicleApi = new VehicleApiService(
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  () => ({
    'Content-Type': 'application/json'
  })
);

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favoriteCars, setFavoriteCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user favorites from database
  useEffect(() => {
    const fetchUserFavorites = async () => {
      setIsLoading(true);
      try {
        const favorites = await favoritesApi.getUserFavorites();

        if (favorites && favorites.length > 0) {
          // Get pricing for each favorite vehicle
          const carsWithPricing = await Promise.all(favorites.map(async (car: any) => {
            try {
              const price = await getConsistentVehiclePrice(car, new Date().toISOString());
              return { ...car, displayPrice: price };
            } catch (error) {
              console.error('Error getting price for car:', car._id, error);
              return { ...car, displayPrice: car.pricingReference?.basePrice || 0 };
            }
          }));

          setFavoriteCars(carsWithPricing);
        } else {
          setFavoriteCars([]);
        }
      } catch (error) {
        console.error('Failed to fetch favorite cars:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load favorite cars.",
        });
        setFavoriteCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFavorites();
  }, []);

  const removeFavorite = async (carId: string) => {
    try {
      // Optimistically remove from view first
      setFavoriteCars(prev => prev.filter(c => c._id !== carId));

      // Then remove from database
      await favoritesApi.removeFromFavorites(carId);

      // If successful, the toast is already shown in the API service
    } catch (error) {
      // If API call fails, add the car back to the list
      console.error('Failed to remove from favorites:', error);
      setFavoriteCars(prev => {
        // Re-fetch favorites to ensure consistency
        const fetchUpdatedFavorites = async () => {
          try {
            const favorites = await favoritesApi.getUserFavorites();
            const carsWithPricing = await Promise.all(favorites.map(async (car: any) => {
              const price = await getConsistentVehiclePrice(car, new Date().toISOString());
              return { ...car, displayPrice: price };
            }));
            return carsWithPricing;
          } catch (err) {
            console.error('Failed to re-fetch favorites:', err);
            return prev;
          }
        };
        fetchUpdatedFavorites();
        return prev;
      });
    }
  };

  const getCarImage = (car: any) => {
      if (car.images && car.images.length > 0) {
          const primary = car.images.find((img: any) => img.isPrimary);
          return primary ? primary.url : car.images[0].url;
      }
      return car.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-[#212c40] px-4 py-4 pt-8 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-[#f48432] hover:bg-white/10"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold text-white tracking-wide">My Favorites</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6 max-w-4xl">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#f48432] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : favoriteCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteCars.map((car) => (
              <div 
                key={car._id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative group cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate(`/car-details/${car._id}`, { state: { car } })}
              >
                 <button
                    className="absolute top-3 right-3 z-10 p-2 bg-red-50 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(car._id);
                    }}
                 >
                    <Heart className="w-5 h-5 fill-current" />
                 </button>

                 <div className="h-40 w-full flex items-center justify-center mb-4 bg-gray-50 rounded-xl overflow-hidden">
                    <img src={getCarImage(car)} alt={car.model} className="w-full h-full object-contain mix-blend-multiply" />
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-[#212c40] text-lg">{car.brand} {car.model}</h3>
                            <p className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-1">
                                {car.pricingReference?.category || 'Standard'}
                            </p>
                        </div>
                         <div className="text-right">
                             <span className="block text-lg font-bold text-[#212c40]">₹{car.displayPrice}<span className="text-xs font-normal text-gray-500">/km</span></span>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                         <div className="flex items-center gap-1.5">
                             <CarIcon className="w-3.5 h-3.5 text-[#f48432]" />
                             <span>{car.year || '2024'} Model</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                             <Navigation className="w-3.5 h-3.5 text-[#f48432]" />
                             <span>Automatic</span>
                         </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
            <p className="text-gray-500 max-w-xs mx-auto mb-8">
              Start adding cars to your favorites to see them here.
            </p>
            <Button 
                className="bg-[#f48432] hover:bg-[#d66e22] text-white px-8 rounded-full"
                onClick={() => navigate('/')}
            >
                Explore Cars
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
