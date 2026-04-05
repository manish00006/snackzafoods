import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

import { mockProducts } from '../data/mockProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('halfKg');
  const { addToCart } = useCart();

  useEffect(() => {
    const p = mockProducts.find(p => p._id === id || p.name === id) || mockProducts[0];
    setProduct(p);
  }, [id]);

  if (!product) return <div className="py-20 text-center text-xl font-semibold">Loading...</div>;

  const price = selectedSize === 'halfKg' ? product.halfKgPrice : product.fullKgPrice;
  const sizeLabel = selectedSize === 'halfKg' ? '½ kg' : '1 kg';

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      price,
      size: sizeLabel,
      cartKey: `${product._id}_${selectedSize}`,
    };
    addToCart(cartItem, quantity);
    toast.success(`${quantity} × ${product.name} (${sizeLabel}) added to cart`);
  };

  const placeholderImage = `https://api.dicebear.com/8.x/shapes/svg?seed=${product.name}&backgroundColor=F58220,2E3192`;

  return (
    <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/products" className="inline-flex items-center text-[#2A3626] dark:text-[#A8B49B] hover:text-[#CF6B2B] dark:hover:text-[#F58220] mb-8 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>

        <div className="bg-white dark:bg-[#1A2218] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Image Section */}
            <div className="bg-gray-100 dark:bg-[#111611] flex items-center justify-center relative min-h-[400px]">
              <span className="absolute top-6 left-6 z-10 bg-[#F9F7F1] dark:bg-[#161B15]/80 backdrop-blur-sm text-[#2A3626] dark:text-[#EAE3D3] border border-transparent dark:border-white/10 text-sm font-bold px-4 py-2 rounded-full shadow-md">
                {product.category}
              </span>
              <img
                src={product.image || placeholderImage}
                alt={product.name}
                className="w-full h-full object-cover max-h-[600px] hover:scale-105 transition-transform duration-700"
                onError={(e) => { e.target.src = placeholderImage; }}
              />
            </div>

            {/* Details Section */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{product.name}</h1>

              {/* Price display */}
              <div className="text-3xl font-bold text-[#CF6B2B] dark:text-[#F58220] mb-2">
                ₹{price}
                <span className="text-base font-normal text-gray-400 ml-2">per {sizeLabel}</span>
              </div>

              {/* Size selector */}
              <div className="flex gap-3 mb-6 mt-2">
                <button
                  onClick={() => setSelectedSize('halfKg')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${
                    selectedSize === 'halfKg'
                      ? 'bg-[#CF6B2B] border-[#CF6B2B] text-white shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#CF6B2B] hover:text-[#CF6B2B]'
                  }`}
                >
                  ½ kg — ₹{product.halfKgPrice}
                </button>
                <button
                  onClick={() => setSelectedSize('fullKg')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${
                    selectedSize === 'fullKg'
                      ? 'bg-[#CF6B2B] border-[#CF6B2B] text-white shadow-md'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#CF6B2B] hover:text-[#CF6B2B]'
                  }`}
                >
                  1 kg — ₹{product.fullKgPrice}
                </button>
              </div>

              <div className="prose prose-blue dark:prose-invert mb-8">
                <p className="text-gray-600 dark:text-[#A8B49B] leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700 dark:text-[#A8B49B]">
                  <span className="text-green-500 dark:text-green-400 mr-3 text-lg">✔</span> 100% Homemade Recipe
                </li>
                <li className="flex items-center text-gray-700 dark:text-[#A8B49B]">
                  <span className="text-green-500 dark:text-green-400 mr-3 text-lg">✔</span> Zero Chemical Preservatives
                </li>
                <li className="flex items-center text-gray-700 dark:text-[#A8B49B]">
                  <span className="text-green-500 dark:text-green-400 mr-3 text-lg">✔</span> Prepared with Pure Oils & Spices
                </li>
              </ul>

              {/* Quantity */}
              <div className="flex mb-4">
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-[#141A13] mr-4 shadow-sm w-36">
                  <button
                    className="px-4 py-3 text-gray-600 dark:text-[#A8B49B] hover:text-[#CF6B2B] dark:hover:text-[#F58220] hover:bg-gray-50 dark:hover:bg-[#111611] font-bold rounded-l-full flex-1"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >-</button>
                  <span className="px-3 font-semibold text-gray-900 dark:text-white w-10 text-center">{quantity}</span>
                  <button
                    className="px-4 py-3 text-gray-600 dark:text-[#A8B49B] hover:text-[#CF6B2B] dark:hover:text-[#F58220] hover:bg-gray-50 dark:hover:bg-[#111611] font-bold rounded-r-full flex-1"
                    onClick={() => setQuantity(q => q + 1)}
                  >+</button>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  Total: <span className="font-bold text-gray-900 dark:text-white ml-1">₹{price * quantity}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center flex-1"
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Add {quantity} × {sizeLabel} to Cart (₹{price * quantity})
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
