import { useCartContext } from "../../contexts/CartContext/CartContext";
import Ratings from "../Rating/Ratings";

const ProductCard = ({ details }) => {

    const {state: {cart}, dispatch} = useCartContext();


    const handleAddToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: details
        })
    }

    const handleRemoveFromCart = () => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: details
    })
}

    return (
        <>
            <div className="card bg-slate-300 shadow-xl w-[18.5rem]">
                <figure>
                    <img
                        src={details.image}
                        alt="product"
                        className="aspect-video object-fill"
                    />
                </figure>
                <div className="card-body p-1">
                    <h2 className="card-title line-clamp-1">{details.productName}
                        {details.new &&
                            <div className="badge badge-secondary ">New</div>
                        }
                    </h2>
                    <p className="line-clamp-2">{details.productDescription}</p>
                    <h3 className="flex"><strong>Price: ₹{details.price}</strong>
                        {(details.inStock) > 0 ? <p className="text-green-500 text-right"> In Stock </p> : <p className="text-red-500 text-right"> Out Of Stock</p>}
                    </h3>
                    

                    {details.fastDelivery ? 
                        (<p>Fast Delivery Avaialble..</p>)
                        : (
                            <p>Normal Delivery Available..</p>
                        )
                    }
                    <Ratings defaultRating={details.ratings} isEditable={false} />
                    {/* {console.log(details.ratings)} */}

                <div className="card-actions justify-between m-1">
                    {
                    cart.some((p) => p.id === details.id) ? (
                        <button 
                        onClick={handleRemoveFromCart} 
                        className="btn btn-warning w-inherit">
                            Remove from Cart
                        </button>
                        ) : (
                        <button onClick={handleAddToCart} className="btn btn-neutral w-inherit">
                            Add To Cart
                        </button>
                        )
                    }
                        <button className="btn btn-info w-inherit">Buy Now</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard