import { Button } from "@/components/ui/button";
import { ChevronDown, Globe, HelpCircle, User, Phone, Home, List } from "lucide-react";
import busLogo from "@/assets/Happiness-logo.jpeg";
import { Link, useLocation } from "react-router-dom";

const TopNavigation = () => {
  const location = useLocation();
  const isOnAuthPage = location.pathname === "/auth";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        {/* Top bar removed as requested */}

        {/* Main navigation */}
        <div className="flex justify-between items-center  md:py-1 py-3">
          {/* Mobile Logo + Text */}
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <div className="flex items-center gap-3">
              <div className="relative overflow-hidden rounded-full p-1 transition-transform duration-300 group-hover:scale-105">
                <img 
                  src={busLogo} 
                  alt="Happiness Logo" 
                  className="w-12 h-12 md:w-16 md:h-16 object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold text-[#212c40] tracking-tight leading-none group-hover:text-[#2a3650] transition-colors">
                  Happiness
                </span>
                <span className="text-[10px] md:text-xs text-[#f48432] font-bold tracking-wider uppercase mt-1">
                  COMFORT IN EVERY MILE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links - Centered/Right like reference */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                location.pathname === '/' 
                  ? 'text-[#212c40]' 
                  : 'text-gray-600 hover:text-[#212c40]'
              }`}
            >
              <Home className={`w-5 h-5 ${location.pathname === '/' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>Home</span>
            </Link>
            <Link 
              to="/bookings" 
              className={`flex items-center space-x-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                location.pathname === '/bookings' 
                  ? 'text-[#212c40]' 
                  : 'text-gray-600 hover:text-[#212c40]'
              }`}
            >
              <List className={`w-5 h-5 ${location.pathname === '/bookings' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>Bookings</span>
            </Link>
            <Link 
              to="/help" 
              className={`flex items-center space-x-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                location.pathname === '/help' 
                  ? 'text-[#212c40]' 
                  : 'text-gray-600 hover:text-[#212c40]'
              }`}
            >
              <HelpCircle className={`w-5 h-5 ${location.pathname === '/help' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>Help</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center space-x-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                location.pathname === '/profile' 
                  ? 'text-[#212c40]' 
                  : 'text-gray-600 hover:text-[#212c40]'
              }`}
            >
              <User className={`w-5 h-5 ${location.pathname === '/profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span>Profile</span>
            </Link>
          </div>

          {/* Desktop CTA Button */}


          {/* Mobile Menu Toggle / Helpline */}
           <div className="md:hidden flex items-center pr-2">
              <button 
                onClick={() => window.location.href = "tel:+919171838260"}
                className="flex flex-col items-end text-right"
              >
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Helpline</span>
                <span className="text-xs text-[#212c40] font-bold flex items-center">
                   <Phone className="w-3 h-3 mr-1" />
                   +91 9171838260
                </span>
              </button>
           </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;