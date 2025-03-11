import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersByCustomer } from "../../redux/Order/Actions";
import OrderTable from "../../components/OrderTable/OrderTable";
import "./Order.css";

const OrderPage = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.order);

    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Fetch all orders on component mount
    useEffect(() => {
        dispatch(getOrdersByCustomer());
    }, [dispatch]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [orderStatus, paymentStatus, selectedDate, pageSize]);

    // Filter orders based on selected filters
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Filter by order status
            if (orderStatus && order.status.toLowerCase() !== orderStatus.toLowerCase()) {
                return false;
            }
            
            // Filter by payment status
            if (paymentStatus && order.paymentStatus.toLowerCase() !== paymentStatus.toLowerCase()) {
                return false;
            }
            
            // Filter by date
            if (selectedDate) {
                const orderDate = new Date(order.createAt).toISOString().split('T')[0];
                if (orderDate !== selectedDate) {
                    return false;
                }
            }
            
            return true;
        });
    }, [orders, orderStatus, paymentStatus, selectedDate]);

    // Calculate pagination
    const paginatedOrders = useMemo(() => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, page, pageSize]);

    // Calculate total pages
    const totalPages = useMemo(() => {
        return Math.ceil(filteredOrders.length / pageSize) || 1;
    }, [filteredOrders, pageSize]);

    return (
        <div className="order-page">
            <h2 className="order-page-title">My Orders History</h2>

            {/* Top Controls - Page Size */}
            <div className="top-controls">
                <div className="page-size-control">
                    <label>Show:</label>
                    <select 
                        value={pageSize} 
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="page-size-select"
                    >
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                        <option value="100">100 per page</option>
                    </select>
                </div>
            </div>

            {/* Filter Section */}
            <div className="filters">
                <div className="filter-item">
                    <label>Order Status:</label>
                    <select 
                        value={orderStatus} 
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="status-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Payment Status:</label>
                    <select 
                        value={paymentStatus} 
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="status-select"
                    >
                        <option value="">All Payments</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>

                <div className="filter-item">
                    <label>Order Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="date-input"
                    />
                    {selectedDate && (
                        <button 
                            className="clear-date-btn" 
                            onClick={() => setSelectedDate("")}
                            title="Clear date filter"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Order Table */}
            <OrderTable orders={paginatedOrders} />

            {/* Pagination Controls - Bottom Right */}
            <div className="pagination">
                <div className="pagination-info">
                    {filteredOrders.length > 0 ? (
                        <span>
                            Showing {Math.min((page - 1) * pageSize + 1, filteredOrders.length)} to {Math.min(page * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
                        </span>
                    ) : (
                        <span>No orders found</span>
                    )}
                </div>
                <div className="pagination-controls">
                    <button 
                        className="pagination-btn" 
                        disabled={page === 1} 
                        onClick={() => setPage(1)}
                    >
                        First
                    </button>
                    <button 
                        className="pagination-btn" 
                        disabled={page === 1} 
                        onClick={() => setPage(page - 1)}
                    >
                        Prev
                    </button>
                    <span className="page-indicator">Page {page} of {totalPages}</span>
                    <button 
                        className="pagination-btn" 
                        disabled={page === totalPages || totalPages === 0} 
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                    <button 
                        className="pagination-btn" 
                        disabled={page === totalPages || totalPages === 0} 
                        onClick={() => setPage(totalPages)}
                    >
                        Last
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;