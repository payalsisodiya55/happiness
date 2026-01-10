import { useState, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Loader2, ArrowLeft, Phone, Mail, MapPin, Building, Globe, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import { toast } from "sonner";
import apiService from "@/services/api";
import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";

const DriverEditProfile = () => {
  const navigate = useNavigate();
  const { driver, updateDriverData } = useDriverAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: driver?.firstName || "",
    lastName: driver?.lastName || "",
    phone: driver?.phone || "",
    email: driver?.email || "",
    profilePhoto: driver?.profilePhoto || "",
    address: {
      street: driver?.address?.street || "",
      city: driver?.address?.city || "",
      state: driver?.address?.state || "",
      pincode: driver?.address?.pincode || "",
      country: driver?.address?.country || "India"
    }
  });

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('document', file);
      // Using 'profile_photo' as assumed document type for avatar
      formDataUpload.append('documentType', 'profile_photo');

      const token = apiService.getAuthToken('driver');
      const url = `${apiService.baseURL}/driver/upload-document`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formDataUpload,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (data.success) {
        setFormData(prev => ({ ...prev, profilePhoto: data.data.documentUrl }));
        toast.success("Profile photo uploaded successfully");
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Prepare the data for the backend
      const updateData: any = {};
      
      if (formData.firstName && formData.lastName) {
        updateData.firstName = formData.firstName;
        updateData.lastName = formData.lastName;
      }
      
      if (formData.phone) {
        updateData.phone = formData.phone;
      }
      
      if (formData.email) {
        updateData.email = formData.email;
      }

      if (formData.profilePhoto) {
        updateData.profilePhoto = formData.profilePhoto;
      }
      
      if (formData.address) {
        updateData.address = formData.address;
      }

      const response = await apiService.updateDriverProfile(updateData);
      
      if (response.success) {
        // Update local driver data
        updateDriverData(response.data);
        toast.success("Profile updated successfully!");
        navigate('/driver/profile');
      } else {
        toast.error(response.error?.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 pb-20 md:pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#29354c] shadow-md">
        <div className="text-white py-4 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/driver/profile')}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-lg font-semibold">Edit Profile</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:container md:mx-auto md:px-4 md:mt-6 bg-white pb-24 md:pb-6">
        <div className="md:shadow-lg md:rounded-xl md:bg-white md:overflow-hidden">
          <div className="p-4 md:p-6">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-2 relative cursor-pointer group overflow-hidden"
                onClick={handlePhotoClick}
              >
                {formData.profilePhoto ? (
                  <img 
                    src={formData.profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400 group-hover:text-gray-600 transition-colors" />
                )}
                
                {/* Hover/Loading Overlay */}
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isUploadingPhoto ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                   {isUploadingPhoto ? (
                     <Loader2 className="w-6 h-6 text-white animate-spin" />
                   ) : (
                     <Camera className="w-6 h-6 text-white" />
                   )}
                </div>
              </div>
              <p 
                className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={handlePhotoClick}
              >
                {isUploadingPhoto ? 'Uploading...' : 'Change Profile Photo'}
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                   <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                      placeholder="First Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                    placeholder="Email Address"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="street" 
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    required
                    className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                    placeholder="Street Address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="city" 
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      required
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                      placeholder="City"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                   <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="state" 
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      required
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="pincode" 
                      value={formData.address.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      required
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                      placeholder="Pincode"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="country" 
                      value={formData.address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      required
                      className="pl-9 bg-gray-50 border-gray-200 focus:border-[#f48432] focus:ring-[#f48432]"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
              
              {/* Desktop Buttons (Hidden on Mobile) */}
              <div className="hidden md:flex space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/driver/profile')} 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#f48432] hover:bg-[#e07528] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>

               {/* Mobile Fixed Bottom Buttons */}
               <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex space-x-3 z-50">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/driver/profile')} 
                  className="flex-1" 
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#f48432] hover:bg-[#e07528] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block">
        <DriverBottomNavigation />
      </div>
    </div>
  );
};

export default DriverEditProfile;
