import React, { useState } from "react";
import { FaStar, FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import "./FoodCard.css";
import { formatPrice } from "../../utils/format";
import { useDispatch } from "react-redux";
import { addFoodToCart } from "../../redux/Cart/Actions";

const FoodCard = ({ food}) => {
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);

    // Default image if food image is not available
    const defaultImage = "https://via.placeholder.com/300x200?text=Food+Item";

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        dispatch(addFoodToCart({ foodId: food.id, quantity }));
        setQuantity(1);
    };

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="food-card">
            <div className="food-image">
                <img
                    src={food.image || defaultImage}
                    alt={food.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
                {food.isPopular && <span className="popular-tag">Popular</span>}
                {food.discount > 0 && (
                    <span className="discount-tag">{food.discount}% OFF</span>
                )}
            </div>

            <div className="food-info">
                <h3 className="food-name">{food.name}</h3>

                {food.rating && (
                    <div className="food-rating">
                        <FaStar className="star-icon" />
                        <span>{food.rating}</span>
                        {food.ratingCount && (
                            <span className="rating-count">({food.ratingCount})</span>
                        )}
                    </div>
                )}

                <div className="food-description-container">
                    <p className={`food-description ${isExpanded ? 'expanded' : ''}`}>
                        {food.description || "No description available."}
                    </p>
                    {food.description && food.description.length > 100 && (
                        <button
                            className="read-more-btn"
                            onClick={toggleDescription}
                        >
                            {isExpanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </div>

                <div className="food-price-container">
                    <div className="food-price">
                        {food.discount > 0 ? (
                            <>
                                <span className="original-price">
                                    {formatPrice(food.price)}
                                </span>
                                <span className="discounted-price">
                                    {formatPrice(food.price * (1 - food.discount / 100))}
                                </span>
                            </>
                        ) : (
                            <span>{formatPrice(food.price)}</span>
                        )}
                    </div>

                    {food.quantity <= 0 ? (
                        <span className="out-of-stock">Out of Stock</span>
                    ) : (
                        <div className="quantity-controls">
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                <FaMinus />
                            </button>
                            <span className="quantity">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= food.quantity}
                            >
                                <FaPlus />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="food-footer">
                <button
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={food.quantity <= 0}
                >
                    <FaShoppingCart className="cart-icon" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default FoodCard; 