import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('halfKg');

  const price = selectedSize === 'halfKg' ? product.halfKgPrice : product.fullKgPrice;
  const sizeLabel = selectedSize === 'halfKg' ? '½ kg' : '1 kg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    const cartItem = {
      ...product,
      price,
      size: sizeLabel,
      cartKey: `${product._id}_${selectedSize}`,
    };
    addToCart(cartItem);
    toast.success(`${product.name} (${sizeLabel}) added to cart`);
  };

  const placeholderImage = `https://api.dicebear.com/8.x/shapes/svg?seed=${product.name}&backgroundColor=F58220,2E3192`;

  return (
    <Link to={`/products/${product._id || product.name}`} className="group card flex flex-col h-full bg-white dark:bg-[#1A2218] relative">
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-[#F9F7F1] dark:bg-[#161B15]/80 backdrop-blur-sm text-[#2A3626] dark:text-[#EAE3D3] border border-transparent dark:border-white/10 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="w-full h-56 overflow-hidden bg-gray-100 dark:bg-[#111611] rounded-t-2xl">
        <img
          src={product.image || placeholderImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = placeholderImage; }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#CF6B2B] dark:group-hover:text-[#F58220] transition-colors truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-[#A8B49B] mt-1 line-clamp-2 min-h-[36px]">
          {product.description}
        </p>

        {/* ── Size selector ── */}
        <div
          className="flex gap-2 mt-4"
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={(e) => { e.preventDefault(); setSelectedSize('halfKg'); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full border transition-all ${
              selectedSize === 'halfKg'
                ? 'bg-[#CF6B2B] border-[#CF6B2B] text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#CF6B2B] hover:text-[#CF6B2B]'
            }`}
          >
            ½ kg &nbsp;·&nbsp; ₹{product.halfKgPrice}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); setSelectedSize('fullKg'); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full border transition-all ${
              selectedSize === 'fullKg'
                ? 'bg-[#CF6B2B] border-[#CF6B2B] text-white'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#CF6B2B] hover:text-[#CF6B2B]'
            }`}
          >
            1 kg &nbsp;·&nbsp; ₹{product.fullKgPrice}
          </button>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{price}
            <span className="text-xs font-normal text-gray-400 ml-1">/ {sizeLabel}</span>
          </span>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-[#CF6B2B]/10 dark:bg-[#CF6B2B]/20 text-[#CF6B2B] dark:text-[#EAE3D3] rounded-full hover:bg-[#CF6B2B] dark:hover:bg-[#F58220] hover:text-white transition-all transform hover:scale-110 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
