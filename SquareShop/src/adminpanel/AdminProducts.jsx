import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../appwrite/adminServices';

import { Query } from 'appwrite';
import Pagination from '../components/Pagination/Pagination';


const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await adminService.listProducts([
                    Query.limit(itemsPerPage),
                    Query.offset((currentPage - 1) * itemsPerPage),
                    Query.orderDesc('$createdAt')
                ]);
                setProducts(response.documents);
                setTotalPages(Math.ceil(response.total / itemsPerPage));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.deleteProduct(productId);
                setProducts(products.filter(p => p.$id !== productId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="text-center py-8">Loading products...</div>;
    if (error) return <div className="text-center text-red-500 py-8">Error: {error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Product Management</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Product
                </Link>
            </div>

            <ProductTable products={products} onDelete={handleDelete} />

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default AdminProducts;