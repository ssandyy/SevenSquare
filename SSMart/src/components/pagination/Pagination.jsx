

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    console.log(totalItems, itemsPerPage, currentPage, onPageChange);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`mx-1 px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    );
  };

  export default Pagination;