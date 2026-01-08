import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { 
  User, 
  Home, 
  Settings, 
  LogOut, 
  Phone, 
  Mail,
  ChevronRight,
  Shield,
  Bell,
  Camera,
  Edit3,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/UserAuthContext";
import { useIsMobile } from "../hooks/use-mobile";
import TopNavigation from "../components/TopNavigation";
import UserBottomNavigation from "../components/UserBottomNavigation";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout: contextLogout } = useUserAuth();
  const isMobile = useIsMobile() || false;
  
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Indore, Madhya Pradesh",
    avatar: "https://github.com/shadcn.png"
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Update user profile when user data changes
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name provided';
      setUserProfile({
        name: fullName,
        email: user.email || "No email provided",
        phone: user.phone || "No phone provided",
        location: user.location || "Indore, Madhya Pradesh", // Use user's location or default
        avatar: user.profilePicture || "https://github.com/shadcn.png"
      });
    }
  }, [user]);

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    contextLogout();
    navigate('/');
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile({
          ...userProfile,
          avatar: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
    setIsPhotoModalOpen(false);
  };

  const profileOptions = [
    {
      id: 1,
      title: "Personal Information",
      icon: User,
      description: "Update your personal details",
      path: "/profile/personal-info"
    },
    {
      id: 2,
      title: "Notifications",
      icon: Bell,
      description: "Manage notification preferences",
      path: "/profile/notifications"
    },
    {
      id: 3,
      title: "Privacy & Security",
      icon: Shield,
      description: "Account security settings",
      path: "/profile/privacy"
    },
    {
      id: 4,
      title: "Settings",
      icon: Settings,
      description: "App preferences and settings",
      path: "/profile/settings"
    },
    {
      id: 5,
      title: "Privacy Policy",
      icon: Shield,
      description: "Read our privacy policy and terms",
      path: "/privacy-policy"
    },
    {
      id: 6,
      title: "Terms & Conditions",
      icon: FileText,
      description: "Read our terms of use",
      path: "/terms-conditions"
    }
  ];

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="hidden md:block">
        <TopNavigation />
      </div>
      {!isAuthenticated ? (
        // Login Screen
        <div className="bg-white">
          <div className="flex items-center justify-center min-h-screen px-4 sm:px-6">
            <div className="text-center space-y-6 sm:space-y-8 max-w-md mx-auto w-full">
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#212c40] leading-tight px-2">
                Log in to manage<br />your bookings
              </h1>
              
              {/* Login Button */}
              <Button 
                className="w-full bg-[#f48432] hover:bg-[#d66e22] text-white text-base sm:text-lg font-semibold py-3 sm:py-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                onClick={handleLogin}
              >
                Log in
              </Button>
              
              {/* Sign Up Link */}
              <p className="text-sm text-gray-600 px-2">
                Don't have an account? <span className="underline cursor-pointer text-[#212c40] font-semibold hover:text-[#f48432]" onClick={handleLogin}>Sign up</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Profile Management Screen
        <>
          {/* Header */}
          <div className="bg-[#212c40] text-white p-6 sm:p-8 shadow-md">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">My Profile</h1>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24 md:pb-12 -mt-4 relative z-10">
            {/* Profile Card */}
            <Card className="p-6 sm:p-8 border-none shadow-lg bg-white rounded-xl">
              <div className={`flex ${isMobile ? 'flex-col space-y-6' : 'items-start space-x-8'}`}>
                <div className="relative flex justify-center sm:justify-start">
                  <div className="relative">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-xl">
                      <img src={userProfile.avatar} alt={userProfile.name} className="object-cover" />
                    </Avatar>
                    <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f48432] hover:bg-[#d66e22] text-white p-0 border-2 border-white shadow-md transition-all hover:scale-105"
                        >
                          <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-md mx-auto">
                        <DialogHeader>
                          <DialogTitle>Change Profile Photo</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-center">
                            <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-dashed border-gray-200">
                              <img src={userProfile.avatar} alt={userProfile.name} />
                            </Avatar>
                            <p className="text-sm text-muted-foreground mb-4">
                              Choose a new profile photo
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="photo-upload" className="cursor-pointer">
                              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#f48432] hover:bg-orange-50/50 transition-colors">
                                <Camera className="w-8 h-8 mx-auto mb-2 text-[#212c4050]" />
                                <p className="text-sm font-medium text-[#212c40]">Click to upload photo</p>
                                <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                              </div>
                            </Label>
                            <Input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className={`flex-1 text-center sm:text-left ${isMobile ? 'space-y-4' : 'pt-2 space-y-3'}`}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#212c40]">{userProfile.name}</h2>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f48432] transition-colors duration-300">
                        <Mail className="w-4 h-4 text-[#f48432] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-base text-gray-600 break-all font-medium">{userProfile.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f48432] transition-colors duration-300">
                        <Phone className="w-4 h-4 text-[#f48432] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-base text-gray-600 font-medium">{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start space-x-3 group">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f48432] transition-colors duration-300">
                        <Home className="w-4 h-4 text-[#f48432] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-base text-gray-600 font-medium">{userProfile.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end pt-2">
                    <Button 
                      variant="outline" 
                      className="border-2 border-[#212c40] text-[#212c40] hover:bg-[#212c40] hover:text-white font-semibold transition-all w-full sm:w-auto px-6"
                      onClick={() => navigate('/profile/personal-info')}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                </div>
              </div>
            </Card>

            {/* Profile Options */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#212c40] mb-4 px-1">Account Settings</h3>
              <div className="space-y-3">
                {profileOptions.map((option) => (
                  <Card 
                    key={option.id}
                    className="p-4 border-none shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group bg-white rounded-xl"
                    onClick={() => navigate(option.path)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#212c40]/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#212c40] transition-colors duration-300">
                        <option.icon className="w-6 h-6 text-[#212c40] group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#212c40] text-base sm:text-lg">{option.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{option.description}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#f48432] transition-colors" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Logout */}
            <Card className="p-4 border-none shadow-sm bg-white rounded-xl group hover:shadow-md transition-all cursor-pointer" onClick={handleLogout}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#212c40] text-base sm:text-lg">Logout</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Sign out of your account</p>
                </div>
              </div>
            </Card>

            {/* Download App */}
            <Card className="hidden md:block p-4 border-none shadow-sm bg-gradient-to-r from-[#212c40] to-[#2c3b55] text-white rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-base sm:text-lg">Download App</h4>
                  <p className="text-xs sm:text-sm text-white/70">Get the best experience </p>
                </div>
                <Button 
                  className="bg-[#f48432] hover:bg-[#d66e22] text-white font-semibold border-none shadow-lg" 
                  size="sm"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=com.chalo.sawari', '_blank')}
                >
                  Download
                </Button>
              </div>
            </Card>

            {/* App Version */}
            <div className="text-center pt-4 opacity-50">
              <p className="text-xs font-medium text-gray-400">Happiness Car Rental v1.0.0</p>
            </div>
          </div>
        </>
      )}
      <UserBottomNavigation />
    </div>
  );
};

export default Profile;