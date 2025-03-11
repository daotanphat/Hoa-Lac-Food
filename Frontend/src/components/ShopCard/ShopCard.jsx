import React from "react";
import { FaStar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./ShopCard.css";

const ShopCard = ({ shop, onClick }) => {
    // Default image if shop image is not available
    const defaultImage = "https://via.placeholder.com/300x200?text=Restaurant";
    
    const handleCardClick = (e) => {
        // Prevent click event if clicking the view menu button
        if (e.target.closest('.view-shop-btn')) {
            return;
        }
        if (!shop.isOpen) {
            return; // Prevent click when shop is closed
        }
        onClick();
    };
    
    return (
        <div className="shop-card" onClick={handleCardClick}>
            <div className="shop-image">
                <img 
                    src={shop.image || defaultImage} 
                    alt={shop.name} 
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
                {shop.isOpen ? (
                    <span className="shop-status open">Open</span>
                ) : (
                    <span className="shop-status closed">Closed</span>
                )}
            </div>
            
            <div className="shop-info">
                <h3 className="shop-name">{shop.name}</h3>
                
                <div className="shop-rating">
                    <FaStar className="star-icon" />
                    <span>{shop.rating || "New"}</span>
                    <span className="rating-count">({shop.ratingCount || 0} ratings)</span>
                </div>
                
                <div className="shop-location">
                    <FaMapMarkerAlt className="location-icon" />
                    <span>{shop.address || "Location not available"}</span>
                </div>
                
                <div className="shop-hours">
                    <FaClock className="clock-icon" />
                    <span>{shop.openingHours || "Hours not available"}</span>
                </div>
            </div>
            
            <div className="shop-footer">
                <button 
                    className="view-shop-btn"
                    onClick={() => shop.isOpen && onClick(true)}
                    disabled={!shop.isOpen}
                >
                    {shop.isOpen ? "View Menu" : "Currently Closed"}
                </button>
            </div>
        </div>
    );
};

export default ShopCard; 