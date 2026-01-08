import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useUserAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "Indore, Madhya Pradesh"
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
        toast({
          title: "Error",
          description: "First name, last name, and phone are required",
          variant: "destructive",
        });
        return;
      }

      const profileData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        location: formData.location.trim()
      };

      await updateProfile(profileData);

      toast({
        title: "Success",
        description: "Personal information updated successfully!",
        variant: "default",
      });
      // Optional: navigate back on success or just stay on page
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <TopNavigation />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 bg-white border-b z-10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-[#212c40]">Personal Information</h1>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <div className="mb-6 hidden md:block">
           <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-600 hover:text-[#f48432]" onClick={() => navigate('/profile')}>
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Profile
           </Button>
           <h1 className="text-3xl font-bold text-[#212c40] mt-4">Personal Information</h1>
           <p className="text-gray-500 mt-1">Update your personal details and contact info</p>
        </div>

        <Card className="p-6 border-none shadow-sm md:shadow-md bg-white rounded-xl">
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#212c40]">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="pl-9 focus-visible:ring-[#f48432]"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#212c40]">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="pl-9 focus-visible:ring-[#f48432]"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#212c40]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="pl-9 focus-visible:ring-[#f48432]"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#212c40]">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="pl-9 focus-visible:ring-[#f48432]"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#212c40]">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="pl-9 focus-visible:ring-[#f48432]"
                    placeholder="Enter current location"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-[#f48432] hover:bg-[#d66e22] text-white font-semibold py-6 shadow-md transition-all hover:-translate-y-0.5"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfo;
