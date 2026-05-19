
import React from "react";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilityCard from "@/components/FacilityCard";
import { useQuery } from "@tanstack/react-query";
import { getAllFutsals, getRecommendedFutsals } from "@/lib/futsalApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Sparkles, Navigation2, X } from "lucide-react";

const Futsals = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [coords, setCoords] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = React.useState<"idle" | "loading" | "ready" | "error">("idle");
  const [locationMessage, setLocationMessage] = React.useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ['futsals'],
    queryFn: getAllFutsals
  });

  const {
    data: recommendedData,
    isLoading: recommendedLoading,
    isError: recommendedError,
  } = useQuery({
    queryKey: ['recommended-futsals', coords?.latitude, coords?.longitude],
    queryFn: () => getRecommendedFutsals({ latitude: coords!.latitude, longitude: coords!.longitude, limit: 6 }),
    enabled: Boolean(coords),
    retry: false,
  });

  const fetchedFacilities = data?.data || [];
  const recommendedFacilities = recommendedData?.data || [];

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage("Geolocation is not supported in this browser.");
      return;
    }

    setLocationStatus("loading");
    setLocationMessage("Fetching your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("ready");
        setLocationMessage("Using your live location for recommendations.");
      },
      (error) => {
        setLocationStatus("error");
        setLocationMessage(error.message || "Unable to access your location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Transform base futsal data into expected Facility format for the Card
  const dynamicFacilities = fetchedFacilities.map((f: any) => ({
    id: String(f.id),
    name: f.futsalName || "Unknown Futsal",
    location: `${f.location?.address || ''} ${f.location?.city || ''} ${f.location?.district || ''} ${f.location?.full_address || ''}`.trim() || f.location?.full_address || "Nepal",
    description: "Experience professional futsal matches near you.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=800&auto=format&fit=crop",
    pitches: [],
    rating: 5.0,
    reviews: 0,
    isUnderMaintenance: f.isActive === false,
    maintenanceReason: "Inactive Tenant"
  }));

  // Filter facilities based on search term
  const filteredFacilities = dynamicFacilities.filter((facility: any) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recommendedCards = recommendedFacilities.map((f: any) => ({
    id: String(f.id),
    name: f.futsalName || "Unknown Futsal",
    location: f.location?.full_address || f.location?.address || f.location?.city || "Near you",
    description: `Distance: ${Number(f.metrics?.distanceKm || 0).toFixed(1)} km • Positive reviews and bookings ranked higher.`,
    image: "https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=800&auto=format&fit=crop",
    pitches: [],
    rating: Number(f.metrics?.avgRating || 0) || 0,
    reviews: Number(f.metrics?.totalReviews || 0),
    isUnderMaintenance: f.isActive === false,
    maintenanceReason: "Inactive Tenant",
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="flex-1 pt-24">

        {/* Floating Search Action */}
        <div className="container mx-auto px-4 md:px-6 pb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight">All Futsals</h1>
              <p className="text-muted-foreground mt-2 text-lg">Discover premium environments near you.</p>
            </div>

            <div className="flex items-center gap-3 self-start">
              {/* Expandable Search Button (Top Left of actions area) */}
              <div className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-64 md:w-80' : 'w-10'}`}>
                {isSearchExpanded ? (
                  <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 transition-colors group-focus-within:text-emerald-600" />
                    <Input
                      autoFocus
                      placeholder="Search Venue..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => { if (!searchTerm) setIsSearchExpanded(false); }}
                      className="pl-9 pr-10 h-10 w-full rounded-full border-emerald-500/20 bg-card/50 backdrop-blur-sm ring-emerald-500/10 transition-all focus:ring-emerald-500/20 focus:border-emerald-500/40"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => { setSearchTerm(""); setIsSearchExpanded(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsSearchExpanded(true)}
                    className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Recommend Action Button */}
              <Button
                onClick={requestLocation}
                className="h-10 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Navigation2 className="h-4 w-4 mr-2" />
                Recommend
              </Button>
            </div>
          </div>

          {/* Recommended section - Always show something if location is requested or active */}
          {(coords || locationStatus === "loading") && (
            <div className="mb-14 rounded-[2.5rem] border border-emerald-500/10 bg-emerald-500/5 p-6 md:p-10 shadow-sm transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold uppercase tracking-wide text-sm">Recommended Futsals</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Discover Top Rated Venues</h2>
                  <p className="text-muted-foreground mt-2">
                    Personalized results based on ratings, reviews, and nearby availability.
                  </p>
                </div>
                <Button variant="outline" onClick={requestLocation} disabled={locationStatus === "loading"}>
                  {locationStatus === "loading" ? "Updating..." : "Refresh location"}
                </Button>
              </div>

              {recommendedLoading ? (
                <div className="flex justify-center items-center py-12 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
                  <span>Loading recommendations...</span>
                </div>
              ) : recommendedError ? (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-amber-700 dark:text-amber-300">
                  Could not load recommendations. Showing all futsals below.
                </div>
              ) : recommendedCards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-start">
                  {recommendedCards.map((facility: any) => (
                    <FacilityCard key={`recommended-${facility.id}`} facility={facility} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground">
                  No personalized recommendations yet. Tap the button above to enable location.
                </div>
              )}
            </div>
          )}

          {/* Facilities Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-24 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
              <span className="text-muted-foreground">Loading Futsals...</span>
            </div>
          ) : filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-start">
              {filteredFacilities.map((facility: any) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No facilities found matching "{searchTerm}".
              </p>
              <p className="text-muted-foreground/70 mt-2">
                Try a different search term or browse all facilities.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Futsals;
