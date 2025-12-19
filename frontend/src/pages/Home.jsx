import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceAPI } from '../services/api';

const Home = () => {
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
  return (
    <div className="min-h-screen">
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to HomeBuddy</h1>
          <p className="text-xl mb-8">Your trusted home service booking platform</p>
          <Link to="/services" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Book a Service
          </Link>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          {loading ? (
            <div className="text-center py-8">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {services.slice(0, 8).map((service) => (
                <Link key={service._id} to={`/book/${service._id}`} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
                  <img src={service.image} alt={service.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                    <p className="text-blue-600 font-bold">From ₹{service.basePrice}</p>
                    {service.pricePerHour > 0 && (
                      <p className="text-gray-600 text-sm">₹{service.pricePerHour}/hr</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/services" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block">
              View All Services
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HomeBuddy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">All our service providers are background checked and verified for your safety.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
              <p className="text-gray-600">Book services in just a few clicks. Get instant confirmation and track your requests.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">We ensure high-quality service delivery with customer reviews and ratings.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">1000+</h3>
              <p className="text-blue-200">Happy Customers</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-blue-200">Verified Providers</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">8</h3>
              <p className="text-blue-200">Service Categories</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-blue-200">Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;