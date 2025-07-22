import React, { createContext, useEffect, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }, count = 50) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // const fetchProducts  = async () => {
    //   const response = await fetch('https://fakestoreapi.com/products');
    //   const productData = await response.json();
    //   setProducts(productData);
    // }
    // fetchProducts();
    
    (async () => {
      const response = await fetch('https://fakestoreapi.com/products')
          .then(response => response.json())
          .then(data => {
          // console.log(response);
          const productsWithQuantity = data.map(product => ({
            ...product,
            quantity: Math.floor(Math.random() * 10) + 1, // or 0, depending on your use case
          }));
          setProducts(productsWithQuantity);
        })
    })();
  },[])
  
  return (
  <ProductContext.Provider value={{products}}>
    {children}
  </ProductContext.Provider>
  );
}

export default ProductProvider;
