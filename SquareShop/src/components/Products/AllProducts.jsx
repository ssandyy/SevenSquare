import { useEffect, useRef, useState } from 'react';
import { useCartContext } from '../../contexts/CartContext/CartContext';
import ProductCard from '../Card/ProductCard';
import Pagination from '../Pagination/Pagination';

const AllProducts = () => {
  const [page, setPage] = useState(1);
  const { state: { products = [], loading, error } } = useCartContext();
  const containerRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;

      if (width >= 1536) setItemsPerPage(16);
      else if (width >= 1280) setItemsPerPage(12);
      else if (width >= 1024) setItemsPerPage(8);
      else if (width >= 640) setItemsPerPage(6);
      else setItemsPerPage(4);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center justify-end text-gray-600">
        <h2 className="text-2xl font-semibold">Error loading products</h2>
        <p>{error}</p>
      </div>
    );
  }

  // If products is null/undefined or empty array
  if (!products || products.length === 0) {
    return (
      <div className="p-6 text-center justify-end text-gray-600">
        <h2 className="text-2xl font-semibold">No Products Available</h2>
        <p className="mt-2">There are currently no products in the store.</p>
        {/* Optional: Add a button to refresh or add products */}
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  }

  const paginationStartIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = products.slice(paginationStartIndex, paginationStartIndex + itemsPerPage);

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 max-w-7xl mx-auto gap-6 p-4">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} details={product} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default AllProducts;