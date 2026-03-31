import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const WHATSAPP_NUMBER = '917559381226';

  const placeOrder = async (e) => {
    e.preventDefault();
    
    // In a full app, you would POST this to your /api/orders backend first
    // For this demonstration, we'll format the WhatsApp message directly

    let message = `*New Order - Snackza Foods* 🛍️\n\n`;
    message += `*Customer Details:*\n`;
    message += `👤 Name: ${formData.name}\n`;
    message += `📞 Phone: ${formData.phone}\n`;
    message += `📍 Address: ${formData.address}\n\n`;
    
    message += `*Order Items:*\n`;
    cartItems.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.name} (₹${item.price * item.quantity})\n`;
    });
    
    message += `\n*Total Amount:* ₹${getCartTotal()}\n\n`;
    message += `Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Normally you clear cart after successful backend response
    clearCart();
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
    navigate('/');
  };

  return (
    <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-8">Secure Checkout</h1>
        
        <div className="bg-white dark:bg-[#1A2218] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Form Section */}
            <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <ShieldCheck className="w-5 h-5 text-green-500 mr-2" /> 
                Delivery Details
              </h2>
              
              <form onSubmit={placeOrder} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-1">Complete Address *</label>
                  <textarea 
                    name="address" 
                    required 
                    value={formData.address} 
                    onChange={handleChange}
                    className="input-field min-h-[100px] resize-y"
                    placeholder="House no, Building, Street, Area, City, Pincode"
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 flex items-start">
                    <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      Clicking "Place Order via WhatsApp" will redirect you to WhatsApp with your order details pre-filled. You will pay upon delivery or as agreed on chat.
                    </p>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center bg-green-600 hover:bg-green-700 mt-6">
                  Place Order via WhatsApp <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </form>
            </div>
            
            {/* Order Summary Section */}
            <div className="bg-gray-50 dark:bg-[#141A13] p-8 md:p-12">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
               
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6 divide-y divide-gray-200 dark:divide-gray-800">
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
                 <div className="flex justify-between text-gray-600 dark:text-[#A8B49B]">
                   <span>Subtotal</span>
                   <span>₹{getCartTotal()}</span>
                 </div>
                 <div className="flex justify-between items-center text-gray-600 dark:text-[#A8B49B] font-medium">
                   <span>Shipping</span>
                   <span className="text-[#CF6B2B] dark:text-[#F58220] text-xs bg-orange-100 dark:bg-[#CF6B2B]/20 px-3 py-1.5 rounded-full border border-brand-orange/20 dark:border-transparent">Send us a message to get it</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-4 border-t border-gray-200 dark:border-gray-800">
                   <span>Total</span>
                   <span className="text-[#CF6B2B] dark:text-[#F58220]">₹{getCartTotal()}</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
