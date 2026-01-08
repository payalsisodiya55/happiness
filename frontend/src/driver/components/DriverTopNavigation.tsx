import { Button } from "@/components/ui/button";
import { ChevronDown, Globe, HelpCircle, Phone } from "lucide-react";
import busLogo from "@/assets/BusLogo.png";
import { Link } from "react-router-dom";

const DriverTopNavigation = () => {
  return (
    <nav className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main navigation - Logo only */}
        <div className="flex justify-between items-center py-3">
          <Link to="/driver" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="flex items-center">
              {/* Logo Icon */}
              <img src="/src/assets/Happiness-logo-removebg-preview.png" alt="Chalo Sawari" className="h-10 w-auto object-contain" />
              {/* Logo Text - Matching the image */}
              <div className="flex flex-col ml-2 justify-center">
                <span className="text-2xl font-bold text-[#29354c] leading-none">Happiness</span>
                <span className="text-[0.6rem] font-bold text-[#f48432] tracking-wider uppercase mt-0.5">COMFORT IN EVERY MILE</span>
              </div>
            </div>
          </Link>

          {/* Right side icons/buttons if needed, for now keeping it clean as per image */}
        </div>
      </div>
    </nav>
  );
};

export default DriverTopNavigation; 