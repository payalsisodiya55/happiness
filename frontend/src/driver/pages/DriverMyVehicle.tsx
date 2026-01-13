import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import AddVehicleForm from "@/driver/components/AddVehicleForm";
import { Home, MessageSquare, Car, User, Plus, Edit, Trash2, MapPin, Calendar, Fuel, Settings, CheckCircle, AlertCircle, Search, Filter, Upload, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import VehicleApiService, { Vehicle, CreateVehicleData, UpdateVehicleData } from "@/services/vehicleApi";

// Vehicle type configurations
const VEHICLE_CONFIGS = {
  'auto': {
    name: 'Auto',
    icon: '🛺',
    defaultCapacity: 3,
    variants: ['Fuel', 'Electric', 'CNG'],
    amenities: ['charging', 'usb', 'gps'],
    defaultBaseFare: 50,
    defaultPerKmRate: 15
  },
  'car': {
    name: 'Car',
    icon: '🚗',
    defaultCapacity: 4,
    variants: ['Sedan', 'Hatchback', 'SUV'],
    amenities: ['ac', 'charging', 'usb', 'bluetooth', 'gps'],
    defaultBaseFare: 100,
    defaultPerKmRate: 20
  },
  'bus': {
    name: 'Bus',
    icon: '🚌',
    defaultCapacity: 40,
    variants: ['AC Sleeper', 'Non-AC Sleeper', '52-Seater AC/Non-AC', '40-Seater AC/Non-AC', '32-Seater AC/Non-AC', '26-Seater AC/Non-AC', '17-Seater AC/Non-AC'],
    amenities: ['ac', 'sleeper', 'charging', 'usb', 'gps', 'camera', 'wifi', 'tv'],
    defaultBaseFare: 200,
    defaultPerKmRate: 25
  }
};

interface DetailRowProps {
  label: string;
  value: string | number | undefined;
  capitalize?: boolean;
  isMono?: boolean;
}

const DetailRow = ({ label, value, capitalize, isMono }: DetailRowProps) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100 last:border-0 hover:bg-white px-2 rounded-lg transition-colors">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className={`font-semibold text-gray-800 ${capitalize ? 'capitalize' : ''} ${isMono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
};

const PricingCard = ({ label, amount, suffix = '', isMain = false }: { label: string; amount: number; suffix?: string; isMain?: boolean }) => (
  <div className={`p-4 rounded-xl text-center border transition-all hover:shadow-md ${isMain ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
    <div className={`text-xl font-bold ${isMain ? 'text-[#f48432]' : 'text-[#29354c]'}`}>
      ₹{amount}{suffix}
    </div>
    <div className={`text-xs mt-1 font-medium ${isMain ? 'text-orange-700/70' : 'text-gray-500'}`}>
      {label}
    </div>
  </div>
);

const DriverMyVehicle = () => {
  const navigate = useNavigate();
  const { driver, isLoggedIn } = useDriverAuth();
  const [activeTab, setActiveTab] = useState("myvehicle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'maintenance'>("all");
  const [filterType, setFilterType] = useState<'all' | 'bus' | 'car' | 'auto'>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [detailImageIndex, setDetailImageIndex] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API service
  const vehicleApi = new VehicleApiService(
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    () => ({
      'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
    })
  );

  useEffect(() => {
    const initializeDriverModule = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!isLoggedIn) {
          navigate('/driver-auth');
          return;
        }

        // Load driver's vehicles
        await loadVehicles();

      } catch (err) {
        console.error('Error initializing driver module:', err);
        setError('Failed to load driver module. Please try refreshing the page.');
        toast({
          title: "Error",
          description: "Failed to load driver module. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeDriverModule();
  }, [navigate, isLoggedIn]);

  const loadVehicles = async () => {
    try {
      const response = await vehicleApi.getDriverVehicles({
        page: 1,
        limit: 100,
        status: filterStatus === 'all' ? undefined : filterStatus,
        type: filterType === 'all' ? undefined : filterType
      });

      let vehiclesData: Vehicle[] = [];
      if (response.success && Array.isArray(response.data)) {
        vehiclesData = response.data;
      } else if (response.success && response.data && 'docs' in response.data && Array.isArray(response.data.docs)) {
        vehiclesData = response.data.docs;
      } else if (response.success && response.data && 'vehicles' in response.data && Array.isArray(response.data.vehicles)) {
        vehiclesData = response.data.vehicles;
      } else {
        console.warn('Unexpected response structure:', response);
        vehiclesData = [];
      }

      setVehicles(vehiclesData);
      setError(null);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('Failed to load vehicles. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        navigate('/driver');
        break;
      case "requests":
        navigate('/driver/requests');
        break;
      case "profile":
        navigate('/driver/profile');
        break;
      default:
        navigate('/driver/myvehicle');
    }
  };

  const handleAddVehicle = async (vehicleData: CreateVehicleData, images: File[]) => {
    try {
      setIsSubmitting(true);
      
      const response = await vehicleApi.createVehicle(vehicleData);
      
      if (response.success) {
        // Upload images if provided
        const created = response.data as any;
        const vehicleId = created?._id || created?.data?._id;
        if (vehicleId && images && images.length > 0) {
          await vehicleApi.uploadVehicleImages(vehicleId, images);
        }
        toast({
          title: "Vehicle Added!",
          description: `${vehicleData.brand} ${vehicleData.model || ''} has been successfully added to your fleet.`,
          variant: "default",
        });
        
        setShowAddDialog(false);
        await loadVehicles(); // Reload vehicles
      }
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVehicle = async (vehicleId: string, updates: UpdateVehicleData) => {
    try {
      setIsSubmitting(true);
      
      const response = await vehicleApi.updateVehicle(vehicleId, updates);
      
      if (response.success) {
        toast({
          title: "Vehicle Updated!",
          description: "Vehicle details have been successfully updated.",
          variant: "default",
        });
        
        setEditingVehicle(null);
        await loadVehicles(); // Reload vehicles
      }
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await vehicleApi.deleteVehicle(vehicleId);
      
      if (response.success) {
        toast({
          title: "Vehicle Removed!",
          description: "Vehicle has been successfully removed from your fleet.",
          variant: "destructive",
        });
        
        await loadVehicles(); // Reload vehicles
      }
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (vehicleId: string, newStatus: 'active' | 'inactive' | 'maintenance') => {
    try {
      const response = await vehicleApi.updateVehicleAvailability(vehicleId, { isAvailable: newStatus === 'active' });
      
      if (response.success) {
        toast({
          title: "Status Updated!",
          description: `Vehicle status changed to ${newStatus}.`,
          variant: "default",
        });
        
        await loadVehicles(); // Reload vehicles
      }
    } catch (error: any) {
      console.error('Error updating vehicle status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update vehicle status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageNavigation = (vehicleId: string, direction: 'prev' | 'next' | number) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (!vehicle) return;
    
    const currentIndex = currentImageIndex[vehicleId] || 0;
    let newIndex;
    
    if (typeof direction === 'number') {
      // Direct index navigation
      newIndex = direction;
    } else if (direction === 'prev') {
      newIndex = currentIndex === 0 ? vehicle.images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === vehicle.images.length - 1 ? 0 : currentIndex + 1;
    }
    
    // Ensure index is within bounds
    if (newIndex >= 0 && newIndex < vehicle.images.length) {
      setCurrentImageIndex(prev => ({ ...prev, [vehicleId]: newIndex }));
    }
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle);
    setDetailImageIndex(0);
  };

  const handleDetailImageNavigation = (direction: 'prev' | 'next') => {
    if (!viewingVehicle) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = detailImageIndex === 0 ? viewingVehicle.images.length - 1 : detailImageIndex - 1;
    } else {
      newIndex = detailImageIndex === viewingVehicle.images.length - 1 ? 0 : detailImageIndex + 1;
    }
    setDetailImageIndex(newIndex);
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Fix the status filtering logic
    let matchesStatus = true;
    if (filterStatus === 'active') {
      matchesStatus = vehicle.isAvailable === true;
    } else if (filterStatus === 'inactive') {
      matchesStatus = vehicle.isAvailable === false;
    } else if (filterStatus === 'maintenance') {
      // For now, use isActive as a proxy for maintenance status
      matchesStatus = vehicle.isActive === false;
    }
    // If filterStatus is 'all', matchesStatus remains true
    
    const matchesType = filterType === "all" || vehicle.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading driver module...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-40">
        {/* Driver Header */}
        <div className="bg-[#29354c] text-white pt-6 pb-16 shadow-md relative overflow-hidden rounded-b-[2rem]">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold mb-1 text-white">
                  My Fleet
                </h1>
                <p className="text-gray-300 text-sm">Manage your vehicles and documents</p>
              </div>
              <Button 
                className="bg-[#f48432] text-white hover:bg-[#e07528] shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 text-sm font-semibold rounded-full hover:scale-105"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>

        {/* Vehicle Stats - moved here for sticky effect */}
        <div className="container mx-auto px-4 -mt-12 relative z-50">
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden relative group">
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#29354c] group-hover:w-2 transition-all"></div>
            <CardContent className="p-3 sm:p-5 text-center relative z-10">
              <div className="text-3xl sm:text-5xl font-bold text-[#29354c] mb-1">{vehicles.length}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">Total Vehicles</div>
            </CardContent>
            <div className="absolute right-0 bottom-0 p-2 opacity-5">
              <Car className="w-16 h-16 text-[#29354c]" />
            </div>
          </Card>
          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden relative group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 group-hover:w-2 transition-all"></div>
            <CardContent className="p-3 sm:p-5 text-center relative z-10">
              <div className="text-3xl sm:text-5xl font-bold text-green-600 mb-1">
                {vehicles.filter(v => v.isAvailable).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">Active</div>
            </CardContent>
            <div className="absolute right-0 bottom-0 p-2 opacity-5">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </Card>
          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl overflow-hidden relative group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#f48432] group-hover:w-2 transition-all"></div>
            <CardContent className="p-3 sm:p-5 text-center relative z-10">
              <div className="text-3xl sm:text-5xl font-bold text-[#f48432] mb-1">
                {vehicles.filter(v => !v.isAvailable).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-wider">Inactive</div>
            </CardContent>
            <div className="absolute right-0 bottom-0 p-2 opacity-5">
              <AlertCircle className="w-16 h-16 text-[#f48432]" />
            </div>
          </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-20 mt-4">
        {/* Vehicles List */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">My Vehicles ({filteredVehicles.length})</h2>
            {filteredVehicles.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </div>
            )}
          </div>
          
          {filteredVehicles.length === 0 ? (
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Car className="w-12 h-12 text-[#29354c]" />
                </div>
                <h3 className="text-2xl font-bold text-[#29354c] mb-2">No vehicles found</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  {searchTerm || filterStatus !== 'all' || filterType !== 'all' 
                    ? "Try adjusting your search criteria or filters."
                    : "Your fleet is currently empty. Add your first vehicle to start earning."
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                  <Button 
                    onClick={() => setShowAddDialog(true)}
                    className="bg-[#f48432] hover:bg-[#e07528] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    Add Your First Vehicle
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onEdit={() => setEditingVehicle(vehicle)}
                onDelete={() => handleDeleteVehicle(vehicle._id)}
                onToggleStatus={(status) => handleToggleStatus(vehicle._id, status)}
                onViewDetails={() => handleViewDetails(vehicle)}
                currentImageIndex={currentImageIndex[vehicle._id] || 0}
                onImageNavigation={handleImageNavigation}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] max-h-[90vh] p-0 flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="p-6 shrink-0">
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <AddVehicleForm 
            mode="create"
            onSubmit={handleAddVehicle} 
            onCancel={() => setShowAddDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-[90vh] max-h-[90vh] p-0 flex flex-col gap-0 overflow-hidden">
          <DialogHeader className="p-6 shrink-0">
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <AddVehicleForm
              mode="edit"
              initial={({
                type: editingVehicle.type as any,
                brand: editingVehicle.brand || '',
                model: editingVehicle.model || '',
                year: Number(editingVehicle.year) || new Date().getFullYear(),
                color: editingVehicle.color || '',
                fuelType: editingVehicle.fuelType as any || 'petrol',
                transmission: editingVehicle.transmission as any || 'manual',
                seatingCapacity: Number(editingVehicle.seatingCapacity) || 4,
                engineCapacity: editingVehicle.engineCapacity || undefined,
                mileage: editingVehicle.mileage || undefined,
                isAc: editingVehicle.isAc || false,
                isSleeper: editingVehicle.isSleeper || false,
                amenities: editingVehicle.amenities || [],
                registrationNumber: editingVehicle.registrationNumber || '',
                chassisNumber: editingVehicle.chassisNumber || '',
                engineNumber: editingVehicle.engineNumber || '',
                // Document numbers
                // rcNumber: editingVehicle.documents?.rc?.number || '', // RC number is same as registration number
                // rcExpiryDate: editingVehicle.documents?.rc?.expiryDate ? new Date(editingVehicle.documents.rc.expiryDate).toISOString().split('T')[0] : '',
                insuranceNumber: editingVehicle.documents?.insurance?.number || '',
                insuranceExpiryDate: editingVehicle.documents?.insurance?.expiryDate ? new Date(editingVehicle.documents.insurance.expiryDate).toISOString().split('T')[0] : '',
                fitnessNumber: editingVehicle.documents?.fitness?.number || '',
                fitnessExpiryDate: editingVehicle.documents?.fitness?.expiryDate ? new Date(editingVehicle.documents.fitness.expiryDate).toISOString().split('T')[0] : '',
                permitNumber: editingVehicle.documents?.permit?.number || '',
                permitExpiryDate: editingVehicle.documents?.permit?.expiryDate ? new Date(editingVehicle.documents.permit.expiryDate).toISOString().split('T')[0] : '',
                pucNumber: editingVehicle.documents?.puc?.number || '',
                pucExpiryDate: editingVehicle.documents?.puc?.expiryDate ? new Date(editingVehicle.documents.puc.expiryDate).toISOString().split('T')[0] : '',
                // Pricing reference
                pricingReference: editingVehicle.pricingReference || {
                  category: editingVehicle.type as any,
                  vehicleType: '',
                  vehicleModel: ''
                },
                // Working schedule
                workingDays: editingVehicle.schedule?.workingDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                workingHoursStart: editingVehicle.schedule?.workingHours?.start || '06:00',
                workingHoursEnd: editingVehicle.schedule?.workingHours?.end || '22:00',
                // Operating area
                operatingCities: editingVehicle.operatingArea?.cities || [],
                operatingStates: editingVehicle.operatingArea?.states || [],
              } as any)}
              existingImages={(editingVehicle.images || []) as any}
              isSubmitting={isSubmitting}
              onCancel={() => setEditingVehicle(null)}
              onSubmit={async (updates, newImages, deleteImageIds) => {
                await handleEditVehicle(editingVehicle._id, updates as any);
                // Delete selected existing images
                if (deleteImageIds && deleteImageIds.length) {
                  for (const imgId of deleteImageIds) {
                    try { await vehicleApi.removeVehicleImage(editingVehicle._id, imgId); } catch {}
                  }
                }
                // Upload new images
                if (newImages && newImages.length) {
                  await vehicleApi.uploadVehicleImages(editingVehicle._id, newImages);
                }
                await loadVehicles();
                setEditingVehicle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Vehicle Details Modal */}
      <Dialog open={!!viewingVehicle} onOpenChange={() => setViewingVehicle(null)}>
        <DialogContent className="w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] p-0 flex flex-col gap-0 overflow-hidden bg-white">
          <DialogHeader className="bg-[#29354c] text-white p-6 shrink-0 z-20 sticky top-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <Car className="w-6 h-6 text-[#f48432]" />
              <span className="truncate">{viewingVehicle?.brand} {viewingVehicle?.model}</span>
            </DialogTitle>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setViewingVehicle(null)} 
                className="text-white/70 hover:text-white hover:bg-white/10 -mr-2 rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
          </DialogHeader>
          
          {viewingVehicle && (
            <div className="space-y-8 p-6 overflow-y-auto custom-scrollbar">
              {/* Vehicle Images Gallery - Premium Look */}
              <div className="relative group">
                <div className="relative h-64 sm:h-80 overflow-hidden rounded-2xl bg-gray-100 shadow-inner">
                  {viewingVehicle.images && viewingVehicle.images.length > 0 ? (
                    <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${detailImageIndex * 100}%)` }}>
                      {viewingVehicle.images.map((image, index) => (
                        <div key={image._id} className="min-w-full h-full flex items-center justify-center bg-gray-100">
                           <img 
                            src={image.url} 
                            alt={`${viewingVehicle.brand} ${viewingVehicle.model} - Image ${index + 1}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                       <PlaceholderImage vehicleType={viewingVehicle.type} className="opacity-50" />
                    </div>
                  )}
                  
                  {/* Image Navigation */}
                  {viewingVehicle.images && viewingVehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handleDetailImageNavigation('prev')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white/40 transition-all border border-white/20 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDetailImageNavigation('next')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white/40 transition-all border border-white/20 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      {/* Image Indicators */}
                       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                        {viewingVehicle.images.map((_, idx) => (
                          <div 
                            key={idx} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === detailImageIndex ? 'w-6 bg-[#f48432]' : 'w-1.5 bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Grid Layout for Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div>
                   <h3 className="text-[#29354c] font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <div className="w-1 h-5 bg-[#f48432] rounded-full"></div>
                      Basic Info
                   </h3>
                   <div className="bg-gray-50/50 rounded-xl p-4 space-y-3 border border-gray-100">
                      <DetailRow label="Type" value={viewingVehicle.type} capitalize />
                      <DetailRow label="Year" value={viewingVehicle.year} />
                      <DetailRow label="Color" value={viewingVehicle.color} />
                      <DetailRow label="Fuel Type" value={viewingVehicle.fuelType} capitalize />
                      <DetailRow label="Seating" value={`${viewingVehicle.seatingCapacity} Passengers`} />
                   </div>
                </div>

                {/* Technical / Status */}
                <div>
                   <h3 className="text-[#29354c] font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <div className="w-1 h-5 bg-[#f48432] rounded-full"></div>
                      Technical & Stats
                   </h3>
                   <div className="bg-gray-50/50 rounded-xl p-4 space-y-3 border border-gray-100">
                      <DetailRow label="Reg. Number" value={viewingVehicle.registrationNumber} isMono />
                      <DetailRow label="Transmission" value={viewingVehicle.transmission} capitalize />
                      {viewingVehicle.mileage && <DetailRow label="Mileage" value={`${viewingVehicle.mileage} km/l`} />}
                       <div className="flex justify-between items-center py-2 text-sm">
                        <span className="text-gray-500 font-medium">Status</span>
                        <Badge className={`${viewingVehicle.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} hover:bg-opacity-100 border-none px-2.5`}>
                           {viewingVehicle.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                   </div>
                </div>
              </div>

               {/* Amenities */}
              {viewingVehicle.amenities && viewingVehicle.amenities.length > 0 && (
                <div>
                  <h3 className="text-[#29354c] font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <div className="w-1 h-5 bg-[#f48432] rounded-full"></div>
                      Features & Amenities
                   </h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingVehicle.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-full shadow-sm text-sm text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-[#f48432]" />
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing - If exists */}
              {viewingVehicle.computedPricing && (
                 <div>
                   <h3 className="text-[#29354c] font-bold text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                      <div className="w-1 h-5 bg-[#f48432] rounded-full"></div>
                      Pricing Structure
                   </h3>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <PricingCard 
                        label="Base Price" 
                        amount={viewingVehicle.computedPricing.autoPrice?.oneWay || 0} 
                        isMain 
                      />
                      {viewingVehicle.computedPricing.category !== 'auto' && (
                        <>
                           <PricingCard label="50km Rate" amount={viewingVehicle.computedPricing.distancePricing?.oneWay?.['50km'] || 0} suffix="/km" />
                           <PricingCard label="100km Rate" amount={viewingVehicle.computedPricing.distancePricing?.oneWay?.['100km'] || 0} suffix="/km" />
                           <PricingCard label="200km Rate" amount={viewingVehicle.computedPricing.distancePricing?.oneWay?.['200km'] || 0} suffix="/km" />
                        </>
                      )}
                   </div>
                 </div>
              )}
            </div>
          )}

        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <DriverBottomNavigation />
    </div>
  );
};

// Placeholder Image Component
const PlaceholderImage = ({ vehicleType, className }: { vehicleType: string; className?: string }) => {
  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'bus':
        return '🚌';
      case 'car':
        return '🚗';
      case 'auto':
        return '🛺';
      default:
        return '🚗';
    }
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center ${className}`}>
      <div className="text-4xl mb-2">{getVehicleIcon()}</div>
      <p className="text-gray-500 text-sm text-center">No image available</p>
    </div>
  );
};

// Vehicle Card Component
const VehicleCard = ({ 
  vehicle, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewDetails,
  currentImageIndex,
  onImageNavigation
}: {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: (status: 'active' | 'inactive' | 'maintenance') => void;
  onViewDetails: () => void;
  currentImageIndex: number;
  onImageNavigation: (vehicleId: string, direction: 'prev' | 'next' | number) => void;
}) => {
  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-600' : 'bg-gray-600';
  };

  const getStatusText = (isAvailable: boolean) => {
    return isAvailable ? 'Active' : 'Inactive';
  };

  const handleImageNavigation = (direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      onImageNavigation(vehicle._id, direction);
    } else {
      onImageNavigation(vehicle._id, direction);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-100 shadow-sm bg-white rounded-xl overflow-hidden group">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Vehicle Image - Compact */}
          <div className="relative flex-shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
              {vehicle.images && vehicle.images.length > 0 ? (
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                  {vehicle.images.map((image, index) => (
                    <img 
                      key={image._id}
                      src={image.url} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.parentElement?.querySelector('.placeholder-fallback');
                        if (placeholder) {
                          (placeholder as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ))}
                  {vehicle.images.map((_, index) => (
                    <div 
                      key={`placeholder-${index}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 hidden placeholder-fallback"
                    >
                      <PlaceholderImage vehicleType={vehicle.type} className="w-full h-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <PlaceholderImage vehicleType={vehicle.type} className="w-full h-full" />
              )}
              
              {/* Status Badge */}
              <div className="absolute -top-1 -right-1 z-10">
                {vehicle.isAvailable ? (
                  <Badge className="bg-green-500 text-white border-0 shadow-sm text-xs px-1.5 py-0.5 rounded-full">
                    <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-[#f48432] text-white border-0 shadow-sm text-xs px-1.5 py-0.5 rounded-full">
                    <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                    Inactive
                  </Badge>
                )}
              </div>

              {/* Image Navigation for multiple images */}
              {vehicle.images && vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-all duration-200 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-all duration-200 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-black/60 backdrop-blur-[2px] text-white text-[10px] px-1.5 py-0 rounded-full font-normal">
                      {currentImageIndex + 1}/{vehicle.images.length}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Vehicle Info - Compact */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-[#29354c] truncate">{vehicle.brand} {vehicle.model}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 capitalize bg-blue-50 text-[#29354c]">
                    {vehicle.type}
                  </Badge>
                  <span className="text-xs text-gray-400">• <span className="text-gray-600">{vehicle.year}</span></span>
                </div>
                {vehicle.vehicleLocation?.address && (
                  <div className="flex items-start gap-1 mt-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#f48432]" />
                    <span className="truncate">{vehicle.vehicleLocation.address}</span>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-1 ml-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onEdit}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-[#29354c] hover:bg-blue-50 transition-all duration-200 rounded-full"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Vehicle</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {vehicle.brand} {vehicle.model} from your fleet? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={onDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remove Vehicle
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Registration</div>
                <div className="text-xs font-mono font-bold text-[#29354c] truncate">{vehicle.registrationNumber}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Fuel</div>
                <div className="text-xs font-bold text-[#29354c] capitalize truncate">{vehicle.fuelType}</div>
              </div>
            </div>

            {/* Pricing & Stats */}
            <div className="flex items-center justify-between mb-3">
              {vehicle.computedPricing && (
                <div className="flex items-center gap-2">
                  <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-sm font-bold text-yellow-600">₹{vehicle.computedPricing.autoPrice?.oneWay || 0}</div>
                    <div className="text-xs text-gray-600">Base Price</div>
                  </div>
                  {vehicle.computedPricing.category !== 'auto' && (
                    <div className="text-center p-2 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-sm font-bold text-purple-600">₹{vehicle.computedPricing.distancePricing?.oneWay?.['50km'] || 0}/km</div>
                      <div className="text-xs text-gray-600">50km Rate</div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">{vehicle.statistics?.totalTrips || 0}</div>
                  <div className="text-xs text-gray-600">Trips</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2">
              <Select 
                value={vehicle.isAvailable ? 'active' : 'inactive'} 
                onValueChange={(value: 'active' | 'inactive' | 'maintenance') => 
                  onToggleStatus(value)
                }
              >
                <SelectTrigger className="flex-1 h-9 text-xs border-gray-200 hover:border-[#29354c] focus:border-[#29354c] rounded-lg transition-all duration-200 font-medium text-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active" className="text-green-600 font-medium">Active</SelectItem>
                  <SelectItem value="inactive" className="text-gray-600">Inactive</SelectItem>
                  <SelectItem value="maintenance" className="text-orange-600">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 px-4 hover:bg-[#29354c] hover:text-white border-[#29354c] text-[#29354c] rounded-lg transition-all duration-300 text-xs font-semibold"
                onClick={onViewDetails}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default DriverMyVehicle;