'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { createReview } from '@/lib/api';
import Button from '@/components/ui/Button';

interface ReviewFormProps {
  booking: {
    _id: string;
    hotel: {
      _id: string;
      name: string;
    };
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewForm({ booking, onClose, onSuccess }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState({
    overall: 0,
    cleanliness: 0,
    service: 0,
    value: 0,
    location: 0,
  });
  const [comment, setComment] = useState('');

  const handleStarClick = (category: keyof typeof rating, value: number) => {
    setRating(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating.overall === 0) {
      setError('Please provide an overall rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    try {
      setLoading(true);
      await createReview({
        hotel: booking.hotel._id,
        booking: booking._id,
        rating,
        comment: comment.trim(),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ 
    category, 
    label 
  }: { 
    category: keyof typeof rating; 
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-charcoal">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleStarClick(category, value)}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                value <= rating[category]
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
        {rating[category] > 0 && (
          <span className="ml-2 text-sm text-charcoal-light">{rating[category]}/5</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-charcoal">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              {booking.hotel.name}
            </h3>
            <p className="text-sm text-charcoal-light">Share your experience with other travelers</p>
          </div>

          <StarRating category="overall" label="Overall Rating *" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StarRating category="cleanliness" label="Cleanliness" />
            <StarRating category="service" label="Service" />
            <StarRating category="value" label="Value for Money" />
            <StarRating category="location" label="Location" />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your stay..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald outline-none resize-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-charcoal rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald hover:bg-emerald-dark text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}