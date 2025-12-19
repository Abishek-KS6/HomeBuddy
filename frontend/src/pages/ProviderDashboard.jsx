import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, reviewAPI, providerAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    avgRating: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    checkProviderProfile();
  }, []);

  const checkProviderProfile = async () => {
    try {
      await providerAPI.getMyProfile();
      loadData();
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/provider-setup');
      } else {
        setLoading(false);
      }
    }
  };

  const loadData = async () => {
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([
        bookingAPI.getProviderBookings(),
        reviewAPI.getMyReviews()
      ]);

      const bookingsData = bookingsRes.data;
      setBookings(bookingsData);
      setReviews(reviewsRes.data);

      const totalBookings = bookingsData.length;
      const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
      const completedBookings = bookingsData.filter(b => b.status === 'completed').length;
      const totalEarnings = bookingsData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0);
      const avgRating = reviewsRes.data.length > 0 
        ? reviewsRes.data.reduce((sum, r) => sum + r.rating, 0) / reviewsRes.data.length 
        : 0;

      setStats({ totalBookings, pendingBookings, completedBookings, avgRating, totalEarnings });
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      toast.success('Booking updated successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to update booking');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Provider Dashboard
          </h1>
          <p className="text-xl text-blue-100">Manage your bookings and track your performance</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-blue-600">{stats.totalBookings}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Total Bookings</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Pending</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-green-600">{stats.completedBookings}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Completed</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-purple-600">{stats.avgRating.toFixed(1)}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Average Rating</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-indigo-600">Rs.{stats.totalEarnings}</span>
            </div>
            <h3 className="text-gray-600 font-semibold">Total Earnings</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Bookings
                </h2>
              </div>
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">Your bookings will appear here once customers start booking your services.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {bookings.slice(0, 10).map((booking) => {
                      const status = statusConfig[booking.status];

                      return (
                        <div key={booking._id} className={`border-2 ${status.border} rounded-xl p-4 ${status.bg} hover:shadow-md transition-all duration-300`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="mb-2">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800">{booking.service.name}</h4>
                                  <p className="text-sm text-gray-600">#{booking._id.slice(-8)}</p>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <div className="text-gray-600">
                                    <span>Customer: {booking.customer.name}</span>
                                  </div>
                                  <div className="text-gray-600">
                                    <span>Phone: {booking.customer.phone}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-gray-600">
                                    <span>Date: {format(new Date(booking.scheduledDate), 'PPp')}</span>
                                  </div>
                                  <div className="text-gray-600">
                                    <span className="font-semibold">Price: Rs.{booking.price}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <div className="text-gray-600 text-sm">
                                  <span>Address: {booking.address}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className={`bg-gradient-to-r ${status.color} text-white px-3 py-1 rounded-full text-sm font-semibold ml-4`}>
                              {status.text}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 text-sm"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 text-sm"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => updateBookingStatus(booking._id, 'completed')}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 text-sm"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Reviews
                </h2>
              </div>
              <div className="p-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No reviews yet</h3>
                    <p className="text-gray-600 text-sm">Complete some bookings to start receiving reviews!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review._id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div>
                              <span className="font-semibold text-gray-800">{review.customer.name}</span>
                              <div className="mt-1">
                                <span className="text-yellow-400 font-semibold">{review.rating}/5</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {format(new Date(review.createdAt), 'PP')}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Performance Summary</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{((stats.completedBookings / Math.max(stats.totalBookings, 1)) * 100).toFixed(1)}%</div>
              <p className="text-purple-100">Completion Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{reviews.length}</div>
              <p className="text-purple-100">Total Reviews</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Rs.{stats.totalEarnings > 0 ? (stats.totalEarnings / Math.max(stats.completedBookings, 1)).toFixed(0) : 0}</div>
              <p className="text-purple-100">Avg. Earning per Job</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;