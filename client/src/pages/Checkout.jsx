import { useState, useCallback, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const MAP_CONTAINER_STYLE = { width: '100%', height: '260px', borderRadius: '12px' };
const DEFAULT_CENTER = { lat: 19.076, lng: 72.8777 }; // Mumbai default
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [markerPos, setMarkerPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [geocoding, setGeocoding] = useState(false);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reverse geocode a lat/lng into a readable address
  const reverseGeocode = async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setFormData((prev) => ({ ...prev, address: data.results[0].formatted_address }));
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
    } finally {
      setGeocoding(false);
    }
  };

  // Called when user clicks on the map
  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPos({ lat, lng });
    reverseGeocode(lat, lng);
  }, []);

  // Use browser geolocation to center map on user's position
  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setMapCenter({ lat, lng });
      setMarkerPos({ lat, lng });
      reverseGeocode(lat, lng);
      if (mapRef.current) mapRef.current.panTo({ lat, lng });
    });
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

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    clearCart();
    window.open(whatsappUrl, '_blank');
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

                {/* Google Map picker */}
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

                  {loadError && (
                    <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                      Failed to load Google Maps. Please type your address below.
                    </div>
                  )}

                  {!isLoaded && !loadError && (
                    <div className="w-full h-[260px] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-sm animate-pulse">
                      Loading map…
                    </div>
                  )}

                  {isLoaded && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <GoogleMap
                        mapContainerStyle={MAP_CONTAINER_STYLE}
                        center={mapCenter}
                        zoom={13}
                        onClick={onMapClick}
                        onLoad={(map) => { mapRef.current = map; }}
                        options={{
                          disableDefaultUI: false,
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        {markerPos && <Marker position={markerPos} />}
                      </GoogleMap>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Click anywhere on the map to auto-fill your delivery address.
                  </p>
                </div>

                {/* Address textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">
                    Complete Address *
                    {geocoding && <span className="ml-2 text-xs text-[#CF6B2B] animate-pulse">Detecting…</span>}
                  </label>
                  <textarea
                    name="address" required
                    value={formData.address} onChange={handleChange}
                    className="input-field min-h-[90px] resize-y"
                    placeholder="House no, Building, Street, Area, City, Pincode"
                  />
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 flex items-start">
                  <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    Clicking "Place Order via WhatsApp" will redirect you to WhatsApp with your order details and map location pre-filled. Pay upon delivery or as agreed on chat.
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

              {/* Map pin summary */}
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
