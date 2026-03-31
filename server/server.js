require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/snackza')
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Initial mock products insertion if empty
const seedProducts = async () => {
  const Product = require('./models/Product');
  const count = await Product.countDocuments();
  if (count === 0) {
    const initialProducts = [
      { name: 'Mango Pickle', price: 200, description: 'Traditional homemade mango pickle without preservatives.', category: 'Pickles', image: '/assets/mango-pickle.png' },
      { name: 'Mixed Pickle', price: 180, description: 'Delicious blend of various vegetables and spices.', category: 'Pickles', image: '/assets/mixed-pickle.png' },
      { name: 'Lemon Pickle', price: 150, description: 'Tangy and flavorful homemade lemon pickle.', category: 'Pickles', image: '/assets/lemon-pickle.jpg' },
      { name: 'Turmeric Pickle', price: 220, description: 'Fresh raw turmeric pickle with healthy spices.', category: 'Pickles', image: '/assets/turmeric-pickle.jpg' },
      { name: 'Wood Apple (Kavath) Pickle', price: 250, description: 'Unique and traditional wood apple pickle.', category: 'Pickles', image: '/assets/kavath-pickle.jpg' },
      { name: 'Jackfruit Pickle', price: 260, description: 'Spicy homemade jackfruit pickle.', category: 'Pickles', image: '/assets/jackfruit-pickle.jpg' },
      { name: 'Amla (Gooseberry) Pickle', price: 190, description: 'Healthy amla pickle packed with Vitamin C.', category: 'Pickles', image: '/assets/amla-pickle.jpg' },
      { name: 'Lemon Crush', price: 150, description: 'Refreshing lemon crush for hot summers.', category: 'Drinks & More', image: '/assets/lemon-crush.jpg' },
      { name: 'Amla Sharbat', price: 180, description: 'Cooling and healthy amla sharbat.', category: 'Drinks & More', image: '/assets/amla-sharbat.jpg' },
      { name: 'Wood Apple Sharbat', price: 200, description: 'Traditional healthy summer cooler.', category: 'Drinks & More', image: '/assets/wood-apple-sharbat.jpg' },
      { name: 'Special Sharbat', price: 220, description: 'Our signature secret recipe sharbat.', category: 'Drinks & More', image: '/assets/special-sharbat.png' },
      { name: 'Rose Sharbat', price: 170, description: 'Classic homemade refreshing rose syrup.', category: 'Drinks & More', image: '/assets/rose-sharbat.png' },
      { name: 'Gulkand', price: 300, description: 'Pure rose petals preserved with organic sugar.', category: 'Drinks & More', image: '/assets/gulkand.jpg' },
      { name: 'Chivda', price: 150, description: 'Crispy and savory homemade roasted chivda.', category: 'Farsan', image: '/assets/chivda.png' },
      { name: 'Besan Ladoo', price: 250, description: 'Traditional homemade besan ladoos made with pure ghee.', category: 'Farsan', image: '/assets/besan_ladoo.png' },
      { name: 'Chakali', price: 180, description: 'Crunchy, spiral Maharashtrian snack made perfectly crispy.', category: 'Farsan', image: '/assets/chakali.png' },
      { name: 'Shev', price: 140, description: 'Classic spicy and crispy gram flour shev.', category: 'Farsan', image: '/assets/shev.png' },
      { name: 'Dry Fruit Ladoo – Energy Ball', price: 350, description: 'Power-packed homemade energy ball containing premium dry fruits and no added sugar.', category: 'Dry Fruits Items', image: '/assets/dry-fruit-ladoo.png' },
      { name: 'Dry Fruit Chocolate Bites', price: 280, description: 'Delicious bite-sized homemade chocolates packed with roasted dry fruits.', category: 'Dry Fruits Items', image: '/assets/dry-fruit-chocolate-bites.png' },
      { name: 'Dry Fruit Cake', price: 450, description: 'Rich, dense, and naturally sweet homemade cake baked with an abundance of premium nuts.', category: 'Dry Fruits Items', image: '/assets/dry-fruit-cake.png' },
      { name: 'Dry Fruit Chikki', price: 200, description: 'Traditional Indian sweet brittle made entirely of dry fruits held together by pure jaggery.', category: 'Dry Fruits Items', image: '/assets/dry-fruit-chikki.png' },
      { name: 'Dry Fruit Panjiri', price: 320, description: 'Highly nutritious homemade traditional supplement packed with roasted dry fruits, ghee, and herbs.', category: 'Dry Fruits Items', image: '/assets/dry-fruit-panjiri.png' },
      { name: 'Dry Fruit Cube', price: 260, description: 'Compact cubes of compressed energy made of premium figs, dates, and assorted nuts.', category: 'Dry Fruits Items', image: '/assets/dry-fruit-cube.png' },
      { name: 'Assorted Dry Fruit Chocolate Bites', price: 300, description: 'A premium roasted assortment of nuts enveloped in artisanal dark chocolate.', category: 'Dry Fruits Items', image: '/assets/premium-dry-fruit-chocolate.png' },
      { name: 'Homemade Chocolates (Cartoon Shapes)', price: 150, description: 'Fun, cute, and delicious homemade chocolates molded into cartoon shapes. Perfect for kids!', category: 'Dry Fruits Items', image: '/assets/cartoon-chocolates.png' }
    ];
    await Product.insertMany(initialProducts);
    console.log('Database seeded with initial products.');
  }
};

mongoose.connection.once('open', () => {
  seedProducts();
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
