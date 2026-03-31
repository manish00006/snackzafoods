import { Phone, MapPin, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-[#F9F7F1] dark:bg-[#161B15] min-h-screen py-10 lg:py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#2A3626] dark:text-[#EAE3D3] mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 dark:text-[#A8B49B] max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our homemade products, bulk orders, or feedback!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Contact Details */}
          <div>
            <div className="bg-white dark:bg-[#1A2218] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transform hover:-translate-y-1 transition-transform">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <ul className="space-y-8">
                <li className="flex items-start">
                  <div className="bg-orange-100 dark:bg-[#CF6B2B]/20 p-3 rounded-full text-[#CF6B2B] mr-4 shrink-0 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Our Kitchen</h4>
                    <p className="text-gray-600 dark:text-[#A8B49B] leading-relaxed">
                      Narayan Elite, Sector 23,<br/>
                      Ghansoli, Navi Mumbai.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-blue-100 dark:bg-[#2A3626] p-3 rounded-full text-[#2A3626] dark:text-[#A8B49B] mr-4 shrink-0 mt-1">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Phone Number</h4>
                    <p className="text-gray-600 dark:text-[#A8B49B]">
                      Primary: +91 91529 09134<br/>
                      Secondary: +91 70214 17839
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full text-green-600 dark:text-green-400 mr-4 shrink-0 mt-1">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Working Hours</h4>
                    <p className="text-gray-600 dark:text-[#A8B49B]">
                      Monday - Saturday: 9:00 AM - 8:00 PM<br/>
                      Sunday: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-[#CF6B2B] to-[#2A3626] dark:from-[#CF6B2B] dark:to-[#0D120C] rounded-3xl p-8 text-white shadow-lg text-center lg:text-left flex flex-col md:flex-row items-center justify-between">
               <div>
                 <h4 className="text-xl font-bold mb-2">🚚 Home Delivery</h4>
                 <p className="text-white/80 text-sm md:text-base max-w-sm">We deliver our fresh, homemade goodness right to your doorstep across Navi Mumbai.</p>
               </div>
               <div className="text-6xl mt-6 lg:mt-0 opacity-80 animate-bounce">🛵</div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white dark:bg-[#1A2218] rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-2">Your Name</label>
                <input type="text" className="input-field bg-gray-50 dark:bg-[#141A13]" placeholder="Shruti Sharma" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-2">Phone Number</label>
                <input type="tel" className="input-field bg-gray-50 dark:bg-[#141A13]" placeholder="+91 98765 43210" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-2">Inquiry Type</label>
                <select className="input-field bg-gray-50 dark:bg-[#141A13] text-gray-700 dark:text-[#EAE3D3]">
                   <option>General Question</option>
                   <option>Bulk Order / Events</option>
                   <option>Delivery Information</option>
                   <option>Feedback</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#A8B49B] mb-2">Message</label>
                <textarea className="input-field bg-gray-50 dark:bg-[#141A13] min-h-[120px] resize-y" placeholder="How can we help you?"></textarea>
              </div>
              
              <button className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center group bg-[#2A3626] dark:bg-[#CF6B2B] hover:bg-[#1A2218] dark:hover:bg-[#F97316]">
                Send Message <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
