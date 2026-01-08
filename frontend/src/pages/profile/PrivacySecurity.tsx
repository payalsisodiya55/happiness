import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Lock, Eye, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import TopNavigation from "@/components/TopNavigation";

const PrivacySecurity = () => {
  const navigate = useNavigate();

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
        <h1 className="text-lg font-bold text-[#212c40]">Privacy & Security</h1>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <div className="mb-6 hidden md:block">
           <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-600 hover:text-[#f48432]" onClick={() => navigate('/profile')}>
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Profile
           </Button>
           <h1 className="text-3xl font-bold text-[#212c40] mt-4">Privacy & Security</h1>
           <p className="text-gray-500 mt-1">Manage your account security and privacy details</p>
        </div>

        <Card className="p-6 border-none shadow-sm md:shadow-md bg-white rounded-xl">
           <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-[#f48432] border-[#f48432] hover:bg-orange-50">Enable</Button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Biometric Login</p>
                    <p className="text-sm text-gray-500">Use fingerprint or face ID</p>
                  </div>
                </div>
                <Switch className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Location Services</p>
                    <p className="text-sm text-gray-500">Allow app to access location</p>
                  </div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Data Sharing</p>
                    <p className="text-sm text-gray-500">Share usage data for improvements</p>
                  </div>
                </div>
                <Switch className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="pt-2 space-y-3">
                <Button variant="outline" className="w-full justify-between h-12 hover:bg-gray-50 hover:text-[#212c40] border-gray-200">
                   Change Password
                   <ChevronRight className="w-4 h-4 text-gray-400" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-12 hover:bg-gray-50 hover:text-[#212c40] border-gray-200">
                   Privacy Policy
                   <ChevronRight className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacySecurity;
