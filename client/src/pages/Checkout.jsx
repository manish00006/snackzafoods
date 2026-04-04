import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon broken by bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [19.076, 72.8777]; // Mumbai
const DEFAULT_ZOOM = 13;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [markerPos, setMarkerPos] = useState(null);
  const [geocoding, setGeocoding] = useState(false);

  const mapRef = useRef(null);       // Leaflet map instance
  const markerRef = useRef(null);    // Leaflet marker instance
  const mapContainerRef = useRef(null); // DOM element

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Initialise Leaflet map once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      placeMarker(map, lat, lng);
      reverseGeocode(lat, lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const placeMarker = (map, lat, lng) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }
    setMarkerPos({ lat, lng });
  };

  // Free reverse geocoding via OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.display_name) {
        setFormData((prev) => ({ ...prev, address: data.display_name }));
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
    } finally {
      setGeocoding(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      mapRef.current.setView([lat, lng], 16);
      placeMarker(mapRef.current, lat, lng);
      reverseGeocode(lat, lng);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const WHATSAPP_NUMBER = '917021417839';

  const placeOrder = async (e) => {
    e.preventDefault();

    let message = `*New Order - Snackza Foods* 🛍️\n\n`;
    message += `*Customer Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📞 Phone: ${formData.phone}\n`;
    message += `📍 Address: ${formData.address}\n`;
    if (markerPos) {
      message += `🗺️ Map Location: https://maps.google.com/?q=${markerPos.lat},${markerPos.lng}\n`;
    }
    message += `\n*Order Items:*\n`;
    cartItems.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} (₹${item.price * item.quantity})\n`;
    });
    message += `\n*Total Amount:* ₹${getCartTotal()}\n\nPlease confirm my order. Thank you!`;

    clearCart();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    navigate('/');
  };

  return (
    <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-8">
          Secure Checkout
        </h1>

        <div className="bg-white dark:bg-[#1A2218] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ── Left: Form + Map ── */}
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
                Delivery Details
              </h2>

              <form onSubmit={placeOrder} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    className="input-field" placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel" name="phone" required
                    value={formData.phone} onChange={handleChange}
                    className="input-field" placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* Map picker */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-[#A8B49B] flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#CF6B2B]" /> Pin Your Location
                    </label>
                    <button
                      type="button"
                      onClick={useMyLocation}
                      className="text-xs flex items-center gap-1 text-[#CF6B2B] hover:text-[#F58220] font-semibold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Use My Location
                    </button>
                  </div>

                  <div
                    ref={mapContainerRef}
                    className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                    style={{ height: '260px', zIndex: 0 }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Click anywhere on the map to auto-fill your delivery address.
                  </p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">
                    Complete Address *
                    {geocoding && (
                      <span className="ml-2 text-xs text-[#CF6B2B] animate-pulse">Detecting…</span>
                    )}
                  </label>
                  <textarea
                    name="address" required
                    value={formData.address} onChange={handleChange}
                    className="input-field min-h-[90px] resize-y"
                    placeholder="House no, Building, Street, Area, City, Pincode"
                  />
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 flex items-start">
                  <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    Clicking "Place Order via WhatsApp" will open WhatsApp with your order and map location pre-filled. Pay on delivery or as agreed on chat.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors mt-2"
                >
                  Place Order via WhatsApp <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="bg-gray-50 dark:bg-[#141A13] p-8 md:p-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 mb-6 divide-y divide-gray-200 dark:divide-gray-800">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-3 first:pt-0">
                    <div className="flex items-center">
                      <img
                        src={item.image || `https://api.dicebear.com/8.x/shapes/svg?seed=${item.name}&backgroundColor=F58220,2E3192`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-[#A8B49B]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
                <div className="flex justify-between text-gray-600 dark:text-[#A8B49B]">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600 dark:text-[#A8B49B] font-medium">
                  <span>Shipping</span>
                  <span className="text-[#CF6B2B] dark:text-[#F58220] text-xs bg-orange-100 dark:bg-[#CF6B2B]/20 px-3 py-1.5 rounded-full border border-brand-orange/20 dark:border-transparent">
                    Send us a message to get it
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span>Total</span>
                  <span className="text-[#CF6B2B] dark:text-[#F58220]">₹{getCartTotal()}</span>
                </div>
              </div>

              {/* Pin confirmation */}
              {markerPos && (
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-800 dark:text-green-300">Delivery pin set ✓</p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-0.5 break-all">{formData.address}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
