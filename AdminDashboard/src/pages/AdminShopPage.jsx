import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Search, Store, Map, CreditCard } from "lucide-react";
import Header from "../components/common/Header";
import ShopGrid from "../components/shop/ShopGrid";
import { getShops } from "../redux/Shop/Actions"; // You'll need to create this action

const AdminShopPage = () => {
    const dispatch = useDispatch();
    const shops = useSelector((state) => state.shop?.shops || []);
    const loading = useSelector((state) => state.shop?.loading);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('all');
    
    useEffect(() => {
        dispatch(getShops());
    }, [dispatch]);
    
    // Filter shops based on search term and status
    const filteredShops = shops.filter((shop) => {
        const matchesSearch = shop.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = 
            statusFilter === 'all' ? true : 
            statusFilter === 'active' ? shop.status : 
            !shop.status;
        
        return matchesSearch && matchesStatus;
    });
    
    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);
    
    // Get current shops for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentShops = filteredShops.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <Header title="Shop Management" />
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400">
                                <Store className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Total Shops</p>
                                <p className="text-2xl font-semibold text-white">{shops.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                                <Map className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Active Shops</p>
                                <p className="text-2xl font-semibold text-white">
                                    {shops.filter(shop => shop.status).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-500/20 text-red-400">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-400">Inactive Shops</p>
                                <p className="text-2xl font-semibold text-white">
                                    {shops.filter(shop => !shop.status).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Updated Search and Filter Controls */}
                <motion.div 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-5 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row gap-4 flex-grow">
                            {/* Search Input */}
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="Search shops..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>

                            {/* Status Filter Dropdown */}
                            <div className="relative w-full md:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white appearance-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Items per page dropdown */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-400">Items per page:</label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className="px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
                
                {/* Shop Grid */}
                <ShopGrid 
                    shops={currentShops} 
                    loading={loading}
                />
                
                {/* Pagination */}
                {filteredShops.length > 0 && (
                    <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
                        <div className="flex justify-between w-full">
                            <div className="text-sm text-gray-400">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(indexOfLastItem, filteredShops.length)}
                                </span>{" "}
                                of <span className="font-medium">{filteredShops.length}</span> shops
                            </div>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                
                                {Array.from({ length: Math.ceil(filteredShops.length / itemsPerPage) }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === index + 1
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-700 text-gray-300"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                )).slice(
                                    Math.max(0, currentPage - 3),
                                    Math.min(Math.ceil(filteredShops.length / itemsPerPage), currentPage + 2)
                                )}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => 
                                        Math.min(prev + 1, Math.ceil(filteredShops.length / itemsPerPage))
                                    )}
                                    disabled={currentPage === Math.ceil(filteredShops.length / itemsPerPage)}
                                    className="px-3 py-1 rounded bg-gray-700 text-gray-300 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminShopPage; 