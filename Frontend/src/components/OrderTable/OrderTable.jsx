import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaInfoCircle, FaTimesCircle, FaEye, FaBan, FaQrcode } from "react-icons/fa";
import OrderDetailPopup from "../OrderDetailPopup/OrderDetailPopup";
import PaymentQRPopup from "../PaymentQRPopup/PaymentQRPopup";
import { cancelOrder } from "../../redux/Order/Actions";
import "./OrderTable.css";

const OrderTable = ({ orders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [showPaymentQR, setShowPaymentQR] = useState(false);
    const [selectedPaymentOrder, setSelectedPaymentOrder] = useState(null);
    const dispatch = useDispatch();
    const { cancelLoading } = useSelector(state => state.order);

    // Function to render status badge with appropriate color
    const renderStatusBadge = (status) => {
        let badgeClass = "status-badge";

        switch (status.toLowerCase()) {
            case "completed":
                badgeClass += " status-completed";
                break;
            case "processing":
                badgeClass += " status-processing";
                break;
            case "pending":
                badgeClass += " status-pending";
                break;
            case "cancelled":
                badgeClass += " status-cancelled";
                break;
            default:
                badgeClass += " status-default";
        }

        return <span className={badgeClass}>{status}</span>;
    };

    // Function to render payment status badge
    const renderPaymentBadge = (paymentStatus, order) => {
        let badgeClass = "payment-badge";
        let clickable = false;

        switch (paymentStatus.toLowerCase()) {
            case "paid":
                badgeClass += " payment-paid";
                break;
            case "pending":
                badgeClass += " payment-pending";
                clickable = true;  // Make it clickable for pending payments
                break;
            case "failed":
                badgeClass += " payment-failed";
                break;
            default:
                badgeClass += " payment-default";
        }

        // If pending and clickable, wrap in a button that opens QR popup
        if (clickable && order.status.toLowerCase() !== "cancelled") {
            return (
                <button 
                    className={`${badgeClass} payment-badge-button`}
                    onClick={() => handlePaymentClick(order)}
                    title="Click to view payment QR code"
                >
                    {paymentStatus} <FaQrcode className="qr-icon" />
                </button>
            );
        }

        return <span className={badgeClass}>{paymentStatus}</span>;
    };

    const handlePaymentClick = (order) => {
        setSelectedPaymentOrder(order);
        setShowPaymentQR(true);
    };

    const onViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const onCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            setCancellingOrderId(orderId);
            await dispatch(cancelOrder(orderId));
            setCancellingOrderId(null);
        }
    };

    return (
        <div className="order-table-container">
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="no-orders">No orders found</td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id}>
                                <td className="order-id">{order.orderId}</td>
                                <td className="price">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalPrice)}</td>
                                <td>{renderStatusBadge(order.status)}</td>
                                <td>{renderPaymentBadge(order.paymentStatus, order)}</td>
                                <td>{new Date(order.createAt).toLocaleDateString("en-US")}</td>
                                <td className="actions">
                                    <button className="info-btn" onClick={() => onViewOrder(order)}>
                                        <FaEye /> View
                                    </button>
                                    {order.paymentStatus.toLowerCase() === "pending" &&
                                        order.status.toLowerCase() !== "canceled" && (
                                            <button
                                                className="cancel-btn"
                                                onClick={() => onCancelOrder(order.orderId)}
                                                disabled={cancelLoading && cancellingOrderId === order.id}
                                            >
                                                {cancelLoading && cancellingOrderId === order.id ? (
                                                    <span className="loading-spinner"></span>
                                                ) : (
                                                    <>
                                                        <FaBan /> Cancel
                                                    </>
                                                )}
                                            </button>
                                        )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedOrder && (
                <OrderDetailPopup
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            {showPaymentQR && selectedPaymentOrder && (
                <PaymentQRPopup 
                    order={selectedPaymentOrder}
                    onClose={() => {
                        setShowPaymentQR(false);
                        setSelectedPaymentOrder(null);
                    }}
                />
            )}
        </div>
    );
};

export default OrderTable;