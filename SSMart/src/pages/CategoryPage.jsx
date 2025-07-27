import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import { ProductList } from './Home';

const CategoryPage = () => {
  const { category } = useParams();
  const { products } = useContext(ProductContext);
  
  // Filter products by category
  const filteredProducts = products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
  
  // Capitalize first letter for title
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  console.log('Category:', category);
  console.log('Filtered Products:', filteredProducts);
  
  return (
    <ProductList 
      products={filteredProducts} 
      title={`${categoryTitle} Products`}
      showHero={false}
    />
  );
};

export default CategoryPage; 