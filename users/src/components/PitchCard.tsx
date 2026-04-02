import React from "react";
import { Pitch } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Map, Sun } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useBooking } from "@/contexts/BookingContext";

interface PitchCardProps {
  pitch: Pitch;
  onSelectPitch: (pitchId: string) => void;
}

const PitchCard: React.FC<PitchCardProps> = ({ pitch, onSelectPitch }) => {
  const { selectedPitchId } = useBooking();
  const isSelected = selectedPitchId === pitch.id;

  return (
    <Card className={`overflow-hidden transition-all duration-300 group ${
        isSelected 
            ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500 ring-offset-2' 
            : 'border-slate-200 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1'
    } rounded-3xl bg-white`}>
      
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
            <img
                src={pitch.image}
                alt={pitch.name}
                className={`object-cover w-full h-full transition-transform duration-700 ${isSelected ? '' : 'group-hover:scale-105'}`}
            />
        </AspectRatio>

        {/* Floating tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {pitch.is_active === false && (
                <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                    Maintenance
                </span>
            )}
            {pitch.indoor === true && (
                <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                    Indoor
                </span>
            )}
            {pitch.lighting === true && (
                <span className="px-2.5 py-1 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                    <Sun className="h-3 w-3" /> Floodlights
                </span>
            )}
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">{pitch.name}</h3>
                {(pitch.pitch_type || pitch.surface_type) && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 text-sm font-medium">
                        {pitch.pitch_type && (
                            <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-600">{pitch.pitch_type}</span>
                        )}
                        {pitch.surface_type && (
                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                <Map className="h-3 w-3" /> {pitch.surface_type}
                            </span>
                        )}
                    </div>
                )}
            </div>
            
        </div>
        
        <div className="flex items-center gap-1 mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
            <div className="text-emerald-700 font-black text-lg">
                NPR {pitch.pricePerHour}
            </div>
            <div className="text-emerald-600/70 text-sm font-semibold">/ hour</div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          onClick={() => onSelectPitch(pitch.id)} 
          className={`w-full h-12 rounded-xl text-base font-bold transition-all shadow-md ${
             isSelected 
             ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30" 
             : "bg-slate-900 hover:bg-emerald-600 text-white"
          }`}
          disabled={pitch.is_active === false}
        >
          {pitch.is_active === false ? "Unavailable" : isSelected ? "Currently Selected" : "Book this Pitch"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PitchCard;
