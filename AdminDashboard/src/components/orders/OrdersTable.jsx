import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByShop, updateOrderStatus } from "../../redux/Order/Actions";
import { formatPrice, formatDateTime } from "../../utils/format";
import OrderDetail from "./OrderDetail";
import { toast } from "react-toastify";

const OrdersTable = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order?.orders);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); // Add this line
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "Processing", label: "Processing" },
        { value: "Confirmed", label: "Confirmed" },
        { value: "Shipped", label: "Shipped" },
        { value: "Delivered", label: "Delivered" },
        { value: "Canceled", label: "Canceled" }
    ];

    useEffect(() => {
        dispatch(getOrdersByShop());
    }, [dispatch]);

    useEffect(() => {
        const filtered = orders.filter((order) => {
            const matchesSearch = order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                order.customer.userName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === "" || order.status === selectedStatus;
            const matchesDate = !selectedDate || new Date(order.createAt).toISOString().split('T')[0] === selectedDate;
            return matchesSearch && matchesStatus && matchesDate;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [orders, searchTerm, selectedStatus, selectedDate]); // Add selectedDate to dependency array

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

    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
                <div className='relative flex-1'>
                    <input
                        type='text'
                        placeholder='Search customer...'
                        className='w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
                
                <select
                    className='w-full md:w-48 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    className='w-full md:w-48 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className='overflow-x-auto'>
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
                        {paginatedOrders.map((order) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
                                    {order.id}
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
            </div>

            <div className='flex flex-col md:flex-row justify-between items-center mt-6 gap-4'>
                <div className='flex items-center gap-2 text-gray-300'>
                    <span>Show</span>
                    <select
                        className='bg-gray-700 text-white rounded px-2 py-1'
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                        {[10, 20, 50, 100].map(value => (
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
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className='px-3 py-1 text-gray-300'>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className='px-3 py-1 rounded border border-gray-600 text-gray-300 disabled:opacity-50'
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

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
