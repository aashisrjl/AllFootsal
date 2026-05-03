import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ImageIcon, VideoIcon, Loader, AlertCircle, Star, MessageSquare } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  uploadedAt: string;
}

interface RatingItem {
  id: number;
  rating: number;
  review: string;
  sentiment_score: number;
  sentiment_label: string;
  createdAt: string;
  reviewerName: string;
}

const MediaManagement = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  const categories = [
    { value: 'pitch', label: 'Pitch Photos' },
    { value: 'facility', label: 'Facility Photos' },
    { value: 'event', label: 'Event Videos' },
    { value: 'other', label: 'Other Media' },
  ];

  useEffect(() => {
    // Fetch existing media
    fetchMedia();
    fetchRatings();
  }, [selectedCategory]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual media API endpoint
      // const token = localStorage.getItem('token'); // or however auth is handled
      // const response = await fetch(`/api/futsal/media/${selectedCategory}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // setMedia(data);
      
      // Mock data for demonstration
      setMedia([
        {
          id: '1',
          url: 'https://via.placeholder.com/200x150?text=Pitch+Photo',
          type: 'image',
          category: selectedCategory,
          uploadedAt: '2024-01-15',
        },
        {
          id: '2',
          url: 'https://via.placeholder.com/200x150?text=Facility+Photo',
          type: 'image',
          category: selectedCategory,
          uploadedAt: '2024-01-14',
        },
      ]);
    } catch (err) {
      setError('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setRatingsLoading(true);
      // TODO: Replace with actual ratings API endpoint
      // const token = localStorage.getItem('token'); // or however auth is handled
      // const response = await fetch('/api/v1/futsal-ratings', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const result = await response.json();
      // if (result.success) {
      //   setRatings(result.data);
      // }
      
      // Mock data for demonstration
      setRatings([
        {
          id: 1,
          rating: 5,
          review: 'Excellent facility! Clean and well-maintained.',
          sentiment_score: 0.95,
          sentiment_label: 'positive',
          createdAt: '2024-01-15T10:30:00Z',
          reviewerName: 'John Doe',
        },
        {
          id: 2,
          rating: 4,
          review: 'Good place to play, but parking could be better.',
          sentiment_score: 0.75,
          sentiment_label: 'positive',
          createdAt: '2024-01-14T15:45:00Z',
          reviewerName: 'Jane Smith',
        },
        {
          id: 3,
          rating: 2,
          review: 'Facilities were okay but staff was rude.',
          sentiment_score: 0.25,
          sentiment_label: 'negative',
          createdAt: '2024-01-13T20:15:00Z',
          reviewerName: 'Mike Johnson',
        },
      ]);
    } catch (err) {
      setError('Failed to load ratings');
    } finally {
      setRatingsLoading(false);
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

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('media', file);
      });
      formData.append('category', selectedCategory);

      // Replace with actual API endpoint
      // const response = await fetch('/api/futsal/media/upload', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // if (!response.ok) throw new Error('Upload failed');
      // const result = await response.json();
      
      // Mock success response
      console.log('Uploading files:', selectedFiles);
      
      // Add new media to the list
      const newMedia: MediaItem[] = selectedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        category: selectedCategory,
        uploadedAt: new Date().toISOString().split('T')[0],
      }));

      setMedia([...newMedia, ...media]);
      setSelectedFiles([]);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Replace with actual API endpoint
      // const response = await fetch(`/api/futsal/media/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // if (!response.ok) throw new Error('Delete failed');
      
      setMedia(media.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete media');
    }
  };

  const handleDeleteRating = async (ratingId: number) => {
    try {
      // TODO: Replace with actual API endpoint
      // const token = localStorage.getItem('token'); // or however auth is handled
      // const response = await fetch(`/api/v1/futsal/ratings/${ratingId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // if (!response.ok) throw new Error('Delete failed');
      
      setRatings(ratings.filter(item => item.id !== ratingId));
    } catch (err) {
      setError('Failed to delete rating');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
      </div>

      {/* Category Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === category.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="text-center">
                {category.value === 'pitch' && <ImageIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />}
                {category.value === 'facility' && <ImageIcon className="h-6 w-6 mx-auto mb-2 text-green-600" />}
                {category.value === 'event' && <VideoIcon className="h-6 w-6 mx-auto mb-2 text-purple-600" />}
                {category.value === 'other' && <Upload className="h-6 w-6 mx-auto mb-2 text-gray-600" />}
                <p className="text-sm font-medium text-gray-900">{category.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Media</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-lg font-medium text-gray-900 mb-1">Drag and drop files here</p>
            <p className="text-sm text-gray-500 mb-4">or click to select files</p>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Select Files
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-3">Supported formats: JPG, PNG, GIF, MP4, WebM</p>
          </div>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Files ({selectedFiles.length})</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                    ) : (
                      <VideoIcon className="h-5 w-5 text-purple-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
              uploading || selectedFiles.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
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
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {categories.find(c => c.value === selectedCategory)?.label} Gallery
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No media found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map(item => (
              <div key={item.id} className="relative group">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt="Media"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">{item.uploadedAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings and Reviews Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings and Reviews</h3>

        {ratingsLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No ratings or reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= item.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.rating}/5
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.sentiment_label === 'positive'
                          ? 'bg-green-100 text-green-800'
                          : item.sentiment_label === 'negative'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.sentiment_label}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{item.review}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {item.reviewerName}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>Sentiment: {(item.sentiment_score * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRating(item.id)}
                    className="ml-4 p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManagement;
