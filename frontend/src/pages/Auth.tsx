import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import happinessLogo from "@/assets/Happiness-logo.jpeg";
import apiService from "@/services/api";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { toast } from "@/hooks/use-toast";


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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>

      <div className="w-full max-w-[360px] relative z-10">
        <Card className="w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-0 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden ring-1 ring-white/50">
          <CardHeader className="text-center pb-0 pt-6 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="flex justify-center mb-3">
              <div className="flex flex-col items-center">
                <div className="w-20 h-auto mb-3">
                  <img src={happinessLogo} alt="Happiness Logo" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <h1 className="text-lg font-bold text-[#212c40]">Welcome to Happiness</h1>
                <p className="text-xs text-gray-500 mt-1">Your Journey, Your Happiness</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-2 px-5 pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-lg h-9">
                <TabsTrigger 
                  value="login"
                  className="rounded-md text-xs py-1 data-[state=active]:bg-white data-[state=active]:text-[#f48432] data-[state=active]:shadow-sm font-medium transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-md text-xs py-1 data-[state=active]:bg-white data-[state=active]:text-[#f48432] data-[state=active]:shadow-sm font-medium transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login Tab */}
              <TabsContent value="login" className="space-y-3 focus-visible:outline-none">
                {!showOtpField ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center">
                      <h2 className="text-sm font-bold text-[#212c40]">Enter Mobile Number</h2>
                      <p className="text-[10px] text-gray-500 mt-0.5">We'll send you a verification code</p>
                    </div>

                    <div className="space-y-2">
                       <Label htmlFor="mobileNumber" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile Number</Label>
                      <div className="flex space-x-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-20 border-gray-200 focus:ring-0 focus:border-[#f48432] focus-visible:ring-0 h-10 text-xs">
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
                          className="flex-1 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-4 focus:ring-[#f48432]/10 h-10 text-sm transition-all duration-300"
                          value={loginForm.phone}
                          onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-[#f48432] to-[#ff9e5e] hover:from-[#e07020] hover:to-[#f48432] text-white h-10 rounded-lg text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all mt-1"
                      onClick={handleSendOtp}
                      disabled={!loginForm.phone.trim() || isLoading}
                    >
                      {isLoading ? "Sending..." : "Get OTP"}
                    </Button>

                    <div className="text-center text-[10px] text-gray-400 mt-2">
                      By proceeding, you agree to our <span className="text-[#f48432] cursor-pointer hover:underline">Terms</span> & <span className="text-[#f48432] cursor-pointer hover:underline">Privacy Policy</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                     <div className="text-center relative pt-2">
                        <button 
                          onClick={handleBackToPhone}
                          className="absolute left-0 top-1 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </button>
                        <h2 className="text-base font-bold text-[#212c40]">Enter OTP</h2>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Sent to {countryCode} {loginForm.phone}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="relative group">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="• • • • • •"
                            className={`h-11 border-2 border-gray-100 focus:border-[#f48432] focus-visible:ring-0 focus:ring-4 focus:ring-[#f48432]/10 text-center transition-all duration-300 ${loginForm.otp ? 'text-lg tracking-[0.5em] font-bold text-[#212c40]' : 'text-sm tracking-widest text-gray-400 font-medium'}`}
                            value={loginForm.otp}
                            onChange={(e) => setLoginForm({...loginForm, otp: e.target.value})}
                            maxLength={6}
                          />
                        </div>
                        
                        <div className="text-center">
                          <Button 
                            variant="link" 
                            className="text-[10px] p-0 h-auto text-[#f48432]"
                            onClick={() => handleResendOtp('login')}
                          >
                            Resend OTP
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-[#212c40] hover:bg-[#2d3a52] text-white h-10 rounded-lg text-sm font-semibold shadow-md active:scale-[0.98] transition-all"
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
                        <Label htmlFor="firstName" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input
                            id="firstName"
                            className="pl-8 h-10 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 text-sm"
                            value={signupForm.firstName}
                            onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                         <Label htmlFor="lastName" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input
                            id="lastName"
                            className="pl-8 h-10 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 text-sm"
                            value={signupForm.lastName}
                            onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                       <Label htmlFor="email" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email (Optional)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-8 h-10 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 text-sm"
                          value={signupForm.email || ''}
                          onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                       <Label htmlFor="signupMobileNumber" className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile Number</Label>
                      <div className="flex space-x-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-20 border-gray-200 focus:ring-0 focus:border-[#f48432] focus-visible:ring-0 h-10 text-xs">
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
                          className="flex-1 border-gray-200 focus:border-[#f48432] focus-visible:ring-0 focus:ring-0 h-10 text-sm"
                          value={signupForm.phone}
                          onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-[#f48432] to-[#ff9e5e] hover:from-[#e07020] hover:to-[#f48432] text-white h-10 rounded-lg text-sm font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all mt-1"
                      onClick={handleSendSignupOtp}
                      disabled={!signupForm.phone.trim() || !signupForm.firstName.trim() || !signupForm.lastName.trim() || isLoading}
                    >
                      {isLoading ? "Sending..." : "Create Account"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center relative pt-2">
                        <button 
                          onClick={handleBackToSignupPhone}
                          className="absolute left-0 top-1 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </button>
                        <h2 className="text-base font-bold text-[#212c40]">Verify Number</h2>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Code sent to {countryCode} {signupForm.phone}
                        </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          id="signupOtp"
                          type="text"
                          placeholder="• • • • • •"
                          className={`h-11 border-2 border-gray-100 focus:border-[#f48432] focus-visible:ring-0 focus:ring-4 focus:ring-[#f48432]/10 text-center transition-all duration-300 ${signupForm.otp ? 'text-lg tracking-[0.5em] font-bold text-[#212c40]' : 'text-sm tracking-widest text-gray-400 font-medium'}`}
                          value={signupForm.otp}
                          onChange={(e) => setSignupForm({...signupForm, otp: e.target.value})}
                          maxLength={6}
                        />
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          variant="link" 
                          className="text-[10px] p-0 h-auto text-[#f48432]"
                          onClick={() => handleResendOtp('signup')}
                        >
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-[#212c40] hover:bg-[#2d3a52] text-white h-10 rounded-lg text-sm font-semibold shadow-md active:scale-[0.98] transition-all"
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
    </div>
  );
};

export default Auth;