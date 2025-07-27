import { useState, useEffect } from "react";

const usePagination = (products, defaultItemsPerPage = 8) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    // Responsive items per page based on screen size
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 640) { // Mobile
                setItemsPerPage(4);
            } else if (width < 768) { // Small tablet
                setItemsPerPage(6);
            } else if (width < 1024) { // Large tablet
                setItemsPerPage(8);
            } else if (width < 1280) { // Small desktop
                setItemsPerPage(12);
            } else { // Large desktop
                setItemsPerPage(16);
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    // Reset to first page when items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return { 
        currentPage, 
        setCurrentPage: handlePageChange, 
        currentProducts, 
        totalPages, 
        itemsPerPage,
        totalItems
    };
};

export default usePagination;
