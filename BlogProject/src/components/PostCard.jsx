import { Link } from 'react-router-dom';
import appwriteService from "../appwrite/serviceConfig";

function PostCard({$id, title, featuredImage}) {
    
  return (
  <Link to={`/post/${$id}`}>
    <div className="w-[250px] h-[350px] bg-gray-100 rounded-xl p-2 shadow hover:shadow-lg transition flex flex-col">
      
      {/* Image container */}
      <div className="w-full h-[250px] overflow-hidden rounded-lg mb-4">
        <img
          src={appwriteService.getFilePreview(featuredImage)}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Title */}
      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-lg font-bold text-center text-gray-800">
          {title}
        </h2>
      </div>
    </div>
  </Link>
);

}


export default PostCard