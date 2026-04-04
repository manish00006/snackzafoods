import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck, MapPin, Navigation, Truck, Store } from 'lucide-react';
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

// Shop location: Ghansoli Road, Sector 23, Navi Mumbai, 400701
const SHOP_LAT = 19.1353385;
const SHOP_LNG = 72.9983139;
const SHOP_ADDRESS = 'Narayan Elite, Ghansoli Road, Sector 23, Navi Mumbai, 400701';
const FREE_KM = 1.5;
const RATE_PER_KM = 15;

const DEFAULT_CENTER = [SHOP_LAT, SHOP_LNG];
const DEFAULT_ZOOM = 15;

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calcDelivery = (distKm) => {
  if (distKm <= FREE_KM) return 0;
  return Math.ceil((distKm - FREE_KM) * RATE_PER_KM);
};

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // 'delivery' | 'pickup'
  const [orderMode, setOrderMode] = useState('delivery');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [markerPos, setMarkerPos] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const shopMarkerRef = useRef(null);
  const mapContainerRef = useRef(null);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const isPickup = orderMode === 'pickup';
  const deliveryCharge = isPickup ? 0 : (distanceKm !== null ? calcDelivery(distanceKm) : null);
  const grandTotal = deliveryCharge !== null ? getCartTotal() + deliveryCharge : getCartTotal();

  // Initialise Leaflet map once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Shop marker (orange dot)
    const shopIcon = L.divIcon({
      html: `<div style="background:#F58220;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 6px rgba(0,0,0,0.4)"></div>`,
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    shopMarkerRef.current = L.marker([SHOP_LAT, SHOP_LNG], { icon: shopIcon })
      .addTo(map)
      .bindTooltip('🏪 Snackza Foods (Shop)', { permanent: false });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      placeMarker(map, lat, lng);
      reverseGeocode(lat, lng);
      const dist = getDistanceKm(SHOP_LAT, SHOP_LNG, lat, lng);
      setDistanceKm(dist);
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
      const dist = getDistanceKm(SHOP_LAT, SHOP_LNG, lat, lng);
      setDistanceKm(dist);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = (mode) => {
    setOrderMode(mode);
    // Reset delivery-specific state when switching to pickup
    if (mode === 'pickup') {
      setMarkerPos(null);
      setDistanceKm(null);
      setFormData((prev) => ({ ...prev, address: '' }));
    }
  };

  const WHATSAPP_NUMBER = '917021417839';

  const placeOrder = async (e) => {
    e.preventDefault();

    let message = `*New Order - Snackza Foods* 🛍️\n\n`;
    message += `*Order Type:* ${isPickup ? '🏪 Pickup from Store' : '🚚 Home Delivery'}\n\n`;
    message += `*Customer Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📞 Phone: ${formData.phone}\n`;

    if (isPickup) {
      message += `📍 Pickup from: ${SHOP_ADDRESS}\n`;
    } else {
      message += `📍 Delivery Address: ${formData.address}\n`;
      if (markerPos) {
        message += `🗺️ Map Location: https://maps.google.com/?q=${markerPos.lat},${markerPos.lng}\n`;
        message += `📏 Distance: ${distanceKm.toFixed(2)} km\n`;
      }
    }

    message += `\n*Order Items:*\n`;
    cartItems.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} (₹${item.price * item.quantity})\n`;
    });

    message += `\n*Subtotal:* ₹${getCartTotal()}\n`;
    if (isPickup) {
      message += `*Delivery:* FREE (Pickup)\n`;
    } else {
      message += `*Delivery Charge:* ${deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}\n`;
    }
    message += `*Grand Total:* ₹${grandTotal}\n\nPlease confirm my order. Thank you!`;

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

        {/* ── Order Mode Toggle ── */}
        <div className="flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
          <button
            type="button"
            onClick={() => switchMode('delivery')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all duration-200 ${
              !isPickup
                ? 'bg-[#CF6B2B] dark:bg-[#F58220] text-white'
                : 'bg-white dark:bg-[#1A2218] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2a1c]'
            }`}
          >
            <Truck className="w-4 h-4" /> Home Delivery
          </button>
          <div className="w-px bg-gray-200 dark:bg-gray-700" />
          <button
            type="button"
            onClick={() => switchMode('pickup')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all duration-200 ${
              isPickup
                ? 'bg-[#CF6B2B] dark:bg-[#F58220] text-white'
                : 'bg-white dark:bg-[#1A2218] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1e2a1c]'
            }`}
          >
            <Store className="w-4 h-4" /> Pickup from Store
          </button>
        </div>

        <div className="bg-white dark:bg-[#1A2218] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ── Left: Form ── */}
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-800 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
                {isPickup ? 'Pickup Details' : 'Delivery Details'}
              </h2>

              <form onSubmit={placeOrder} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">Full Name *</label>
                  <input
                    type="text" name="name" required
                    value={formData.name} onChange={handleChange}
                    className="input-field" placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">Phone Number *</label>
                  <input
                    type="tel" name="phone" required
                    value={formData.phone} onChange={handleChange}
                    className="input-field" placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                {/* ── PICKUP MODE ── */}
                {isPickup && (
                  <div className="bg-orange-50 dark:bg-[#CF6B2B]/10 border border-orange-200 dark:border-[#CF6B2B]/30 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[#CF6B2B] dark:text-[#F58220] font-bold text-sm">
                      <Store className="w-5 h-5" /> Store Location
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{SHOP_ADDRESS}</p>
                    <a
                      href={`https://maps.google.com/?q=${SHOP_LAT},${SHOP_LNG}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#CF6B2B] dark:text-[#F58220] font-semibold hover:underline"
                    >
                      <MapPin className="w-3.5 h-3.5" /> View on Google Maps →
                    </a>
                    <div className="bg-white dark:bg-[#1A2218] rounded-lg p-3 border border-orange-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
                      🕐 Please visit the store during business hours. No delivery charge applies — just come and pick up your order!
                    </div>
                  </div>
                )}

                {/* ── DELIVERY MODE ── */}
                {!isPickup && (
                  <>
                    {/* Map */}
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
                        style={{ height: '480px', zIndex: 0 }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                        🟠 Orange dot = our shop. Click to drop your delivery pin &amp; auto-calculate charges.
                      </p>
                    </div>

                    {/* Address */}
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
                        Delivery is <strong>FREE within 1.5 km</strong>. Beyond that, ₹15 per km is charged. Pin your location to see the exact charge.
                      </p>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors mt-2"
                >
                  {isPickup ? 'Confirm Pickup via WhatsApp' : 'Place Order via WhatsApp'}
                  <ArrowRight className="w-5 h-5 ml-2" />
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
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600 dark:text-[#A8B49B]">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal()}</span>
                </div>

                {/* Delivery / Pickup row */}
                <div className="flex justify-between items-center text-gray-600 dark:text-[#A8B49B] font-medium">
                  <span className="flex items-center gap-1">
                    {isPickup ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    {isPickup ? 'Pickup' : (
                      <>
                        Delivery
                        {distanceKm !== null && (
                          <span className="text-xs font-normal text-gray-400 ml-1">({distanceKm.toFixed(2)} km)</span>
                        )}
                      </>
                    )}
                  </span>

                  {isPickup ? (
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      FREE 🎉
                    </span>
                  ) : deliveryCharge === null ? (
                    <span className="text-[#CF6B2B] dark:text-[#F58220] text-xs bg-orange-100 dark:bg-[#CF6B2B]/20 px-3 py-1.5 rounded-full">
                      Pin location to calculate
                    </span>
                  ) : deliveryCharge === 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-bold text-sm bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                      FREE 🎉
                    </span>
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-white">₹{deliveryCharge}</span>
                  )}
                </div>

                {/* Grand Total */}
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-800">
                  <span>Total</span>
                  <span className="text-[#CF6B2B] dark:text-[#F58220]">
                    ₹{deliveryCharge !== null ? grandTotal : getCartTotal()}
                    {!isPickup && deliveryCharge === null && (
                      <span className="text-xs font-normal text-gray-400 ml-1">+ delivery</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Pickup info card */}
              {isPickup && (
                <div className="mt-6 bg-orange-50 dark:bg-[#CF6B2B]/10 border border-orange-200 dark:border-[#CF6B2B]/30 rounded-xl p-4 flex items-start gap-3">
                  <Store className="w-5 h-5 text-[#CF6B2B] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#CF6B2B]">Pickup from store — No delivery charge!</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{SHOP_ADDRESS}</p>
                  </div>
                </div>
              )}

              {/* Delivery pin confirmation */}
              {!isPickup && markerPos && (
                <div className={`mt-6 border rounded-xl p-4 flex items-start gap-3 ${
                  deliveryCharge === 0
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40'
                    : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40'
                }`}>
                  <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${deliveryCharge === 0 ? 'text-green-600 dark:text-green-400' : 'text-[#CF6B2B]'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${deliveryCharge === 0 ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'}`}>
                      Delivery pin set ✓ — {distanceKm.toFixed(2)} km from shop
                    </p>
                    <p className={`text-xs mt-0.5 break-all ${deliveryCharge === 0 ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
                      {formData.address}
                    </p>
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
