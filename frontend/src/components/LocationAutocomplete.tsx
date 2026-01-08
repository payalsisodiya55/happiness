import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { googleMapsService, LocationSuggestion } from '@/services/googleMapsService';
import { cn } from '@/lib/utils';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: LocationSuggestion) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  showGetLocation?: boolean;
  variant?: 'default' | 'minimal';
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder,
  icon = <Search className="w-4 h-4" />,
  className,
  disabled = false,
  showGetLocation = false,
  variant = 'default'
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isServiceReady, setIsServiceReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if Google Maps service is ready with retry mechanism
  useEffect(() => {
    // Service is backed by backend, so it's always "ready" in terms of initialization
    setIsServiceReady(true);
  }, []);

  // Debounced search function
  const searchLocations = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await googleMapsService.getLocationSuggestions(searchTerm);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('LocationAutocomplete: Error searching locations:', error);
      // Don't show error to user for empty results, just hide suggestions
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleLocationSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle location selection with enhanced details
  const handleLocationSelect = async (location: LocationSuggestion) => {
    try {
      // Get detailed place information including address components
      const placeDetails = await googleMapsService.getPlaceDetails(location.place_id);

      if (placeDetails && placeDetails.detailedAddress) {
        const { detailedAddress, formatted_address } = placeDetails;

        let displayAddress = formatted_address;

        // Use logic to prioritize village/sublocality if available
        if (detailedAddress.sublocality) {
          const parts = [];
          if (detailedAddress.sublocality) parts.push(detailedAddress.sublocality);
          if (detailedAddress.locality && detailedAddress.locality !== detailedAddress.sublocality) parts.push(detailedAddress.locality);
          if (detailedAddress.administrative_area_level_1) parts.push(detailedAddress.administrative_area_level_1);
          displayAddress = parts.join(', ');
        }

        // Update the location object with detailed information
        const enhancedLocation = {
          ...location,
          description: displayAddress,
          structured_formatting: {
            main_text: detailedAddress.sublocality || detailedAddress.locality || location.structured_formatting.main_text,
            secondary_text: displayAddress
          },
          detailedAddress: detailedAddress,
          // Add coordinates if available
          ...(placeDetails.geometry?.location && {
            lat: placeDetails.geometry.location.lat(),
            lng: placeDetails.geometry.location.lng()
          })
        };

        onChange(displayAddress);
        onLocationSelect(enhancedLocation);
      } else {
        // Fallback to original behavior if detailed info is not available
        onChange(location.description);
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      // Fallback to original behavior
      onChange(location.description);
      onLocationSelect(location);
    }

    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus input when suggestions are shown
  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSuggestions]);

  // Get current location function
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode the coordinates to get detailed address
      console.log('Starting reverse geocoding for current location...');
      const geocodeResult = await googleMapsService.getReverseGeocode(latitude, longitude);
      console.log('Reverse geocoding result:', geocodeResult);

      if (geocodeResult) {
        const { formattedAddress, detailedAddress } = geocodeResult;

        // Create a comprehensive address string that includes village information
        let displayAddress = formattedAddress;

        // If we have village/sublocality information, prioritize it in the display
        if (detailedAddress.sublocality) {
          const parts = [];
          if (detailedAddress.sublocality) parts.push(detailedAddress.sublocality);
          if (detailedAddress.locality && detailedAddress.locality !== detailedAddress.sublocality) parts.push(detailedAddress.locality);
          if (detailedAddress.administrative_area_level_1) parts.push(detailedAddress.administrative_area_level_1);
          displayAddress = parts.join(', ');
        }

        console.log('Final display address:', displayAddress);
        onChange(displayAddress);

        // Create a location object with coordinates and detailed information
        const currentLocation = {
          place_id: 'current_location',
          description: displayAddress,
          structured_formatting: {
            main_text: detailedAddress.sublocality || detailedAddress.locality || 'Current Location',
            secondary_text: displayAddress
          },
          // Add actual coordinates for distance calculation
          lat: latitude,
          lng: longitude,
          // Add detailed address information
          detailedAddress: detailedAddress
        };

        console.log('Current location object:', currentLocation);
        onLocationSelect(currentLocation);
      } else {
        console.error('Reverse geocoding returned null');
        setError('Unable to get address for current location. Please try again.');
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      if (error.code === 1) {
        setError('Location access denied. Please allow location access.');
      } else if (error.code === 2) {
        setError('Location unavailable. Please try again.');
      } else if (error.code === 3) {
        setError('Location request timed out. Please try again.');
      } else {
        setError('Failed to get current location. Please try again.');
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        {variant !== 'minimal' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center z-10 transition-all duration-300 group-hover:bg-blue-200 group-hover:scale-110">
            {icon}
          </div>
        )}
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "h-14 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base hover:border-blue-300 hover:shadow-md",
            variant === 'default' ? "pl-12" : "pl-3",
            showGetLocation ? "pr-20" : "pr-4",
            className
          )}
          disabled={disabled}
        />

        {/* GPS Button for getting current location */}
        {showGetLocation && (
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation || disabled}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-100 hover:bg-green-200 disabled:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed"
            title="Get current location"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4 text-green-600" />
            )}
          </button>
        )}

        {/* Loading spinner (only show when not getting location) */}
        {isLoading && !isGettingLocation && (
          <div className={cn(
            "absolute top-1/2 transform -translate-y-1/2",
            showGetLocation ? "right-24" : "right-4" // Position based on GPS button
          )}>
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto shadow-2xl border-0 bg-white rounded-xl scrollbar-hide"
        >
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50",
                  selectedIndex === index && "bg-blue-100 border-l-4 border-blue-500"
                )}
                onClick={() => handleLocationSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  {suggestion.structured_formatting.secondary_text && (
                    <div className="text-sm text-gray-500 truncate">
                      {suggestion.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No API Key Warning - Hidden as requested */}
      {false && !isServiceReady && !error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-yellow-600" />
            <span>
              Initializing Google Maps service... Please wait.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
