import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/serviceConfig";
import { Button, Container } from "../components";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const postId = post?.$id || post?.id;

    const isAuthor = post && userData?.userData ? post.userId === userData.userData.id : false;

//    console.log("✅ isAuthor:", isAuthor);
;


    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

        // console.log("📝 post.$id:", post.$id);
        // console.log("📝 postId:", postId);
        // console.log("📝 postId:", userData);

    const deletePost = () => {
        if (!postId) {
            console.error("Post ID not found");
            return;
        }
            appwriteService.deletePost(postId).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
            });
       
    }

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost();
        }
    }

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                   <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        onError={(e) => {
                            console.error("Image failed to load", e);
                            e.target.style.display = "none"; // or use a placeholder
                        }}
                        alt={post.title}
                        className="w-[300px] h-[400px] object-cover rounded-lg"
                        />

                    {isAuthor && (
                        
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                            {/* {console.log("👤 isAuthor:", isAuthor)} */}

                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            
                            <Button bgColor="bg-red-500" onClick={() => handleDelete()}>
                                Delete
                            </Button>
                            {/* <button onClick={() => console.log("Clicked Delete")}>Test Delete</button> */}

                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.contents)}
                    </div>
            </Container>
        </div>
    ) : null;
}