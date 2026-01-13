
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format, parse, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThemedDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
}

export function ThemedDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  minDate
}: ThemedDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (isValid(d)) {
        setDate(d);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
        // Format to YYYY-MM-DD to match input type="date" behavior
      onChange(format(newDate, "yyyy-MM-dd"));
      setOpen(false);
    } else {
      onChange("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-start text-left font-semibold p-0 h-auto text-[10px] bg-transparent hover:bg-transparent hover:text-inherit",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border-0 shadow-xl rounded-xl overflow-hidden" align="start">
        <div className="bg-[#212c40] p-3 text-white text-center font-bold">
           {date ? format(date, "MMMM yyyy") : "Select Date"}
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(d) => minDate ? d < minDate : false}
          initialFocus
          className="p-3"
          classNames={{
            day_selected: "bg-[#29354c] text-white hover:bg-[#29354c] hover:text-white focus:bg-[#29354c] focus:text-white",
            day_today: "bg-gray-100 text-[#29354c] font-bold",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

interface ThemedTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ThemedTimePicker({
  value,
  onChange,
  placeholder = "Pick time",
  className,
}: ThemedTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState({ hour: "12", minute: "00", period: "AM" as "AM" | "PM" });

  useEffect(() => {
    if (value && value.includes(":")) {
      const [hStr, m] = value.split(":");
      let h = parseInt(hStr, 10);
      let period: "AM" | "PM" = "AM";

      if (h >= 12) {
        period = "PM";
        if (h > 12) h -= 12;
      }
      if (h === 0) h = 12;

      setTime({ 
        hour: h.toString().padStart(2, "0"), 
        minute: m, 
        period 
      });
    }
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => 
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const handleTimeChange = (type: "hour" | "minute" | "period", val: string) => {
    const newTime = { ...time, [type]: val };
    setTime(newTime);
    
    // Convert back to 24h format for onChange
    let h = parseInt(newTime.hour, 10);
    if (newTime.period === "PM" && h !== 12) h += 12;
    if (newTime.period === "AM" && h === 12) h = 0;
    
    onChange(`${h.toString().padStart(2, "0")}:${newTime.minute}`);
  };

  // Helper to format display value
  const getDisplayValue = () => {
    if (!value) return null;
    return `${time.hour}:${time.minute} ${time.period}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full justify-start text-left font-semibold p-0 h-auto text-[10px] bg-transparent hover:bg-transparent hover:text-inherit",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? getDisplayValue() : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-white border-0 shadow-xl rounded-xl overflow-hidden" align="start">
        <div className="bg-[#212c40] p-2 flex justify-between items-center text-white font-bold px-4 text-xs">
           <span>Hr</span>
           <span>Min</span>
           <span>Am/Pm</span>
        </div>
        <div className="flex h-40">
           {/* Hours Column */}
           <ScrollArea className="w-1/3 border-r border-gray-100">
              <div className="p-1 flex flex-col gap-0.5">
                 {hours.map((h) => (
                    <button
                       key={h}
                       onClick={() => handleTimeChange("hour", h)}
                       className={cn(
                          "w-full py-1.5 text-center rounded-lg text-xs transition-all hover:bg-gray-100",
                          time.hour === h ? "bg-[#29354c] text-white hover:bg-[#29354c] font-bold" : "text-gray-600"
                       )}
                    >
                       {h}
                    </button>
                 ))}
              </div>
           </ScrollArea>
           
           {/* Minutes Column */}
           <ScrollArea className="w-1/3 border-r border-gray-100">
              <div className="p-1 flex flex-col gap-0.5">
                 {minutes.map((m) => (
                    <button
                       key={m}
                       onClick={() => handleTimeChange("minute", m)}
                       className={cn(
                          "w-full py-1.5 text-center rounded-lg text-xs transition-all hover:bg-gray-100",
                          time.minute === m ? "bg-[#29354c] text-white hover:bg-[#29354c] font-bold" : "text-gray-600"
                       )}
                    >
                       {m}
                    </button>
                 ))}
              </div>
           </ScrollArea>

           {/* Period Column */}
           <ScrollArea className="w-1/3">
              <div className="p-1 flex flex-col gap-1 h-full justify-center">
                 {periods.map((p) => (
                    <button
                       key={p}
                       onClick={() => handleTimeChange("period", p)}
                       className={cn(
                          "w-full py-2 text-center rounded-lg text-xs transition-all hover:bg-gray-100 mb-1",
                          time.period === p ? "bg-[#f48432] text-white hover:bg-[#f48432] font-bold" : "text-gray-600"
                       )}
                    >
                       {p}
                    </button>
                 ))}
              </div>
           </ScrollArea>
        </div>
        <div className="p-1.5 border-t border-gray-100">
           <Button 
             className="w-full bg-[#f48432] hover:bg-[#e07020] text-white h-7 text-xs font-bold"
             onClick={() => setOpen(false)}
           >
             Done
           </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
