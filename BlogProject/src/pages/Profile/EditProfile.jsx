import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";

const EditProfile = () => {
  const userData = useSelector((state) => state.auth.userData?.userData);
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");

   const handleUpdate = async (e) => {
    e.preventDefault();

      try {
        let updated = false;

        // ✅ 1. Re-authenticate the user first with correct password
        const loginSession = await authService.login({
          email: userData.email,
          password: currentPassword
        });

        if (!loginSession) {
          alert("Reauthentication failed. Incorrect current password.");
          return;
        }

        // ✅ 2. Update name (no password needed)
        if (name !== userData.name) {
          await authService.updateName(name);
          updated = true;
        }

        // ✅ 3. Update email (requires password)
        if (email !== userData.email) {
          await authService.updateEmail(email, currentPassword);
          updated = true;
        }

        if (updated) {
          alert("Profile updated successfully!");
          navigate("/profile");
        } else {
          alert("No changes detected.");
        }

      } catch (err) {
        console.error("Profile update failed:", err);
        alert("Update failed. Please check your credentials.");
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
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Current Password (required)"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      
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
