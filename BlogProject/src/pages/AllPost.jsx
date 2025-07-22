import { Query } from 'appwrite';
import { useEffect, useState } from 'react';
import appwriteService from "../appwrite/serviceConfig";
import { Container, PostCard } from '../components';
import Pagination from '../components/Pagination';

function AllPosts({ postPerPage = 8, pagination = true, title = "All Blogs", userId = null }) {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ALL posts once
  const fetchAllPosts = async () => {
    let queries = [Query.equal("status", "active"), Query.limit(100), Query.orderDesc('$createdAt')];
    if (userId) queries.push(Query.equal("userId", userId));

    try {
      const result = await appwriteService.getPosts(queries);
      if (result) {
        setAllPosts(result.documents);
        setFilteredPosts(result.documents); // initially show all
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, [userId]);

  useEffect(() => {
    // Filter on search term change
    if (searchTerm.trim() === "") {
      setFilteredPosts(allPosts);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = allPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(lower) ||
          post.content?.toLowerCase().includes(lower)
      );
      setFilteredPosts(filtered);
      setPage(1); // reset to first page on search
    }
  }, [searchTerm, allPosts]);

  // Paginate filtered results
  const offset = (page - 1) * postPerPage;
  const paginatedPosts = filteredPosts.slice(offset, offset + postPerPage);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full py-8">
      <Container>
        <form onSubmit={handleSearch} className="mb-6 max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Search
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {paginatedPosts.length === 0 ? (
          <p className="text-center">No posts found.</p>
        ) : (
          <>
            <div className="flex flex-wrap">
              {paginatedPosts.map((post) => (
                <div key={post.$id} className="p-2 w-full sm:w-1/2 lg:w-1/4">
                  <PostCard {...post} />
                </div>
              ))}
            </div>

            {pagination && (
              <Pagination
                currentPage={page}
                totalItems={filteredPosts.length}
                itemsPerPage={postPerPage}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
