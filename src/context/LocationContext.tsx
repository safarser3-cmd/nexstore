"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LocationState {
  pincode: string;
  city: string;
  stateName: string;
  isSet: boolean;
}

interface LocationContextType {
  location: LocationState;
  setLocation: (loc: LocationState) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationState>({
    pincode: "",
    city: "",
    stateName: "",
    isSet: false,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setLocationState(JSON.parse(saved));
      } catch (error) {
        console.error("Error parsing saved location", error);
      }
    } else {
      // If no location is saved, open the modal on first visit
      setTimeout(() => setIsModalOpen(true), 1500);
    }
    setIsInitialized(true);
  }, []);

  const setLocation = (loc: LocationState) => {
    setLocationState(loc);
    localStorage.setItem("userLocation", JSON.stringify(loc));
  };

  if (!isInitialized) return null;

  return (
    <LocationContext.Provider value={{ location, setLocation, isModalOpen, setIsModalOpen }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
