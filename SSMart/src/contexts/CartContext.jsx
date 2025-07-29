import React, { createContext, useContext, useEffect, useState } from 'react';
import CartService from '../services/cartService';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

// Add the useCart hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function getDiscountedPrice(originalPrice) {
  const min = 10, max = 40;
  const pseudoRandom = Math.abs(Math.sin(originalPrice)) % 1; // deterministic for same price
  const discountPercent = Math.floor(pseudoRandom * (max - min + 1)) + min;
  const offerPrice = (originalPrice * (1 - discountPercent / 100)).toFixed(2);
  return { offerPrice, originalPrice, discountPercent };
}


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartQty, setCartQty] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalSaving, setTotalSaving] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [totalDiscountedPrice, setTotalDiscountedPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Load user's cart when user changes
  useEffect(() => {
    console.log('CartContext: currentUser changed:', currentUser?.uid || 'null');
    if (currentUser) {
      loadCart();
    } else {
      console.log('CartContext: Clearing cart state');
      setCart([]);
      setCartQty(0);
      setCartTotal(0);
      setTotalSaving(0);
      setDiscountedPrice(0);
      setTotalDiscountedPrice(0);
    }
  }, [currentUser?.uid]); // Use currentUser.uid instead of currentUser object

  const loadCart = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userCart = await CartService.getUserCart(currentUser.uid);
      setCart(userCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // total quantity
  useEffect(() => {
    const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartQty(totalQty);
    console.log("Total Qty:", totalQty); // Log the calculated value
  }, [cart]);


  useEffect(() => {
    const discount = cart.reduce((acc, item) => acc + item.price * item.quantity - getDiscountedPrice(item.price).offerPrice * item.quantity, 0)
    setTotalSaving(discount.toFixed(2))
  }, [cart])
  
  // total price
  useEffect(() => {
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity,0).toFixed(2)
    setCartTotal(totalAmount)
  }, [cart])
 
  useEffect(() => {
    const totalAmount = cart.reduce((total, item) => total + getDiscountedPrice(item.price).offerPrice * item.quantity,0).toFixed(2)
    setTotalDiscountedPrice(totalAmount)
  }, [cart])


  useEffect(() => {
    const discountedPrice = cart.reduce((total, item) => total + getDiscountedPrice(item.price).offerPrice * item.quantity,0).toFixed(2)
    setDiscountedPrice(discountedPrice)
  }, [cart])


  const addToCart = async (product) => {
    if (!currentUser) {
      throw new Error('Please login to add items to cart');
    }

    try {
      const updatedCart = await CartService.addToCart(currentUser.uid, product);
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;

    try {
      const updatedCart = await CartService.removeFromCart(currentUser.uid, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const incrementQuantity = async (productId) => {
    if (!currentUser) return;

    try {
      const updatedCart = await CartService.incrementQuantity(currentUser.uid, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error incrementing quantity:', error);
      throw error;
    }
  };

  const decrementQuantity = async (productId) => {
    if (!currentUser) return;

    try {
      const updatedCart = await CartService.decrementQuantity(currentUser.uid, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error decrementing quantity:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    try {
      const updatedCart = await CartService.clearCart(currentUser.uid);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // const addToCart = (product) => {
  //   const newItem = {...product, quantity: 1};

  //   const existingItem = cart.find((item) => item.id === product.id);

  //   if(existingItem) {
  //       const newCartbucket = [...cart].map((item) => {
  //         if(item.id === product.id){
  //           return {...item, quantity: item.quantity + 1}
  //         }
  //         return item;
  //       })
  //       setCart(newCartbucket);
  //   } else {
  //     setCart([...cart, newItem])
  //   }
  // }
  // const removeFromCart = (product) => {
  //   const newCartbucket = [...cart].filter((item) => item.id !== product.id);
  //   setCart(newCartbucket);
  // }

  return (
    <CartContext.Provider value={{ 
      cart, 
      discountedPrice, 
      addToCart, 
      removeFromCart, 
      incrementQuantity, 
      totalDiscountedPrice, 
      decrementQuantity, 
      cartQty, 
      cartTotal, 
      totalSaving,
      clearCart,
      loading,
      loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
