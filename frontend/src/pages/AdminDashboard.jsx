import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const [statsRes, bookingsRes, providersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', config),
        axios.get('http://localhost:5000/api/admin/bookings', config),
        axios.get('http://localhost:5000/api/admin/providers', config)
      ]);
      
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setProviders(providersRes.data);
    } catch (error) {
      console.error('Admin fetch error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      }
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const updateProviderStatus = async (providerId, isApproved) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/admin/providers/${providerId}/status`,
        { isApproved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Provider status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update provider');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBookings || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Providers</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalProviders || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Pending Bookings</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingBookings || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 font-semibold ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              >
                Manage Bookings
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`px-6 py-3 font-semibold ${activeTab === 'providers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
              >
                Manage Providers
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">All Bookings</h3>
                {bookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{booking.service?.name}</h4>
                        <p className="text-gray-600">Customer: {booking.customer?.name} ({booking.customer?.phone})</p>
                        <p className="text-gray-600">Date: {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                        <p className="text-gray-600">Price: ₹{booking.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                          className="border rounded px-3 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Address: {booking.address}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'providers' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">All Providers</h3>
                {providers.map((provider) => (
                  <div key={provider._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{provider.userId?.name}</h4>
                        <p className="text-gray-600">Email: {provider.userId?.email}</p>
                        <p className="text-gray-600">Phone: {provider.userId?.phone}</p>
                        <p className="text-gray-600">Experience: {provider.experience} years</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateProviderStatus(provider._id, !provider.isApproved)}
                          className={`px-4 py-2 rounded ${
                            provider.isApproved 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {provider.isApproved ? 'Reject' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;