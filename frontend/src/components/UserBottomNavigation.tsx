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
                "flex flex-col items-center justify-center py-3 px-3 min-w-0 flex-1",
                "transition-colors duration-200",
                active
                  ? "text-[#212c40] bg-[#212c40]/10"
                  : "text-[#212c40]/70 hover:text-[#212c40] hover:bg-[#212c40]/5"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mb-1",
                active ? "text-[#212c40]" : "text-[#212c40]/70"
              )} />
              <span className={cn(
                "text-xs font-medium truncate",
                active ? "text-[#212c40]" : "text-[#212c40]/70"
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
