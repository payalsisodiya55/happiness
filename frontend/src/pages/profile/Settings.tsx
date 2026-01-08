import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Volume2, Smartphone, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import TopNavigation from "@/components/TopNavigation";

const Settings = () => {
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
        <h1 className="text-lg font-bold text-[#212c40]">Settings</h1>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <div className="mb-6 hidden md:block">
           <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-600 hover:text-[#f48432]" onClick={() => navigate('/profile')}>
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Profile
           </Button>
           <h1 className="text-3xl font-bold text-[#212c40] mt-4">Settings</h1>
           <p className="text-gray-500 mt-1">App preferences and general settings</p>
        </div>

        <Card className="p-6 border-none shadow-sm md:shadow-md bg-white rounded-xl">
           <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Auto-Login</p>
                    <p className="text-sm text-gray-500">Stay logged in on this device</p>
                  </div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Sound Effects</p>
                    <p className="text-sm text-gray-500">Play sounds for notifications</p>
                  </div>
                </div>
                <Switch className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#212c40]">Haptic Feedback</p>
                    <p className="text-sm text-gray-500">Vibrate on interactions</p>
                  </div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="pt-2 space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-red-50 hover:text-red-600 border-gray-200 text-gray-700">
                   <Trash2 className="w-4 h-4 mr-3" />
                   Clear Cache
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 hover:bg-gray-50 hover:text-[#212c40] border-gray-200 text-gray-700">
                   <Info className="w-4 h-4 mr-3" />
                   About App
                </Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
