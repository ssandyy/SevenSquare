import React from 'react';
import usePagination from './pagination/usePagination';
import Pagination from './pagination/Pagination';

const PaginatedList = ({ 
  items, 
  renderItem, 
  itemsPerPage = 8,
  className = "",
  showPagination = true,
  emptyMessage = "No items found",
  emptyIcon = "📦"
}) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentProducts, 
    totalItems, 
    itemsPerPage: actualItemsPerPage 
  } = usePagination(items, itemsPerPage);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">{emptyIcon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Render items */}
      <div className="space-y-4">
        {currentProducts.map((item, index) => renderItem(item, index))}
      </div>

      {/* Pagination */}
      {showPagination && items.length > actualItemsPerPage && (
        <div className="mt-8">
          <Pagination 
            totalItems={totalItems} 
            itemsPerPage={actualItemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedList; 