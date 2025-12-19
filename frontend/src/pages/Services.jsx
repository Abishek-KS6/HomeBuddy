import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceAPI.getAll()
      .then(({ data }) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Services</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
              <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                <div className="mb-4">
                  <p className="text-blue-600 font-bold">Base Price: ₹{service.basePrice}</p>
                  {service.pricePerHour > 0 && (
                    <p className="text-gray-700 text-sm">₹{service.pricePerHour}/hour</p>
                  )}
                </div>
                <Link
                  to={`/book/${service._id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;