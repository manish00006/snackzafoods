import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockProducts';

const Products = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const categories = ['All', 'Pickles', 'Drinks & More', 'Farsan', 'Dry Fruits Items'];

  useEffect(() => {
    // Check if category passed in URL
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      // Map 'Drinks' to 'Drinks & More'
      const matched = categories.find(c => c.includes(categoryParam));
      if (matched) setActiveCategory(matched);
    }
    
    // In real app, fetch from API here
  }, [location]);

  useEffect(() => {
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);

  return (
    <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-screen py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] text-center mb-8">Our Products</h1>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 space-y-4 md:space-y-0">
          
          <div className="flex flex-wrap gap-2 justify-center bg-white dark:bg-[#1A2218] p-1 rounded-2xl md:rounded-full shadow-sm border border-gray-100 dark:border-gray-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#CF6B2B] text-white shadow-md' 
                    : 'text-gray-600 dark:text-[#A8B49B] hover:text-[#CF6B2B] hover:bg-orange-50 dark:hover:bg-[#CF6B2B]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search homemade snacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 h-11 py-2 text-sm bg-white dark:bg-[#1A2218]"
            />
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1A2218] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-[#EAE3D3]">No products found</h3>
            <p className="text-gray-500 dark:text-[#A8B49B] mt-2">Try adjusting your category filter or search term.</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveCategory('All');}}
              className="mt-6 text-[#CF6B2B] dark:text-[#F58220] underline font-semibold hover:text-[#2A3626] dark:hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
