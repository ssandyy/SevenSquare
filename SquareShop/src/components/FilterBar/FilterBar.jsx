import { useState } from "react";
import Ratings from "../Rating/Ratings";

const FilterBar = () => {

    const [filters, setFilters] = useState({
        price: 2365,
        ratings: 3,
        fastDelivery: false,
        includeOutOfStock: true,
        sortingType: false,

    })

     const handleInputChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            }));
    };

    return (
        <div className="w-full bg-gray-300 min-h-screen min-w-[15rem] border-r border-r-white/10 p-6 sticky top-[3.5rem]">


            {/* radio ascending and descending */}
            <div>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">Ascending</span>
                        <input
                            type="radio"
                            name="sortingType"
                            className="radio checked:bg-blue-500"
                            value="ascending"
                            onChange={handleInputChange}
                            defaultChecked
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
                    min={5}
                    max={5000}
                    name="price"
                    value={filters.price}
                    className="range range-info"
                    onChange={handleInputChange}
                />
            </div>

            {/* clear filter */}
            <button
                // onClick={handleClearFilter} 
                className="btn btn-neutral w-full">
                Clear Filters
            </button>

        </div>
    )
}

export default FilterBar