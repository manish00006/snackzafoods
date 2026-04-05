import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-[70vh] flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-[#1A2218] p-10 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 mb-8 inline-flex">
          <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-[#A8B49B] mb-8 max-w-md text-center">
          Looks like you haven't added any of our delicious homemade snacks to your cart yet.
        </p>
        <Link to="/products" className="btn-primary flex items-center text-lg px-8 py-4">
          Browse Products <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-[#1A2218] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {cartItems.map((item) => {
                  const cartKey = item.cartKey || item._id;
                  return (
                    <li key={cartKey} className="p-6 flex flex-col sm:flex-row items-center hover:bg-gray-50 dark:hover:bg-[#202A1F]/50 transition-colors">
                      <img
                        src={item.image || `https://api.dicebear.com/8.x/shapes/svg?seed=${item.name}&backgroundColor=F58220,2E3192`}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl shadow-sm mb-4 sm:mb-0"
                      />

                      <div className="sm:ml-6 flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                          <p className="text-sm text-gray-500 dark:text-[#A8B49B]">{item.category}</p>
                          {item.size && (
                            <span className="text-xs font-bold bg-[#CF6B2B]/10 dark:bg-[#CF6B2B]/20 text-[#CF6B2B] px-2 py-0.5 rounded-full">
                              {item.size}
                            </span>
                          )}
                        </div>
                        <span className="text-[#CF6B2B] dark:text-[#F58220] font-semibold block mt-2 sm:hidden">₹{item.price}</span>
                      </div>

                      <div className="mt-4 sm:mt-0 flex items-center gap-6">
                        <span className="hidden sm:block text-[#CF6B2B] dark:text-[#F58220] font-bold text-lg w-20 text-right">₹{item.price}</span>

                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-[#141A13] shadow-sm">
                          <button
                            onClick={() => updateQuantity(cartKey, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-[#A8B49B] hover:text-[#CF6B2B] dark:hover:text-[#F58220] hover:bg-gray-50 dark:hover:bg-[#111611] rounded-l-full transition-colors"
                          >-</button>
                          <span className="w-8 text-center text-gray-900 dark:text-white font-medium text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(cartKey, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-[#A8B49B] hover:text-[#CF6B2B] dark:hover:text-[#F58220] hover:bg-gray-50 dark:hover:bg-[#111611] rounded-r-full transition-colors"
                          >+</button>
                        </div>

                        <button
                          onClick={() => removeFromCart(cartKey)}
                          className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={clearCart} className="text-sm font-medium text-gray-500 hover:text-red-500 underline text-right">
                Empty Entire Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-[#1A2218] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sticky top-28">
              <h2 className="text-xl font-bold text-[#2A3626] dark:text-[#EAE3D3] mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Order Summary</h2>

              <div className="space-y-4 text-gray-600 dark:text-[#A8B49B]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between items-center text-sm gap-2">
                  <span>Shipping Estimate</span>
                  <span className="font-semibold text-[#CF6B2B] dark:text-[#F58220] bg-orange-100 dark:bg-[#CF6B2B]/20 px-3 py-1.5 rounded-full shadow-sm border border-brand-orange/20 dark:border-transparent">Send us a message to get it</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xl font-bold text-gray-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-[#CF6B2B] dark:text-[#F58220]">₹{getCartTotal()}</span>
              </div>

              <Link to="/checkout" className="btn-primary w-full block text-center mt-8 py-4 text-lg font-bold shadow-lg shadow-brand-orange/20 flex items-center justify-center group">
                Proceed To Checkout
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
