
import React from "react";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import FacilityCard from "@/components/FacilityCard";
import { useQuery } from "@tanstack/react-query";
import { getAllFutsals } from "@/lib/futsalApi";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Futsals = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['futsals'],
    queryFn: getAllFutsals
  });

  const fetchedFacilities = data?.data || [];

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">

        {/* Banner */}
        <div className="bg-emerald-900 border-b border-emerald-800 py-16 px-4 md:px-6 mb-8 mt-20 text-center bg-[url('https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=1200')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Find Your Next Match</h1>
            <p className="text-emerald-100 text-lg md:text-xl mb-8">Discover and book premium Futsal environments across the city instantly.</p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto shadow-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search by futsal name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 text-lg rounded-2xl border-0 ring-4 ring-emerald-500/20 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto pb-16 px-4 md:px-6">

          {/* Facilities Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-24 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
              Loading Futsals...
            </div>
          ) : filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility: any) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">
                No facilities found matching "{searchTerm}".
              </p>
              <p className="text-gray-600 mt-2">
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
