import { useEffect, useState } from 'react';
import { bookingAPI, reviewAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    loadBookings();
  }, []);
  const loadBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      toast.success(' Booking updated successfully');
      loadBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };
  const submitReview = async () => {
    try {
      await reviewAPI.create({
        providerId: selectedBooking.provider._id,
        bookingId: selectedBooking._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success(' Review submitted successfully');
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };
  const statusConfig = {
    pending: {
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'Pending'
    },
    confirmed: {
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'Confirmed'
    },
    completed: {
      color: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'Completed'
    },
    cancelled: {
      color: 'from-red-500 to-pink-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'Cancelled'
    }
  };
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            My Bookings 
          </h1>
          <p className="text-xl text-blue-100">Track and manage all your service bookings</p>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Bookings', count: bookings.length },
              { key: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
              { key: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
              { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
              { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  filter === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {filter === 'all' ? 'No bookings found' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start by booking your first service!' 
                  : `You don't have any ${filter} bookings yet.`
                }
              </p>
              <button
                onClick={() => window.location.href = '/services'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
              >
                Book a Service
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const status = statusConfig[booking.status];
              return (
                <div key={booking._id} className={`bg-white rounded-2xl shadow-lg border-2 ${status.border} overflow-hidden hover:shadow-xl transition-all duration-300`}>
                  <div className={`${status.bg} p-4 border-b ${status.border}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{booking.service.name}</h3>
                        <p className="text-gray-600">Booking ID: #{booking._id.slice(-8)}</p>
                      </div>
                      <div className={`bg-gradient-to-r ${status.color} text-white px-4 py-2 rounded-full font-semibold`}>
                        {status.text}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">
                          Provider Details
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="font-semibold text-lg">{booking.provider?.userId?.name || 'Provider Name'}</p>
                          <div className="mt-2">
                            <span className="text-gray-600">Phone: {booking.provider?.userId?.phone || 'Phone not available'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">
                          Booking Details
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                          <div>
                            <span className="text-gray-600">Scheduled: {format(new Date(booking.scheduledDate), 'PPpp')}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 font-semibold">Price: Rs.{booking.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Service Address
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700">{booking.address}</p>
                      </div>
                    </div>]
                    {booking.notes && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Additional Notes
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-gray-700">{booking.notes}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'cancelled')}
                          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
                        >
                        Cancel Booking
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(booking._id, 'completed')}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300"
                        >
                          Mark as Completed
                        </button>
                      )}
                      {booking.status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowReviewModal(true);
                          }}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300"
                        >
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <h3 className="text-2xl font-bold">Leave a Review</h3>
                <p className="text-purple-100">Share your experience with {selectedBooking?.provider?.userId?.name}</p>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                        className={`text-3xl transition-transform hover:scale-110 ${
                          star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
{star}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Comment</label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                  focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    rows="4"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={submitReview}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl 
                    font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
                  >
                      Submit Review
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewData({ rating: 5, comment: '' });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyBookings;