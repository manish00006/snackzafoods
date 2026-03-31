import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Plus, Edit, Trash2 } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch these from your backend
    // fetch('/api/products').then(r => r.json()).then(setProducts);
    // fetch('/api/orders').then(r => r.json()).then(setOrders);
    
    // Mocking for now
    setProducts([
      { _id: '1', name: 'Mango Pickle', price: 200, category: 'Pickles', stock: 50 },
      { _id: '2', name: 'Amla Sharbat', price: 180, category: 'Drinks & More', stock: 30 }
    ]);
    setOrders([
      { _id: 'ord_1', customerName: 'Manish P', phone: '9876543210', totalAmount: 380, status: 'Pending', createdAt: new Date().toISOString() }
    ]);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-brand-blue mb-8">Admin Dashboard</h1>
        
        <div className="flex gap-4 mb-8">
           <button 
             onClick={() => setActiveTab('products')}
             className={`px-6 py-3 rounded-xl font-bold flex items-center shadow-sm ${activeTab === 'products' ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
           >
             <Package className="w-5 h-5 mr-2" /> Manage Products
           </button>
           <button 
             onClick={() => setActiveTab('orders')}
             className={`px-6 py-3 rounded-xl font-bold flex items-center shadow-sm ${activeTab === 'orders' ? 'bg-brand-orange text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
           >
             <ShoppingCart className="w-5 h-5 mr-2" /> View Orders
           </button>
        </div>

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Products List</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add New Product
                </button>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                   <tr>
                     <th className="p-4 font-semibold">Name</th>
                     <th className="p-4 font-semibold">Category</th>
                     <th className="p-4 font-semibold">Price</th>
                     <th className="p-4 font-semibold">Stock</th>
                     <th className="p-4 font-semibold text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {products.map(p => (
                     <tr key={p._id} className="hover:bg-gray-50">
                       <td className="p-4 font-medium text-gray-900">{p.name}</td>
                       <td className="p-4 text-gray-600">{p.category}</td>
                       <td className="p-4 text-gray-600">₹{p.price}</td>
                       <td className="p-4 text-gray-600">{p.stock}</td>
                       <td className="p-4 flex justify-end gap-2 text-right">
                          <button className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit className="w-4 h-4"/></button>
                          <button className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 className="w-4 h-4"/></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 text-gray-600 text-sm border-b">
                   <tr>
                     <th className="p-4 font-semibold">Order ID</th>
                     <th className="p-4 font-semibold">Customer</th>
                     <th className="p-4 font-semibold">Phone</th>
                     <th className="p-4 font-semibold">Total</th>
                     <th className="p-4 font-semibold">Date</th>
                     <th className="p-4 font-semibold">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {orders.map(o => (
                     <tr key={o._id} className="hover:bg-gray-50">
                       <td className="p-4 font-medium text-gray-900">#{o._id.substring(0,8)}</td>
                       <td className="p-4 text-gray-600">{o.customerName}</td>
                       <td className="p-4 text-gray-600">{o.phone}</td>
                       <td className="p-4 font-bold text-gray-900">₹{o.totalAmount}</td>
                       <td className="p-4 text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                       <td className="p-4">
                         <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">
                           {o.status}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
