import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceAPI, providerAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ProviderSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    services: [],
    experience: '',
    bio: ''
  });

  useEffect(() => {
    if (user?.role !== 'provider') {
      navigate('/');
      return;
    }
    
    serviceAPI.getAll()
      .then(({ data }) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load services');
        setLoading(false);
      });
  }, [user, navigate]);

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    
    setSubmitting(true);
    try {
      await providerAPI.create(formData);
      toast.success('Provider profile created successfully!');
      navigate('/provider-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Setup Your Provider Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select Your Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  onClick={() => toggleService(service._id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    formData.services.includes(service._id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-gray-600">₹{service.basePrice} base price</p>
                  {formData.services.includes(service._id) && (
                    <div className="mt-2 text-blue-600 font-semibold">✓ Selected</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-2">About You</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              rows="4"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting || formData.services.length === 0}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Creating Profile...' : 'Create Provider Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderSetup;