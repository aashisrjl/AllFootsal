
import React from "react";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilityCard from "@/components/FacilityCard";
import { useQuery } from "@tanstack/react-query";
import { getAllFutsals, getRecommendedFutsals } from "@/lib/futsalApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Sparkles, Navigation2 } from "lucide-react";

const Futsals = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
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
    location: "Nepal", // Extend API to include joined location later
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

      <main className="flex-1">

        {/* Banner */}
        <div className="bg-emerald-900 border-b border-emerald-800 py-16 px-4 md:px-6 mb-8 mt-20 text-center bg-[url('https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=1200')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Find Your Next Match</h1>
            <p className="text-emerald-100 text-lg md:text-xl mb-8">Discover and book premium futsal environments across the city instantly.</p>

            <div className="flex flex-col items-center gap-3 mb-8">
              <Button
                onClick={requestLocation}
                className="rounded-full bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg px-6"
              >
                <Navigation2 className="h-4 w-4 mr-2" />
                Show futsals near me
              </Button>
              <div className="flex items-center gap-2 text-emerald-100 text-sm flex-wrap justify-center">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  Browser location only
                </Badge>
                <span>{locationMessage}</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto shadow-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search by futsal name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg rounded-2xl border-0 ring-4 ring-emerald-500/20 bg-card text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto pb-16 px-4 md:px-6">

          {/* Recommended section */}
          {coords && (
            <div className="mb-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold uppercase tracking-wide text-sm">Recommended for you</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nearest, most loved, and most booked futsals</h2>
                  <p className="text-muted-foreground mt-2">
                    Ranked using your location, sentiment from reviews, and booking popularity.
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
