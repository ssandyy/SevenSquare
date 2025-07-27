import React, { createContext, useEffect, useState } from 'react';
import { productsService } from '../services/adminService';
import { getProductImage } from '../utils/imageStorage';

export const ProductContext = createContext();

// Utility function to get offer price, original price, and discount percent
const calculatePricing = (price) => {
  const originalPrice = price;
  const discountPercent = Math.floor(Math.random() * 30) + 10; // 10-40% discount
  const offerPrice = originalPrice - (originalPrice * discountPercent / 100);
  return { offerPrice: Math.round(offerPrice * 100) / 100, originalPrice, discountPercent };
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define pools of possible colors and sizes
  const colorPool = ['#27AE60', '#EB5757', '#F2C94C', '#2F80ED', '#000000', '#FF5733', '#8E44AD', '#34495E'];
  const sizePool = [16, 18, 20, 22, 24, 26, 28, 30];

  function getRandomSubset(array, min = 2, max = 4) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const firebaseProducts = await productsService.getAllProducts();
      
      // Transform Firebase products to match frontend format
      const transformedProducts = firebaseProducts.map(product => {
        const pricing = calculatePricing(product.price);
        return {
          id: product.id,
          title: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          image: getProductImage(product.id, product.image), // Use localStorage images
          rating: {
            rate: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            count: Math.floor(Math.random() * 100) + 50
          },
          quantity: product.stock,
          colors: getRandomSubset(colorPool),
          sizes: getRandomSubset(sizePool),
          offerPrice: pricing.offerPrice,
          originalPrice: pricing.originalPrice,
          discountPercent: pricing.discountPercent,
          status: product.status
        };
      });

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to fake data if Firebase fails
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        const productsWithExtras = data.map(product => ({
          ...product,
          quantity: Math.floor(Math.random() * 10) + 1,
          colors: getRandomSubset(colorPool),
          sizes: getRandomSubset(sizePool),
        }));
        setProducts(productsWithExtras);
      } catch (fallbackError) {
        console.error('Error fetching fallback data:', fallbackError);
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to refresh products (can be called when admin adds new products)
  const refreshProducts = () => {
    fetchProducts();
  };
  
  return (
    <ProductContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;
