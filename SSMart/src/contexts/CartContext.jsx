import React, { createContext, useContext, useEffect, useState } from 'react';

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


  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Store the original product quantity as maxQuantity
        return [
          ...prevCart,
          { ...product, quantity: 1, maxQuantity: product.quantity }
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }

  const incrementQuantity = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id && item.quantity < item.maxQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  const decrementQuantity = (product) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === product.id ? item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

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
    // <CartContext.Provider value={{ cart, addToCart, removeFromCart}}>
    <CartContext.Provider value={{ cart, discountedPrice, addToCart, removeFromCart, incrementQuantity, totalDiscountedPrice, decrementQuantity, cartQty, cartTotal, totalSaving}}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
