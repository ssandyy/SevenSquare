import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import service from "../../appwrite/serviceConfig";
import Button from "../../components/Button";
import Container from "../../components/container/Container";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.auth.userData?.userData);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const isValid = await authService.verifySession();
        if (!isValid) {
          navigate("/login");
        }
      } catch (error) {
        setError("Session verification failed");
        throw error;
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  const handleDelete = async () => {
    if (!window.confirm(
      "Are you sure you want to deactivate your account? You can re-enable it later by contacting support."
    )) return;

    try {
      if (!userData?.documentId) {
        throw new Error("User document ID not found");
      }

      setLoading(true);
      const status = await authService.deactivateUser(userData.documentId);
      
      if (status) {
        alert("Account deactivated successfully.");
        navigate("/login");
      } else {
        throw new Error("Failed to deactivate account");
      }
    } catch (error) {
      setError(error.message);
      console.error("Deactivation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <Container>
          <h2 className="text-2xl font-bold">Profile Not Found</h2>
          <p className="text-gray-600 mt-2">
            Unable to load user profile. Please try again later.
          </p>
          <Button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="w-full flex justify-center relative border rounded-xl p-2">
          <img
            src={
              userData?.profileImage 
                ? service.getFilePreview(userData.profileImage)
                : `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=random`
            }
            onError={(e) => {
              e.target.src = "https://www.flaticon.com/free-icons/astronaut";
            }}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mt-4">
          {userData.name || "User"}
        </h1>
        <p className="text-center text-gray-600">
          {userData.email || "No email provided"}
        </p>

        <div className="text-center mt-6 space-x-2">
          <Link to="/edit-profile">
            <Button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              Edit Profile
            </Button>
          </Link>
          
          <Link to="/change-password">
            <Button 
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              disabled={loading}
            >
              Change Password
            </Button>
          </Link>
          
          <Button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Processing..." : "Delete Account"}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Profile;