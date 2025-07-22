import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import service from "../../appwrite/serviceConfig";
import { Button, Container } from "../../components";
import AllPosts from "../AllPost";

const Profile = () => {

    const userData = useSelector((state) => state.auth.userData?.userData);
    const navigate = useNavigate();

    const deleteUser = () => {
    if (!userData?.id) {
        console.error("User ID not found");
        return;
    }

    authService.deactivateUser(userData.id).then((status) => {
        if (status) {
            navigate("/");
        }
    });
};

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deleteUser();
        }
    }
  return (
    <>
    <div className="py-8">
        <Container>
            <div className="w-full flex justify-center  relative border rounded-xl p-2">
            <img
                src={
                    userData?.profileImage ? service.getFilePreview(userData.profileImage)
                     : `https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=random`   // : "/images/avatar.png" // or use a URL like 
                    }
                    onError={(e) => {
                    e.target.src = "https://www.flaticon.com/free-icons/astronaut"; // fallback on error
                }}
                
                alt="https://www.flaticon.com/free-icons/astronaut"
                className="w-32 h-32 rounded-full object-cover"
            />
            </div>
            <h1 className="text-2xl font-bold text-center">{userData.name}</h1>
            <p className="text-center text-gray-600">{userData.email}</p>

            <div className="text-center mt-4">
                <Link to="/edit-profile">
                    <Button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                         Edit Profile
                    </Button>
                    
                </Link>
                <Link to="/change-password">
                    <Button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 ml-2">
                        Change Password
                    </Button>
                </Link>
                <Button 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 ml-2"
                    onClick={handleDelete}
                >
                    Delete Account
                </Button>
            </div>
            <div>
                <AllPosts postPerPage={4} pagination={false} title="Latest Articles"  userId={userData.id} />
            </div>
        </Container>
    </div>
    </>
  )
}

export default Profile