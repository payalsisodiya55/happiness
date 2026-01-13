import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Lock, 
  ArrowLeft,
  Mail,
  User,
  Home,
  List,
  HelpCircle,
  Truck,
  ShieldCheck,
  Phone,
  Gift
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import happinessLogo from "@/assets/Happiness-logo-removebg-preview.png";
import { toast } from "@/hooks/use-toast";
import { useDriverAuth } from "@/contexts/DriverAuthContext";
import apiService from "@/services/api";

const DriverAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: driverLogin, isLoggedIn } = useDriverAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showSignupOtpField, setShowSignupOtpField] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  
  // Get return URL from location state
  const returnUrl = location.state?.returnUrl || '/driver';

  // Redirect if already authenticated
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      console.log('DriverAuth: Driver already authenticated, redirecting to:', returnUrl);
      navigate(returnUrl, { replace: true });
    }
  }, [isLoggedIn, isLoading, navigate, returnUrl]);

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
    otp: "",
    referralCode: ""
  });

  const handleSendOtp = async () => {
    if (loginForm.phone.trim()) {
      try {
        setIsLoading(true);
        // Remove country code and send only the phone number
        const phoneNumber = loginForm.phone.replace(/[^0-9]/g, '');
        
        const response = await apiService.request('/auth/driver/send-otp', {
          method: 'POST',
          body: JSON.stringify({ 
            phone: phoneNumber,
            purpose: 'login'
          })
        }, 'public');

        if (response.success) {
          setShowOtpField(true);
          toast({
            title: "OTP Sent",
            description: `OTP sent to ${countryCode} ${loginForm.phone}`,
          });
        }
      } catch (error) {
        console.error('Send OTP error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP. Please try again.",
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
        // Remove country code and send only the phone number
        const phoneNumber = signupForm.phone.replace(/[^0-9]/g, '');
        
        const response = await apiService.request('/auth/driver/send-otp', {
          method: 'POST',
          body: JSON.stringify({ 
            phone: phoneNumber,
            purpose: 'signup'
          })
        }, 'public');

        if (response.success) {
          setShowSignupOtpField(true);
          toast({
            title: "OTP Sent",
            description: `OTP sent to ${countryCode} ${signupForm.phone}`,
          });
        }
      } catch (error) {
        console.error('Send OTP error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to send OTP. Please try again.",
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
        console.log('Handling driver login with:', { phone: loginForm.phone, otp: loginForm.otp });
        
        // Use the DriverAuthContext login function
        await driverLogin(loginForm.phone, loginForm.otp);
        
        console.log('Driver login successful in DriverAuth component');
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } catch (error) {
        console.error('Driver login error in DriverAuth component:', error);
        toast({
          title: "Login Failed",
          description: error.message || "Failed to login. Please try again.",
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
        // Remove country code and send only the phone number
        const phoneNumber = signupForm.phone.replace(/[^0-9]/g, '');
        
        const response = await apiService.request('/auth/driver/verify-otp', {
          method: 'POST',
          body: JSON.stringify({
            phone: phoneNumber,
            otp: signupForm.otp,
            purpose: 'signup',
            driverData: {
              firstName: signupForm.firstName,
              lastName: signupForm.lastName,
              email: signupForm.email,
              referralCode: signupForm.referralCode
            }
          })
        }, 'public');
        
        if (response.success) {
          toast({
            title: "Account Created",
            description: "Account created successfully! Please wait for admin approval.",
          });
          
          // Switch to login tab
          setActiveTab('login');
          setShowOtpField(true);
          setLoginForm({ phone: signupForm.phone, otp: '' });
          setShowSignupOtpField(false);
          setLoginForm({ phone: signupForm.phone, otp: '' });
          setShowSignupOtpField(false);
          setSignupForm({ firstName: '', lastName: '', email: '', phone: '', otp: '', referralCode: '' });
        }
      } catch (error) {
        console.error('Driver signup error:', error);
        toast({
          title: "Signup Failed",
          description: error.message || "Failed to create account. Please try again.",
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
        
        const response = await apiService.request('/auth/driver/resend-otp', {
          method: 'POST',
          body: JSON.stringify({ 
            phone: phoneNumber,
            purpose: purpose
          })
        }, 'public');

        if (response.success) {
          toast({
            title: "OTP Resent",
            description: "OTP resent successfully!",
          });
        }
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f48432] rounded-full opacity-5 blur-3xl transform translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#29354c] rounded-full opacity-5 blur-3xl transform -translate-x-32 translate-y-32"></div>
      

      
      <div className="flex-grow container mx-auto px-4 py-4 flex items-center justify-center relative z-10">
        <div className="w-full max-w-sm">
          {/* Brand/Logo Section */}
          <div className="text-center mb-4">
            <div className="inline-block p-1 rounded-2xl shadow-sm mb-2">
               <img src={happinessLogo} alt="Happiness Logo" className="w-12 h-12 object-contain rounded-xl" />
            </div>
            <h1 className="text-xl font-bold text-[#29354c] tracking-tight">Driver Partner</h1>
            <p className="text-gray-500 mt-1 text-xs">Join our network of professional drivers</p>
          </div>

          <Card className="w-full shadow-xl border-0 ring-1 ring-gray-100 bg-white rounded-xl overflow-hidden">
             {/* Header Bar */}
             <div className="h-1.5 bg-gradient-to-r from-[#29354c] to-[#f48432]"></div>
             
             <CardHeader className="text-center pt-4 pb-0">
                {/* Feature Icons */}
                <div className="flex justify-center gap-4 mb-3">
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="p-2 bg-blue-50 rounded-full text-[#29354c] group-hover:bg-[#29354c] group-hover:text-white transition-colors">
                            <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Drive</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="p-2 bg-orange-50 rounded-full text-[#f48432] group-hover:bg-[#f48432] group-hover:text-white transition-colors">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wide">Secure</span>
                    </div>
                </div>
             </CardHeader>
            
            <CardContent className="pt-2 px-5 pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/80 p-0.5 rounded-lg h-9">
                  <TabsTrigger 
                    value="login" 
                    className="text-xs rounded-md data-[state=active]:bg-[#29354c] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-xs rounded-md data-[state=active]:bg-[#29354c] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                {/* Login Tab */}
                <TabsContent value="login" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                  {!showOtpField ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="text-center mb-1">
                        <h2 className="text-base font-bold text-[#29354c]">Welcome Back!</h2>
                        <p className="text-xs text-gray-500">Enter your mobile number to continue</p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="mobileNumber" className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider ml-1">Mobile Number</Label>
                        <div className="flex space-x-2 group">
                          <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-20 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                              <SelectItem value="+1">+1</SelectItem>
                              <SelectItem value="+44">+44</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative flex-1">
                             <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                             <Input
                                id="mobileNumber"
                                type="tel"
                                placeholder="98765 43210"
                                className="pl-9 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] focus:border-[#29354c] transition-all text-sm"
                                value={loginForm.phone}
                                onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                              />
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-[#29354c] hover:bg-[#1a2333] text-white hover:text-white/90 h-10 rounded-lg shadow-md shadow-blue-900/10 font-medium text-sm tracking-wide transition-transform active:scale-[0.98] mt-1"
                        onClick={handleSendOtp}
                        disabled={!loginForm.phone.trim() || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                             <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             Sending...
                          </div>
                        ) : "Generate OTP"}
                      </Button>

                      <div className="text-center pt-1">
                         <p className="text-[10px] text-gray-400">
                            By continuing, you agree to our <a href="#" className="text-[#f48432] hover:underline">Terms</a> & <a href="#" className="text-[#f48432] hover:underline">Privacy Policy</a>
                         </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="text-center mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-[#29354c]">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-base font-bold text-[#29354c]">Verify OTP</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Code sent to <span className="font-medium text-gray-800">{countryCode} {loginForm.phone}</span>
                        </p>
                        <button 
                             onClick={handleBackToPhone} 
                             className="text-[10px] text-[#f48432] hover:underline mt-1 font-medium flex items-center justify-center w-full gap-1"
                        >
                            <ArrowLeft className="w-2.5 h-2.5" /> Change Number
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="relative">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="• • • • • •"
                            className={`text-center h-12 bg-white border-2 border-gray-100 focus:border-[#29354c] focus:ring-0 transition-all ${loginForm.otp ? 'text-lg tracking-[0.5em] font-bold text-[#29354c]' : 'text-sm tracking-widest text-gray-400 font-medium'}`}
                            value={loginForm.otp}
                            onChange={(e) => setLoginForm({...loginForm, otp: e.target.value})}
                            maxLength={6}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs">
                           <span className="text-gray-400 text-[10px]">Expecting code...</span> 
                           <button 
                             className="text-[#f48432] hover:text-[#d36a1e] font-medium text-[10px] hover:underline"
                             onClick={() => handleResendOtp('login')}
                           >
                              Resend Code
                           </button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#f48432] hover:bg-[#e07528] text-white h-10 rounded-lg shadow-md shadow-orange-500/20 font-medium text-sm mt-2 transition-transform active:scale-[0.98]"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                         {isLoading ? "Verifying..." : "Verify & Sign In"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-3 focus-visible:outline-none focus-visible:ring-0">
                  {!showSignupOtpField ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="text-center mb-1">
                         <h2 className="text-base font-bold text-[#29354c]">Create Account</h2>
                         <p className="text-xs text-gray-500">Join us as a driver partner</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName" className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider ml-1">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <Input
                              id="firstName"
                              placeholder="John"
                              className="pl-9 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm"
                              value={signupForm.firstName}
                              onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName" className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider ml-1">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              className="pl-9 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm"
                              value={signupForm.lastName}
                              onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="signupMobile" className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider ml-1">Mobile Number</Label>
                        <div className="flex space-x-2">
                          <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-20 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="+91">+91</SelectItem>
                            </SelectContent>
                          </Select>
                           <div className="relative flex-1">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                                <Input
                                    id="signupMobile"
                                    type="tel"
                                    placeholder="98765 43210"
                                    className="pl-9 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm"
                                    value={signupForm.phone}
                                    onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                                />
                           </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider ml-1">Email (Optional)</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-9 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm"
                            value={signupForm.email || ''}
                            onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="referralCode" className="text-[10px] font-semibold uppercase text-gray-500 tracking-wider ml-1">Referral Code (Optional)</Label>
                        <div className="relative">
                          <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input
                            id="referralCode"
                            placeholder="HAPPYXXXX"
                            className="pl-9 h-10 bg-gray-50 border-gray-200 focus:ring-[#29354c] text-sm"
                            value={signupForm.referralCode || ''}
                            onChange={(e) => setSignupForm({...signupForm, referralCode: e.target.value.toUpperCase()})}
                          />
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-[#29354c] hover:bg-[#1a2333] text-white hover:text-white/90 h-10 rounded-lg shadow-md shadow-blue-900/10 font-medium text-sm mt-1"
                        onClick={handleSendSignupOtp}
                        disabled={!signupForm.phone.trim() || !signupForm.firstName.trim() || !signupForm.lastName.trim() || isLoading}
                      >
                         {isLoading ? "Sending..." : "Continue & Verify"}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-right-8 duration-500">
                       <div className="text-center mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-[#29354c]">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className="text-base font-bold text-[#29354c]">Verify & Register</h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Code sent to <span className="font-medium text-gray-800">{countryCode} {signupForm.phone}</span>
                        </p>
                         <button 
                             onClick={handleBackToSignupPhone} 
                             className="text-[10px] text-[#f48432] hover:underline mt-1 font-medium flex items-center justify-center w-full gap-1"
                        >
                            <ArrowLeft className="w-2.5 h-2.5" /> Edit Details
                        </button>
                      </div>

                      <div className="relative">
                         <Input
                            id="signupOtp"
                            type="text"
                            placeholder="• • • • • •"
                            className={`text-center h-12 bg-white border-2 border-gray-100 focus:border-[#29354c] focus:ring-0 transition-all ${signupForm.otp ? 'text-lg tracking-[0.5em] font-bold text-[#29354c]' : 'text-sm tracking-widest text-gray-400 font-medium'}`}
                            value={signupForm.otp}
                            onChange={(e) => setSignupForm({...signupForm, otp: e.target.value})}
                            maxLength={6}
                          />
                      </div>
                      
                      <div className="text-center">
                         <button 
                             className="text-[#f48432] hover:text-[#d36a1e] font-medium text-[10px] hover:underline"
                             onClick={() => handleResendOtp('signup')}
                           >
                              Resend Verification Code
                           </button>
                      </div>

                      <Button 
                        className="w-full bg-[#f48432] hover:bg-[#e07528] text-white h-10 rounded-lg shadow-md shadow-orange-500/20 font-medium text-sm mt-2"
                        onClick={handleSignup}
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating..." : "Create Account"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="mt-5 pt-4 border-t border-gray-100/50 text-center text-xs">
                {activeTab === "login" ? (
                  <p className="text-gray-500">
                    New to Happiness?{" "}
                    <button 
                      className="font-bold text-[#29354c] hover:text-[#f48432] transition-colors"
                      onClick={() => setActiveTab("signup")}
                    >
                      Join now
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Already a partner?{" "}
                    <button 
                      className="font-bold text-[#29354c] hover:text-[#f48432] transition-colors"
                      onClick={() => setActiveTab("login")}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
};

export default DriverAuth;