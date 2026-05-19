
import React from "react";
import { Link } from "react-router-dom";
import { Facility } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Star, Trophy, ArrowRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import { getFutsalLocation, getFutsalMedia, getFutsalPitches, getFutsalRatings } from "@/lib/futsalApi";

interface FacilityCardProps {
  facility: any;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  const futsalId = String(facility.id);

  const { data: locData } = useQuery({ queryKey: ['futsal-loc', futsalId], queryFn: () => getFutsalLocation(futsalId) });
  const { data: mediaData } = useQuery({ queryKey: ['futsal-media-logo', futsalId], queryFn: () => getFutsalMedia(futsalId, 'logo') });
  const { data: pitchesData } = useQuery({ queryKey: ['futsal-pitches', futsalId], queryFn: () => getFutsalPitches(futsalId) });
  const { data: ratingsData } = useQuery({ queryKey: ['futsal-ratings', futsalId], queryFn: () => getFutsalRatings(futsalId) });

  const loc = locData?.data?.[0];
  const mediaObj = mediaData?.data?.url ? mediaData.data : (mediaData?.data?.[0] || null);
  const pitches = pitchesData?.data || [];
  const ratings = ratingsData?.data || [];

  const locationStr = loc ? `${loc.address || ''}, ${loc.city || ''}` : facility.location;
  const imageUrl = mediaObj?.url || mediaObj?.media_url || facility.image;

  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc: number, curr: any) => acc + Number(curr.rating), 0) / ratings.length).toFixed(1)
    : "5.0";
  const positiveCount = ratings.filter((rating: any) => String(rating.sentiment_label || '').toLowerCase() === 'positive').length;
  const negativeCount = ratings.filter((rating: any) => String(rating.sentiment_label || '').toLowerCase() === 'negative').length;

  return (
    <Card className="group overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-950/80 border-border/50 dark:border-white/10 bg-card dark:bg-zinc-900/50 backdrop-blur-sm hover:-translate-y-1.5">
      <Link to={`/futsals/${facility.id}`}>
        <AspectRatio ratio={16 / 9} className="overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={facility.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium border border-white/20 shadow-lg">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>{avgRating} ({ratings.length} reviews)</span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border border-white/20 shadow-lg">
            <span className="text-emerald-300">+{positiveCount}</span>
            <span className="text-rose-300">-{negativeCount}</span>
          </div>
        </AspectRatio>
        <CardContent className="p-5">
          <h3 className="font-bold text-xl text-foreground line-clamp-1 group-hover:text-emerald-500 transition-colors">{facility.name}</h3>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium">{locationStr}</span>
          </div>
          <p className="text-sm text-muted-foreground/80 mt-3 line-clamp-2 leading-relaxed">
            {facility.description}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-border mt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 mt-4">
            <div className="bg-emerald-500/15 text-emerald-500 p-1.5 rounded-lg">
              <Trophy className="h-4 w-4" />
            </div>
            {pitches.length} {pitches.length === 1 ? 'Pitch' : 'Pitches'} Available
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm font-bold text-emerald-500 group-hover:translate-x-1 transition-transform">
            Book Now <ArrowRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default FacilityCard;
