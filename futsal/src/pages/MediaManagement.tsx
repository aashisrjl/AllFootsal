import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Play, Loader, AlertCircle, Image as ImageIcon, VideoIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MediaItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  category: string;
  created_at?: string;
}

const MediaManagement = () => {
  const { futsalProfile } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pitch');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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
    fetchMedia();
  }, [selectedCategory]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const futsalId = futsalProfile?.id;
      
      const response = await fetch(
        `${apiBaseUrl}/futsal/${futsalId}/media/?category=${selectedCategory}`,
        {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const responseBody = await response.json().catch(() => null);
      if (response.ok) {
        setMedia(responseBody?.data || []);
      } else {
        setError(responseBody?.message || responseBody?.error || 'Failed to load media.');
      }
    } catch (err) {
      console.log('Using mock data for demonstration');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const isValid = file.type.startsWith('image/') || file.type.startsWith('video/');
        if (!isValid) {
          setError(`${file.name} is not a valid image or video file`);
        }
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

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('media', file);
      });
      formData.append('category', selectedCategory);

      const response = await fetch(`${apiBaseUrl}/futsal/media/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseBody = await response.json().catch(() => null);
      if (!response.ok) {
        setError(responseBody?.message || responseBody?.error || 'Failed to upload files. Please try again.');
        return;
      }

      setSuccess(`Successfully uploaded ${selectedFiles.length} file(s)!`);
      setSelectedFiles([]);
      
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        fetchMedia();
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this media?')) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiBaseUrl}/futsal/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMedia(media.filter(item => item.id !== id));
        setSuccess('Media deleted successfully');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      setError('Failed to delete media');
    }
  };

  const currentCategory = categories.find(c => c.value === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Select Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.value;
            const colorClasses = {
              emerald: isSelected ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700 hover:border-emerald-500/30 hover:bg-slate-700/50',
              blue: isSelected ? 'border-blue-500/50 bg-blue-500/10' : 'border-slate-700 hover:border-blue-500/30 hover:bg-slate-700/50',
              purple: isSelected ? 'border-purple-500/50 bg-purple-500/10' : 'border-slate-700 hover:border-purple-500/30 hover:bg-slate-700/50',
              slate: isSelected ? 'border-slate-500/50 bg-slate-700/50' : 'border-slate-700 hover:border-slate-500/30 hover:bg-slate-700/50',
            };

            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-4 rounded-lg border-2 transition-all ${colorClasses[category.color as keyof typeof colorClasses]}`}
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

      {/* Upload Section */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Upload Media</h3>
        
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-slate-400 mb-3" />
            <p className="text-lg font-semibold text-slate-200 mb-1">Drag and drop files here</p>
            <p className="text-sm text-slate-400 mb-4">or click to select files</p>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="inline-flex items-center px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
                Select Files
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-3">Supported: JPG, PNG, GIF, MP4, WebM (Max 100MB each)</p>
          </div>
        </div>

        {/* Selected Files Preview */}
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
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="ml-3 text-red-400 hover:text-red-300 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
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

        {/* Upload Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className={`flex items-center px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg ${
              uploading || selectedFiles.length === 0
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl'
            }`}
          >
            {uploading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </>
            )}
          </button>
          {selectedFiles.length > 0 && (
            <button
              onClick={() => {
                setSelectedFiles([]);
                const fileInput = document.getElementById('file-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }}
              className="px-6 py-2.5 border border-slate-600 rounded-lg text-slate-300 font-semibold hover:bg-slate-700/50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          {currentCategory?.label} Gallery
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="h-8 w-8 text-emerald-400 animate-spin" />
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12 bg-slate-700/20 rounded-lg border border-slate-700">
            <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No media found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map(item => (
              <div key={item.id} className="relative group">
                <div className="relative overflow-hidden rounded-lg bg-slate-700/30 aspect-square">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt="Media"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-8 w-8 text-white/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl transform group-hover:scale-100 scale-75"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManagement;
