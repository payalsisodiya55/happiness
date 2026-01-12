import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Search, MapPin, Navigation, ChevronDown } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';
import CarHeroBanner from '@/assets/CarHeroBanner.png';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const timeRef = useRef<HTMLInputElement>(null);
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip' | 'local'>('oneWay');
  const [date, setDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [localPackage, setLocalPackage] = useState('4hrs40km');

  /* Intersection Observer logic to trigger animation on scroll */
  const formRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Store full location objects (with lat/lng)
  const [fromLocationData, setFromLocationData] = useState<any>(null);
  const [toLocationData, setToLocationData] = useState<any>(null);

  useEffect(() => {
    const formObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFormVisible(true);
        } else {
          setIsFormVisible(false); 
        }
      },
      { threshold: 0.1 }
    );

    const textObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTextVisible(true);
        } else {
          setIsTextVisible(false); 
        }
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      formObserver.observe(formRef.current);
    }
    if (textRef.current) {
      textObserver.observe(textRef.current);
    }

    return () => {
      if (formRef.current) formObserver.unobserve(formRef.current);
      if (textRef.current) textObserver.unobserve(textRef.current);
    };
  }, []);

  const handleSearch = () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    // Validation
    if (!fromLocation) {
      newErrors.fromLocation = "Required field";
      isValid = false;
    }

    if (tripType !== 'local' && !toLocation) {
      newErrors.toLocation = "Required field";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Required field";
      isValid = false;
    }

    if (!time) {
      newErrors.time = "Required field";
      isValid = false;
    }

    if (tripType === 'roundTrip' && !returnDate) {
      newErrors.returnDate = "Required field";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields marked in red.",
      });
      return;
    }

    // Navigate to /vihicle-search with state
    navigate('/vihicle-search', {
      state: {
        serviceType: tripType, // 'oneWay' | 'roundTrip' | 'local'
        from: fromLocation,
        to: toLocation,
        pickupDate: date ? date.toISOString() : undefined,
        returnDate: returnDate ? returnDate.toISOString() : undefined,
        pickupTime: time,
        package: (tripType === 'local') ? localPackage : undefined,
        fromData: fromLocationData,
        toData: toLocationData
      }
    });
  };

  return (
    <div className="relative w-full h-[90vh] min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={CarHeroBanner} 
          alt="Premium Car Rental" 
          className="w-full h-full object-cover"
        />
        {/* Subtle dark gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 w-full h-full flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
          
          {/* Left Side Booking Form - Styled like the reference image */}
          <div 
            ref={formRef}
            className={cn(
              "lg:col-span-4 flex flex-col h-full justify-center pt-20 pb-10 relative z-20 transition-all duration-700 ease-out",
              isFormVisible 
                ? "opacity-100 translate-x-0 animate-in slide-in-from-left-10 fade-in" 
                : "opacity-0 -translate-x-10"
            )}
          >
            
            {/* Form Container */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg flex flex-col shadow-2xl">
              
              {/* Tabs */}
              <div className="flex border-b border-white/20 bg-black/40 rounded-t-lg">
                <button
                  onClick={() => { setTripType('oneWay'); setErrors({}); }}
                  className={cn(
                    "flex-1 py-4 text-sm font-semibold tracking-wide transition-all duration-300",
                    tripType === 'oneWay'
                      ? "bg-white text-black"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  One Way Trip
                </button>
                <button
                  onClick={() => { setTripType('roundTrip'); setErrors({}); }}
                  className={cn(
                    "flex-1 py-4 text-sm font-semibold tracking-wide transition-all duration-300 border-l border-r border-white/20",
                    tripType === 'roundTrip'
                      ? "bg-white text-black"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  Round Trip
                </button>
                <button
                  onClick={() => { setTripType('local'); setErrors({}); }}
                  className={cn(
                    "flex-1 py-4 text-sm font-semibold tracking-wide transition-all duration-300",
                    tripType === 'local'
                      ? "bg-white text-black"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  Local Trip
                </button>
              </div>

              {/* Form Content */}
              <div className={cn(
                "flex flex-col transition-all duration-300",
                tripType === 'roundTrip' ? "p-5 gap-4" : "p-6 gap-7 py-8"
              )}>
                
                {/* Pickup Location */}
                <div className="space-y-1 relative">
                  <label className="text-white/70 text-[11px] font-semibold uppercase tracking-wider pl-1">Pick Up Address</label>
                  <LocationAutocomplete
                    value={fromLocation}
                    onChange={(val) => { setFromLocation(val); if(errors.fromLocation) setErrors({...errors, fromLocation: ''}); }}
                    onLocationSelect={setFromLocationData}
                    placeholder="Enter City, Airport, or Address"
                    variant="minimal"
                    className={cn(
                      "w-full bg-transparent border-0 border-b rounded-none text-white text-base placeholder:text-white/40 focus:ring-0 px-0 py-2 h-auto",
                      errors.fromLocation ? "border-red-500" : "border-white/30 focus:border-white"
                    )}
                    icon={null} 
                  />
                  {errors.fromLocation && <span className="text-red-500 text-[10px] absolute right-0 top-0 font-medium">{errors.fromLocation}</span>}
                </div>

                {/* Dropoff Location (Conditional) */}
                {(tripType === 'oneWay' || tripType === 'roundTrip') && (
                  <div className="space-y-1 relative">
                    <label className="text-white/70 text-[11px] font-semibold uppercase tracking-wider pl-1">Drop Off Address</label>
                     <LocationAutocomplete
                      value={toLocation}
                      onChange={(val) => { setToLocation(val); if(errors.toLocation) setErrors({...errors, toLocation: ''}); }}
                      onLocationSelect={setToLocationData}
                      placeholder="Enter City, Airport, or Address"
                      variant="minimal"
                      className={cn(
                        "w-full bg-transparent border-0 border-b rounded-none text-white text-base placeholder:text-white/40 focus:ring-0 px-0 py-2 h-auto",
                        errors.toLocation ? "border-red-500" : "border-white/30 focus:border-white"
                      )}
                      icon={null}
                    />
                     {errors.toLocation && <span className="text-red-500 text-[10px] absolute right-0 top-0 font-medium">{errors.toLocation}</span>}
                  </div>
                )}



                {/* Date & Time Row - 2 Columns */}
                <div className={cn(
                  "grid grid-cols-2",
                  tripType === 'roundTrip' ? "gap-5" : "gap-8"
                )}>
                  
                  {/* Pick Up Date */}
                  <div className="space-y-1 relative">
                     <label className="text-white/70 text-[11px] font-semibold uppercase tracking-wider pl-1">Pick Up Date</label>
                     {errors.date && <span className="text-red-500 text-[10px] absolute right-0 top-0 font-medium">{errors.date}</span>}
                     <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "w-full bg-transparent border-0 border-b rounded-none text-left text-base focus:ring-0 px-0 py-2 h-auto transition-colors flex justify-between items-center group",
                            !date ? "text-white/40" : "text-white",
                            errors.date ? "border-red-500" : "border-white/30 focus:border-white"
                          )}
                        >
                          <span className="truncate">{date ? format(date, "PPP") : "Select Date"}</span>
                          <CalendarIcon className={cn("w-4 h-4 transition-colors flex-shrink-0 ml-2", errors.date ? "text-red-500" : "text-white/50 group-hover:text-white")} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white text-black border-none shadow-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => { setDate(d); if(errors.date) setErrors({...errors, date: ''}); }}
                          initialFocus
                          className="bg-white rounded-md"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Pick Up Time (For One Way & Local default position) or Return Date (For Round Trip) */}
                   {tripType === 'roundTrip' ? (
                      <div className="space-y-1 relative">
                         <label className="text-white/70 text-[11px] font-semibold uppercase tracking-wider pl-1">Return Date</label>
                         {errors.returnDate && <span className="text-red-500 text-[10px] absolute right-0 top-0 font-medium">{errors.returnDate}</span>}
                         <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className={cn(
                                "w-full bg-transparent border-0 border-b rounded-none text-left text-base focus:ring-0 px-0 py-2 h-auto transition-colors flex justify-between items-center group",
                                !returnDate ? "text-white/40" : "text-white",
                                errors.returnDate ? "border-red-500" : "border-white/30 focus:border-white"
                              )}
                            >
                              <span className="truncate">{returnDate ? format(returnDate, "PPP") : "Select Date"}</span>
                              <CalendarIcon className={cn("w-4 h-4 transition-colors flex-shrink-0 ml-2", errors.returnDate ? "text-red-500" : "text-white/50 group-hover:text-white")} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white text-black border-none shadow-xl" align="start">
                            <Calendar
                              mode="single"
                              selected={returnDate}
                              onSelect={(d) => { setReturnDate(d); if(errors.returnDate) setErrors({...errors, returnDate: ''}); }}
                              initialFocus
                              className="bg-white rounded-md"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                   ) : (
                      <div className="space-y-1 relative">
                         <label className="text-white/70 text-[11px] font-semibold uppercase tracking-wider pl-1">Pick Up Time</label>
                         {errors.time && <span className="text-red-500 text-[10px] absolute right-0 top-0 font-medium">{errors.time}</span>}
                         <div className={cn(
                             "relative border-b transition-colors py-2 group",
                             errors.time ? "border-red-500" : "border-white/30 hover:border-white"
                         )}>
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => { setTime(e.target.value); if(errors.time) setErrors({...errors, time: ''}); }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex justify-between items-center text-white text-base">
                              <span className={!time ? "text-white/40" : "text-white"}>
                                {time || "--:--"}
                              </span>
                              <Clock className={cn("w-4 h-4 transition-colors", errors.time ? "text-red-500" : "text-white/50 group-hover:text-white")} />
                            </div>
                         </div>
                      </div>
                   )}
                </div>

                {/* Extra Row for Round Trip Time */}
                {tripType === 'roundTrip' && (
                  <div className="w-full space-y-1 relative">
                     <label className="text-white/70 text-[11px] font-semibold uppercase tracking-wider pl-1">Pick Up Time</label>
                     {errors.time && <span className="text-red-500 text-[10px] absolute right-0 top-0 font-medium">{errors.time}</span>}
                     <div className={cn(
                         "relative border-b transition-colors py-2 group",
                         errors.time ? "border-red-500" : "border-white/30 hover:border-white"
                     )}>
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => { setTime(e.target.value); if(errors.time) setErrors({...errors, time: ''}); }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex justify-between items-center text-white text-base">
                          <span className={!time ? "text-white/40" : "text-white"}>
                            {time || "--:--"}
                          </span>
                          <Clock className={cn("w-4 h-4 transition-colors", errors.time ? "text-red-500" : "text-white/50 group-hover:text-white")} />
                        </div>
                     </div>
                  </div>
                )}

                {/* Search Button */}
                <div className="pt-2"> 
                  <Button 
                    onClick={handleSearch}
                    className="w-full bg-[#f48432] hover:bg-[#d66e22] text-white font-bold text-base py-6 rounded-none uppercase tracking-wide transition-all shadow-lg hover:shadow-orange-500/20"
                  >
                    Search
                  </Button>
                </div>

              </div>
            </div>
          </div>

          {/* Right Side - Empty or Content */}
          <div className="lg:col-span-8 h-full flex flex-col justify-start items-end text-right pt-10">
             <div 
               ref={textRef}
               className={cn(
                 "space-y-4 max-w-2xl pr-8 lg:pr-0 transition-all duration-700 ease-out",
                 isTextVisible 
                   ? "opacity-100 translate-x-0" 
                   : "opacity-0 translate-x-10"
               )}
             >
               <h3 className={cn(
                 "text-[#f48432] font-medium text-xl tracking-wide",
                 isTextVisible && "animate-in fade-in slide-in-from-right-10 duration-700 delay-100"
               )}>we are here for you !</h3>
               <h1 className={cn(
                 "text-5xl md:text-7xl font-bold text-white leading-tight",
                 isTextVisible && "animate-in fade-in slide-in-from-right-10 duration-700 delay-200"
               )}>
                 Search, Book & <br/> Rent Vehicle <br/> Easily
               </h1>
             </div>
          </div>

        </div>

        {/* Bottom Stats - Overlapping like reference */}
        <div className="absolute bottom-16 right-0 left-0 bg-gradient-to-t from-black/80 to-transparent pt-20 pb-8 px-6 md:px-12">
           <div className="container mx-auto">
             <div className="flex flex-wrap justify-end gap-8 md:gap-16 border-t border-white/10 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">+15</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">Years of<br/>Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">+200</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">Satisfied<br/>Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">+150</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">Customers<br/>Returns</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">+100</div>
                  <div className="text-xs text-white/60 uppercase tracking-widest">Cars<br/>Available</div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
