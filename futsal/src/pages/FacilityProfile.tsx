import { useEffect, useMemo, useState } from 'react';
import { Building2, Crosshair, Facebook, Globe, Instagram, MapPin, Plus, Save, ShieldAlert, Trash2, Twitter, Youtube } from 'lucide-react';
import {
  createOwnerInfo,
  createOwnerLocation,
  getFutsalInfoById,
  getOwnerLocation,
  updateOwnerInfo,
  updateOwnerLocation,
} from '../lib/facilityApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import MapPicker from '../components/MapPicker';

interface LocationPayload {
  id?: number;
  district: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  full_address: string;
}

interface DayHours {
  isClosed: boolean;
  open: string;
  close: string;
}

interface InfoFormPayload {
  id?: number;
  established_year: string;
  facilities: string[];
  operating_hours: Record<string, DayHours>;
  social_links: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    x: string;
  };
  website_url: string;
  parking_info: string;
  additional_info: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const defaultOperatingHours = (): Record<string, DayHours> =>
  DAYS.reduce<Record<string, DayHours>>((acc, day) => {
    acc[day] = { isClosed: false, open: '06:00', close: '22:00' };
    return acc;
  }, {});

const FacilityProfile = () => {
  const { futsalProfile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingLocation, setSavingLocation] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [facilityInput, setFacilityInput] = useState('');

  const [location, setLocation] = useState<LocationPayload>({
    district: '',
    address: '',
    city: '',
    postal_code: '',
    latitude: null,
    longitude: null,
    full_address: '',
  });

  const [info, setInfo] = useState<InfoFormPayload>({
    established_year: '',
    facilities: [],
    operating_hours: defaultOperatingHours(),
    social_links: {
      facebook: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      x: '',
    },
    website_url: '',
    parking_info: '',
    additional_info: '',
  });

  const completion = futsalProfile?.profileCompletion;

  const isMandatoryComplete = useMemo(() => {
    return completion?.isProfileComplete ?? false;
  }, [completion]);

  const fetchFacilityData = async () => {
    if (!futsalProfile?.id) return;

    try {
      setLoading(true);

      const [locationRes, infoRes] = await Promise.all([
        getOwnerLocation().catch(() => ({ data: [] })),
        getFutsalInfoById(futsalProfile.id).catch(() => ({ data: [] })),
      ]);

      const locationRows = (locationRes?.data || []) as any[];
      const infoRows = (infoRes?.data || []) as any[];

      const latestLocation = locationRows[0];
      if (latestLocation) {
        setLocation({
          id: latestLocation.id,
          district: latestLocation.district || '',
          address: latestLocation.address || '',
          city: latestLocation.city || '',
          postal_code: latestLocation.postal_code || '',
          latitude: latestLocation.latitude !== null ? Number(latestLocation.latitude) : null,
          longitude: latestLocation.longitude !== null ? Number(latestLocation.longitude) : null,
          full_address: latestLocation.full_address || '',
        });
      }

      const latestInfo = infoRows[0];
      if (latestInfo) {
        let parsedFacilities: string[] = [];
        let parsedOperatingHours = defaultOperatingHours();
        let parsedSocialLinks = {
          facebook: '',
          instagram: '',
          tiktok: '',
          youtube: '',
          x: '',
        };

        try {
          const value = typeof latestInfo.facilities === 'string' ? JSON.parse(latestInfo.facilities) : latestInfo.facilities;
          if (Array.isArray(value)) {
            parsedFacilities = value.map((item) => String(item));
          }
        } catch {
          parsedFacilities = [];
        }

        try {
          const value = typeof latestInfo.operating_hours === 'string'
            ? JSON.parse(latestInfo.operating_hours)
            : latestInfo.operating_hours;
          if (value && typeof value === 'object') {
            parsedOperatingHours = {
              ...defaultOperatingHours(),
              ...value,
            };
          }
        } catch {
          parsedOperatingHours = defaultOperatingHours();
        }

        try {
          const value = typeof latestInfo.social_links === 'string'
            ? JSON.parse(latestInfo.social_links)
            : latestInfo.social_links;
          if (value && typeof value === 'object') {
            parsedSocialLinks = {
              ...parsedSocialLinks,
              ...value,
            };
          }
        } catch {
          parsedSocialLinks = parsedSocialLinks;
        }

        setInfo({
          id: latestInfo.id,
          established_year: latestInfo.established_year ? String(latestInfo.established_year) : '',
          facilities: parsedFacilities,
          operating_hours: parsedOperatingHours,
          social_links: parsedSocialLinks,
          website_url: latestInfo.website_url || '',
          parking_info: latestInfo.parking_info || '',
          additional_info: latestInfo.additional_info || '',
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load facility data';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
      toast.error('Geolocation is not supported in this browser.');
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
        toast.error('Unable to get current location. Please select it from map.');
      }
    );
  };

  const saveLocation = async () => {
    const toastId = toast.loading('Saving location...');
    try {
      setSavingLocation(true);

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
      toast.dismiss(toastId);
      toast.success('Location saved successfully');
    } catch (err: any) {
      toast.dismiss(toastId);
      const message = err?.response?.data?.message || err?.message || 'Failed to save location';
      toast.error(message);
    } finally {
      setSavingLocation(false);
    }
  };

  const saveInfo = async () => {
    if (!futsalProfile?.id) return;

    const toastId = toast.loading('Saving facility info...');
    try {
      setSavingInfo(true);

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
      toast.dismiss(toastId);
      toast.success('Facility info saved successfully');
    } catch (err: any) {
      toast.dismiss(toastId);
      const message = err?.response?.data?.message || err?.message || 'Failed to save facility info';
      toast.error(message);
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">Facility Profile</h1>
          <p className="text-app-muted mt-1 text-sm font-medium">Complete location and facility info to activate full owner dashboard access.</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-app-heading flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Location (Mandatory)
          </h2>

          <div>
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">District</label>
            <input value={location.district} onChange={(e) => setLocation((prev) => ({ ...prev, district: e.target.value }))} placeholder="Enter district" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">City</label>
            <input value={location.city} onChange={(e) => setLocation((prev) => ({ ...prev, city: e.target.value }))} placeholder="Enter city" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">Street Address</label>
            <input value={location.address} onChange={(e) => setLocation((prev) => ({ ...prev, address: e.target.value }))} placeholder="Street, lane, or landmark" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">Postal Code</label>
            <input value={location.postal_code} onChange={(e) => setLocation((prev) => ({ ...prev, postal_code: e.target.value }))} placeholder="Postal code" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          </div>

          <div className="rounded-xl border border-app-border-subtle bg-app-surface-solid p-3 text-xs text-slate-400">
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
            <div className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl text-sm">
              Latitude: {location.latitude ?? 'Not selected'}
            </div>
            <div className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl text-sm">
              Longitude: {location.longitude ?? 'Not selected'}
            </div>
          </div>

          <button onClick={setCurrentLocation} type="button" className="inline-flex items-center gap-2 px-3 py-2 bg-app-surface-solid border border-app-border-subtle text-app-text rounded-lg text-sm hover:border-app-border w-fit">
            <Crosshair className="w-4 h-4" />
            Use My Current Location
          </button>

          <textarea value={location.full_address} onChange={(e) => setLocation((prev) => ({ ...prev, full_address: e.target.value }))} placeholder="Full Address" rows={3} className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />

          <button
            onClick={() => void saveLocation()}
            disabled={savingLocation}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {savingLocation ? 'Saving...' : 'Save Location'}
          </button>
        </div>

        <div className="bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-app-heading flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Facility Info (Mandatory)
          </h2>

          <div>
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">Established Year</label>
            <input value={info.established_year} onChange={(e) => setInfo((prev) => ({ ...prev, established_year: e.target.value }))} placeholder="e.g. 2023" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          </div>
          <div>
            <label className="text-xs font-bold text-app-muted mb-2 uppercase tracking-wide flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Website Link
            </label>
            <input value={info.website_url} onChange={(e) => setInfo((prev) => ({ ...prev, website_url: e.target.value }))} placeholder="https://your-futsal-website.com" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          </div>

          <div>
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">Facilities</label>
            <div className="flex gap-2">
              <input
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                placeholder="Add facility (e.g. Parking)"
                className="flex-1 px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl"
              />
              <button type="button" onClick={addFacility} className="px-3 py-2.5 bg-app-surface-solid border border-app-border-subtle rounded-xl text-app-text hover:border-app-border">
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
            <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">Operating Hours</label>
            <div className="space-y-2">
              {DAYS.map((day) => (
                <div key={day} className="grid grid-cols-[120px_1fr_1fr_auto] gap-2 items-center">
                  <span className="capitalize text-app-text text-sm">{day}</span>
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
                    className="px-3 py-2 bg-app-input border border-app-border-subtle rounded-lg text-app-text"
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
                    className="px-3 py-2 bg-app-input border border-app-border-subtle rounded-lg text-app-text"
                  />
                  <label className="text-xs text-app-muted inline-flex items-center gap-1">
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
              <label className="text-xs font-bold text-app-muted mb-2 uppercase tracking-wide flex items-center gap-2">
                <Facebook className="w-3.5 h-3.5 text-blue-400" />
                Facebook URL
              </label>
              <input value={info.social_links.facebook} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, facebook: e.target.value } }))} placeholder="https://facebook.com/yourpage" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-app-muted mb-2 uppercase tracking-wide flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Instagram URL
              </label>
              <input value={info.social_links.instagram} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, instagram: e.target.value } }))} placeholder="https://instagram.com/yourpage" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-app-muted mb-2 uppercase tracking-wide flex items-center gap-2">
                <Youtube className="w-3.5 h-3.5 text-rose-400" />
                YouTube URL
              </label>
              <input value={info.social_links.youtube} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, youtube: e.target.value } }))} placeholder="https://youtube.com/@yourchannel" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-app-muted mb-2 uppercase tracking-wide flex items-center gap-2">
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                X / Twitter URL
              </label>
              <input value={info.social_links.x} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, x: e.target.value } }))} placeholder="https://x.com/yourpage" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-app-muted mb-2 uppercase tracking-wide">TikTok URL</label>
              <input value={info.social_links.tiktok} onChange={(e) => setInfo((prev) => ({ ...prev, social_links: { ...prev.social_links, tiktok: e.target.value } }))} placeholder="https://tiktok.com/@yourpage" className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
            </div>
          </div>
          <textarea value={info.parking_info} onChange={(e) => setInfo((prev) => ({ ...prev, parking_info: e.target.value }))} placeholder="Parking Info" rows={2} className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />
          <textarea value={info.additional_info} onChange={(e) => setInfo((prev) => ({ ...prev, additional_info: e.target.value }))} placeholder="Additional Info" rows={2} className="w-full px-4 py-2.5 bg-app-input border border-app-border-subtle text-app-text rounded-xl" />

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
