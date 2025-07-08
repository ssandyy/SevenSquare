import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LogoutBtn } from "../../../../BlogProject/src/components";
import { AuthService } from "../../appwrite/auth";
import { useCartContext } from "../../contexts/CartContext/CartContext";
import Button from "../Button";

  const RightMenu = () => {
    
    const { state: {cart} } = useCartContext();
    const cartCount = cart.length;
    const navigate = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData?.userData.name);

    // using accumulator 
    const subTotal = cart.reduce((accumulator, currentValue)=> accumulator + (currentValue.price) * (currentValue.quantity), 0);

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
          {authStatus ? (
              <>
                <li className='mr-4 flex items-center'>
                  <Link to='/' className="flex items-center space-x-2 hover:bg-blue-100 px-2 py-2 rounded-full duration-200">
                    <img src={
                              userData?.profileImage ? AuthService.getFilePreview(userData.profileImage)
                                : `https://ui-avatars.com/api/?name=${userData || 'User'}&background=random`   // : "/images/avatar.png" // or use a URL like 
                              }
                              onError={(e) => {
                              e.target.src = "https://www.flaticon.com/free-icons/astronaut"; // fallback on error
                          }}
                          
                          alt="https://www.flaticon.com/free-icons/astronaut"
                          className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className='hidden md:inline-block text-black font-semibold'>
                        {userData || "Profile"}
                      </span>
                  </Link>
                
                {/* <span className="ml-2">
                  <LogoutBtn  />
                </span> */}
                  
                </li>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            <li onClick={() => navigate("/profile")} ><a className="justify-between">Profile <span className="badge">New</span></a></li>
            <li onClick={() => navigate("/edit-profile")}><a>Settings</a></li>
            <li ><LogoutBtn /></li>
          </ul>
            </>
            ) : (
              <Button variant="link" onClick={() => navigate('/login')}>
                  Login || Signup
              </Button>
            )}
          {/* <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
             <Link to='/profile' className="flex items-center space-x-2 hover:bg-blue-100 px-2 py-2 rounded-full duration-200">
                    <img src={
                              userData?.profileImage ? AuthService.getFilePreview(userData.profileImage)
                                : `https://ui-avatars.com/api/?name=${userData || 'User'}&background=random`   // : "/images/avatar.png" // or use a URL like 
                              }
                              onError={(e) => {
                              e.target.src = "https://www.flaticon.com/free-icons/astronaut"; // fallback on error
                          }}
                          
                          alt="https://www.flaticon.com/free-icons/astronaut"
                          className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className='hidden md:inline-block text-black font-semibold'>
                        {userData || "Profile"}
                      </span>
                  </Link>
            </div>
          </div> */}
          
        </div>
      </div>
      </>
    )
  }

  export default RightMenu