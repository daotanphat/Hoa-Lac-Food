import React from "react";
import { FaTimes, FaCheckCircle, FaTimesCircle, FaSpinner, FaCreditCard, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaBox, FaMoneyBillWave } from "react-icons/fa";
import "./OrderDetailPopup.css";

const OrderDetailPopup = ({ order, onClose }) => {
    if (!order) return null;

    // Helper function to render status badge
    const renderStatusBadge = (status) => {
        let badgeClass = "detail-status-badge";
        let icon = <FaSpinner className="status-icon spinning" />;

        switch (status.toLowerCase()) {
            case "shipped":
                badgeClass += " status-shipped";
                icon = <FaCheckCircle className="status-icon spinning" />;
                break;
            case "processing":
                badgeClass += " status-processing";
                icon = <FaSpinner className="status-icon spinning" />;
                break;
            case "confirmed":
                badgeClass += " status-confirmed";
                icon = <FaSpinner className="status-icon" />;
                break;
            case "canceled":
                badgeClass += " status-cancelled";
                icon = <FaTimesCircle className="status-icon" />;
                break;
            case "delivered":
                badgeClass += " status-delivered";
                icon = <FaCheckCircle className="status-icon" />;
                break;
            default:
                badgeClass += " status-default";
        }

        return (
            <div className={badgeClass}>
                {icon}
                <span>{status}</span>
            </div>
        );
    };

    // Helper function to render payment status badge
    const renderPaymentBadge = (paymentStatus) => {
        let badgeClass = "detail-payment-badge";
        let icon = <FaSpinner className="status-icon spinning" />;

        switch (paymentStatus.toLowerCase()) {
            case "paid":
                badgeClass += " payment-paid";
                icon = <FaCheckCircle className="status-icon" />;
                break;
            case "pending":
                badgeClass += " payment-pending";
                icon = <FaSpinner className="status-icon spinning" />;
                break;
            case "failed":
                badgeClass += " payment-failed";
                icon = <FaTimesCircle className="status-icon" />;
                break;
            default:
                badgeClass += " payment-default";
        }

        return (
            <div className={badgeClass}>
                {icon}
                <span>{paymentStatus}</span>
            </div>
        );
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="order-detail-overlay">
            <div className="order-detail-popup">
                <div className="popup-header">
                    <h2>Order Details</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="popup-content">
                    {/* Order ID and Date */}
                    <div className="order-header">
                        <div className="order-id-container">
                            <span className="label">Order ID:</span>
                            <span className="order-detail-id">{order.orderId}</span>
                        </div>
                        <div className="order-date">
                            <FaCalendarAlt className="icon" />
                            <span>{formatDate(order.createAt)}</span>
                        </div>
                    </div>

                    {/* Status Section */}
                    <div className="status-section">
                        <div className="status-item">
                            <span className="label">Order Status:</span>
                            {renderStatusBadge(order.status)}
                        </div>
                        <div className="status-item">
                            <span className="label">Payment Status:</span>
                            {renderPaymentBadge(order.paymentStatus)}
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="detail-section">
                        <h3 className="section-title">
                            <FaUser className="section-icon" />
                            Customer Information
                        </h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="label">Name:</span>
                                <span>{order.customer?.fullName || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">
                                    <FaPhone className="icon-small" /> Phone:
                                </span>
                                <span>{order.customer?.phone || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">
                                    <FaEnvelope className="icon-small" /> Email:
                                </span>
                                <span>{order.customer?.email || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">
                                    <FaMapMarkerAlt className="icon-small" /> Address:
                                </span>
                                <span>{order.customer?.address || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="detail-section">
                        <h3 className="section-title">
                            <FaBox className="section-icon" />
                            Order Items
                        </h3>
                        <div className="order-items">
                            <table className="items-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems && order.orderItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="item-info">
                                                    {item.food.image && (
                                                        <img
                                                            src={item.food.image}
                                                            alt={item.food.name}
                                                            className="item-image"
                                                        />
                                                    )}
                                                    <span>{item.food.name}</span>
                                                </div>
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.price)}</td>
                                            <td>{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="detail-section">
                        <h3 className="section-title">
                            <FaMoneyBillWave className="section-icon" />
                            Payment Information
                        </h3>
                        <div className="payment-details">
                            <div className="payment-method">
                                <span className="label">Payment Method:</span>
                                <span>
                                    <FaCreditCard className="icon-small" />
                                    {order.paymentMethod || "N/A"}
                                </span>
                            </div>
                            <div className="payment-summary">
                                <div className="summary-item">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(order.totalPrice || 0)}</span>
                                </div>
                                <div className="summary-item">
                                    <span>Shipping:</span>
                                    <span>{formatCurrency(order.shippingFee || 0)}</span>
                                </div>
                                <div className="summary-item total">
                                    <span>Total:</span>
                                    <span>{formatCurrency(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="detail-section">
                            <h3 className="section-title">Notes</h3>
                            <div className="order-notes">
                                {order.notes}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPopup; 