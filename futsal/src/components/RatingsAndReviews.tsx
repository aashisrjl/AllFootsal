import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Loader, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Rating {
  id: number;
  rating: number;
  review: string;
  sentiment_score: number;
  sentiment_label: string;
  createdAt: string;
  reviewerName: string;
}

const RatingsAndReviews = () => {
  const { futsalProfile } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

  useEffect(() => {
    if (futsalProfile?.id) {
      fetchRatings();
    }
  }, [futsalProfile?.id]);

  const fetchRatings = async () => {
    if (!futsalProfile?.id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${apiBaseUrl}/futsal/${futsalProfile.id}/ratings`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseBody = await response.json().catch(() => null);
      if (response.ok) {
        const data = responseBody?.data || [];
        setRatings(data);

        // Calculate average rating and total reviews
        if (data.length > 0) {
          const avg = data.reduce((sum: number, rating: Rating) => sum + rating.rating, 0) / data.length;
          setAverageRating(Math.round(avg * 10) / 10);
          setTotalReviews(data.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      } else {
        setError(responseBody?.message || responseBody?.error || 'Failed to load ratings.');
      }
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Failed to load ratings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'sm') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getSentimentIcon = (label: string) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return <ThumbsUp className="h-4 w-4 text-green-400" />;
      case 'negative':
        return <ThumbsDown className="h-4 w-4 text-red-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case 'positive':
        return 'text-green-300';
      case 'negative':
        return 'text-red-300';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ratings Overview */}
      <div className="bg-app-surface-solid backdrop-blur-lg rounded-xl border border-app-border p-6">
        <h3 className="text-lg font-semibold text-app-text mb-4">Ratings & Reviews Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating), 'lg')}
            </div>
            <p className="text-sm text-slate-400">Average Rating</p>
          </div>

          {/* Total Reviews */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{totalReviews}</div>
            <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Total Reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {totalReviews > 0 ? `${Math.round((ratings.filter(r => r.rating >= 4).length / totalReviews) * 100)}%` : '0%'}
            </div>
            <ThumbsUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Positive Reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-app-surface-solid backdrop-blur-lg rounded-xl border border-app-border p-6">
        <h3 className="text-lg font-semibold text-app-text mb-4">Customer Reviews</h3>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader className="h-8 w-8 text-emerald-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-12 bg-slate-700/20 rounded-lg border border-app-border-subtle">
            <MessageSquare className="h-12 w-12 text-app-muted mx-auto mb-3" />
            <p className="text-slate-400">No reviews yet</p>
            <p className="text-sm text-app-muted mt-1">Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ratings.map((rating) => (
              <div key={rating.id} className="border border-app-border rounded-lg p-4 bg-slate-700/20 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-app-text">{rating.reviewerName}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(rating.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(rating.rating)}
                    <span className="text-sm font-semibold text-slate-300">{rating.rating}</span>
                  </div>
                </div>

                <p className="text-app-text mb-3 leading-relaxed">{rating.review}</p>

                <div className="flex items-center space-x-2">
                  {getSentimentIcon(rating.sentiment_label)}
                  <span className={`text-sm font-medium ${getSentimentColor(rating.sentiment_label)}`}>
                    {rating.sentiment_label} ({Math.round(rating.sentiment_score * 100)}% confidence)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsAndReviews;