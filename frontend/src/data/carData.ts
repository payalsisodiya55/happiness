// Comprehensive car data for admin pricing management
export interface CarData {
  [brand: string]: {
    [model: string]: {
      types: string[]; // e.g., ['Sedan', 'Hatchback', 'SUV']
      fuelTypes: string[]; // e.g., ['Petrol', 'Diesel', 'CNG', 'Electric']
    };
  };
}

// Complete car data with brands, models, and their types
export const CAR_DATA: CarData = {
  // Luxury Brands
  'Audi': {
    'A3': { types: ['Sedan', 'Hatchback'], fuelTypes: ['Petrol', 'Diesel'] },
    'A4': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'A6': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'Q3': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Q5': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Q7': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'BMW': {
    '3 Series': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    '5 Series': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'X1': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'X3': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'X5': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Mercedes-Benz': {
    'C-Class': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'E-Class': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'GLC': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'GLE': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Jaguar': {
    'XE': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'XF': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'F-PACE': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Land Rover': {
    'Range Rover Evoque': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Range Rover Sport': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Discovery': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },

  // Premium Brands
  'Volvo': {
    'S60': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'S90': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'XC40': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel', 'Electric'] },
    'XC60': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'XC90': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Lexus': {
    'ES': { types: ['Sedan'], fuelTypes: ['Petrol'] },
    'RX': { types: ['SUV'], fuelTypes: ['Petrol'] },
    'NX': { types: ['SUV'], fuelTypes: ['Petrol'] }
  },

  // Popular Indian Brands
  'Maruti Suzuki': {
    'Swift': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Swift Dzire': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Baleno': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Vitara Brezza': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG'] },
    'Ertiga': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG'] },
    'Ciaz': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Wagon R': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Alto': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Ignis': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'S-Presso': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] }
  },
  'Hyundai': {
    'i10': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'i20': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Verna': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Creta': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Venue': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG'] },
    'Tucson': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Aura': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Santro': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] }
  },
  'Honda': {
    'City': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Amaze': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Jazz': { types: ['Hatchback'], fuelTypes: ['Petrol'] },
    'WR-V': { types: ['SUV'], fuelTypes: ['Petrol'] },
    'BR-V': { types: ['SUV'], fuelTypes: ['Petrol'] }
  },
  'Tata': {
    'Tiago': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Tigor': { types: ['Sedan'], fuelTypes: ['Petrol', 'CNG'] },
    'Altroz': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Punch': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG'] },
    'Nexon': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG', 'Electric'] },
    'Harrier': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Safari': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },

  // Other Popular Brands
  'Mahindra': {
    'Scorpio': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Scorpio-N': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'XUV300': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'XUV500': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'XUV700': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Bolero': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Thar': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Kia': {
    'Seltos': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Sonet': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG'] },
    'Carnival': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Toyota': {
    'Innova Crysta': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Fortuner': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Glanza': { types: ['Hatchback'], fuelTypes: ['Petrol', 'CNG'] },
    'Urban Cruiser': { types: ['SUV'], fuelTypes: ['Petrol', 'CNG'] }
  },
  'Renault': {
    'Kwid': { types: ['Hatchback'], fuelTypes: ['Petrol'] },
    'Triber': { types: ['SUV'], fuelTypes: ['Petrol'] },
    'Duster': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Nissan': {
    'Magnite': { types: ['SUV'], fuelTypes: ['Petrol'] },
    'Kicks': { types: ['SUV'], fuelTypes: ['Petrol'] }
  },
  'Volkswagen': {
    'Polo': { types: ['Hatchback'], fuelTypes: ['Petrol', 'Diesel'] },
    'Vento': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'Tiguan': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Ford': {
    'Figo': { types: ['Hatchback'], fuelTypes: ['Petrol', 'Diesel'] },
    'Aspire': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'Endeavour': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'EcoSport': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },
  'Skoda': {
    'Rapid': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'Octavia': { types: ['Sedan'], fuelTypes: ['Petrol', 'Diesel'] },
    'Kushaq': { types: ['SUV'], fuelTypes: ['Petrol'] },
    'Slavia': { types: ['Sedan'], fuelTypes: ['Petrol'] }
  },
  'MG': {
    'Hector': { types: ['SUV'], fuelTypes: ['Petrol'] },
    'ZS EV': { types: ['SUV'], fuelTypes: ['Electric'] },
    'Gloster': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  },

  // Electric Vehicles
  'Tata Motors': {
    'Nexon EV': { types: ['SUV'], fuelTypes: ['Electric'] },
    'Tigor EV': { types: ['Sedan'], fuelTypes: ['Electric'] }
  },

  // International Brands
  'Jeep': {
    'Compass': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] },
    'Wrangler': { types: ['SUV'], fuelTypes: ['Petrol', 'Diesel'] }
  }
};

// Helper functions to get data
export const getAllBrands = (): string[] => {
  return Object.keys(CAR_DATA).sort();
};

export const getModelsForBrand = (brand: string): string[] => {
  if (!CAR_DATA[brand]) return [];
  return Object.keys(CAR_DATA[brand]).sort();
};

export const getTypesForBrandAndModel = (brand: string, model: string): string[] => {
  if (!CAR_DATA[brand] || !CAR_DATA[brand][model]) return [];
  return CAR_DATA[brand][model].types;
};

export const getFuelTypesForBrandAndModel = (brand: string, model: string): string[] => {
  if (!CAR_DATA[brand] || !CAR_DATA[brand][model]) return [];
  return CAR_DATA[brand][model].fuelTypes;
};

export const getAllVehicleTypes = (): string[] => {
  const types = new Set<string>();
  Object.values(CAR_DATA).forEach(brandData => {
    Object.values(brandData).forEach(modelData => {
      modelData.types.forEach(type => types.add(type));
    });
  });
  return Array.from(types).sort();
};

export const getAllModels = (): string[] => {
  const models = new Set<string>();
  Object.values(CAR_DATA).forEach(brandData => {
    Object.keys(brandData).forEach(model => models.add(model));
  });
  return Array.from(models).sort();
};

// Export default
export default CAR_DATA;

