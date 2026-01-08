import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import TopNavigation from "@/components/TopNavigation";
import happinessLogo from "@/assets/Happiness-logo.jpeg";
import apiService from "@/services/api";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { toast } from "@/hooks/use-toast";
import UserBottomNavigation from "@/components/UserBottomNavigation";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useUserAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showSignupOtpField, setShowSignupOtpField] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get return URL from location state
  const returnUrl = location.state?.returnUrl || '/profile';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(returnUrl, { replace: true, state: location.state });
    }
  }, [isAuthenticated, isLoading, navigate, returnUrl, location.state]);

  // Form states
  const [loginForm, setLoginForm] = useState({
    phone: "",
    otp: ""
  });

  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    otp: ""
  });

  const handleSendOtp = async () => {
    if (loginForm.phone.trim()) {
      try {
        setIsLoading(true);
        const phoneNumber = loginForm.phone.replace(/[^0-9]/g, '');
        
        const response = await apiService.request('/auth/send-otp', {
          method: 'POST',
          body: JSON.stringify({ 
            phone: phoneNumber,
            purpose: 'login'
          })
        });

        if (response.success) {
          setShowOtpField(true);
          toast({
            title: "OTP Sent",
            description: `OTP sent to ${countryCode} ${loginForm.phone}`,
            className: "bg-[#212c40] text-white border-none"
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendSignupOtp = async () => {
    if (signupForm.phone.trim() && signupForm.firstName.trim() && signupForm.lastName.trim()) {
      try {
        setIsLoading(true);
        const phoneNumber = signupForm.phone.replace(/[^0-9]/g, '');
        
        const response = await apiService.request('/auth/send-otp', {
          method: 'POST',
          body: JSON.stringify({ 
            phone: phoneNumber,
            purpose: 'signup'
          })
        });

        if (response.success) {
          setShowSignupOtpField(true);
          toast({
            title: "OTP Sent",
            description: `OTP sent to ${countryCode} ${signupForm.phone}`,
            className: "bg-[#212c40] text-white border-none"
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogin = async () => {
    if (showOtpField && loginForm.otp.trim()) {
      try {
        setIsLoading(true);
        await login(loginForm.phone, loginForm.otp);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          className: "bg-[#f48432] text-white border-none"
        });
      } catch (error: any) {
        toast({
          title: "Login Failed",
          description: error.message || "Failed to login",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (!showOtpField) {
      handleSendOtp();
    }
  };

  const handleBackToPhone = () => {
    setShowOtpField(false);
    setLoginForm({ ...loginForm, otp: "" });
  };

  const handleBackToSignupPhone = () => {
    setShowSignupOtpField(false);
    setSignupForm({ ...signupForm, otp: "" });
  };

  const handleSignup = async () => {
    if (showSignupOtpField && signupForm.otp.trim()) {
      try {
        setIsLoading(true);
        const phoneNumber = signupForm.phone.replace(/[^0-9]/g, '');
        
        const response = await apiService.request('/auth/verify-otp', {
          method: 'POST',
          body: JSON.stringify({
            phone: phoneNumber,
            otp: signupForm.otp,
            purpose: 'signup',
            userData: {
              firstName: signupForm.firstName,
              lastName: signupForm.lastName,
              email: signupForm.email,
              password: 'defaultPassword123'
            }
          })
        });
        
        if (response.success) {
          toast({
            title: "Account Created",
            description: "Please login with your phone number",
            className: "bg-[#f48432] text-white border-none"
          });
          setActiveTab('login');
          setShowOtpField(true);
          setLoginForm({ phone: signupForm.phone, otp: '' });
          setShowSignupOtpField(false);
          setSignupForm({ firstName: '', lastName: '', email: '', phone: '', otp: '' });
        }
      } catch (error: any) {
        toast({
          title: "Signup Failed",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (!showSignupOtpField) {
      handleSendSignupOtp();
    }
  };

  const handleResendOtp = async (purpose: 'login' | 'signup') => {
    try {
      setIsLoading(true);
      const phone = purpose === 'login' ? loginForm.phone : signupForm.phone;
      if (phone.trim()) {
        const phoneNumber = phone.replace(/[^0-9]/g, '');
        const response = await apiService.request('/auth/resend-otp', {
          method: 'POST',
          body: JSON.stringify({ phone: phoneNumber, purpose })
        });

        if (response.success) {
          toast({
            title: "OTP Resent",
            description: "OTP resent successfully!",
            className: "bg-[#212c40] text-white border-none"
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TopNavigation />
      
      <div className="container mx-auto px-4 py-8 pb-32 md:pb-8 flex justify-center items-center min-h-[calc(100vh-140px)]">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-2 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="flex justify-center mb-2">
              <div className="flex flex-col items-center">
                <div className="w-32 h-auto mb-4">
                  <img src={happinessLogo} alt="Happiness Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl font-bold text-[#212c40]">Welcome to Happiness</h1>
                <p className="text-sm text-gray-500 mt-1">Your Journey, Your Happiness</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2 px-6 md:px-8 pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="login"
                  className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-[#f48432] data-[state=active]:shadow-sm font-medium transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:text-[#f48432] data-[state=active]:shadow-sm font-medium transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-3 focus-visible:outline-none">
                {!showOtpField ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-[#212c40]">What's your mobile number?</h2>
                      <p className="text-sm text-gray-500 mt-0.5">We'll send you a verification code</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber" className="text-sm font-medium text-[#212c40]">Mobile Number</Label>
                      <div className="flex space-x-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-24 border-gray-200 focus:ring-0 focus:border-[#f48432] focus-visible:ring-0 h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="mobileNumber"
                          type="tel"
                          placeholder="Phone number"
                          className="flex-1 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 h-11"
                          value={loginForm.phone}
                          onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#f48432] hover:bg-[#e07020] text-white h-11 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      onClick={handleSendOtp}
                      disabled={!loginForm.phone.trim() || isLoading}
                    >
                      {isLoading ? "Sending..." : "Get OTP"}
                    </Button>

                    <div className="text-center text-xs text-gray-400 mt-2">
                      By proceeding, you agree to our <span className="text-[#f48432] cursor-pointer">Terms</span> & <span className="text-[#f48432] cursor-pointer">Privacy Policy</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="text-center relative">
                        <button 
                          onClick={handleBackToPhone}
                          className="absolute left-0 top-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <h2 className="text-xl font-bold text-[#212c40]">Enter OTP</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Sent to {countryCode} {loginForm.phone}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="pl-11 h-11 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 text-center text-lg tracking-widest"
                            value={loginForm.otp}
                            onChange={(e) => setLoginForm({...loginForm, otp: e.target.value})}
                            maxLength={6}
                          />
                        </div>
                        
                        <div className="text-center">
                          <Button 
                            variant="link" 
                            className="text-sm p-0 h-auto text-[#f48432]"
                            onClick={() => handleResendOtp('login')}
                          >
                            Resend OTP
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#212c40] hover:bg-[#2d3a52] text-white h-11 rounded-xl font-semibold shadow-lg transition-all"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify & Login"}
                      </Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-3 focus-visible:outline-none">
                {!showSignupOtpField ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium text-[#212c40]">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="firstName"
                            className="pl-9 h-11 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0"
                            value={signupForm.firstName}
                            onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium text-[#212c40]">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="lastName"
                            className="pl-9 h-11 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0"
                            value={signupForm.lastName}
                            onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium text-[#212c40]">Email (Optional)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-9 h-11 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0"
                          value={signupForm.email || ''}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="signupMobileNumber" className="text-sm font-medium text-[#212c40]">Mobile Number</Label>
                      <div className="flex space-x-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-24 border-gray-200 focus:ring-0 focus:border-[#f48432] focus-visible:ring-0 h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+1">+1</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="signupMobileNumber"
                          type="tel"
                          className="flex-1 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 h-11"
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-[#f48432] hover:bg-[#e07020] text-white h-11 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      onClick={handleSendSignupOtp}
                      disabled={!signupForm.phone.trim() || !signupForm.firstName.trim() || !signupForm.lastName.trim() || isLoading}
                    >
                      {isLoading ? "Sending..." : "Create Account"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center relative">
                        <button 
                          onClick={handleBackToSignupPhone}
                          className="absolute left-0 top-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <h2 className="text-xl font-bold text-[#212c40]">Verify Number</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Code sent to {countryCode} {signupForm.phone}
                        </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="signupOtp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          className="pl-11 h-11 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 text-center text-lg tracking-widest"
                          value={signupForm.otp}
                          onChange={(e) => setSignupForm({...signupForm, otp: e.target.value})}
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          className="text-sm p-0 h-auto text-[#f48432]"
                          onClick={() => handleResendOtp('signup')}
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-[#212c40] hover:bg-[#2d3a52] text-white h-11 rounded-xl font-semibold shadow-lg transition-all"
                      onClick={handleSignup}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Complete Signup"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <UserBottomNavigation />
    </div>
  );
};

export default Auth;