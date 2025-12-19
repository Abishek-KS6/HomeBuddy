import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceAPI, providerAPI, bookingAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const BookService = () => {
  const { serviceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    provider: '',
    scheduledDate: '',
    address: '',
    notes: ''
  });
  useEffect(() => {
    const loadData = async () => {
      try {
        const [serviceRes, providersRes] = await Promise.all([
          serviceAPI.getById(serviceId),
          providerAPI.getByService(serviceId)
        ]);
        setService(serviceRes.data);
        setProviders(providersRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load service details');
        setLoading(false);
      }
    };
    loadData();
  }, [serviceId]);
  const handleProviderSelect = (providerId) => {
    const provider = providers.find(p => p._id === providerId);
    setSelectedProvider(provider);
    setFormData({ ...formData, provider: providerId });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }
    try {
      await bookingAPI.create({
        providerId: formData.provider,
        serviceId: serviceId,
        scheduledDate: formData.scheduledDate,
        address: formData.address,
        notes: formData.notes
      });
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading service details...</p>
        </div>
      </div>
    );
  }
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Service not found</h2>
          <button onClick={() => navigate('/services')} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Back to Services
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <img src={service.image} alt={service.name} className="w-full h-64 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Base Price</p>
                <p className="text-2xl font-bold text-blue-600">₹{service.basePrice}</p>
              </div>
              {service.pricePerHour > 0 && (
                <div className="bg-green-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Per Hour</p>
                  <p className="text-2xl font-bold text-green-600">₹{service.pricePerHour}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Your Provider</h2>
            
            {providers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No providers available for this service</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {providers.map((provider) => (
                  <div
                    key={provider._id}
                    onClick={() => handleProviderSelect(provider._id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      selectedProvider?._id === provider._id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {provider.userId?.name || 'Provider Name'}
                        </h3>
                        <p className="text-gray-600">{provider.userId?.phone || 'Phone not available'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{provider.rating?.toFixed(1) || '0.0'} ⭐</p>
                        <p className="text-sm text-gray-500">{provider.totalReviews || 0} reviews</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Experience: {provider.experience || 0} years</p>
                        <p className="text-sm text-gray-500 mt-1">{provider.bio || 'No bio available'}</p>
                      </div>
                      {selectedProvider?._id === provider._id && (
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Selected ✓
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Book Your Service</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Service Address</label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  rows="3"
                  placeholder="Enter your complete address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Additional Notes (Optional)</label>
                <textarea
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  rows="2"
                  placeholder="Any specific requirements or instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              {selectedProvider && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Service:</span> {service.name}</p>
                    <p><span className="font-medium">Provider:</span> {selectedProvider.userId?.name}</p>
                    <p><span className="font-medium">Base Price:</span> ₹{service.basePrice}</p>
                    {service.pricePerHour > 0 && (
                      <p><span className="font-medium">Hourly Rate:</span> ₹{service.pricePerHour}/hr</p>
                    )}
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={!selectedProvider || !formData.scheduledDate || !formData.address}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {selectedProvider ? 'Confirm Booking' : 'Select a Provider First'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;