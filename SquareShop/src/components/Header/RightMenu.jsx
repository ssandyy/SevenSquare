import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../appwrite/auth";
import { useCartContext } from "../../contexts/CartContext/CartContext";
import Button from "../Button";
import LogoutBtn from "../LogoutBtn"; // Update this import path

const RightMenu = () => {
  const { state: { cart } } = useCartContext();
  const cartCount = cart.length;
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData?.userData);

  
  const userName = userData?.name || 'User';
  const profileImage = userData?.profileImage;
  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
console.log(userData?.name);
  return (
    <div className="flex items-center gap-4">
      {/* Cart Dropdown - Always Visible */}
      <div className="dropdown dropdown-end">
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
              <button 
                onClick={() => navigate('/cart')} 
                className="btn btn-primary btn-block"
              >
                View cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Dropdown - Conditionally Rendered */}
      {authStatus ? (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img 
                src={
                  profileImage
                    ? AuthService.getFilePreview(profileImage)
                    : `https://ui-avatars.com/api/?name=${userName}&background=random`
                }
                onError={(e) => {
                  e.target.src = "https://www.flaticon.com/free-icons/astronaut";
                }}
                alt="Profile"
              />
              
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
            
              <a className="justify-between" onClick={() => navigate('/profile')}>
                Profile
                
                <span className="badge">New</span>
              </a>
            </li>
            {/* <li><a onClick={() => navigate('/settings')}>Settings</a></li> */}
            <li><LogoutBtn /></li>
          </ul>
        </div>
      ) : (
        <Button 
          onClick={() => navigate('/login')}
          className="btn-primary"
        >
          Login / Signup
        </Button>
      )}
    </div>
  );
};

export default RightMenu;