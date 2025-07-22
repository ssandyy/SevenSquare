import { useEffect, useState } from "react";
import { useCartContext } from "../../contexts/CartContext/CartContext";

const SearchField = () => {
    const [searchResult, setSearchResult] = useState('');
    const {state: {unfilteredProducts}, dispatch} = useCartContext();


// debounce/delay search functionality implemented for 1 sec
    useEffect(()=>{
        const debounceSearch = setTimeout(()=> {
            const filteredItems = unfilteredProducts.filter((product) => {
                // console.log(product)
                return (product.productName.toLowerCase().includes(searchResult.toLowerCase()) 
                || 
                product.productDescription.toLowerCase().includes(searchResult.toLowerCase()))
            })
            dispatch({
                type: 'FILTERED_PRODUCTS',
                payload: filteredItems
            })
            // console.log(filteredItems);

        },1000)
        return () => clearTimeout(debounceSearch);
        
    },[searchResult, unfilteredProducts, dispatch])


  return (
    <>
    <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
          value={searchResult}
          onChange={(e) => setSearchResult(e.target.value)}
        />
    </>
    
  )
}

export default SearchField