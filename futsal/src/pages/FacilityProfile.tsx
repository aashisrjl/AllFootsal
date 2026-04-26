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

  useEffect(() => {
    void fetchFacilityData();
  }, [futsalProfile?.id]);

  const validateLocation = () => {
    if (!location.district || !location.address || !location.city || location.latitude === null || location.longitude === null) {
      throw new Error('Location requires district, address, city, latitude and longitude.');
    }
  };

  const validateInfo = () => {
    if (!info.established_year || !info.website_url || info.facilities.length === 0) {
      throw new Error('Info requires established year and website URL.');
    }
  };

  const addFacility = () => {
    const value = facilityInput.trim();
    if (!value) return;

    if (info.facilities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setFacilityInput('');
      return;
    }

    setInfo((prev) => ({ ...prev, facilities: [...prev.facilities, value] }));
    setFacilityInput('');
  };

  const removeFacility = (facility: string) => {
    setInfo((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((item) => item !== facility),
    }));
  };

  const setCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation((prev) => ({
          ...prev,
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
        }));
      },
      () => {
        setError('Unable to get current location. Please select it from map.');
      }
    );
  };

  const saveLocation = async () => {
    try {
      setSavingLocation(true);
      setError('');
      setSuccess('');

      validateLocation();

      const payload = {
        district: location.district,
        address: location.address,
        city: location.city,
        postal_code: location.postal_code,
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
        full_address: location.full_address,
      };

      if (location.id) {
        await updateOwnerLocation(location.id, payload);
      } else {
        await createOwnerLocation(payload);
      }

      await refreshProfile();
      await fetchFacilityData();
      setSuccess('Location saved successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save location';
      setError(message);
    } finally {
      setSavingLocation(false);
    }
  };

  const saveInfo = async () => {
    if (!futsalProfile?.id) return;

    try {
      setSavingInfo(true);
      setError('');
      setSuccess('');

      validateInfo();

      const payload = {
        established_year: Number(info.established_year),
        facilities: info.facilities,
        operating_hours: info.operating_hours,
        social_links: info.social_links,
        website_url: info.website_url,
        parking_info: info.parking_info,
        additional_info: info.additional_info,
      };

      if (info.id) {
        await updateOwnerInfo(info.id, payload);
      } else {
        await createOwnerInfo(payload);
      }

      await refreshProfile();
      await fetchFacilityData();
      setSuccess('Facility info saved successfully.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save info';
      setError(message);
    } finally {
      setSavingInfo(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Facility Profile</h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">Complete location and facility info to activate full owner dashboard access.</p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
            isMandatoryComplete
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}
        >
          {isMandatoryComplete ? 'Profile Completed' : 'Mandatory Profile Pending'}
        </span>
      </div>

      {!isMandatoryComplete && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 mt-0.5" />
          <span>
            You must complete both <strong>Location</strong> and <strong>Facility Info</strong> after registration.
          </span>
        </div>
      )}

      {error ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{success}</div> : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Location (Mandatory)
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">District</label>
            <input value={location.district} onChange={(e) => setLocation((prev) => ({ ...prev, district: e.target.value }))} placeholder="Enter district" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">City</label>
            <input value={location.city} onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))} placeholder="Enter city" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Street Address</label>
            <input value={location.address} onChange={(e) => setLocation((prev) => ({ ...prev, address: e.target.value }))} placeholder="Street, lane, or landmark" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Postal Code</label>
            <input value={location.postal_code} onChange={(e) => setLocation((prev) => ({ ...prev, postal_code: e.target.value }))} placeholder="Postal code" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs text-slate-400">
            Click on the map to place the pin, or use your current location. The selected coordinates are saved automatically.
          </div>

          <MapPicker
            value={location.latitude !== null && location.longitude !== null ? { lat: location.latitude, lng: location.longitude } : null}
            onChange={(value) => {
              setLocation((prev) => ({
                ...prev,
                latitude: Number(value.lat.toFixed(7)),
                longitude: Number(value.lng.toFixed(7)),
              }));
            }}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-slate-300 rounded-xl text-sm">
              Latitude: {location.latitude ?? 'Not selected'}
            </div>
            <div className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-slate-300 rounded-xl text-sm">
              Longitude: {location.longitude ?? 'Not selected'}
            </div>
          </div>

          <button onClick={setCurrentLocation} type="button" className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm hover:border-slate-500 w-fit">
            <Crosshair className="w-4 h-4" />
            Use My Current Location
          </button>

          <textarea value={location.full_address} onChange={(e) => setLocation((prev) => ({ ...prev, full_address: e.target.value }))} placeholder="Full Address" rows={3} className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />

          <button
            onClick={() => void saveLocation()}
            disabled={savingLocation}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {savingLocation ? 'Saving...' : 'Save Location'}
          </button>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Facility Info (Mandatory)
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Established Year</label>
            <input value={info.established_year} onChange={(e) => setInfo((prev) => ({ ...prev, established_year: e.target.value }))} placeholder="e.g. 2023" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Website Link
            </label>
            <input value={info.website_url} onChange={(e) => setInfo((prev) => ({ ...prev, website_url: e.target.value }))} placeholder="https://your-futsal-website.com" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Facilities</label>
            <div className="flex gap-2">
              <input
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                placeholder="Add facility (e.g. Parking)"
                className="flex-1 px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl"
              />
              <button type="button" onClick={addFacility} className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 hover:border-slate-500">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {info.facilities.map((facility) => (
                <span key={facility} className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 text-emerald-300 rounded-lg border border-emerald-500/30 text-sm">
                  {facility}
                  <button type="button" onClick={() => removeFacility(facility)} className="text-rose-300 hover:text-rose-200">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Operating Hours</label>
            <div className="space-y-2">
              {DAYS.map((day) => (
                <div key={day} className="grid grid-cols-[120px_1fr_1fr_auto] gap-2 items-center">
                  <span className="capitalize text-slate-300 text-sm">{day}</span>
                  <input
                    type="time"
                    disabled={info.operating_hours[day]?.isClosed}
                    value={info.operating_hours[day]?.open || '06:00'}
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        operating_hours: {
                          ...prev.operating_hours,
                          [day]: { ...prev.operating_hours[day], open: e.target.value },
                        },
                      }))
                    }
                    className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white"
                  />
                  <input
                    type="time"
                    disabled={info.operating_hours[day]?.isClosed}
                    value={info.operating_hours[day]?.close || '22:00'}
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        operating_hours: {
                          ...prev.operating_hours,
                          [day]: { ...prev.operating_hours[day], close: e.target.value },
                        },
                      }))
                    }
                    className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white"
                  />
                  <label className="text-xs text-slate-400 inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={info.operating_hours[day]?.isClosed || false}
                      onChange={(e) =>
                        setInfo((prev) => ({
                          ...prev,
                          operating_hours: {
                            ...prev.operating_hours,
                            [day]: { ...prev.operating_hours[day], isClosed: e.target.checked },
                          },
                        }))
                      }
                    />
                    Closed
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                Facebook URL
              </label>
              <input value={info.social_links.facebook} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, facebook: e.target.value } }))} placeholder="https://facebook.com/yourpage" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Instagram URL
              </label>
              <input value={info.social_links.instagram} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, instagram: e.target.value } }))} placeholder="https://instagram.com/yourpage" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                <Youtube className="w-3.5 h-3.5 text-rose-400" />
                YouTube URL
              </label>
              <input value={info.social_links.youtube} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, youtube: e.target.value } }))} placeholder="https://youtube.com/@yourchannel" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex items-center gap-2">
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                X / Twitter URL
              </label>
              <input value={info.social_links.x} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, x: e.target.value } }))} placeholder="https://x.com/yourpage" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">TikTok URL</label>
              <input value={info.social_links.tiktok} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, tiktok: e.target.value } }))} placeholder="https://tiktok.com/@yourpage" className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
            </div>
          </div>
          <textarea value={info.parking_info} onChange={(e) => setInfo((prev) => ({ ...prev, parking_info: e.target.value }))} placeholder="Parking Info" rows={2} className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />
          <textarea value={info.additional_info} onChange={(e) => setInfo((prev) => ({ ...prev, additional_info: e.target.value }))} placeholder="Additional Info" rows={2} className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 text-white rounded-xl" />

          <button
            onClick={() => void saveInfo()}
            disabled={savingInfo}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {savingInfo ? 'Saving...' : 'Save Facility Info'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityProfile;
