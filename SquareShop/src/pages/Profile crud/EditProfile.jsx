import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import Button from "../../components/Button";

const EditProfile = () => {
  const userData = useSelector((state) => state.auth.userData?.userData);
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");

  //currentpassword button visible only when email is changed
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      let updated = false;

      // Update name (does not require password)
      if (name !== userData.name) {
        await authService.updateName(name);
        updated = true;
      }

      // Update email (requires current password)
      if (email !== userData.email) {
        if (!currentPassword) {
          alert("Current password is required to update email.");
          return;
        }

        await authService.updateEmail(email, currentPassword);
        updated = true;
      }

      if (updated) {
        alert("Profile updated successfully!");
        navigate("/profile");
      } else {
        alert("No changes made.");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      if (err?.message?.includes("Invalid credentials")) {
        alert("Incorrect password. Please try again.");
      } else {
        alert("Update failed. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-lg mx-auto space-y-4 p-4">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

      <input
        type="text"
        placeholder="New Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        placeholder="New Email"
        value={email}
        onChange={(e) => {
            const newEmail = e.target.value;
            setEmail(newEmail);
            if(newEmail !== userData.email) {
              // If email is changed, show current password field
            setShowCurrentPassword(true)
          }
        }}
        className="w-full p-2 border rounded"
      />
      
      {showCurrentPassword && (
        <input
                type="password"
                placeholder="Current Password (required)"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded"
                
              />
        )}
            

      <Button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Profile
      </Button>
    </form>
  );
};

export default EditProfile;
