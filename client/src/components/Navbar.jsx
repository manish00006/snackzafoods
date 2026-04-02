import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { getCartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @keyframes blueRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes colorCycle {
          0%, 100% { filter: hue-rotate(0deg); }
          17% { filter: hue-rotate(300deg); }
          33% { filter: hue-rotate(120deg); }
          50% { filter: hue-rotate(260deg); }
          67% { filter: hue-rotate(170deg); }
          83% { filter: hue-rotate(195deg); }
        }
        .blue-glow-ring {
          animation: blueRingSpin 2.5s linear infinite, colorCycle 12s ease-in-out infinite;
        }
      `}</style>
      <nav className="bg-white dark:bg-[#1A2218] border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 sm:h-28">
            <div className="flex items-center py-2">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <div className="relative flex items-center justify-center rounded-full w-[55px] h-[55px] sm:w-[90px] sm:h-[90px] md:w-[130px] md:h-[130px] my-2">
                  
                  {/* Blue Glow Ring — tight, bright, no spread */}
                  <div className="absolute -inset-[3px] md:-inset-[5px] rounded-full bg-[conic-gradient(from_0deg,transparent_55%,#1d4ed8_75%,#3b82f6_85%,#60a5fa_95%,#93c5fd_100%)] blue-glow-ring blur-[2px] md:blur-[3px] opacity-100"></div>
                
                {/* The Logo Image (Expanded) */}
                <img 
                  className="relative z-10 w-full h-full rounded-full object-cover border-[4px] border-[#F9F7F1] bg-white group-hover:scale-105 transition-transform duration-300 shadow-inner" 
                  src="/assets/snackzafood.jpeg?v=3" 
                  alt="Snackza Foods Logo" 
                />
              </div>
              <span className="ml-2 sm:ml-5 font-extrabold text-lg sm:text-3xl md:text-4xl tracking-tight text-[#2A3626] dark:text-[#EAE3D3] drop-shadow-sm font-serif group-hover:text-[#CF6B2B] dark:group-hover:text-[#F58220] transition-colors duration-300">
                SNACKZA FOODS
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'border-brand-orange text-brand-orange dark:border-[#F58220] dark:text-[#F58220]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-brand-orange dark:text-gray-400 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/cart" className="relative p-2 text-brand-blue dark:text-[#EAE3D3] hover:text-brand-orange dark:hover:text-brand-orange transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-orange rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu buttons */}
          <div className="flex items-center sm:hidden space-x-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-brand-orange dark:text-gray-400 dark:hover:text-yellow-400 transition-colors rounded-full"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/cart" className="relative p-2 mr-1 text-brand-blue dark:text-[#EAE3D3] hover:text-brand-orange transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-orange rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden bg-white dark:bg-[#1A2218] border-t border-gray-100 dark:border-gray-800">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-brand-orange text-brand-orange dark:text-[#F58220]'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  </>
  );
};

export default Navbar;
