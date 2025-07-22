import { useEffect, useMemo, useRef, useState } from "react";
import { useCartContext } from "../../contexts/CartContext/CartContext";
import Ratings from "../Rating/Ratings";

const FilterBar = () => {
  const initialFilters = {
    price: 50000,
    ratings: 1,
    sortingType: null,
    includeOutOfStock: true,
    fastDelivery: false,
  };

  const {
    state: { unfilteredProducts = [] },
    dispatch,
  } = useCartContext();

  const [filters, setFilters] = useState(initialFilters);
  const previousProducts = useRef(unfilteredProducts);

  // Memoize filtered products with deep comparison
  const filteredProducts = useMemo(() => {
    // Skip if products haven't changed
    if (JSON.stringify(unfilteredProducts) === JSON.stringify(previousProducts.current)) {
      return;
    }
    previousProducts.current = unfilteredProducts;

    if (!unfilteredProducts || unfilteredProducts.length === 0) return [];

    const filtered = unfilteredProducts.filter((product) => {
      if (!product) return false;
      
      const priceMatch = product.price <= filters.price;
      const ratingMatch = product.ratings >= filters.ratings;
      const stockMatch = filters.includeOutOfStock ? true : product.inStock > 0;
      const deliveryMatch = filters.fastDelivery ? product.fastDelivery : true;
      
      return priceMatch && ratingMatch && stockMatch && deliveryMatch;
    });

    if (filters.sortingType) {
      return [...filtered].sort((a, b) => {
        return filters.sortingType === "ascending"
          ? a.productName?.localeCompare(b.productName)
          : b.productName?.localeCompare(a.productName);
      });
    }

    return filtered;
  }, [unfilteredProducts, filters]);

  // Only dispatch when products actually change
  useEffect(() => {
    if (filteredProducts === undefined) return;
    
    dispatch({
      type: "SET_PRODUCTS",
      payload: filteredProducts,
    });
  }, [filteredProducts, dispatch]);

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClearFilter = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="min-w-[15rem] border-r border-r-white/10 p-6 sticky top-[5rem]">
      {/* radio ascending and descending */}
      <div>
        <p>{"Sort A-Z     ↑/↓"}</p>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Ascending</span>
            <input
              type="radio"
              name="sortingType"
              className="radio checked:bg-blue-500"
              value="ascending"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Descending</span>
            <input
              type="radio"
              name="sortingType"
              className="radio checked:bg-red-500"
              value="descending"
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
      <div className="h-[1px] w-full bg-white/20 my-6"></div>
      {/* check box for out of stock and fast deliver */}
      <div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Include Out Of Stock</span>
            <input
              type="checkbox"
              checked={filters.includeOutOfStock}
              name="includeOutOfStock"
              className="checkbox checkbox-success"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Fast Delivery Only</span>
            <input
              type="checkbox"
              checked={filters.fastDelivery}
              name="fastDelivery"
                className="checkbox checkbox-error"
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>

      {/* ratings */}
      <div className="my-6">
        <Ratings
          defaultRating={filters.ratings}
          isEditable={true}
          onRatingChange={(rating) =>
            setFilters((prev) => ({
              ...prev,
              ratings: rating,
            }))
          }
        />
      </div>

      {/* price range */}
      <div className="flex flex-col gap-3 my-8">
        <p>
          Price: <strong>{filters.price}</strong> Rs
        </p>
        <input
          type="range"
          min={0}
          max={5000}
          name="price"
          value={filters.price}
          className="range range-info"
          onChange={handleInputChange}
        />
      </div>

      {/* clear filter */}
      <button onClick={handleClearFilter} className="btn btn-neutral w-full">
        Clear Filters
      </button>
    </div>
  );
};

export default FilterBar