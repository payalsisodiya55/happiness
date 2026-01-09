import { Link, useLocation } from "react-router-dom";
import { 
  Home,
  List,
  HelpCircle,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const UserBottomNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Bookings",
      href: "/bookings",
      icon: List,
    },
    {
      title: "Help",
      href: "/help",
      icon: HelpCircle,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  const isActive = (href: string) => {
    const currentPath = location.pathname;
    
    // For exact matches
    if (currentPath === href) {
      return true;
    }
    
    // For home route, only match exact path
    if (href === "/") {
      return currentPath === "/";
    }
    
    // For other routes, match if it starts with the href
    if (href !== "/") {
      return currentPath.startsWith(href);
    }
    
    return false;
  };

  return (
    <>
      {/* White background to fill the gap below navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-4 bg-white z-40"></div>
      
      <div className="md:hidden fixed bottom-4 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg rounded-t-lg">
        <div className="flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 relative group",
                "transition-all duration-300 ease-in-out",
                active
                  ? "text-[#f48432]"
                  : "text-gray-400 hover:text-[#212c40] hover:bg-gray-50/50"
              )}
            >
              {active && (
                 <span className="absolute top-0 w-8 h-1 bg-[#f48432] rounded-b-full shadow-[0_2px_8px_rgba(244,132,50,0.4)] transition-all duration-300"></span>
              )}
              
              <Icon 
                className={cn(
                  "w-6 h-6 mb-1 transition-all duration-300",
                  active ? "text-[#f48432] scale-110 drop-shadow-sm" : "text-gray-400 group-hover:text-[#212c40]"
                )} 
                strokeWidth={active ? 2.5 : 2}
                fill="none"
                stroke="currentColor"
              />
              
              <span className={cn(
                "text-[10px] font-medium truncate transition-all duration-300",
                active ? "font-bold text-[#f48432]" : "text-gray-400 group-hover:text-[#212c40]"
              )}>
                {item.title}
              </span>
            </Link>
          );
        })}
        </div>
      </div>
    </>
  );
};

export default UserBottomNavigation;
