import AllProducts from "../../../components/Products/AllProducts";
// import { useCartContext } from "../../../contexts/CartContext/CartContext";

const Body = () => {
  // const {products} = useCartContext()


  return (
    <>
        {/* <div  className="grid grid-cols-3 gap-[1rem] max-md:grid-cols-1 max-lg:grid-cols-2 p-2"> */}
        {/* {products.map((productsDetails)=>{
        return <ProductCard key={productsDetails.id} details={productsDetails} />
        // })} */}
        {/* </div> */}
      
      
    <div className="flex justify-around">
        <AllProducts />
    </div>
      
    
    
    </>
  )
}

export default Body