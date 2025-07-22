import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // ⬅️ Add this
import authService from "../appwrite/auth"; // Ensure this path is correct
import { logout } from "../Store/authSlice";
import Button from "./Button";

const LogoutBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ⬅️ Hook for navigation

  const handleLogout = () => {
    authService.logout()
      .then(() => {
        dispatch(logout()); // reset redux state
        navigate("/login"); // ⬅️ go to login or home page after logout
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full"
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutBtn;
