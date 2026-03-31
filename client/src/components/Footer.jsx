import { Link } from 'react-router-dom';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2A3626] dark:bg-[#0D120C] text-white pt-12 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1 border-r border-[#3A4A36] dark:border-gray-800 pr-8">
            <h3 className="text-2xl font-bold text-[#EAE3D3] mb-4 drop-shadow-sm">Snackza Foods</h3>
            <p className="text-[#A8B49B] mb-6 text-sm leading-relaxed">
              Homemade Taste, Pure Tradition.
              Delicious, hygienic, and traditionally prepared homemade pickles and refreshing beverages.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#A8B49B] hover:text-[#F58220] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#A8B49B] hover:text-[#F58220] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 px-4 md:px-8 border-r-0 md:border-r border-[#3A4A36] dark:border-gray-800">
            <h4 className="text-lg font-semibold mb-4 text-[#F58220]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#A8B49B]">
              <li><Link to="/" className="hover:text-[#F58220] transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#F58220] transition-colors">Our Products</Link></li>
              <li><Link to="/cart" className="hover:text-[#F58220] transition-colors">Shopping Cart</Link></li>
              <li><Link to="/contact" className="hover:text-[#F58220] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 pl-0 md:pl-8">
             <h4 className="text-lg font-semibold mb-4 text-[#F58220]">Contact Us</h4>
             <ul className="space-y-4 text-sm text-[#A8B49B]">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-[#F58220] flex-shrink-0" />
                <span>Narayan Elite, Sector 23, Ghansoli.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-[#F58220] flex-shrink-0" />
                <span>+91 91529 09134 / +91 70214 17839</span>
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow-sm">
              🚚 Home Delivery Available
            </div>
          </div>

        </div>
        
        <div className="border-t border-[#3A4A36] dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-[#A8B49B]">
            &copy; {new Date().getFullYear()} Snackza Foods. All rights reserved.
          </p>
          <p className="text-xs text-[#A8B49B] mt-2 md:mt-0">
            100% Homemade | No Preservatives | Pure Veg
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
