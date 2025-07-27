import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { MarketingPromo, Product } from "../components";
import Pagination from "../components/pagination/Pagination";
import usePagination from "../components/pagination/usePagination";
import { Loader2 } from "lucide-react";

// Generic ProductList component
const ProductList = ({ products, title = "All Products", showHero = true, loading = false }) => {
  const { currentPage, setCurrentPage, currentProducts, totalPages, itemsPerPage, totalItems } = usePagination(products);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <>
      {showHero && (
        <div className="mx-auto m-3 p-3 text-center justify-center">
          <MarketingPromo />
        </div>
      )}
      
      {title && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h1>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-6">
        <Product product={currentProducts} containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" cardClassName="w-full" />
      </div>
      
      {products.length > 0 && (
        <Pagination 
          totalItems={totalItems} 
          itemsPerPage={itemsPerPage} 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
      )}
      
      {products.length === 0 && !loading && (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-gray-500 text-lg">
            No products found. Please add some products in the admin panel.
          </div>
          <div className="mt-4">
            <a 
              href="/admin/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        </div>
      )}
    </>
  );
};

const Home = () => {
  const { products, loading } = useContext(ProductContext);
  console.log('Products from context:', products.length, 'Loading:', loading);

  return <ProductList products={products} loading={loading} />;
};

export default Home;
export { ProductList };
