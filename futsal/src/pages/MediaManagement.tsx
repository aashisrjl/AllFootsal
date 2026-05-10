import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Play, Loader, AlertCircle, Image as ImageIcon, VideoIcon, MapPin, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface MediaItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  category: string;
  pitch_id?: number | null;
  created_at?: string;
}

interface Pitch {
  id: number;
  name: string;
  pitch_type?: string;
}

const MediaManagement = () => {
  const { futsalProfile } = useAuth();
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pitch');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('all');

  // Pitch-specific state
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [selectedPitchId, setSelectedPitchId] = useState<number | null>(null);
  const [pitchesLoading, setPitchesLoading] = useState(false);

  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

  const categories = [
    { value: 'home', label: 'Home Media', icon: ImageIcon, color: 'emerald' },
    { value: 'pitch', label: 'Pitch Photos', icon: ImageIcon, color: 'blue' },
    { value: 'facility', label: 'Facility Photos', icon: ImageIcon, color: 'purple' },
    { value: 'event', label: 'Event Videos', icon: VideoIcon, color: 'violet' },
    { value: 'logo', label: 'Logo', icon: ImageIcon, color: 'yellow' },
    { value: 'banner', label: 'Banner', icon: ImageIcon, color: 'cyan' },
    { value: 'other', label: 'Other Media', icon: Upload, color: 'slate' },
  ];

  useEffect(() => {
    if (futsalProfile?.id) {
      fetchAllMedia();
      if (selectedCategory === 'pitch') {
        fetchPitches();
      } else {
        setPitches([]);
        setSelectedPitchId(null);
      }
    }
  }, [selectedCategory, futsalProfile?.id]);

  const fetchPitches = async () => {
    if (!futsalProfile?.id) return;
    try {
      setPitchesLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/futsal/${futsalProfile.id}/pitches`, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const body = await response.json().catch(() => null);
      if (response.ok) {
        const pitchData: Pitch[] = body?.data || body?.pitches || [];
        setPitches(pitchData);
        if (pitchData.length > 0 && !selectedPitchId) {
          setSelectedPitchId(pitchData[0].id);
        }
      }
    } catch {
      console.log('Could not load pitches');
    } finally {
      setPitchesLoading(false);
    }
  };

  const fetchAllMedia = async () => {
    if (!futsalProfile?.id) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const futsalId = futsalProfile.id;
      const catValues = categories.map(c => c.value);

      // Fetch all categories in parallel
      const results = await Promise.allSettled(
        catValues.map(cat =>
          fetch(`${apiBaseUrl}/futsal/${futsalId}/media/?category=${cat}`, {
            credentials: 'include',
            headers: { 'Authorization': `Bearer ${token}` },
          }).then(r => r.json().catch(() => null))
        )
      );

      const combined: MediaItem[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value?.data) {
          combined.push(...result.value.data);
        }
      });

      setAllMedia(combined);
    } catch {
      console.log('Could not load media');
      setAllMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
        if (!isValid) setError(`${file.name} is not a valid image or video file`);
        return isValid;
      });
      setSelectedFiles(validFiles);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }
    if (selectedCategory === 'pitch' && !selectedPitchId) {
      setError('Please select a pitch to upload photos for');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('media', file));

      let uploadUrl: string;
      if (selectedCategory === 'pitch' && selectedPitchId) {
        uploadUrl = `${apiBaseUrl}/futsal/media/pitch/${selectedPitchId}/upload`;
      } else if (selectedCategory === 'logo') {
        uploadUrl = `${apiBaseUrl}/futsal/media/logo/upload`;
      } else if (selectedCategory === 'banner') {
        uploadUrl = `${apiBaseUrl}/futsal/media/banner/upload`;
      } else {
        formData.append('category', selectedCategory);
        uploadUrl = `${apiBaseUrl}/futsal/media/upload`;
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const responseBody = await response.json().catch(() => null);
      if (!response.ok) {
        const errorMsg = responseBody?.message || responseBody?.error || 'Failed to upload files. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const successMsg = `Successfully uploaded ${selectedFiles.length} file(s) to ${getPitchName(selectedPitchId)}!`;
      setSuccess(successMsg);
      toast.success(successMsg);
      
      setSelectedFiles([]);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await fetchAllMedia();
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Failed to upload files. Please try again.');
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getPitchName = (pitchId: number | null): string => {
    if (!pitchId) return selectedCategory;
    const pitch = pitches.find(p => p.id === pitchId);
    return pitch?.name || `Pitch #${pitchId}`;
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBaseUrl}/futsal/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        setAllMedia(prev => prev.filter((item: MediaItem) => item.id !== id));
        toast.success('Media deleted successfully');
      } else {
        toast.error('Failed to delete media');
      }
    } catch {
      toast.error('Failed to delete media');
    }
  };

  // Derived: media to show in gallery based on filter
  const filteredMedia = galleryFilter === 'all'
    ? allMedia
    : allMedia.filter((m: MediaItem) => m.category === galleryFilter);

  // Group by category for the gallery
  const mediaByCat = categories
    .map(cat => ({
      cat,
      items: filteredMedia.filter((m: MediaItem) => m.category === cat.value),
    }))
    .filter(({ items }) => items.length > 0);

  const MediaCard = ({ item }: { item: MediaItem }) => (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg bg-slate-700/30 aspect-square">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt="Media"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <>
            <video src={item.url} controls className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <Play className="h-8 w-8 text-white/70" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => handleDelete(item.id)}
            className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2">
        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'}
      </p>
    </div>
  );

  const colorClasses = {
    emerald: { selected: 'border-emerald-500/50 bg-emerald-500/10', unselected: 'border-slate-700 hover:border-emerald-500/30 hover:bg-slate-700/50' },
    blue: { selected: 'border-blue-500/50 bg-blue-500/10', unselected: 'border-slate-700 hover:border-blue-500/30 hover:bg-slate-700/50' },
    purple: { selected: 'border-purple-500/50 bg-purple-500/10', unselected: 'border-slate-700 hover:border-purple-500/30 hover:bg-slate-700/50' },
    violet: { selected: 'border-violet-500/50 bg-violet-500/10', unselected: 'border-slate-700 hover:border-violet-500/30 hover:bg-slate-700/50' },
    yellow: { selected: 'border-yellow-500/50 bg-yellow-500/10', unselected: 'border-slate-700 hover:border-yellow-500/30 hover:bg-slate-700/50' },
    cyan: { selected: 'border-cyan-500/50 bg-cyan-500/10', unselected: 'border-slate-700 hover:border-cyan-500/30 hover:bg-slate-700/50' },
    slate: { selected: 'border-slate-500/50 bg-slate-700/50', unselected: 'border-slate-700 hover:border-slate-500/30 hover:bg-slate-700/50' },
  };

  return (
    <div className="space-y-6">
      {/* ── Category Selection (upload target) ── */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-1">Select Category</h3>
        <p className="text-xs text-slate-500 mb-4">Choose where your uploaded files will be saved</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.value;
            const cls = colorClasses[category.color as keyof typeof colorClasses];
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-4 rounded-lg border-2 transition-all ${isSelected ? cls.selected : cls.unselected}`}
              >
                <div className="text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <p className={`text-sm font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-300'}`}>{category.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Pitch Selector — only when "Pitch Photos" is active ── */}
      {selectedCategory === 'pitch' && (
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-blue-500/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-200">Select Pitch</h3>
            <span className="ml-auto text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-full">
              Photos will be linked to the selected pitch
            </span>
          </div>

          {pitchesLoading ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader className="h-4 w-4 animate-spin" />
              Loading pitches...
            </div>
          ) : pitches.length === 0 ? (
            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-300">
                No pitches found. Please create pitches in Pitch Management first.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pitches.map((pitch, index) => {
                const label = String.fromCharCode(65 + index);
                const isSelected = selectedPitchId === pitch.id;
                return (
                  <button
                    key={pitch.id}
                    onClick={() => setSelectedPitchId(pitch.id)}
                    className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/15 shadow-lg shadow-blue-500/10'
                        : 'border-slate-700 hover:border-blue-400/40 hover:bg-slate-700/40'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                    }`}>
                      {label}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-200' : 'text-slate-200'}`}>
                        {pitch.name}
                      </p>
                      {pitch.pitch_type && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{pitch.pitch_type}</p>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/60" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Upload Section ── */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-1">Upload Media</h3>
        {selectedCategory === 'pitch' && selectedPitchId && (
          <p className="text-sm text-blue-400 mb-2">
            Uploading to: <span className="font-semibold">{getPitchName(selectedPitchId)}</span>
          </p>
        )}

        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all mt-4">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-slate-400 mb-3" />
            <p className="text-lg font-semibold text-slate-200 mb-1">Drag and drop files here</p>
            <p className="text-sm text-slate-400 mb-4">or click to select files</p>
            <input id="file-input" type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="inline-flex items-center px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
                Select Files
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-3">Supported: JPG, PNG, GIF, MP4, WebM (Max 100MB each)</p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    ) : (
                      <VideoIcon className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))} className="ml-3 text-red-400 hover:text-red-300 flex-shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center space-x-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Play className="h-5 w-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300">{success}</p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0 || (selectedCategory === 'pitch' && !selectedPitchId)}
            className={`flex items-center px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
              uploading || selectedFiles.length === 0 || (selectedCategory === 'pitch' && !selectedPitchId)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <><Loader className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" />Upload Files</>
            )}
          </button>
          {selectedFiles.length > 0 && (
            <button
              onClick={() => { setSelectedFiles([]); const fi = document.getElementById('file-input') as HTMLInputElement; if (fi) fi.value = ''; }}
              className="px-6 py-2.5 border border-slate-600 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Gallery — ALL categories ── */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        {/* Header + filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Media Gallery</h3>
            <p className="text-xs text-slate-500 mt-0.5">{allMedia.length} total items across all categories</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGalleryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  galleryFilter === 'all'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                All ({allMedia.length})
              </button>
              {categories.map(cat => {
                const count = allMedia.filter((m: MediaItem) => m.category === cat.value).length;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setGalleryFilter(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      galleryFilter === cat.value
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="h-8 w-8 text-emerald-400 animate-spin" />
          </div>
        ) : allMedia.length === 0 ? (
          <div className="text-center py-12 bg-slate-700/20 rounded-lg border border-slate-700">
            <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No media uploaded yet</p>
            <p className="text-xs text-slate-500 mt-1">Select a category above and upload your first file</p>
          </div>
        ) : mediaByCat.length === 0 ? (
          <div className="text-center py-12 bg-slate-700/20 rounded-lg border border-slate-700">
            <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No media in this category</p>
          </div>
        ) : (
          <div className="space-y-10">
            {mediaByCat.map(({ cat, items }) => (
              <div key={cat.value}>
                {/* Category heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                    cat.value === 'pitch' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' :
                    cat.value === 'home' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    cat.value === 'facility' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' :
                    cat.value === 'event' ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30' :
                    cat.value === 'logo' ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30' :
                    cat.value === 'banner' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                    'bg-slate-700/50 text-slate-300 border border-slate-600'
                  }`}>
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </div>
                  <span className="text-xs text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  <div className="flex-1 h-px bg-slate-700/60" />
                </div>

                {/* Pitch: sub-group by pitch A/B/C */}
                {cat.value === 'pitch' && pitches.length > 0 ? (
                  <div className="space-y-6 pl-1">
                    {pitches.map((pitch, idx) => {
                      const pitchItems = items.filter((m: MediaItem) => m.pitch_id === pitch.id);
                      if (pitchItems.length === 0) return null;
                      return (
                        <div key={pitch.id}>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-300">
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <h4 className="text-sm font-semibold text-slate-300">{pitch.name}</h4>
                            <span className="text-xs text-slate-500">({pitchItems.length})</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {pitchItems.map((item: MediaItem) => <MediaCard key={item.id} item={item} />)}
                          </div>
                        </div>
                      );
                    })}
                    {/* Pitch items not linked to any pitch */}
                    {(() => {
                      const unlinked = items.filter((m: MediaItem) => !m.pitch_id);
                      if (unlinked.length === 0) return null;
                      return (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                              <ImageIcon className="h-3 w-3 text-slate-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-slate-400">Unlinked</h4>
                            <span className="text-xs text-slate-500">({unlinked.length})</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {unlinked.map((item: MediaItem) => <MediaCard key={item.id} item={item} />)}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item: MediaItem) => <MediaCard key={item.id} item={item} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManagement;
