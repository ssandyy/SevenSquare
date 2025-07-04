import { useState } from 'react';
import { useCartContext } from '../../contexts/CartContext/CartContext';
import ProductCard from '../Card/ProductCard';
import Pagination from '../Pagination/Pagination';

const AllProducts = ({itemsPerPage}) => {
      const [page, setPage] = useState(1);
      const {products} = useCartContext()
      
    const paginationStartIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = products.slice(paginationStartIndex, paginationStartIndex + itemsPerPage)

    if (!products || products.length === 0) {
             return <p className="text-center text-gray-500">No products available.</p>;
    }
    
  return (
    <div>
        <div className="grid grid-cols-4 gap-[1rem]  max-md:grid-cols-1 max-lg:grid-cols-2 p-2 max-xl:grid-cols-3">
              {paginatedProducts.map((post) => (
                
                  <ProductCard key={post.id} details={post} />
              ))}
        </div>
        <Pagination
            currentPage={page}
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
        />
    </div>
  )
}

export default AllProducts