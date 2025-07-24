import React, { createContext, useEffect, useState } from 'react';

export const ProductContext = createContext();

// Utility function to get offer price, original price, and discount percent

export const ProductProvider = ({ children },  count = 50) => {
  const [products, setProducts] = useState([]);

  // Define pools of possible colors and sizes
  const colorPool = ['#27AE60', '#EB5757', '#F2C94C', '#2F80ED', '#000000', '#FF5733', '#8E44AD', '#34495E'];
  const sizePool = [16, 18, 20, 22, 24, 26, 28, 30];

  function getRandomSubset(array, min = 2, max = 4) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  useEffect(() => {
    (async () => {
      await fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
          const productsWithExtras = data.map(product => ({
            ...product,
            quantity: Math.floor(Math.random() * 10) + 1,
            colors: getRandomSubset(colorPool),
            sizes: getRandomSubset(sizePool),
          }));
          setProducts(productsWithExtras);
        });
    })();
  },[])
  
  return (
  <ProductContext.Provider value={{products}}>
    {children}
  </ProductContext.Provider>
  );
}

export default ProductProvider;
