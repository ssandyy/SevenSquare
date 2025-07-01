import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";

const UpdatePassword = () => {
    
    // const userData = useSelector((state) => state.auth.userData?.userData);
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    // const cp = currentPassword === userData?.password;
    
    const passwordUpdate = async (e) => {
    e.preventDefault();
    try {
        if (password && currentPassword) {
            await authService.updatePassword(password, currentPassword);
            alert("Password updated successfully!");
            navigate("/profile");
        } else {
            alert("Please fill in all fields");
        }
    } catch (error) {
        alert(`Password update failed: ${error.message}`);
    }
}; 

  return (
    <div>
        <form onSubmit={passwordUpdate} className="max-w-lg mx-auto space-y-4 p-4">
        <h1> UpdatePassword </h1>
            <div className="relative">
                    <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2 border rounded pr-10"
                        required
                    />
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={showCurrentPassword}
                            onChange={() => setShowCurrentPassword(!showCurrentPassword)}
                        />
                        <span>Show Passwords</span>
                        </label>
                </div>

                {/* New Password */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded pr-10"
                        required
                    />
                    <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <span>Show Passwords</span>
                    </label>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                    Change Password
                </button>
      
      </form>
    </div>
    
  )
}


export default UpdatePassword