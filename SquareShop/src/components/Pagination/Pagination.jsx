function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-4 py-2 rounded ${
            currentPage === pageNum ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          {pageNum}
        </button>
      ))}
    </div>
  );
}

export default Pagination;