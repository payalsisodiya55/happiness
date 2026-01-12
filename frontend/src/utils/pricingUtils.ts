interface DistancePricing {
  '50km': number;
  '100km': number;
  '150km': number;
  '200km': number;
  '250km': number;
  '300km': number;
}

interface VehiclePricing {
  category: 'auto' | 'car' | 'bus';
  vehicleType: string;
  vehicleModel: string;
  tripType: 'one-way' | 'return';
  autoPrice?: number;
  distancePricing?: DistancePricing;
}

// Import VehiclePricingApiService for consistent pricing
import VehiclePricingApiService from '../services/vehiclePricingApi';

// Create vehicle pricing API service instance for utilities
const vehiclePricingApi = new VehiclePricingApiService(
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) ||
  (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  () => ({
    'Content-Type': 'application/json'
  })
);

/**
 * Calculate fare based on distance and vehicle pricing
 * @param distance - Distance in kilometers
 * @param pricing - Vehicle pricing data from admin
 * @param tripType - Type of trip (one-way or return)
 * @returns Calculated fare amount
 */
export const calculateFare = (distance: number, pricing: VehiclePricing, tripType: 'one-way' | 'return' = 'one-way'): number => {
  if (!pricing || distance <= 0) return 0;

  let totalFare = 0;

  // For auto vehicles, use fixed auto price
  if (pricing.category === 'auto') {
    const autoPricing = pricing.autoPrice || 0;
    totalFare = autoPricing;
  } else {
    // For car and bus vehicles, use simple calculation: distance × base_rate
    const distancePricing = pricing.distancePricing;
    if (distancePricing) {
      // Use 50km rate as base rate for all distances
      const baseRate = distancePricing['50km'] || 102;
      totalFare = distance * baseRate;
    }
  }

  // Return exact amount without rounding to avoid extra charges
  return totalFare;
};

/**
 * Get pricing rate for display purposes
 * @param distance - Distance in kilometers
 * @param pricing - Vehicle pricing data
 * @returns Rate per km and tier information
 */
export const getPricingRate = (distance: number, pricing: VehiclePricing) => {
  if (!pricing) return { rate: 0, tier: 'N/A' };

  if (pricing.category === 'auto') {
    return {
      rate: pricing.autoPrice || 0,
      tier: 'Fixed Rate'
    };
  }

  const distancePricing = pricing.distancePricing;
  if (!distancePricing) return { rate: 0, tier: 'N/A' };

  let rate = 0;
  let tier = '';

  if (distance <= 50 && distancePricing['50km']) {
    rate = distancePricing['50km'];
    tier = '50km';
  } else if (distance <= 100 && distancePricing['100km']) {
    rate = distancePricing['100km'];
    tier = '100km';
  } else if (distance <= 150 && distancePricing['150km']) {
    rate = distancePricing['150km'];
    tier = '150km';
  } else if (distance <= 200 && distancePricing['200km']) {
    rate = distancePricing['200km'];
    tier = '200km';
  } else if (distance <= 250 && distancePricing['250km']) {
    rate = distancePricing['250km'];
    tier = '250km';
  } else if (distancePricing['300km']) {
    rate = distancePricing['300km'];
    tier = '300km+';
  } else {
    // Fallback to highest available tier
    const tiers = ['300km', '250km', '200km', '150km', '100km', '50km'];
    for (const t of tiers) {
      if (distancePricing[t as keyof DistancePricing]) {
        rate = distancePricing[t as keyof DistancePricing];
        tier = t;
        break;
      }
    }
  }

  return { rate, tier };
};

/**
 * Get consistent vehicle price using VehiclePricing API (admin-set pricing)
 * This ensures all pages show the same pricing
 * @param vehicle - Vehicle object with pricingReference
 * @param pickupDate - Pickup date
 * @param returnDate - Optional return date
 * @param distance - Trip distance in km
 * @returns Promise<number> - Calculated price
 */
export const getConsistentVehiclePrice = async (
  vehicle: any,
  pickupDate: string,
  returnDate?: string,
  distance?: number
): Promise<number> => {
  const isRoundTrip = pickupDate && returnDate && pickupDate !== returnDate;
  const tripType = isRoundTrip ? 'return' : 'one-way';

  // Use actual distance if available, otherwise default to 100km
  const tripDistance = distance || 100;

  console.log(`🔄 [CONSISTENT] Calculating price for vehicle ${vehicle._id} (${vehicle.brand} ${vehicle.model})`);
  console.log(`📏 [CONSISTENT] Trip distance: ${tripDistance}km, Trip type: ${tripType}`);

  try {
    // Try to fetch pricing from VehiclePricing model using car.model
    console.log(`🔍 [CONSISTENT] Fetching VehiclePricing for model: ${vehicle.model}`);
    const vehiclePricing = await vehiclePricingApi.getPricingForVehicle(
      vehicle.pricingReference?.category || 'car',
      vehicle.pricingReference?.vehicleType || 'car',
      vehicle.model, // Use the actual car model to match vehiclepricings.vehicleModel
      tripType as 'one-way' | 'return'
    );

    if (vehiclePricing && vehiclePricing.distancePricing) {
      console.log(`✅ [CONSISTENT] Found VehiclePricing for model ${vehicle.model}:`, vehiclePricing);
      console.log(`🚗 [CONSISTENT] vehiclepricings.vehicleModel:`, vehiclePricing.vehicleModel);

      // Select the appropriate rate based on distance tiers
      let baseRate = 0;
      let matchedTier = '';

      if (tripDistance > 250 && vehiclePricing.distancePricing['300km']) {
        baseRate = vehiclePricing.distancePricing['300km'];
        matchedTier = '300km';
      } else if (tripDistance > 200 && vehiclePricing.distancePricing['250km']) {
        baseRate = vehiclePricing.distancePricing['250km'];
        matchedTier = '250km';
      } else if (tripDistance > 150 && vehiclePricing.distancePricing['200km']) {
        baseRate = vehiclePricing.distancePricing['200km'];
        matchedTier = '200km';
      } else if (tripDistance > 100 && vehiclePricing.distancePricing['150km']) {
        baseRate = vehiclePricing.distancePricing['150km'];
        matchedTier = '150km';
      } else if (tripDistance > 50 && vehiclePricing.distancePricing['100km']) {
        baseRate = vehiclePricing.distancePricing['100km'];
        matchedTier = '100km';
      } else {
        baseRate = vehiclePricing.distancePricing['50km'] || 102; // Default/Fallback
        matchedTier = '50km';
      }

      // Calculate final price: distance * rate + GST
      const baseFare = tripDistance * baseRate;
      const gstAmount = Math.round(baseFare * 0.05);
      const totalPrice = baseFare + gstAmount;

      console.log(`💰 [CONSISTENT] Tier calculation: Used ${matchedTier} rate = ₹${baseRate}/km`);
      console.log(`📊 [CONSISTENT] ${baseRate}/km × ${tripDistance}km = ₹${baseFare} (Base) + ₹${gstAmount} (GST) = ₹${totalPrice}`);

      return totalPrice > 0 ? totalPrice : 2500;
    }

    console.log(`❌ [CONSISTENT] No VehiclePricing found for model ${vehicle.model}, falling back to vehicle.pricing`);

    // Fallback to old logic if no VehiclePricing found
    if (!vehicle.pricing || vehicle.computedPricing?.pricingUnavailable) {
      return 0; // No pricing available - admin must set rates
    }

    // Use the fallback logic from old implementation
    let distancePricing: any = {};
    if (vehicle.pricing?.distancePricing) {
      if (tripType === 'return' && vehicle.pricing.distancePricing.return) {
        distancePricing = vehicle.pricing.distancePricing.return;
      } else if (vehicle.pricing.distancePricing.oneWay) {
        distancePricing = vehicle.pricing.distancePricing.oneWay;
      } else if (vehicle.pricing.distancePricing['one-way']) {
        distancePricing = vehicle.pricing.distancePricing['one-way'];
      }
    }

    const pricingData = {
      category: vehicle.pricingReference?.category || 'car',
      vehicleType: vehicle.pricingReference?.vehicleType || 'car',
      vehicleModel: vehicle.pricingReference?.vehicleModel || 'Unknown',
      tripType: tripType as 'one-way' | 'return',
      distancePricing: distancePricing
    };

    const calculatedPrice = calculateFare(tripDistance, pricingData, tripType);
    console.log(`💰 [CONSISTENT] Fallback calculation: ₹${calculatedPrice}`);

    // Ensure we return at least some price, never 0
    return calculatedPrice > 0 ? calculatedPrice : 2500;

  } catch (error) {
    console.error(`❌ [CONSISTENT] Error fetching VehiclePricing for ${vehicle.model}:`, error);

    // Fallback to old logic on error
    if (!vehicle.pricing || vehicle.computedPricing?.pricingUnavailable) {
      return 0; // No pricing available - admin must set rates
    }

    // Use the fallback logic from old implementation
    let distancePricing: any = {};
    if (vehicle.pricing?.distancePricing) {
      if (tripType === 'return' && vehicle.pricing.distancePricing.return) {
        distancePricing = vehicle.pricing.distancePricing.return;
      } else if (vehicle.pricing.distancePricing.oneWay) {
        distancePricing = vehicle.pricing.distancePricing.oneWay;
      } else if (vehicle.pricing.distancePricing['one-way']) {
        distancePricing = vehicle.pricing.distancePricing['one-way'];
      }
    }

    const pricingData = {
      category: vehicle.pricingReference?.category || 'car',
      vehicleType: vehicle.pricingReference?.vehicleType || 'car',
      vehicleModel: vehicle.pricingReference?.vehicleModel || 'Unknown',
      tripType: tripType as 'one-way' | 'return',
      distancePricing: distancePricing
    };

    const calculatedPrice = calculateFare(tripDistance, pricingData, tripType);
    return calculatedPrice > 0 ? calculatedPrice : 2500;
  }
};
