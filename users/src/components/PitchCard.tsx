
import React from "react";
import { Pitch } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
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
    <Card className={`overflow-hidden transition-all ${isSelected ? 'border-green-500 shadow-md' : 'hover:shadow-sm'}`}>
      <AspectRatio ratio={16 / 9}>
        <img
          src={pitch.image}
          alt={pitch.name}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{pitch.name}</h3>
        <p className="text-sm text-green-600 font-medium mt-1">
          NPR {pitch.pricePerHour} per hour
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onSelectPitch(pitch.id)} 
          variant={isSelected ? "default" : "outline"}
          className="w-full gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          {isSelected ? "Selected" : "Book this Pitch"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PitchCard;
