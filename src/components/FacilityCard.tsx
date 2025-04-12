
import React from "react";
import { Link } from "react-router-dom";
import { Facility } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FacilityCardProps {
  facility: Facility;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/facilities/${facility.id}`}>
        <AspectRatio ratio={16 / 9}>
          <img
            src={facility.image}
            alt={facility.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{facility.name}</h3>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{facility.location}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {facility.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{facility.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({facility.reviews} reviews)
            </span>
          </div>
          <div className="text-sm font-medium">
            {facility.pitches.length} {facility.pitches.length === 1 ? 'pitch' : 'pitches'}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default FacilityCard;
