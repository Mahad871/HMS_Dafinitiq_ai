import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { format } from 'date-fns';

interface Review {
  _id: string;
  patient: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  response?: string;
  createdAt: string;
}

const Reviews = () => {
  const { doctorId } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/doctor/${doctorId}`);
      setReviews(data.reviews);
      
      const total = data.reviews.reduce((sum, r) => sum + r.rating, 0);
      setAvgRating(total / data.reviews.length || 0);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load reviews');
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Patient Reviews</h1>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      {review.patient.avatar ? (
                        <img
                          src={review.patient.avatar}
                          alt={review.patient.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <UserIcon className="h-6 w-6 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(review.createdAt), 'PPP')}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <p className="text-gray-700 mb-4">{review.comment}</p>

                {review.response && (
                  <div className="mt-4 pl-4 border-l-4 border-primary-200 bg-primary-50 p-4 rounded">
                    <p className="text-sm font-medium text-primary-900 mb-1">Doctor's Response:</p>
                    <p className="text-gray-700">{review.response}</p>
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

export default Reviews;
