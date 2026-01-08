import { Card } from "@/components/ui/card";
import { ShieldCheck, Clock, Banknote, Award, Timer, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Safe & Sanitized",
      description: "Every car is thoroughly sanitized before delivery ensuring your complete safety and hygiene."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Assistance",
      description: "Round-the-clock roadside assistance and support team to help you anywhere, anytime."
    },
    {
      icon: <Banknote className="w-8 h-8" />,
      title: "Transparent Pricing",
      description: "No hidden charges, zero security deposit options, and honest pricing policies."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Fleet",
      description: "Choose from our wide range of well-maintained, high-quality vehicles for a premium experience."
    },
    {
      icon: <Timer className="w-8 h-8" />,
      title: "Instant Booking",
      description: "Quick and seamless booking process. Get your car in minutes with minimal documentation."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Doorstep Delivery",
      description: "We deliver the car to your doorstep and pick it up, saving you time and hassle."
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
    <section ref={sectionRef} className="pt-20 pb-10 bg-gray-50/50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className={cn(
          "text-center mb-16 transition-all duration-1000 ease-out transform",
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose <span className="text-[#212c40]">Happiness?</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Experience the freedom of self-drive with India's most trusted car rental service.
            We prioritize your comfort, safety, and happiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={cn(
                "group p-8 text-center border-0 shadow-lg bg-white rounded-2xl transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-xl relative overflow-hidden",
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#212c40]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#212c40]/5 rounded-2xl text-[#212c40] mb-6 transition-all duration-500 group-hover:bg-[#212c40] group-hover:text-white group-hover:rotate-6 shadow-sm">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-[#212c40] mb-4 group-hover:text-[#f48432] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-500 leading-relaxed text-base group-hover:text-gray-700 transition-colors duration-300">
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

export default WhyChooseUs;