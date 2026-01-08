import { Car, Briefcase, Plane, Building2, CalendarRange, MapPinned } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const OurServices = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const services = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Car Hire For Outstation",
      description: "We have a large fleet of cars to give on hire for outstation which are luxurious as well as economical for our clients."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Business Travel",
      description: "Planning to rent a car? Just contact us & try our reliable car rental service to travel in style & luxury."
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Airport Pickup & Drop",
      description: "Travelling to a new city? Don't worry. We also offer hassle-free pick up and drop to and from the airport, anytime."
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Company Pickup & Drop",
      description: "Convenient and professional car services for employee transportation, tailored to corporate needs and schedules."
    },
    {
      icon: <CalendarRange className="w-8 h-8" />,
      title: "Monthly Fixed Package",
      description: "Affordable and flexible monthly car rental plans for regular pickup and drop services, customized for you."
    },
    {
      icon: <MapPinned className="w-8 h-8" />,
      title: "Intercity Pickup Drop",
      description: "Seamless, affordable rides between cities with dependable service for hassle-free travel experiences."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pt-10 pb-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-1000 ease-out",
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#212c40]">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            We offer a wide range of professional car rental services to suit your every need, whether you're traveling for business, pleasure, or long-term convenience.
          </p>
          <div className="w-24 h-1.5 bg-[#f48432] mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={cn(
                "group p-10 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-orange-100",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#212c40] mb-6 group-hover:bg-[#f48432] group-hover:text-white group-hover:rotate-3 transition-all duration-300">
                {service.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold mb-4 text-[#212c40] group-hover:text-[#f48432] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm group-hover:text-gray-600 transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurServices;
