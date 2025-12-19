import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">HomeBuddy</Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-blue-200">Home</Link>
            <Link to="/services" className="text-white hover:text-blue-200">Services</Link>
            {location.pathname !== '/admin/login' && location.pathname !== '/admin/dashboard' && (
              <Link to="/admin/login" className="text-white hover:text-blue-200">Admin</Link>
            )}

            {user ? (
              <>
                {user.role === 'provider' ? (
                  <Link to="/provider-dashboard" className="text-white hover:text-blue-200">Dashboard</Link>
                ) : (
                  <Link to="/bookings" className="text-white hover:text-blue-200">My Bookings</Link>
                )}
                
                <span className="text-white">Hi, {user.name}</span>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;