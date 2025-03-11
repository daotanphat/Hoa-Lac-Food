import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { api } from "../../config/Api";
import FoodCard from "../../components/FoodCard/FoodCard";
import "./ShopDetailPage.css";
import { useDispatch, useSelector } from "react-redux";
import { getShopFood } from "../../redux/Food/Actions";

const ShopDetailPage = () => {
    const location = useLocation();
    const shopId = location.state?.shopId;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeCategory, setActiveCategory] = useState("all");

    const shops = useSelector((state) => state.shop?.shops || []);
    const foods = useSelector((state) => state.food?.shopFoods || []);
    const categories = useSelector((state) => state.category?.categories || []);
    const loading = useSelector((state) => state.food?.loading || false);
    const error = useSelector((state) => state.food?.error || null);
    const shop = shops.find(shop => shop.id === shopId);

    useEffect(() => {
        dispatch(getShopFood(shopId));
    }, [shopId, dispatch]);

    const handleCategoryClick = (categoryName) => {
        // If clicking the active category, reset to "all"
        if (activeCategory === categoryName) {
            setActiveCategory("all");
        } else {
            setActiveCategory(categoryName);
        }
    };

    // Filter foods by category
    const filteredFoods = activeCategory === "all"
        ? foods
        : foods.filter(food => food.categoryName === activeCategory);

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="shop-detail-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading shop details...</p>
                </div>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="shop-detail-page">
                <div className="error-container">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error || "Shop not found"}</p>
                    <button onClick={handleBackClick}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-detail-page">
            {/* Back button */}
            <button className="back-button" onClick={handleBackClick}>
                <FaArrowLeft /> Back to Shops
            </button>

            {/* Shop Header */}
            <div className="shop-header" style={{ backgroundImage: `url(${shop.coverImage || shop.image})` }}>
                <div className="shop-header-overlay">
                    <div className="shop-header-content">
                        <div className="shop-logo">
                            <img src={shop.image} alt={shop.name} />
                        </div>
                        <div className="shop-header-info">
                            <h1>{shop.name}</h1>

                            <div className="shop-tags">
                                <span className="shop-tag">{shop.name}</span>
                            </div>

                            <div className="shop-meta">
                                <div className="shop-rating">
                                    <FaStar className="icon" />
                                    <FaStar className="icon" />
                                    <FaStar className="icon" />
                                    <FaStar className="icon" />
                                    <FaStar className="icon" />
                                    <span className="rating-count">({shop.ratingCount || 0} ratings)</span>
                                </div>

                                <div className="shop-status">
                                    {shop.isOpen ? (
                                        <span className="status open">Open Now</span>
                                    ) : (
                                        <span className="status closed">Closed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Details */}
            <div className="shop-details-container">
                <div className="shop-details">
                    <div className="shop-info-item">
                        <FaMapMarkerAlt className="icon" />
                        <span>{shop.address || "Address not available"}</span>
                    </div>

                    <div className="shop-info-item">
                        <FaClock className="icon" />
                        <span>{shop.openingHours || "Hours not available"}</span>
                    </div>

                    {shop.phone && (
                        <div className="shop-info-item">
                            <FaPhone className="icon" />
                            <span>{shop.phone}</span>
                        </div>
                    )}
                </div>

                {shop.description && (
                    <div className="shop-description">
                        <h3>About {shop.name}</h3>
                        <p>{shop.description}</p>
                    </div>
                )}
            </div>

            {/* Menu Section */}
            <div className="shop-menu-section">
                <h2>Menu</h2>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`category-tab ${activeCategory === category.name ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            {category.name === "all" ? "All Items" : category.name}
                        </button>
                    ))}
                </div>

                {/* Food Items */}
                {filteredFoods.length === 0 ? (
                    <div className="no-foods">
                        <p>No items available in this category.</p>
                    </div>
                ) : (
                    <div className="foods-grid">
                        {filteredFoods.map((food) => (
                            <FoodCard
                                key={food.id}
                                food={food}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopDetailPage; 