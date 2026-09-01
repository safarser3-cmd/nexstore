"use client";

import { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, X, Loader2, CheckCircle2 } from "lucide-react";

export function PincodeModal() {
  const { isModalOpen, setIsModalOpen, setLocation } = useLocation();
  const [pincode, setPincodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fetchedData, setFetchedData] = useState<{city: string, state: string} | null>(null);

  if (!isModalOpen) return null;

  const handleVerify = async () => {
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice.Block !== "NA" ? postOffice.Block : postOffice.District;
        const state = postOffice.State;
        
        setFetchedData({ city, state });
        setSuccess(true);
        
        // Auto-close and save after 1.5s
        setTimeout(() => {
          setLocation({
            pincode,
            city,
            stateName: state,
            isSet: true
          });
          setIsModalOpen(false);
          setSuccess(false); // reset for next time
          setFetchedData(null);
          setPincodeInput("");
        }, 1500);

      } else {
        setError("Invalid PIN code. Delivery might not be available.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={() => setIsModalOpen(false)}
      />
      <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:max-w-md bg-background z-[101] rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full md:slide-in-from-bottom-10 duration-300">
        
        <button 
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Check Delivery</h2>
          <p className="text-sm text-muted-foreground">
            Enter your 6-digit PIN code to check delivery availability and exact shipping times.
          </p>
        </div>

        {!success ? (
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter PIN Code (e.g. 400001)"
                className="h-14 text-center text-lg tracking-widest font-bold border-2 focus-visible:ring-primary rounded-xl"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              {error && <p className="text-destructive text-sm font-semibold mt-2 text-center">{error}</p>}
            </div>
            <Button 
              className="w-full h-14 text-lg font-bold rounded-xl"
              onClick={handleVerify}
              disabled={loading || pincode.length !== 6}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
              ) : (
                "Verify PIN Code"
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Delivery Available!</h3>
            <p className="text-primary font-bold text-lg mt-1">
              {fetchedData?.city}, {fetchedData?.state}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
