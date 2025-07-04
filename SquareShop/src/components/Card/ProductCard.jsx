import Ratings from "../Rating/Ratings";

const ProductCard = ({ details }) => {

    return (
        <>
            <div className="card bg-slate-300 shadow-xl w-[18rem] p-2">
                <figure>
                    <img
                        src={details.image}
                        alt="Shoes"
                        className="aspect-video object-fill"
                    />
                </figure>
                <div className="card-body p-0.5">
                    <h2 className="card-title line-clamp-1">{details.productName}
                        {details.new &&
                            <div className="badge badge-secondary">New</div>
                        }
                    </h2>
                    <p className="line-clamp-2">{details.productDescription}</p>
                    <p><strong>Price: ₹{details.price}</strong></p>
                    {(details.inStock) > 0 ? <p className="text-green-500"> In Stock </p> : <p className="text-red-500"> Out Of Stock</p>}

                    {details.fastDelivery &&
                        <p>Fast Delivery Avaialble..</p>
                    }
                    <Ratings defaultRating={details.ratings} isEditable={false} />
                    {/* {console.log(details.ratings)} */}

                    <div className="card-actions justify-between">
                        <button className="btn btn-primary">Add To Cart</button>
                        <button className="btn btn-info">Buy Now</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard