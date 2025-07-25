import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { MarketingPromo, Product } from "../components";
import Pagination from "../components/pagination/Pagination";
import usePagination from "../components/pagination/usePagination";

const Home = () => {
  const { products } = useContext(ProductContext);
  console.log(JSON.stringify(products, null, 2));
  // const featuredProducts = products.slice(0, 4);
  const { currentPage, setCurrentPage, currentProducts, totalPages, itemsPerPage} = usePagination(products, 8);


  return (
    <>
    <div className=" mx-auto m-3 p-3 text-center justify-center">
      <MarketingPromo />
    </div>
    <div className="container mx-auto m-3 p-3 text-center justify-center">
       <Product product={currentProducts} containerClassName="grid grid-cols-1 md:grid-cols-2 justify-center lg:grid-cols-3 xl:grid-cols-4 gap-2" cardClassName="w-[320px] max-w-sm" />
    </div>
    <div className="container mx-auto m-3 p-3 text-center justify-center">
      <Pagination totalItems={products.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
    </>
  );
};

export default Home;
