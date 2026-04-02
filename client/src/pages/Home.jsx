import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Play, X } from 'lucide-react';

import { mockProducts } from '../data/mockProducts';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    // In a real app, fetch from /api/products and filter featured
    // Get Mango Pickle ('1'), Wood Apple Sharbat ('10'), and Besan Ladoo ('15')
    const featured = mockProducts.filter(p => ['1', '10', '15'].includes(p._id));
    setFeaturedProducts(featured.length > 0 ? featured : mockProducts.slice(0, 3));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#F9F7F1] dark:bg-[#161B15] py-24 lg:py-32 overflow-hidden border-b border-[#EAE3D3] dark:border-[#2A3626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-1/2 pt-6">
            
            {/* Elegant "Natural Touch" Intro & Videos */}
            <div className="mb-10">
              <div className="flex items-center space-x-3 mb-6">
                <span className="h-px w-12 bg-[#8A5A44] dark:bg-[#CF6B2B]"></span>
                <span className="uppercase tracking-[0.25em] text-[#8A5A44] dark:text-[#CF6B2B] font-bold text-xs">
                  Inside Our Kitchen
                </span>
              </div>
              
              <div className="flex gap-4">
                {[1, 2, 3].map((num) => (
                  <div 
                    key={num} 
                    onClick={() => setActiveVideo(`/assets/video${num}.mp4`)}
                    className="w-[84px] h-[84px] sm:w-[100px] sm:h-[100px] p-[3px] bg-gradient-to-br from-[#E2D4C6] to-[#C9B6A3] rounded-2xl shadow-lg cursor-pointer relative group transform hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
                    title={`Watch Process ${num}`}
                  >
                    <div className="w-full h-full bg-black rounded-[0.85rem] overflow-hidden relative border border-white">
                      <video src={`/assets/video${num}.mp4`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" muted playsInline autoPlay loop preload="auto" />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/60 flex items-center justify-center group-hover:bg-[#8A5A44] group-hover:border-[#8A5A44] transition-colors duration-300 shadow-sm">
                          <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-[#2A3626] dark:text-[#EAE3D3] leading-[1.05] mb-8 font-serif drop-shadow-sm">
              Homemade Pickles, Farsan, <br className="hidden lg:block"/> Dry Fruits Items & <br className="sm:hidden block"/>
              <span className="text-[#CF6B2B] dark:text-[#F58220] italic font-serif leading-[1.2]">Refreshing Drinks</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#5C6453] dark:text-[#A8B49B] mb-12 max-w-lg font-medium leading-relaxed">
              Experience the authentic flavors of purely homemade, hygienic delicacies. Crafted with love using traditional recipes and absolutely zero preservatives.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <span className="border border-[#2A3626]/20 text-[#2A3626] dark:border-[#EAE3D3]/20 dark:text-[#EAE3D3] bg-transparent px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.15em] shadow-sm">
                Handmade
              </span>
              <span className="border border-[#2A3626]/20 text-[#2A3626] dark:border-[#EAE3D3]/20 dark:text-[#EAE3D3] bg-transparent px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.15em] shadow-sm">
                Pure Veg
              </span>
              <span className="border border-[#2A3626]/20 text-[#2A3626] dark:border-[#EAE3D3]/20 dark:text-[#EAE3D3] bg-transparent px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-[0.15em] shadow-sm">
                No Preservatives
              </span>
            </div>

            <Link to="/products" className="bg-[#2A3626] hover:bg-[#1A2218] dark:bg-[#CF6B2B] dark:hover:bg-[#F97316] text-[#F9F7F1] dark:text-white text-lg font-bold px-10 py-5 rounded-full inline-flex items-center transition-all duration-300 shadow-[0_10px_40px_rgba(42,54,38,0.3)] dark:shadow-[0_10px_40px_rgba(207,107,43,0.2)] hover:-translate-y-1 group">
              Explore The Menu
              <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
        
        {/* Abstract earthy organic blobs */}
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full opacity-60 dark:opacity-10 pointer-events-none z-0">
           <svg viewBox="0 0 800 800" className="absolute right-[-20%] top-[-20%] w-[140%] h-[140%] fill-[#E8DEC1] dark:fill-[#C9B6A3] blur-[100px] mix-blend-multiply dark:mix-blend-screen"><circle cx="400" cy="400" r="300"></circle></svg>
           <svg viewBox="0 0 800 800" className="absolute right-[10%] bottom-[-30%] w-[90%] h-[90%] fill-[#D1DBC5] dark:fill-[#8A5A44] blur-[100px] mix-blend-multiply dark:mix-blend-screen"><circle cx="400" cy="400" r="300"></circle></svg>
        </div>
        
        {/* Gorgeous Floating Image Collage */}
        <div className="hidden lg:block absolute top-0 right-0 w-[45%] h-full p-8 z-10 pointer-events-none">
           <div className="relative w-full h-full pointer-events-auto">
             {/* Pickle Image: Top Left */}
             <img src="/assets/mango_pickle.png" alt="Homemade Mango Pickle" className="absolute top-0 left-4 w-52 h-52 2xl:w-64 2xl:h-64 rounded-3xl shadow-2xl object-cover transform -rotate-12 border-[6px] border-white hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 cursor-pointer" />
             
             {/* Drink Image: Bottom Right */}
             <img src="/assets/amla_sharbat.png" alt="Refreshing Amla Sharbat" className="absolute bottom-24 right-8 w-56 h-56 2xl:w-72 2xl:h-72 rounded-3xl shadow-2xl object-cover transform rotate-6 border-[6px] border-white hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 z-10 cursor-pointer" />
             
             {/* Farsan Image: Center overlapping */}
             <img src="/assets/chakali.png" alt="Crispy Chakali Farsan" className="absolute top-[40%] left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 2xl:w-72 2xl:h-72 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] object-cover rotate-12 border-[8px] border-brand-orange hover:rotate-0 hover:scale-110 hover:z-30 transition-all duration-500 z-20 cursor-pointer" />
           </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white dark:bg-[#161B15] relative overflow-hidden border-b border-gray-100 dark:border-[#2A3626] transition-colors duration-300">
        {/* Soft abstract background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-50 dark:bg-orange-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 dark:bg-green-900/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 transform translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#F9F7F1]/50 dark:bg-[#1A2218]/80 backdrop-blur-sm border border-brand-orange/10 dark:border-white/5 rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-brand-blue/5 text-center transition-transform hover:scale-[1.01] duration-500">
            <div className="inline-flex items-center justify-center space-x-3 mb-8">
              <span className="h-px w-10 bg-brand-orange"></span>
              <span className="text-brand-orange font-extrabold uppercase tracking-[0.2em] text-sm">Our Story</span>
              <span className="h-px w-10 bg-brand-orange"></span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-10 leading-tight">
              🌿 About Snackza Foods
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-8 text-lg md:text-xl text-gray-700 dark:text-[#A8B49B] leading-relaxed font-medium">
              <p>
                Snackza Homemade Foods brings you the true taste of home with every bite. We specialize in preparing delicious pickles and refreshing beverages using traditional methods passed down through generations.
              </p>
              <p>
                Every product is purely homemade, crafted with love, care, and attention to detail—just like it’s made in your own kitchen. We use only high-quality, fresh ingredients, ensuring rich flavor, natural goodness, and no compromise on hygiene.
              </p>
              <p>
                At Snackza, we believe food should not only taste good but also feel safe and trustworthy. That’s why our products are made in small batches, without unnecessary preservatives, preserving the authentic homemade essence.
              </p>
            </div>
            
            <div className="mt-14 pt-10 border-t border-brand-orange/10 dark:border-white/10">
              <p className="text-2xl md:text-3xl text-brand-orange dark:text-[#F97316] font-bold italic font-serif tracking-wide drop-shadow-sm">
                ✨ "From our home to yours — bringing purity, tradition, and taste together."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-[#F9F7F1] dark:bg-[#1C231B] min-h-[600px] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-6">Our Featured Products</h2>
            <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full"></div>
            <p className="mt-4 text-[#5C6453] dark:text-[#A8B49B] max-w-2xl mx-auto">
               Taste the authentic, traditional flavors made with love in our homemade kitchen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products" className="btn-outline inline-flex">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white dark:bg-[#161B15] border-t border-gray-100 dark:border-[#2A3626] transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-5xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-6">Shop by Category</h2>
             <div className="w-24 h-1.5 bg-brand-orange mx-auto rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="bg-[#F9F7F1]/50 dark:bg-[#1A2218] p-10 rounded-[2rem] shadow-lg border border-orange-50 dark:border-[#2A3626] hover:shadow-2xl dark:shadow-black/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-center items-start relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 text-9xl opacity-5 group-hover:scale-110 transition-transform">🥭</div>
               <h3 className="text-3xl font-bold text-[#2A3626] dark:text-white mb-4 relative z-10">Traditional Pickles</h3>
               <p className="text-gray-600 dark:text-[#A8B49B] mb-8 relative z-10 text-sm">From tangy Lemon to spicy Jackfruit, authentic recipes passed down generations.</p>
               <Link to="/products?category=Pickles" className="btn-primary relative z-10">Explore Pickles</Link>
             </div>
             
             <div className="bg-[#F9F7F1]/50 dark:bg-[#1A2218] p-10 rounded-[2rem] shadow-lg border border-orange-50 dark:border-[#2A3626] hover:shadow-2xl dark:shadow-black/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-center items-start relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🍹</div>
               <h3 className="text-3xl font-bold text-brand-orange dark:text-[#F97316] mb-4 relative z-10">Refreshing Drinks</h3>
               <p className="text-gray-600 dark:text-[#A8B49B] mb-8 relative z-10 text-sm">Cooling Sharbats & Crushes prepared traditionally for the perfect summer relief.</p>
               <Link to="/products?category=Drinks" className="btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white relative z-10">Explore Drinks</Link>
             </div>

             <div className="bg-[#F9F7F1]/50 dark:bg-[#1A2218] p-10 rounded-[2rem] shadow-lg border border-orange-50 dark:border-[#2A3626] hover:shadow-2xl dark:shadow-black/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-center items-start relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🥨</div>
               <h3 className="text-3xl font-bold text-[#2A3626] dark:text-white mb-4 relative z-10">Crispy Farsan</h3>
               <p className="text-gray-600 dark:text-[#A8B49B] mb-8 relative z-10 text-sm">Crunchy Chivda, melt-in-the-mouth Besan Ladoos, Chakali, and Shev.</p>
               <Link to="/products?category=Farsan" className="btn-primary relative z-10">Explore Farsan</Link>
             </div>

             <div className="bg-[#F9F7F1]/50 dark:bg-[#1A2218] p-10 rounded-[2rem] shadow-lg border border-orange-50 dark:border-[#2A3626] hover:shadow-2xl dark:shadow-black/40 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-center items-start relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🌰</div>
               <h3 className="text-3xl font-bold text-[#8A5A44] dark:text-[#CF6B2B] mb-4 relative z-10">Dry Fruits Items</h3>
               <p className="text-gray-600 dark:text-[#A8B49B] mb-8 relative z-10 text-sm flex-grow">Energy Balls, premium Chocolates, rich Chikki, and nutritious dry fruit sweets.</p>
               <div className="mt-auto pt-4">
                 <Link to="/products?category=Dry Fruits Items" className="btn-outline border-[#8A5A44] text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white relative z-10">Explore Dry Fruits</Link>
               </div>
             </div>
           </div>
         </div>
      </section>

      {/* Video Modal Popup */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <div 
            className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-brand-orange text-white rounded-full transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <video 
              src={activeVideo} 
              autoPlay 
              controls 
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Trust Section */}
      <section className="py-20 bg-[#2A3626] dark:bg-[#111611] text-white text-center transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-[#EAE3D3]">Why Trust Snackza Foods?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-blue-100">
             <div>
               <div className="text-5xl mb-4">👩‍🍳</div>
               <h4 className="text-xl font-bold mb-2 text-white">100% Homemade</h4>
               <p className="text-sm">Prepared in hygienic home kitchens, ensuring purity and traditional taste in every bite.</p>
             </div>
             <div>
               <div className="text-5xl mb-4">🌿</div>
               <h4 className="text-xl font-bold mb-2 text-white">No Preservatives</h4>
               <p className="text-sm">We strictly avoid artificial colors or chemical preservatives. Only natural goodness.</p>
             </div>
             <div>
               <div className="text-5xl mb-4">💎</div>
               <h4 className="text-xl font-bold mb-2 text-white">Premium Quality</h4>
               <p className="text-sm">We handpick the finest ingredients, spices, and oils to deliver exceptional quality.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
