import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Filter, RefreshCw, FileDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByShop, updateOrderStatus, exportOrdersToExcel } from "../../redux/Order/Actions";
import { formatPrice, formatDateTime } from "../../utils/format";
import OrderDetail from "./OrderDetail";

const OrdersTable = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order?.orders);
    const loading = useSelector((state) => state.order?.loading);

    // Input state (before applying filters)
    const [searchInput, setSearchInput] = useState("");
    const [statusInput, setStatusInput] = useState("All");
    const [dateInput, setDateInput] = useState("");
    
    // Applied filter state (after clicking filter button)
    const [appliedFilters, setAppliedFilters] = useState({
        search: "",
        status: "All",
        date: "",
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);

    const statusOptions = [
        { value: "All", label: "All Status" },
        { value: "Processing", label: "Processing" },
        { value: "Confirmed", label: "Confirmed" },
        { value: "Shipped", label: "Shipped" },
        { value: "Delivered", label: "Delivered" },
        { value: "Canceled", label: "Canceled" }
    ];

    // Initial data load
    useEffect(() => {
        fetchOrders();
    }, [dispatch]);

    // Fetch when applied filters or pagination changes
    useEffect(() => {
        fetchOrders();
    }, [appliedFilters, currentPage, itemsPerPage]);

    const fetchOrders = () => {
        const skip = (currentPage - 1) * itemsPerPage;
        
        const filters = {
            search: appliedFilters.search,
            status: appliedFilters.status,
            date: appliedFilters.date,
            skip: skip,
            top: itemsPerPage
        };
        
        dispatch(getOrdersByShop(filters));
    };

    // Reset to first page when applied filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [appliedFilters]);

    const handleApplyFilters = () => {
        setAppliedFilters({
            search: searchInput,
            status: statusInput,
            date: dateInput
        });
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setStatusInput("All");
        setDateInput("");
        setAppliedFilters({
            search: "",
            status: "All",
            date: ""
        });
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to update the order status to ${newStatus}?`)) {
            return;
        }
        
        setUpdating(true);
        try {
            await dispatch(updateOrderStatus(orderId, newStatus));
        } finally {
            setUpdating(false);
        }
    };

    const handleExport = () => {
        const filters = {
            search: appliedFilters.search,
            status: appliedFilters.status,
            date: appliedFilters.date
        };
        
        dispatch(exportOrdersToExcel(filters));
    };

    const totalPages = Math.ceil(orders.length / itemsPerPage);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className='flex flex-col gap-4 mb-6'>
                {/* Filter controls */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {/* Search input */}
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search by email...'
                            className='w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    </div>
                    
                    {/* Status filter */}
                    <select
                        className='w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={statusInput}
                        onChange={(e) => setStatusInput(e.target.value)}
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Date filter */}
                    <input
                        type="date"
                        className='w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                    />
                </div>
                
                {/* Filter action buttons */}
                <div className='flex justify-between items-center'>
                    {/* Export button */}
                    <button
                        className='px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2'
                        onClick={handleExport}
                    >
                        <FileDown size={16} />
                        Export to Excel
                    </button>
                    
                    {/* Existing filter buttons */}
                    <div className='flex gap-2'>
                        <button
                            className='px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2'
                            onClick={handleResetFilters}
                        >
                            <RefreshCw size={16} />
                            Reset
                        </button>
                        <button
                            className='px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2'
                            onClick={handleApplyFilters}
                        >
                            <Filter size={16} />
                            Apply Filters
                        </button>
                    </div>
                </div>
                
                {/* Applied filters display */}
                {(appliedFilters.search || appliedFilters.status !== "All" || appliedFilters.date) && (
                    <div className='flex flex-wrap gap-2 mt-2'>
                        <span className='text-sm text-gray-400'>Active filters:</span>
                        {appliedFilters.search && (
                            <span className='text-xs bg-gray-700 text-white px-2 py-1 rounded-full'>
                                Search: {appliedFilters.search}
                            </span>
                        )}
                        {appliedFilters.status !== "All" && (
                            <span className='text-xs bg-gray-700 text-white px-2 py-1 rounded-full'>
                                Status: {appliedFilters.status}
                            </span>
                        )}
                        {appliedFilters.date && (
                            <span className='text-xs bg-gray-700 text-white px-2 py-1 rounded-full'>
                                Date: {appliedFilters.date}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Table content */}
            <div className='overflow-x-auto'>
                {loading ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-400">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-400">No orders found</p>
                    </div>
                ) : (
                    <>
                        <table className='min-w-full divide-y divide-gray-700'>
                            <thead>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Order ID
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Customer Email
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Total
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Status
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Payment Status
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Date
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className='divide divide-gray-700'>
                                {orders.map((order) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                            {order.orderId}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                            {order.customer.email}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                            {formatPrice(order.totalPrice)}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {order.paymentStatus === "Paid" && 
                                             order.status !== "Delivered" && 
                                             order.status !== "Canceled" ? (
                                                <select
                                                    className={`px-2 py-1 rounded text-xs font-semibold
                                                        ${order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                                        order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                                                        order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                                                        "bg-red-100 text-red-800"}`}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                                                    disabled={updating}
                                                >
                                                    {statusOptions.filter(opt => opt.value).map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                                    order.status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                                                    order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                                                    "bg-red-100 text-red-800"}`}
                                                >
                                                    {order.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentStatus === "Paid"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.paymentStatus === "Pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{formatDateTime(order.createAt)}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            <button 
                                                className='text-indigo-400 hover:text-indigo-300 mr-2'
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {/* Pagination section remains the same */}
            <div className='flex flex-col md:flex-row justify-between items-center mt-6 gap-4'>
                <div className='flex items-center gap-2 text-gray-300'>
                    <span>Show</span>
                    <select
                        className='bg-gray-700 text-white rounded px-2 py-1'
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        {[5, 10, 20, 50].map(value => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                    <span>entries</span>
                </div>

                <div className='flex gap-2'>
                    <button
                        className='px-3 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50'
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className='px-3 py-1 text-gray-300'>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className='px-3 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50'
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Order detail modal */}
            {selectedOrder && (
                <OrderDetail 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </motion.div>
    );
};

export default OrdersTable;
