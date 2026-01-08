import { Car, Clock, Sliders, Headset, List, Map } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: <Car className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
      title: "Reliable and Affordable Car Rentals",
      description: "Enjoy competitive pricing and transparent rental agreements with no hidden costs."
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
      title: "On-Time Delivery & Pickup",
      description: "We value your time and ensure prompt and efficient delivery and pickup of your rental vehicle."
    },
    {
      icon: <Sliders className="w-6 h-6 text-white" />,
      color: "bg-green-500",
      title: "Flexible Rental Options",
      description: "We offer flexible rental durations and customizable packages to suit your individual preferences."
    },
    {
      icon: <Headset className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
      title: "Excellent Customer Service",
      description: "Our friendly and knowledgeable team is always available to assist you with any inquiries or concerns."
    },
    {
      icon: <List className="w-6 h-6 text-white" />,
      color: "bg-pink-500",
      title: "Wide Range of Vehicles",
      description: "Choose from a variety of cars to match your budget, style, and travel needs."
    },
    {
      icon: <Map className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
      title: "Intercity Travel Made Easy",
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
    <section ref={sectionRef} className="pt-12 pb-10 bg-[#f8f9fa] relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className={cn(
          "text-center mb-16 transition-all duration-1000 ease-out",
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h2 className="text-3xl md:text-5xl font-bold text-[#212c40] mb-4">
            Our Features
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover why Happiness Car Rental is the preferred choice for thousands of travelers.
          </p>
          <div className="w-20 h-1.5 bg-[#f48432] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Features Grid - Modern Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={cn(
                "group p-8 border-none shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 ease-out hover:-translate-y-2 bg-white rounded-2xl overflow-hidden relative",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[100px] -mr-4 -mt-4 transition-all duration-500 group-hover:scale-150 group-hover:bg-gray-100"></div>

              <div className="relative z-10 flex flex-col items-start h-full">
                {/* Icon Box */}
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#212c40] mb-3 group-hover:text-[#f48432] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm flex-grow">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
