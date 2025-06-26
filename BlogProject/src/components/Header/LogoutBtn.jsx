import { useDispatch } from "react-redux";
import authService from "../../appwrite/auth";
import { logout } from "../../Store/authSlice";


const LogoutBtn = () => {

    const dispatch = useDispatch();

    const handleLogout = () => {
        authService.logout()
                    .then(() => {
                        dispatch(logout());
                        //dispatch({ type: 'auth/logout' });
                    })
                    .catch((error) => {
                        console.error("Logout failed:", error);
                    });
    };

  return (
    <>
    <div>
        <button  onClick={handleLogout} className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
            Logout</button>
    </div>
    </>
    
  )
}

export default LogoutBtn