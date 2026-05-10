import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FutsalNavigation from "@/components/FutsalNavigation";
import FutsalFooter from "@/components/FutsalFooter";
import PitchCard from "@/components/PitchCard";
import { useQuery } from "@tanstack/react-query";
import { getFutsalById, getFutsalInfo, getFutsalLocation, getFutsalMedia, getFutsalPitches, sendContactMessage, getFutsalRatings, getEventMedia, getFutsalFaqs, trackVisitors } from "@/lib/futsalApi";
import { useBooking } from "@/contexts/BookingContext";
import { MapPin, Star, Clock, ArrowLeft, Loader2, CheckCircle2, Phone, Mail, CalendarDays, Navigation2, Facebook, Instagram, Globe, Send, MessageSquare, User, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SentimentBadge from "@/components/SentimentBadge";

const safelyParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};



const FullWidthMap = ({ latitude, longitude, address }: { latitude?: string | number, longitude?: string | number, address: string }) => {
  const hasCoordinates = !!latitude && !!longitude && String(latitude) !== "0" && String(longitude) !== "0";
  const query = hasCoordinates ? `${latitude},${longitude}` : encodeURIComponent(address);
  const finalQuery = query || "Kathmandu";
  const mapUrl = `https://maps.google.com/maps?q=${finalQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div id="location" className="w-full h-[60vh] min-h-[500px] bg-muted relative scroll-mt-16 group">
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
      <div className="absolute bottom-10 left-10 z-20 bg-card/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-border max-w-sm hidden md:block text-foreground">
        <h3 className="font-bold text-xl mb-2 text-foreground flex items-center gap-2">
          <MapPin className="h-5 w-5 text-emerald-500" /> Facility Location
        </h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{address}</p>
        <Button
          className="w-full bg-foreground hover:bg-emerald-600 text-background transition-colors shadow-md rounded-xl h-11"
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

  const [contactMessage, setContactMessage] = useState("");
  const [isSendingContact, setIsSendingContact] = useState(false);

  const { data: baseData, isLoading: baseLoading } = useQuery({ queryKey: ['futsal-base', id], queryFn: () => getFutsalById(id as string), enabled: !!id, retry: false });
  const { data: infoData, isLoading: infoLoading } = useQuery({ queryKey: ['futsal-info', id], queryFn: () => getFutsalInfo(id as string), enabled: !!id, retry: false });
  const { data: locData, isLoading: locLoading } = useQuery({ queryKey: ['futsal-loc', id], queryFn: () => getFutsalLocation(id as string), enabled: !!id, retry: false });
  const { data: homeMediaData, isLoading: homeMediaLoading } = useQuery({ queryKey: ['futsal-media-home', id], queryFn: () => getFutsalMedia(id as string, 'home'), enabled: !!id, retry: false });
  const { data: facilityMediaData, isLoading: facilityMediaLoading } = useQuery({ queryKey: ['futsal-media-facility', id], queryFn: () => getFutsalMedia(id as string, 'facility'), enabled: !!id, retry: false });
  const { data: eventMediaData, isLoading: eventLoading } = useQuery({ queryKey: ['futsal-media-event', id], queryFn: () => getEventMedia(id as string), enabled: !!id, retry: false });
  const { data: pitchMediaData } = useQuery({ queryKey: ['futsal-media-pitch', id], queryFn: () => getFutsalMedia(id as string, 'pitch'), enabled: !!id, retry: false });
  const { data: logoData } = useQuery({ queryKey: ['futsal-media-logo', id], queryFn: () => getFutsalMedia(id as string, 'logo'), enabled: !!id, retry: false });
  const { data: bannerData } = useQuery({ queryKey: ['futsal-media-banner', id], queryFn: () => getFutsalMedia(id as string, 'banner'), enabled: !!id, retry: false });
  const { data: pitchesData, isLoading: pitchesLoading } = useQuery({ queryKey: ['futsal-pitches', id], queryFn: () => getFutsalPitches(id as string), enabled: !!id, retry: false });
  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({ queryKey: ['futsal-ratings', id], queryFn: () => getFutsalRatings(id as string), enabled: !!id, retry: false });
  const { data: faqsData } = useQuery({ queryKey: ['futsal-faqs', id], queryFn: () => getFutsalFaqs(id as string), enabled: !!id, retry: false });

  useEffect(() => {
    if (id) {
      trackVisitors(id).catch(err => console.error("Error tracking visitor:", err));
    }
  }, [id]);

  const isPageLoading = baseLoading || infoLoading || locLoading || pitchesLoading || homeMediaLoading;

  const futsal = baseData?.data;
  const info = infoData?.data?.[0];
  const loc = locData?.data?.[0];
  const reviews = ratingsData?.data?.slice(0, 5) || [];
  const faqs = faqsData?.data || [];

  // Logo & banner
  const logoUrl: string | null = logoData?.data?.url || (logoData?.data?.[0]?.url) || null;
  const bannerUrl: string | null = bannerData?.data?.url || (bannerData?.data?.[0]?.url) || null;

  // Collect images
  const allHomeMedia = homeMediaData?.data || [];
  const homeImageUrls = allHomeMedia.map((m: any) => m.url || m.media_url).filter(Boolean);
  if (homeImageUrls.length === 0) {
    homeImageUrls.push("https://images.unsplash.com/photo-1574629810360-7efbb1925846?q=80&w=1200");
  }

  const allFacilityMedia = facilityMediaData?.data || [];
  const facilityImageUrls = allFacilityMedia.map((m: any) => m.url || m.media_url).filter(Boolean);

  const safeEvents = Array.isArray(eventMediaData) ? eventMediaData : eventMediaData?.data || [];
  const eventImageUrls = safeEvents.map((m: any) => m.url || m.media_url).filter(Boolean);

  const combinedPreviewImages = [...homeImageUrls, ...facilityImageUrls, ...eventImageUrls].slice(0, 10);

  const parsedFacilities = info?.facilities ? safelyParse(info.facilities) || [] : ["Drinking water", "Bathroom", "Parking"];
  const parsedHours = info?.operating_hours ? safelyParse(info.operating_hours) || ["6:00 AM - 10:00 PM"] : ["6:00 AM - 10:00 PM"];
  const socialLinks = info?.social_links ? safelyParse(info.social_links) : null;

  const pitchesArray = pitchesData?.data || [];

  const pitchMediaArray = pitchMediaData?.data || [];

  const dynamicFacility = futsal ? {
    id: String(futsal.id),
    name: futsal.futsalName || "Unknown Futsal Tenant",
    location: loc ? `${loc.address || ''}, ${loc.city || ''}`.replace(/^,\s*/, '') : "Location not provided",
    description: info?.additional_info || "Premium Futsal arena matching strictly maintained grounds standards and top-tier facilities for the best playing experience.",
    images: combinedPreviewImages,
    coverImage: bannerUrl || homeImageUrls[0],
    latitude: loc?.latitude,
    longitude: loc?.longitude,
    contactPhone: futsal.phoneNumber || "+977-9800000000",
    contactEmail: futsal.email || "contact@futsal.com",
    establishedYear: info?.established_year,
    websiteUrl: info?.website_url,
    parkingInfo: info?.parking_info,
    pitches: pitchesArray.map((p: any) => {
      const pitchImageObj = pitchMediaArray.find((media: any) => String(media.pitch_id) === String(p.id));
      const pitchImage = pitchImageObj?.url || pitchImageObj?.media_url || p.media_url || "https://images.unsplash.com/photo-1551946596-ce3ebc2efd97?q=80&w=800";

      return {
        id: String(p.id),
        name: p.name || `Pitch ${p.id}`,
        facilityId: String(futsal.id),
        pricePerHour: Number(p.price_per_hour || 1000),
        isEnabled: Boolean(p.is_active ?? 1),
        image: pitchImage,
        isUnderMaintenance: p.is_active === 0,
        pitch_type: p.pitch_type,
        surface_type: p.surface_type,
        lighting: p.lighting,
        indoor: p.indoor,
        is_active: p.is_active
      };
    }),
    rating: 4.8,
    reviews: 124,
    operating_hours: parsedHours,
    amenities: parsedFacilities
  } : null;

  const handleSelectPitch = (pitchId: string) => {
    navigate(`/futsals/${id}/bookings?pitch=${pitchId}`);
  };

  const handleSendContactMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim() || !id) return;
    setIsSendingContact(true);
    try {
      await sendContactMessage(id as string, contactMessage);
      toast.success("Message sent successfully to the futsal administration!");
      setContactMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please log in or try again later.");
    } finally {
      setIsSendingContact(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 text-foreground">
        <FutsalNavigation />
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 my-auto" />
        <p className="my-auto text-muted-foreground font-semibold mt-0">Loading Futsal Booking Environment...</p>
        <FutsalFooter />
      </div>
    );
  }

  if (!dynamicFacility) {
    return (
      <div className="min-h-screen flex flex-col">
        <FutsalNavigation name="Facility Not Found" />
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center bg-card p-10 rounded-3xl shadow-sm border border-border max-w-md mx-4">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Facility Not Found</h1>
            <p className="text-muted-foreground mb-8">The futsal you are looking for might have been removed or does not exist.</p>
            <Button onClick={() => navigate("/futsals")} className="w-full h-12 rounded-xl">
              Back to Facilities
            </Button>
          </div>
        </div>
        <FutsalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-emerald-500 selection:text-white">
      <FutsalNavigation name={dynamicFacility.name} />


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
            {/* Logo badge overlay */}
            {logoUrl && (
              <div className="w-16 h-16 md:w-20 mb-4 md:h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm">
                <img src={logoUrl} alt="Futsal Logo" className="w-full h-full object-cover" />
              </div>
            )}
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
                  onClick={() => navigate(`/futsals/${id}/bookings`)}
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
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <MessageSquare className="h-5 w-5 md:mr-2 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Message Us</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT & INFO SECTION */}
        <section id="about" className="py-24 bg-background scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

              <div className="space-y-8">
                <div>
                  <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">About The Facility</h4>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-6">
                    A Top-Tier Arena For <br /> Your Next Game
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed pb-4">
                    {dynamicFacility.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                    <Star className="h-6 w-6 text-emerald-500 mb-2" />
                    <h4 className="font-bold text-foreground">Avg. Rating</h4>
                    <p className="text-muted-foreground font-medium">{dynamicFacility.rating} out of 5 ({dynamicFacility.reviews})</p>
                  </div>
                  {dynamicFacility.establishedYear && (
                    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                      <Clock className="h-6 w-6 text-emerald-500 mb-2" />
                      <h4 className="font-bold text-foreground">Established</h4>
                      <p className="text-muted-foreground font-medium">{dynamicFacility.establishedYear}</p>
                    </div>
                  )}
                  {dynamicFacility.parkingInfo && (
                    <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-2 transition-transform hover:-translate-y-1">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mb-2" />
                      <h4 className="font-bold text-foreground">Parking</h4>
                      <p className="text-muted-foreground font-medium">{dynamicFacility.parkingInfo}</p>
                    </div>
                  )}
                </div>
                {/* Operating Hours - Full Width Dedicated Card */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-6 sm:p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl">
                      <Clock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Operating Hours</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">When you can play</p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-border overflow-hidden">
                    {Array.isArray(dynamicFacility.operating_hours) ? (
                      <div className="p-5 text-muted-foreground font-medium">
                        {dynamicFacility.operating_hours.join(", ")}
                      </div>
                    ) : typeof dynamicFacility.operating_hours === 'object' && dynamicFacility.operating_hours !== null ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:p-5">
                        {Object.entries(dynamicFacility.operating_hours)
                          .filter(([k]) => isNaN(Number(k))) // Filter out array-like string keys '0', '1'
                          .map(([day, hours]: [string, any]) => {
                            const isClosed = typeof hours === 'object' && (!hours.open || !hours.close);
                            const timeStr = typeof hours === 'object' && hours !== null
                              ? (isClosed ? 'Closed' : `${hours.open} - ${hours.close}`)
                              : String(hours);
                            return (
                              <div key={day} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-colors">
                                <span className="font-semibold text-foreground capitalize text-sm truncate mr-2">{day}</span>
                                <span className={`font-medium px-3 py-1 rounded-lg text-xs whitespace-nowrap mt-0 ${isClosed || timeStr === 'Closed'
                                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                  }`}>
                                  {timeStr}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="p-5 text-muted-foreground font-medium">
                        {String(dynamicFacility.operating_hours || "6:00 AM - 10:00 PM")}
                      </div>
                    )}
                  </div>
                </div>


              </div>


              {/* RIGHT SIDE (Column 2): Top facilities + Social Links */}
              <div className="space-y-24">
                {/* Facilities Visualized Block */}
                <div className="bg-card p-8 md:p-12 rounded-[3rem] border border-border shadow-inner min-w-0">
                  <div className="mb-8">
                    <h3 className="font-extrabold text-3xl mb-4 text-foreground">Top-Notch Facilities</h3>
                    <div className="flex flex-wrap gap-3">
                      {dynamicFacility.amenities.map((amenity: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-2 bg-background px-4 py-2 rounded-xl text-emerald-700 dark:text-emerald-400 font-medium shadow-sm border border-border transition-transform hover:-translate-y-0.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal scrolling facility images */}
                  <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory pt-2">
                      {facilityImageUrls.length > 0 ? facilityImageUrls.map((img: string, i: number) => (
                        <div key={i} className="min-w-[260px] sm:min-w-[320px] h-[240px] rounded-3xl overflow-hidden snap-center shrink-0 shadow-md border border-border relative group">
                          <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Facility detail" />
                          <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>
                      )) : (
                        <div className="w-full h-[240px] bg-background rounded-3xl flex items-center justify-center text-muted-foreground border border-border">
                          <div className="text-center">
                            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p>No special facility photos</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links Block */}
                {(socialLinks || dynamicFacility.websiteUrl) && (
                  <div className="bg-card mt-12 p-8 md:px-12 py-6 rounded-[3vw] border border-border flex flex-row sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                    <div>
                      <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-1">Connect with us</h4>
                      <h3 className="text-xl font-bold text-foreground">Follow our updates</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks?.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="p-3 bg-background rounded-2xl text-muted-foreground hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-colors shadow-sm border border-border">
                          <Facebook className="h-6 w-6" />
                        </a>
                      )}
                      {socialLinks?.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="p-3 bg-background rounded-2xl text-muted-foreground hover:text-white hover:bg-[#E4405F] hover:border-[#E4405F] transition-colors shadow-sm border border-border">
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {socialLinks?.tiktok && (
                        <a href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="p-3 bg-background rounded-2xl text-muted-foreground hover:text-white hover:bg-black dark:hover:bg-white dark:hover:text-black transition-colors shadow-sm border border-border font-bold flex items-center justify-center">
                          TK
                        </a>
                      )}
                      {dynamicFacility.websiteUrl && (
                        <a href={dynamicFacility.websiteUrl} target="_blank" rel="noreferrer" className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white transition-colors shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                          <Globe className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-24 bg-background scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h4 className="text-emerald-500 font-bold tracking-wider uppercase text-sm mb-3">Facility Overview</h4>
                <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Explore Our Grounds</h2>
              </div>
              <Button onClick={() => navigate(`/futsals/${id}/gallery`)} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-500/10 rounded-full px-6 h-12 font-bold">
                View Full Gallery
              </Button>
            </div>

            {dynamicFacility.images.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {dynamicFacility.images.map((src: string, idx: number) => (
                  <div key={idx} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-muted cursor-pointer" onClick={() => navigate(`/futsals/${id}/gallery`)}>
                    <img src={src} alt="Gallery" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                      <span className="bg-black/50 text-white font-bold px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">View Full Gallery</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-card rounded-3xl border border-border">
                <p className="text-muted-foreground text-lg">No photos have been uploaded for this facility yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* PITCHES SECTION */}
        <section id="pitches" className="py-24 bg-background scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h4 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Reserve Your Spot</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6">Available Pitches</h2>
              <p className="text-muted-foreground text-lg">Select a pitch to navigate to the booking gateway.</p>
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
              <div className="p-16 text-center bg-card rounded-[3rem] border border-border shadow-inner flex flex-col items-center justify-center">
                <div className="h-20 w-20 bg-background text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
                  <CalendarDays className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No Pitches Configured</h3>
                <p className="text-muted-foreground max-w-md text-lg">This facility hasn't added any bookable pitches yet. Please check back later.</p>
              </div>
            )}

            <div className="flex justify-center mt-12">
              <Button
                onClick={() => navigate(`/futsals/${id}/bookings`)}
                className="bg-foreground hover:bg-emerald-600 text-background border-none h-14 px-10 rounded-full shadow-lg font-bold text-lg transition-transform hover:-translate-y-1"
              >
                Go to Booking Portal
              </Button>
            </div>
          </div>
        </section>

        {/* REVIEWS SECTION */}
        <section id="reviews" className="py-24 bg-muted/40 scroll-mt-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h4 className="text-emerald-500 font-bold tracking-wider uppercase text-sm mb-3">Player Feedback</h4>
                <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Recent Reviews</h2>
              </div>
              <Button onClick={() => navigate(`/futsals/${id}/reviews`)} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-500/10 rounded-full px-6 h-12 font-bold">
                See All Reviews
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.length > 0 ? reviews.map((review: any) => (
                <div key={review.id} className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{review.reviewerName || 'Anonymous'}</h4>
                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <SentimentBadge
                        score={review.sentiment_score}
                        label={review.sentiment_label}
                      />
                      <div className="flex gap-1 bg-yellow-50 dark:bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-100 dark:border-yellow-500/20 text-yellow-600 dark:text-yellow-300 font-bold items-center text-sm">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    "{review.review}"
                  </p>
                </div>
              )) : (
                <div className="col-span-full p-12 text-center bg-card rounded-3xl border border-border">
                  <p className="text-muted-foreground text-lg">There are no reviews yet for this facility. Be the first to leave one via the portal.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PREMIUM FAQ SECTION */}
        {faqs.length > 0 && (
          <section id="faq" className="py-32 bg-slate-50 dark:bg-slate-950/20 scroll-mt-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
              <div className="flex flex-col lg:flex-row gap-16 items-start">

                {/* FAQ Header & Visual */}
                <div className="lg:w-1/3 lg:sticky lg:top-32 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <HelpCircle className="h-3.5 w-3.5" /> Assistance Center
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                    Everything you <br />
                    <span className="text-emerald-500">need to know</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                    Find quick answers to common questions about our facilities, booking policies, and player guidelines.
                  </p>

                  <div className="pt-8">
                    <div className="p-10 rounded-[2.5rem] bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group transition-transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <MessageSquare className="h-24 w-24" />
                      </div>
                      <h4 className="text-xl font-bold mb-2 relative z-10">Still have questions?</h4>
                      <p className="text-emerald-50 mb-6 text-sm opacity-90 relative z-10">Our support team is always ready to help you with your inquiries.</p>
                      <Button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-emerald-700 hover:bg-emerald-50 border-none rounded-2xl px-6 h-11 font-bold shadow-sm relative z-10"
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>

                {/* FAQ Questions */}
                <div className="lg:w-2/3 w-full space-y-5">
                  {faqs.map((faq: any, idx: number) => (
                    <div
                      key={faq.id}
                      className="group bg-card hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5 border border-border hover:border-emerald-500/30 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <details className="group peer overflow-hidden">
                        <summary className="flex items-center justify-between p-8 cursor-pointer list-none select-none">
                          <div className="flex items-center gap-6">
                            <span className="flex items-center justify-center h-10 w-10 rounded-2xl bg-muted group-hover:bg-emerald-500/10 text-muted-foreground group-hover:text-emerald-600 font-bold text-sm transition-colors border border-transparent group-hover:border-emerald-500/20 shrink-0">
                              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                            </span>
                            <h3 className="font-bold text-foreground text-lg md:text-xl tracking-tight leading-tight transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                              {faq.question}
                            </h3>
                          </div>
                          <div className="flex items-center justify-center h-10 w-10 rounded-full border border-border group-hover:border-emerald-500/20 group-hover:bg-emerald-500/5 transition-all text-muted-foreground group-open:bg-emerald-500 group-open:text-white group-open:border-emerald-500 group-open:rotate-180 shrink-0">
                            <ChevronDown className="h-5 w-5" />
                          </div>
                        </summary>
                        <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                          <div className="pl-16">
                            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-medium">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 bg-slate-900 scroll-mt-16 relative overflow-hidden">
          {/* Decorative background blurs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-900/40 rounded-full blur-[120px] transform -translate-y-1/2"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <h4 className="text-emerald-400 font-bold tracking-wider uppercase text-sm mb-3">Get In Touch</h4>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Send a Direct Message</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Have a question about {dynamicFacility.name}? Use the form below to send a direct message to the administration team.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSendContactMessage} className="bg-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-xl border border-white/20 shadow-2xl">
                <div className="mb-6 z-20 relative">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-3 ml-2">Your Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-3xl bg-black/40 border border-white/10 text-white placeholder-slate-500 p-6 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none shadow-inner"
                    placeholder="Ask us anything about the facility, bulk bookings, or general inquiries..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-lg shadow-emerald-500/20"
                  disabled={isSendingContact}
                >
                  {isSendingContact ? <Loader2 className="h-6 w-6 animate-spin" /> : <><Send className="mr-2 h-5 w-5" /> Send Message</>}
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* FULL WIDTH MAP SECTION */}
        <FullWidthMap
          latitude={dynamicFacility.latitude}
          longitude={dynamicFacility.longitude}
          address={dynamicFacility.location}
        />

      </main>

      <FutsalFooter />
    </div>
  );
};

export default FacilityDetails;
