import { useEffect, useRef, useState } from 'react';
import { useCartContext } from '../../contexts/CartContext/CartContext';
import ProductCard from '../Card/ProductCard';
import Pagination from '../Pagination/Pagination';

const AllProducts = () => {
      const [page, setPage] = useState(1);
      // const {products} = useCartContext()

      //  const { state: {products, cart} } = useCartContext();
        // console.log(state);

  const { state: { products } } = useCartContext();
  const containerRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(8);
 
       
      //  const {state:{products}, dispatch } = useCartContext();

      //  useEffect(() => {
      //   dispatch({
      //     type: "INCREMENT",
      //     payload: products
      //   })
      //  },[])


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
      
      
    //   if (!products || products.length === 0) {
    //          return <p className="text-center text-gray-500">No products available.</p>;
    // }

    const paginationStartIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = products.slice(paginationStartIndex, paginationStartIndex + itemsPerPage)

  return (
    <>
    {products.length <=0 ? (
        <div className="p-6 text-center justify-end text-gray-600">
        <h2 className="text-2xl font-semibold">No Product Found 🛒</h2>
      </div>
          ):(

    <div ref={containerRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto">
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
    
    </>
  )
}

export default AllProducts