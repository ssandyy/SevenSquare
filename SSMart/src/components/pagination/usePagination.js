import { useState } from "react";


const usePagination = (products, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return { currentPage, setCurrentPage:handlePageChange, currentProducts, totalPages, itemsPerPage};
};

export default usePagination;
