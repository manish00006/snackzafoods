import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('snackza-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('snackza-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // cartKey = _id + '_' + size  (e.g. '1_halfKg')
  // If no size provided, fall back to _id for backward compat
  const getKey = (item) => item.cartKey || item._id;

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const key = getKey(product);
      const existing = prev.find(item => getKey(item) === key);
      if (existing) {
        return prev.map(item =>
          getKey(item) === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prev => prev.filter(item => getKey(item) !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) return removeFromCart(cartKey);
    setCartItems(prev => prev.map(item =>
      getKey(item) === cartKey ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
