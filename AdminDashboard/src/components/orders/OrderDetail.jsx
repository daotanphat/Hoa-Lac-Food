import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, formatDateTime } from "../../utils/format";
import "./OrderDetail.css";

const OrderDetail = ({ order, onClose }) => {
    if (!order) return null;

    console.log(order);

    return (
        <AnimatePresence>
            <div className="order-detail-overlay">
                <motion.div 
                    className="order-detail-modal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <div className="order-detail-header">
                        <h2>Order Details #{order.id}</h2>
                        <button onClick={onClose} className="close-button">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="order-detail-content">
                        <div className="order-info-section">
                            <h3>Customer Information</h3>
                            <p>Name: {order.customer.userName}</p>
                            <p>Email: {order.customer.email}</p>
                        </div>

                        <div className="order-info-section">
                            <h3>Order Information</h3>
                            <p>Status: <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></p>
                            <p>Payment Status: <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></p>
                            <p>Order Date: {formatDateTime(order.createAt)}</p>
                        </div>

                        <div className="order-items-section">
                            <h3>Order Items</h3>
                            <div className="order-items-list">
                                {order.orderItems?.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <img src={item.food.image} alt={item.food.name} className="item-image" />
                                        <div className="item-details">
                                            <h4>{item.food.name}</h4>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Price: {formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-total">
                            <h3>Total Amount: {formatPrice(order.totalPrice)}</h3>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default OrderDetail;