import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating if clicking icon inside link
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Generate a random gradient placeholder if image fails or is a placeholder
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
          onError={(e) => { e.target.src = placeholderImage }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#CF6B2B] dark:group-hover:text-[#F58220] transition-colors truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-[#A8B49B] mt-2 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
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
