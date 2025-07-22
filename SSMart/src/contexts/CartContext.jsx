import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  console.log(cart);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    console.log(cart);
  }

  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  }

  const incrementQuantity = (product) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id && item.quantity < product.quantity ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  const decrementQuantity = (product) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
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
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, incrementQuantity, decrementQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
