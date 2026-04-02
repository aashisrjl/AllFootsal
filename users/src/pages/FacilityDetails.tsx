import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Navigation";
import Footer from "@/components/Footer";
import PitchCard from "@/components/PitchCard";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingSummary from "@/components/BookingSummary";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalInfo, getFutsalLocation, getFutsalMedia, getFutsalPitches } from "@/lib/futsalApi";
import { useBooking } from "@/contexts/BookingContext";
import { MapPin, Star, Clock, ArrowLeft, Loader2, CheckCircle2, Phone, Mail, CalendarDays, Navigation2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const safelyParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
};

const LocalNav = ({ name }: { name: string }) => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const handleScroll = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/futsals")}
            className="md:hidden text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="font-extrabold text-lg text-slate-800 truncate max-w-[150px] sm:max-w-xs cursor-pointer" onClick={() => handleScroll('home')}>
            {name}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Button variant="link" onClick={() => handleScroll('about')} className={`text-sm font-semibold transition-colors px-0 ${active === 'about' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}>About</Button>
          <Button variant="link" onClick={() => handleScroll('gallery')} className={`text-sm font-semibold transition-colors px-0 ${active === 'gallery' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}>Gallery</Button>
          <Button variant="link" onClick={() => handleScroll('pitches')} className={`text-sm font-semibold transition-colors px-0 ${active === 'pitches' ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-500'}`}>Pitches</Button>
          <Button variant="ghost" onClick={() => handleScroll('location')} className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${active === 'location' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'}`}>
            <Navigation2 className="h-4 w-4" /> Location
          </Button>
        </div>
      </div>
    </div>
  );
};

const GalleryCarousel = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  if (!images.length) return null;

  return (
    <div id="gallery" className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[550px] overflow-hidden rounded-[2rem] shadow-2xl group scroll-mt-24 bg-slate-100">
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img src={src} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "bg-emerald-400 w-6" : "bg-white/60 w-2 hover:bg-white"
              }`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FullWidthMap = ({ latitude, longitude, address }: { latitude?: string | number, longitude?: string | number, address: string }) => {
  const hasCoordinates = !!latitude && !!longitude && String(latitude) !== "0" && String(longitude) !== "0";
  const query = hasCoordinates ? `${latitude},${longitude}` : encodeURIComponent(address);
  const finalQuery = query || "Kathmandu";
  const mapUrl = `https://maps.google.com/maps?q=${finalQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div id="location" className="w-full h-[60vh] min-h-[500px] bg-slate-200 relative scroll-mt-16 group mt-16">
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_10px_20px_rgba(0,0,0,0.05)]"></div>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        className="grayscale-[20%] contrast-125 transition-all duration-700 group-hover:grayscale-0"
      ></iframe>
      
      {/* Floating Info Card over the map */}
      <div className="absolute bottom-10 left-10 z-20 bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white max-w-sm hidden md:block">
        <h3 className="font-bold text-xl mb-2 text-slate-800 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-500" /> Facility Location
        </h3>
        <p className="text-slate-500 text-sm mb-4 leading-relaxed">{address}</p>
        <Button 
          className="w-full bg-slate-900 hover:bg-emerald-600 text-white transition-colors shadow-md rounded-xl h-11"
          onClick={() => window.open(`https://maps.google.com/?q=${latitude || ''},${longitude || ''}`, '_blank')}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
};

const FacilityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedDate,
    selectedPitchId,
    setSelectedPitchId,
    availableTimeSlots,
    fetchAvailableTimeSlots
  } = useBooking();

  const { data: baseData, isLoading: baseLoading } = useQuery({ queryKey: ['futsal-base', id], queryFn: () => getFutsalById(id as string), enabled: !!id });
  const { data: infoData, isLoading: infoLoading } = useQuery({ queryKey: ['futsal-info', id], queryFn: () => getFutsalInfo(id as string), enabled: !!id });
  const { data: locData, isLoading: locLoading } = useQuery({ queryKey: ['futsal-loc', id], queryFn: () => getFutsalLocation(id as string), enabled: !!id });
  const { data: mediaData, isLoading: mediaLoading } = useQuery({ queryKey: ['futsal-media', id], queryFn: () => getFutsalMedia(id as string, 'home'), enabled: !!id });
  const { data: pitchesData, isLoading: pitchesLoading } = useQuery({ queryKey: ['futsal-pitches', id], queryFn: () => getFutsalPitches(id as string), enabled: !!id });

  const isPageLoading = baseLoading || infoLoading || locLoading || mediaLoading || pitchesLoading;

  const futsal = baseData?.data;
  const info = infoData?.data?.[0];
  const loc = locData?.data?.[0];
  
  const allMedia = mediaData?.data || [];
  const imageUrls = allMedia.map((m: any) => m.url || m.media_url).filter(Boolean);
  if (imageUrls.length === 0) {
    imageUrls.push("https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=1200");
  }

  const parsedFacilities = info?.facilities ? safelyParse(info.facilities) : ["Drinking water", "Bathroom", "Parking"];
  const parsedHours = info?.operating_hours ? safelyParse(info.operating_hours) : ["6:00 AM - 10:00 PM"];
  const pitchesArray = pitchesData?.data || [];
  
  const dynamicFacility = futsal ? {
    id: String(futsal.id),
    name: futsal.futsalName || "Unknown Futsal Tenant",
    location: loc ? `${loc.address || ''}, ${loc.city || ''}`.replace(/^,\s*/, '') : "Location not provided",
    description: info?.additional_info || "Premium Futsal arena matching strictly maintained grounds standards and top-tier facilities for the best playing experience.",
    images: imageUrls,
    coverImage: imageUrls[0],
    latitude: loc?.latitude,
    longitude: loc?.longitude,
    contactPhone: futsal.phoneNumber || "+977-9800000000",
    contactEmail: futsal.email || "contact@futsal.com",
    pitches: pitchesArray.map((p: any) => ({
      id: String(p.id),
      name: p.name || `Pitch ${p.id}`,
      facilityId: String(futsal.id),
      pricePerHour: Number(p.price_per_hour || 1000),
      isEnabled: Boolean(p.is_active ?? 1),
      image: p.media_url || "https://images.unsplash.com/photo-1551946596-ce3ebc2efd97?q=80&w=800",
      isUnderMaintenance: p.is_active === 0,
    })),
    rating: 4.8,
    reviews: 124,
    operating_hours: parsedHours,
    amenities: parsedFacilities
  } : null;

  const selectedPitch = dynamicFacility?.pitches.find((p: any) => String(p.id) === String(selectedPitchId));

  const handleSelectPitch = (pitchId: string) => {
    setSelectedPitchId(pitchId);
    if (dynamicFacility?.id) {
       fetchAvailableTimeSlots(String(dynamicFacility.id), pitchId, selectedDate);
    }
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const scrollToPitches = () => {
    document.getElementById('pitches')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (selectedPitchId && dynamicFacility?.id) {
      fetchAvailableTimeSlots(String(dynamicFacility.id), selectedPitchId, selectedDate);
    }
  }, [selectedDate, selectedPitchId, dynamicFacility?.id]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Header />
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
        <p className="my-auto text-slate-500 font-semibold mt-0">Loading Futsal Booking Environment...</p>
        <Footer />
      </div>
    );
  }

  if (!dynamicFacility) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-slate-100 max-w-md mx-4">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">Facility Not Found</h1>
            <p className="text-slate-500 mb-8">The futsal you are looking for might have been removed or does not exist.</p>
            <Button onClick={() => navigate("/futsals")} className="w-full h-12 rounded-xl">
              Back to Facilities
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Replaced Global Header inside the main view to keep structure clean, but using a custom one might be cleaner. We kept Global Header, but added LocalNav below it. */}
      {/* The user wants it to look like a specific landing page, so global header is included, but LocalNav creates the anchor scrolling. */}
      <Header />
      <LocalNav name={dynamicFacility.name} />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section id="home" className="relative h-[70vh] min-h-[500px] w-full isolate overflow-hidden">
          <img 
            src={dynamicFacility.coverImage} 
            alt="Facility Cover" 
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-slate-900/80 to-emerald-900/40 mix-blend-multiply z-10" />
          
          <div className="absolute inset-0 flex flex-col justify-center z-20 container mx-auto px-4 md:px-6">
            <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-sm font-semibold tracking-wide mb-6 uppercase shadow-lg">
                <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                Premium Futsal Experience
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl leading-tight">
                {dynamicFacility.name}
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-200 font-light mb-10 max-w-2xl leading-relaxed">
                Step onto the pitch where champions are made. High-quality turf, excellent facilities, and easy booking right at your fingertips.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
                <Button 
                  onClick={scrollToPitches}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white border-none h-14 px-10 rounded-full shadow-xl shadow-emerald-500/30 font-bold text-lg transition-transform hover:-translate-y-1"
                >
                  <CalendarDays className="mr-2 h-6 w-6" /> Book Your Slot Now
                </Button>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none border-white/30 bg-white/5 hover:bg-white hover:text-emerald-900 text-white backdrop-blur-md h-14 px-6 rounded-full transition-all group"
                    onClick={() => window.location.href = `tel:${dynamicFacility.contactPhone}`}
                  >
                    <Phone className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Call Us</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none border-white/30 bg-white/5 hover:bg-white hover:text-emerald-900 text-white backdrop-blur-md h-14 px-6 rounded-full transition-all group"
                    onClick={() => window.location.href = `mailto:${dynamicFacility.contactEmail}`}
                  >
                    <Mail className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Email Us</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT & INFO SECTION */}
        <section id="about" className="py-24 bg-white scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left text column */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">About The Facility</h4>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                    A Top-Tier Arena For <br /> Your Next Game
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed pb-4">
                    {dynamicFacility.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 transition-transform hover:-translate-y-1">
                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Operating Hours</h4>
                      <p className="text-slate-600 text-sm font-medium">{dynamicFacility.operating_hours[0] || "6:00 AM - 10:00 PM"}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 transition-transform hover:-translate-y-1">
                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                      <Star className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Avg. Rating</h4>
                      <p className="text-slate-600 text-sm font-medium">{dynamicFacility.rating} out of 5 ({dynamicFacility.reviews})</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Amenities Box using glass effect and vibrant bg */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-300 rounded-[3rem] transform rotate-3 scale-105 opacity-20 blur-xl blur"></div>
                <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-12 rounded-[3rem] border border-white/50 shadow-2xl relative z-10">
                  <h3 className="font-extrabold text-2xl mb-8 text-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" /> Premium Amenities
                  </h3>
                  <div className="flex flex-col gap-5">
                    {dynamicFacility.amenities.length > 0 ? dynamicFacility.amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 text-emerald-600">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <span className="text-lg text-slate-700 font-semibold">{amenity}</span>
                      </div>
                    )) : (
                      <p className="text-slate-500">No amenities documented yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section className="py-20 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 mb-12 text-center">
            <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Facility Overview</h4>
            <h2 className="text-4xl font-extrabold text-slate-900">Explore Our Grounds</h2>
          </div>
          
          <div className="px-4">
            <GalleryCarousel images={dynamicFacility.images} />
          </div>
        </section>

        {/* PITCHES SECTION */}
        <section id="pitches" className="py-24 bg-white scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Reserve Your Spot</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Available Pitches</h2>
              <p className="text-slate-500 text-lg">Select a pitch to view available time slots and confirm your booking instantly.</p>
            </div>
            
            {dynamicFacility.pitches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {dynamicFacility.pitches.map((pitch: any) => (
                  <PitchCard
                    key={pitch.id}
                    pitch={pitch}
                    onSelectPitch={handleSelectPitch}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner flex flex-col items-center justify-center">
                <div className="h-20 w-20 bg-white text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  <CalendarDays className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">No Pitches Configured</h3>
                <p className="text-slate-500 max-w-md text-lg">This facility hasn't added any bookable pitches yet. Please check back later.</p>
              </div>
            )}

            {/* Booking Flow active section */}
            {selectedPitchId && selectedPitch && (
              <div id="booking-section" className="mt-16 bg-white p-8 md:p-12 rounded-[3rem] border border-emerald-100 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] scroll-mt-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="h-14 w-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-emerald-600 font-semibold tracking-wide text-sm mb-1 uppercase">Booking Flow</h4>
                      <h2 className="text-3xl font-bold text-slate-900">Reserve {selectedPitch.name || `Pitch #${selectedPitch.id}`}</h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    <div className="xl:col-span-2 bg-slate-50/50 p-8 rounded-3xl border border-slate-100 shadow-sm">
                      <TimeSlotPicker timeSlots={availableTimeSlots} />
                    </div>
                    <div className="xl:col-span-1">
                      <BookingSummary
                        facilityId={String(dynamicFacility.id)}
                        facilityName={dynamicFacility.name}
                        pitchName={selectedPitch.name || `Pitch #${selectedPitch.id}`}
                        pricePerHour={selectedPitch.pricePerHour || 1000}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FULL WIDTH MAP SECTION */}
        <FullWidthMap 
          latitude={dynamicFacility.latitude} 
          longitude={dynamicFacility.longitude} 
          address={dynamicFacility.location} 
        />
        
      </main>

      <Footer />
    </div>
  );
};

export default FacilityDetails;
