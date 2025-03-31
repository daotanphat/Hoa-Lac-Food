import React from 'react';
import { FaTimes, FaCopy } from 'react-icons/fa';
import './PaymentQRPopup.css';

// Bank account and other payment details
// In a production app, these would come from environment variables or backend
const BANK_ACCOUNT = '962472JJX9';
const BANK_NAME = 'BIDV';

const PaymentQRPopup = ({ order, onClose }) => {
  if (!order) return null;

  // Format currency without symbols
  const formatAmount = (amount) => {
    return Math.round(amount).toString();
  };

  // Generate payment description with order ID
  const generateDescription = (orderId) => {
    return `DH${orderId}`;
  };

  // Generate QR code URL
  const generateQRUrl = () => {
    const amount = formatAmount(order.totalPrice);
    const description = generateDescription(order.orderId);
    
    return `https://qr.sepay.vn/img?acc=${BANK_ACCOUNT}&bank=${BANK_NAME}&amount=${amount}&des=${description}`;
  };

  // Handle copy payment details to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add toast notification here
    alert('Copied to clipboard!');
  };

  return (
    <div className="payment-qr-overlay">
      <div className="payment-qr-popup">
        <div className="popup-header">
          <h2>Scan to Pay</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="popup-content">
          <div className="qr-container">
            <img 
              src={generateQRUrl()} 
              alt="Payment QR Code" 
              className="qr-code"
            />
          </div>

          <div className="payment-instructions">
            <p className="instruction-text">
              Scan the QR code with your banking app to pay for your order.
            </p>
            
            <div className="payment-details">
              <div className="payment-detail-item">
                <span className="label">Amount:</span>
                <span className="value">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalPrice)}</span>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(formatAmount(order.totalPrice))}
                  title="Copy amount"
                >
                  <FaCopy />
                </button>
              </div>
              
              <div className="payment-detail-item">
                <span className="label">Bank Account:</span>
                <span className="value">{BANK_ACCOUNT}</span>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(BANK_ACCOUNT)}
                  title="Copy account number"
                >
                  <FaCopy />
                </button>
              </div>
              
              <div className="payment-detail-item">
                <span className="label">Bank Name:</span>
                <span className="value">{BANK_NAME}</span>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(BANK_NAME)}
                  title="Copy bank name"
                >
                  <FaCopy />
                </button>
              </div>
              
              <div className="payment-detail-item">
                <span className="label">Description:</span>
                <span className="value">{generateDescription(order.orderId)}</span>
                <button 
                  className="copy-btn" 
                  onClick={() => copyToClipboard(generateDescription(order.orderId))}
                  title="Copy description"
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          </div>

          <div className="payment-note">
            <p>Please make the payment within 24 hours. Your order will be automatically canceled if payment is not received.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRPopup; 