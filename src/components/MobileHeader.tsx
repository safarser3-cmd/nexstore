"use client";

import { Bell, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/context/LocationContext";

export function MobileHeader() {
  const { location, setIsModalOpen } = useLocation();
  
  return (
    <div className="md:hidden bg-primary text-primary-foreground rounded-b-[2rem] pt-6 pb-8 px-6 shadow-md relative z-10 overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <button className="text-left" onClick={() => setIsModalOpen(true)}>
          <p className="text-xs text-primary-foreground/80 mb-1">Location</p>
          <div className="flex items-center gap-1 font-semibold text-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[150px]">
              {location.isSet ? `${location.pincode} - ${location.city}` : 'Add Pincode'}
            </span>
            <span className="text-xs ml-1">▼</span>
          </div>
        </button>
        <div className="bg-white/20 p-2 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></span>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            className="w-full h-12 pl-12 pr-4 bg-background text-foreground rounded-xl border-none shadow-sm text-base placeholder:text-muted-foreground/60" 
            placeholder="Search" 
          />
        </div>
        <button className="h-12 w-12 bg-background text-primary rounded-xl flex items-center justify-center shadow-sm">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      {/* Decorative subtle background waves (optional approximation) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-10 w-24 h-24 bg-black/5 rounded-full blur-xl -z-10"></div>
    </div>
  );
}
