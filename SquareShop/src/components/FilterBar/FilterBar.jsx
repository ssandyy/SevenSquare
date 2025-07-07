import { useState, useEffect } from "react";
import Ratings from "../Rating/Ratings";
import { useCartContext } from "../../contexts/CartContext/CartContext";

const FilterBar = () => {
  const initialFilters = {
    price: 50000,
    ratings: 1,
    sortingType: false,
    includeOutOfStock: true,
    fastDelivery: false,
  };

  const {
    state: { unfilteredProducts },
    dispatch,
  } = useCartContext();

  const [filters, setFilters] = useState(initialFilters);

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

  useEffect(() => {
    let filteredItems = unfilteredProducts.filter((p) => {
      let priceCondition = p.price <= filters.price;
      let ratingCondition = p.ratings >= filters.ratings;
      let includeOutOfStockCondition = filters.includeOutOfStock
        ? true
        : p.inStock;
      let deliveryCondition = filters.fastDelivery ? p.fastDelivery : true;
      return (
        includeOutOfStockCondition &&
        priceCondition &&
        ratingCondition &&
        deliveryCondition
      );
    });

    filteredItems = filters.sortingType
      ? filteredItems.sort((Pa, Pb) => {
          return filters.sortingType === "ascending"
            ? Pa.productName.localeCompare(Pb.productName)
            : Pb.productName.localeCompare(Pa.productName);
        })
      : filteredItems;

    dispatch({
      type: "SET_PRODUCTS",
      payload: filteredItems,
    });
  }, [filters, unfilteredProducts]);

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