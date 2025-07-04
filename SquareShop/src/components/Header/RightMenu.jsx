  import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext/CartContext";

  const RightMenu = () => {
    
    const {state:{cart}} = useCartContext();
    const cartCount = cart.length;
    // using accumulator 
    const subTotal = cart.reduce((accumulator, currentValue)=> accumulator + (currentValue.price) * (currentValue.quantity), 0);
    
    const navigate = useNavigate();
    

    return (
      <>  
        <div className="flex-none">
        {/* Cart Dropdown */} 
        <div className="dropdown dropdown-end duration-200">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="badge badge-sm indicator-item">{cartCount}</span>
            </div>
          </div>
          <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow">
            <div className="card-body">
              <span className="text-lg font-bold">{cartCount} Items</span>
              <span className="text-info">Subtotal: ₹{subTotal}</span>
              <div className="card-actions">
                <button onClick={() => navigate('/cart')} className="btn btn-primary btn-block">View cart</button>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end justify-right">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li><a className="justify-between">Profile <span className="badge">New</span></a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
      </>
    )
  }

  export default RightMenu