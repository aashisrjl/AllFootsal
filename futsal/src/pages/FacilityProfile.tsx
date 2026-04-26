import { useState, useEffect } from 'react';
import { Building2, MapPin, Clock, Star, Edit, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const FacilityProfile = () => {
  const { futsalProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facility, setFacility] = useState({
    name: 'Elite Sports Arena',
    location: 'Not specified',
    description: 'Premium futsal facility with state-of-the-art pitches and modern amenities.',
    rating: '4.8',
    reviews: 156,
    amenities: ['Parking', 'Changing Rooms', 'Cafeteria', 'Equipment Rental', 'Wi-Fi'],
    operatingHours: {
      weekdays: '6:00 AM - 11:00 PM',
      weekends: '7:00 AM - 12:00 AM'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@elitesportsarena.com'
    }
  });

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      if (!futsalProfile?.id) return;
      
      try {
        setLoading(true);
        const nextData = { ...facility };
        if (futsalProfile.futsalName) nextData.name = futsalProfile.futsalName;
        if ((futsalProfile as any).description) nextData.description = (futsalProfile as any).description;
        if (futsalProfile.phoneNumber) nextData.contact.phone = futsalProfile.phoneNumber;
        if (futsalProfile.email) nextData.contact.email = futsalProfile.email;

        const locRes = await api.get('/futsal-location').catch(() => null);
        if (locRes?.data?.success && locRes.data.data?.length > 0) {
          const loc = locRes.data.data[0];
          nextData.location = loc.address || loc.full_address || loc.district || nextData.location;
        }

        const infoRes = await api.get(`/futsal/${futsalProfile.id}/info/`).catch(() => null);
        if (infoRes?.data?.success && infoRes.data.data?.length > 0) {
          const info = infoRes.data.data[0];
          try {
            const parsedFacilities = typeof info.facilities === 'string' ? JSON.parse(info.facilities) : info.facilities;
            if (Array.isArray(parsedFacilities) && parsedFacilities.length > 0) nextData.amenities = parsedFacilities;
          } catch(e) {}
          try {
            const parsedHours = typeof info.operating_hours === 'string' ? JSON.parse(info.operating_hours) : info.operating_hours;
            if (parsedHours && (parsedHours.weekdays || parsedHours.weekends)) nextData.operatingHours = { ...nextData.operatingHours, ...parsedHours };
          } catch(e) {}
          if (info.additional_info) nextData.description = info.additional_info;
        }

        const analyticsRes = await api.get('/futsal/analytics/fetch').catch(() => null);
        if (analyticsRes?.data?.success) {
           nextData.rating = parseFloat(analyticsRes.data.data?.averageRating || '0').toFixed(1);
           nextData.reviews = analyticsRes.data.data?.totalBookings || 156;
        }

        setFacility(nextData);
      } catch (error) {
        console.error("Error fetching facility", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilityDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [futsalProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Facility Profile</h1>
           <p className="text-slate-400 mt-1 text-sm font-medium">View and manage your public venue details.</p>
        </div>
        <button className="flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 relative overflow-hidden group">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10 relative z-10">
            <div className="w-32 h-32 bg-slate-800/80 border-2 border-slate-700/50 shadow-2xl rounded-3xl flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 transition-colors duration-500">
              <Building2 className="h-14 w-14 text-emerald-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black text-white mb-3 tracking-tight">{facility.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-slate-400 mb-5">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1.5 text-rose-400" />
                  {facility.location}
                </div>
                <div className="flex items-center text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shadow-sm">
                  <Star className="h-4 w-4 mr-1.5 fill-amber-400" />
                  {facility.rating} ({facility.reviews} reviews)
                </div>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed max-w-2xl text-sm md:text-base">{facility.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-8 border-t border-slate-800/80">
            {/* Amenities */}
            <div>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-5">Amenities Included</h3>
              <div className="flex flex-wrap gap-2.5">
                {facility.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1.5 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-700 hover:text-white transition-colors cursor-default">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-5">Operating Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50 shadow-inner group-hover:border-slate-600 transition-colors">
                  <div className="p-2.5 bg-slate-900 rounded-lg mr-4 shadow-sm border border-slate-800">
                    <Clock className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weekdays</p>
                    <span className="text-sm font-black text-slate-200">{facility.operatingHours.weekdays}</span>
                  </div>
                </div>
                <div className="flex items-center bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/50 shadow-inner group-hover:border-slate-600 transition-colors">
                  <div className="p-2.5 bg-slate-900 rounded-lg mr-4 shadow-sm border border-slate-800">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weekends</p>
                    <span className="text-sm font-black text-slate-200">{facility.operatingHours.weekends}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 hover:border-slate-700 transition-colors">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800/80 pb-4">Contact Information</h3>
            <div className="space-y-5">
              <div className="flex items-center group/contact">
                <div className="p-2.5 bg-slate-800/80 rounded-xl mr-4 border border-slate-700 group-hover/contact:border-emerald-500/50 transition-colors shadow-inner">
                   <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Support Phone</p>
                  <p className="text-sm font-black text-slate-200 group-hover/contact:text-white transition-colors">{facility.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center group/contact">
                 <div className="p-2.5 bg-slate-800/80 rounded-xl mr-4 border border-slate-700 group-hover/contact:border-blue-500/50 transition-colors shadow-inner">
                   <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-black text-slate-200 truncate group-hover/contact:text-white transition-colors" title={facility.contact.email}>{facility.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 hover:border-slate-700 transition-colors">
             <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800/80 pb-4">Quick Insights</h3>
            <div className="space-y-1">
              {[
                { label: "Total Bookings", val: "1,234" },
                { label: "This Month", val: "156", highlight: true },
                { label: "Revenue (MTD)", val: "$7,800", color: "text-emerald-400" },
                { label: "Active Pitches", val: "4" }
              ].map((s, i) => (
                <div key={i} className="flex flex-col py-3.5 border-b border-slate-800/50 last:border-0 last:pb-0 group/stat cursor-default">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/stat:text-slate-400 transition-colors">{s.label}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xl font-black ${s.color || 'text-slate-200'} group-hover/stat:scale-105 transition-transform origin-left`}>{s.val}</span>
                    {s.highlight && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest shadow-sm">High Vol</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityProfile;