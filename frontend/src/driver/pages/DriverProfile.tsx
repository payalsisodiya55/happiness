import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DriverBottomNavigation from "@/driver/components/DriverBottomNavigation";
import { User, LogOut, Edit, Upload, Phone, Mail, MapPin, Calendar, CreditCard, Download, Star, Settings, Bell, TrendingUp, Loader2, FileText, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import { toast } from "sonner";
import apiService from "@/services/api";

const DriverProfile = () => {
  const navigate = useNavigate();
  const { driver, isLoggedIn, logout, refreshDriverData, updateDriverData } = useDriverAuth();

  const [showEarningsDialog, setShowEarningsDialog] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [earningsData, setEarningsData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{type: string, url: string} | null>(null);

  // Format address for display
  const formatAddress = (address: any) => {
    if (!address) return "Not specified";
    const parts = [address.street, address.city, address.state, address.pincode, address.country];
    return parts.filter(Boolean).join(", ");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get driver stats from backend
  const fetchDriverStats = async () => {
    try {
      const response = await apiService.getDriverStats();
      if (response.success) {
        setStatsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching driver stats:', error);
    }
  };

  // Get driver earnings from backend
  const fetchDriverEarnings = async () => {
    try {
      const response = await apiService.getDriverEarnings();
      if (response.success) {
        setEarningsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching driver earnings:', error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/driver-auth');
    } else if (driver) {
      // Fetch additional data when driver is available
      fetchDriverStats();
      fetchDriverEarnings();
    }
  }, [isLoggedIn, driver, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/driver-auth');
  };

  const handleToggleNotifications = (checked: boolean) => {
    setNotifications(checked);
    toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleToggleLocationSharing = (checked: boolean) => {
    setLocationSharing(checked);
    toast.success(`Location sharing ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleViewDocument = (documentType: string, documentUrl: string) => {
    setSelectedDocument({ type: documentType, url: documentUrl });
    setShowDocumentModal(true);
  };

  const handleUpdateDocument = (documentType: 'vehicleRC' | 'insurance') => {
    const inputId = documentType === 'vehicleRC' ? 'rcUpload' : 'insuranceUpload';
    document.getElementById(inputId)?.click();
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: 'vehicleRC' | 'insurance') => {
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

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      console.log('Uploading document:', { documentType, fileName: file.name, fileSize: file.size });

      // Custom request for file upload to avoid Content-Type conflicts
      const token = apiService.getAuthToken('driver');
      const url = `${apiService.baseURL}/driver/upload-document`;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      });

      const data = await response.json();

      console.log('Upload response:', response);
      console.log('Upload data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      if (data.success) {
        // Update the driver state with the new document
        const updatedDriver = {
          ...driver,
          documents: {
            ...driver.documents,
            [documentType]: {
              ...driver.documents?.[documentType],
              image: data.data.documentUrl,
              isVerified: false // New uploads need verification
            }
          }
        };
        
        // Update the driver data in the context
        updateDriverData(updatedDriver);

        toast.success(`${documentType.toUpperCase()} document uploaded successfully`);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Document upload error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      const errorMessage = error.message || 'Failed to upload document';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  // Calculate derived data
  const driverName = `${driver.firstName} ${driver.lastName}`;
  const joinDate = formatDate(driver.createdAt);
  const currentAddress = formatAddress(driver.address);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* DriverTopNavigation removed for cleaner look, as requested in other pages */}
      
      {/* Sticky Header Group: Header + Profile Card */}
      <div className="sticky top-0 z-40">
        {/* Driver Header */}
        <div className="bg-[#29354c] text-white pt-6 pb-24 shadow-md relative overflow-hidden rounded-b-[2rem]">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">My Profile</h1>
                  <p className="text-gray-300 text-sm">Manage your account settings</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to logout? You will need to login again to access the driver portal.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Header Card - Sticky & Overlapping */}
        <div className="container mx-auto px-4 -mt-20 relative z-50">
          <Card className="mb-0 border-none shadow-lg rounded-xl overflow-hidden bg-white">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">{driverName}</h2>
                  <p className="text-gray-600 text-sm md:text-base">Professional Driver</p>
                </div>
                <Button 
                  className="w-full md:w-auto bg-[#f48432] hover:bg-[#e07528] text-white transition-all duration-300"
                  onClick={() => navigate('/driver/profile/edit')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Body - Scrollable */}
      <div className="container mx-auto px-4 mt-6 pb-20 relative z-30">

        {/* Contact Information */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl text-[#29354c]">
              <User className="w-5 h-5 text-[#f48432]" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base">{driver.phone}</p>
                  <p className="text-xs md:text-sm text-gray-500">Mobile Number</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base truncate">{driver.email}</p>
                  <p className="text-xs md:text-sm text-gray-500">Email Address</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base">{currentAddress}</p>
                  <p className="text-xs md:text-sm text-gray-500">Address</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base">Member since {joinDate}</p>
                  <p className="text-xs md:text-sm text-gray-500">Join Date</p>
                </div>
              </div>

              {/* RC Document Upload */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm md:text-base">
                        {driver.documents?.vehicleRC?.image ? 'RC Document Uploaded' : 'RC Document Not Uploaded'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">RC Document</p>
                    </div>
                     <div className="flex flex-col space-y-2">
                       {driver.documents?.vehicleRC?.image ? (
                         <>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleViewDocument('RC Document', driver.documents?.vehicleRC?.image || '')}
                             className="text-[#29354c] hover:text-[#1e2a3b]"
                           >
                             <Eye className="w-4 h-4 mr-1" />
                             View
                           </Button>
                           <Button
                             size="sm"
                             variant="outline"
                              onClick={() => handleUpdateDocument('vehicleRC')}
                              className="text-[#f48432] hover:text-[#e07528]"
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                         </>
                       ) : (
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => document.getElementById('rcUpload')?.click()}
                           className="text-green-600 hover:text-green-700"
                         >
                           <Upload className="w-4 h-4 mr-1" />
                           Upload
                         </Button>
                       )}
                     </div>
                  </div>
                </div>
                <input
                  id="rcUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDocumentUpload(e, 'vehicleRC')}
                  className="hidden"
                />
              </div>

              {/* Insurance Document Upload */}
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm md:text-base">
                        {driver.documents?.insurance?.image ? 'Insurance Document Uploaded' : 'Insurance Document Not Uploaded'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">Insurance Document</p>
                    </div>
                     <div className="flex flex-col space-y-2">
                       {driver.documents?.insurance?.image ? (
                         <>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleViewDocument('Insurance Document', driver.documents?.insurance?.image || '')}
                             className="text-blue-600 hover:text-blue-700"
                           >
                             <Eye className="w-4 h-4 mr-1" />
                             View
                           </Button>
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleUpdateDocument('insurance')}
                             className="text-orange-600 hover:text-orange-700"
                           >
                             <Upload className="w-4 h-4 mr-1" />
                             Update
                           </Button>
                         </>
                       ) : (
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => document.getElementById('insuranceUpload')?.click()}
                           className="text-green-600 hover:text-green-700"
                         >
                           <Upload className="w-4 h-4 mr-1" />
                           Upload
                         </Button>
                       )}
                     </div>
                  </div>
                </div>
                <input
                  id="insuranceUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleDocumentUpload(e, 'insurance')}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Overview */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl text-[#29354c]">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span>Earnings Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors" onClick={() => setShowEarningsDialog(true)}>
                <div className="text-lg md:text-2xl font-bold text-green-600">
                  ₹{earningsData?.netEarnings?.toLocaleString() || '0'}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Total Earnings</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setShowEarningsDialog(true)}>
                <div className="text-lg md:text-2xl font-bold text-blue-600">
                  ₹{driver.earnings?.wallet?.balance?.toLocaleString() || '0'}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Wallet Balance</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => setShowEarningsDialog(true)}>
                <div className="text-lg md:text-2xl font-bold text-purple-600">
                  {driver.totalRides || 0}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Total Rides</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg">
                <div className="text-lg md:text-2xl font-bold text-[#f48432]">
                  {driver.earnings?.commission || 15}%
                </div>
                <div className="text-xs md:text-sm text-gray-600">Commission Rate</div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Performance Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl md:text-3xl font-bold text-blue-600">
                  {statsData?.completionRate || 0}%
                </div>
                <div className="text-xs md:text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl md:text-3xl font-bold text-green-600">
                  {driver.rating || 0}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl md:text-3xl font-bold text-purple-600">
                  {driver.totalRides || 0}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Total Rides</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-4 md:mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Settings className="w-5 h-5 text-gray-600" />
              <span>Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <Bell className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base">Push Notifications</p>
                  <p className="text-xs md:text-sm text-gray-500">Receive ride requests and updates</p>
                </div>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={handleToggleNotifications}
                className="data-[state=checked]:bg-[#f48432]"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 flex-1">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base">Location Sharing</p>
                  <p className="text-xs md:text-sm text-gray-500">Share location with customers</p>
                </div>
              </div>
              <Switch 
                checked={locationSharing} 
                onCheckedChange={handleToggleLocationSharing}
                className="data-[state=checked]:bg-[#f48432]"
              />
            </div>
          </CardContent>
        </Card>
      </div>



       {/* Earnings Details Dialog */}
       <Dialog open={showEarningsDialog} onOpenChange={setShowEarningsDialog}>
         <DialogContent className="max-w-lg">
           <DialogHeader>
             <DialogTitle>Earnings Details</DialogTitle>
           </DialogHeader>
           <EarningsDetailsDialog 
             driverData={driver} 
             earningsData={earningsData}
           />
         </DialogContent>
       </Dialog>

       {/* Document View Modal */}
       <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
         <DialogContent className="max-w-4xl max-h-[90vh]">
           <DialogHeader>
             <DialogTitle className="flex items-center space-x-2">
               <FileText className="w-5 h-5 text-blue-600" />
               <span>{selectedDocument?.type}</span>
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             {selectedDocument && (
               <div className="border rounded-lg overflow-hidden">
                 <img 
                   src={selectedDocument.url} 
                   alt={selectedDocument.type}
                   className="w-full h-auto max-h-[70vh] object-contain bg-gray-50"
                   onError={(e) => {
                     const target = e.target as HTMLImageElement;
                     target.style.display = 'none';
                     target.nextElementSibling?.classList.remove('hidden');
                   }}
                 />
                 <div className="hidden p-8 text-center text-gray-500 bg-gray-50">
                   <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                   <p>Document image not available</p>
                 </div>
               </div>
             )}
             <div className="flex justify-end space-x-3 pt-4 border-t">
               <Button 
                 variant="outline" 
                 onClick={() => setShowDocumentModal(false)}
               >
                 Close
               </Button>
               <Button 
                 onClick={() => {
                   if (selectedDocument) {
                     window.open(selectedDocument.url, '_blank');
                   }
                 }}
                 className="bg-blue-600 hover:bg-blue-700"
               >
                 <Download className="w-4 h-4 mr-2" />
                 Download
               </Button>
             </div>
           </div>
         </DialogContent>
       </Dialog>

      {/* Bottom Navigation */}
      <DriverBottomNavigation />
    </div>
  );
};

// Earnings Details Dialog Component
const EarningsDetailsDialog = ({ 
  driverData, 
  earningsData 
}: { 
  driverData: any; 
  earningsData: any;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ₹{earningsData?.netEarnings?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-600">Total Earnings</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            ₹{driverData.earnings?.wallet?.balance?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-600">Wallet Balance</div>
        </div>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded-lg">
        <div className="text-3xl font-bold text-purple-600">
          {earningsData?.totalBookings || 0}
        </div>
        <div className="text-sm text-gray-600">Total Bookings</div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Rides:</span>
          <span className="font-medium">{driverData.totalRides || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Commission Rate:</span>
          <span className="font-medium">{driverData.earnings?.commission || 15}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Average Rating:</span>
          <span className="font-medium">{driverData.rating || 0}</span>
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-2" />
          Print Report
        </Button>
        <Button className="flex-1">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  );
};

export default DriverProfile;
