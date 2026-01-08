import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Notification preferences saved!",
      variant: "default",
    });
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
        <h1 className="text-lg font-bold text-[#212c40]">Notifications</h1>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
        <div className="mb-6 hidden md:block">
           <Button variant="ghost" className="pl-0 hover:bg-transparent text-gray-600 hover:text-[#f48432]" onClick={() => navigate('/profile')}>
             <ArrowLeft className="w-4 h-4 mr-2" />
             Back to Profile
           </Button>
           <h1 className="text-3xl font-bold text-[#212c40] mt-4">Notifications</h1>
           <p className="text-gray-500 mt-1">Manage your notification preferences</p>
        </div>

        <Card className="p-6 border-none shadow-sm md:shadow-md bg-white rounded-xl">
           <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div>
                  <p className="font-semibold text-[#212c40]">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications on your device</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div>
                  <p className="font-semibold text-[#212c40]">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive booking confirmations via email</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <div>
                  <p className="font-semibold text-[#212c40]">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via SMS</p>
                </div>
                <Switch className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#212c40]">Promotional Offers</p>
                  <p className="text-sm text-gray-500">Receive special offers and discounts</p>
                </div>
                <Switch className="data-[state=checked]:bg-[#f48432]" />
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-[#f48432] hover:bg-[#d66e22] text-white font-semibold py-6 shadow-md transition-all hover:-translate-y-0.5"
                  onClick={handleSave}
                >
                  Save Preferences
                </Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
