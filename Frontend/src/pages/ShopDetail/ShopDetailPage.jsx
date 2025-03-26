import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaClock, FaPhone, FaArrowLeft, FaShoppingCart, FaSearch, FaSort } from "react-icons/fa";
import { api } from "../../config/Api";
import FoodCard from "../../components/FoodCard/FoodCard";
import Pagination from "../../components/Pagination/Pagination";
import "./ShopDetailPage.css";
import { useDispatch, useSelector } from "react-redux";
import { getShopFood } from "../../redux/Food/Actions";

const ShopDetailPage = () => {
    const location = useLocation();
    const shopId = location.state?.shopId;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("default");
    const itemsPerPage = 6;

    const shops = useSelector((state) => state.shop?.shops || []);
    const foods = useSelector((state) => state.food?.shopFoods || []);
    const categories = useSelector((state) => state.category?.categories || []);
    const loading = useSelector((state) => state.food?.loading || false);
    const error = useSelector((state) => state.food?.error || null);
    const shop = shops.find(shop => shop.id === shopId);

    useEffect(() => {
        dispatch(getShopFood(shopId));
    }, [shopId, dispatch]);

    useEffect(() => {
        // Reset to page 1 when category, search, or sort changes
        setCurrentPage(1);
    }, [activeCategory, searchTerm, sortOrder]);

    const handleCategoryClick = (categoryName) => {
        // If clicking the active category, reset to "all"
        if (activeCategory === categoryName) {
            setActiveCategory("all");
        } else {
            setActiveCategory(categoryName);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Filter and sort foods
    const filterAndSortFoods = () => {
        let result = [...foods];
        
        // Category filter
        if (activeCategory !== "all") {
            result = result.filter(food => food.categoryName === activeCategory);
        }
        
        // Search filter
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase().trim();
            result = result.filter(food => 
                food.name.toLowerCase().includes(term) || 
                (food.description && food.description.toLowerCase().includes(term))
            );
        }
        
        // Sort by price
        switch(sortOrder) {
            case "low-to-high":
                result.sort((a, b) => a.price - b.price);
                break;
            case "high-to-low":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default order (as returned from API)
                break;
        }
        
        return result;
    };

    const filteredAndSortedFoods = filterAndSortFoods();

    // Calculate pagination
    const totalPages = Math.ceil(filteredAndSortedFoods.length / itemsPerPage);
    const paginatedFoods = filteredAndSortedFoods.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to menu section when page changes
        document.querySelector('.shop-menu-section').scrollIntoView({ behavior: 'smooth' });
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSortOrder("default");
        setActiveCategory("all");
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

                {/* Search and Filter Bar */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    
                    <div className="filter-box">
                        <label htmlFor="sort-order">
                            <FaSort className="filter-icon" /> Sort by:
                        </label>
                        <select 
                            id="sort-order" 
                            value={sortOrder}
                            onChange={handleSortChange}
                        >
                            <option value="default">Default</option>
                            <option value="low-to-high">Price: Low to High</option>
                            <option value="high-to-low">Price: High to Low</option>
                            <option value="name-asc">Name: A to Z</option>
                            <option value="name-desc">Name: Z to A</option>
                        </select>
                    </div>

                    {(searchTerm || sortOrder !== "default" || activeCategory !== "all") && (
                        <button className="clear-filters" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    )}
                </div>

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
                {filteredAndSortedFoods.length === 0 ? (
                    <div className="no-foods">
                        <p>No items found matching your filters.</p>
                        <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
                    </div>
                ) : (
                    <>
                        <div className="foods-grid">
                            {paginatedFoods.map((food) => (
                                <FoodCard
                                    key={food.id}
                                    food={food}
                                />
                            ))}
                        </div>
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopDetailPage; 