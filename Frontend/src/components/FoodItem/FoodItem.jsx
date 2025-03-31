import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import { useDispatch, useSelector } from 'react-redux';
import { addFoodToCart } from '../../redux/Cart/Actions';
import { formatPrice } from '../../utils/format';

const FoodItem = ({ id, name, price, image }) => {

    // const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart?.cart || []);

    const handleAddToCart = () => {
        dispatch(addFoodToCart({ foodId: id, quantity: 1 }));
    };

    return (
        <div className='food-item'>
            <div className="food-item-img-container">
                <img className='food-item-image' src={image} alt="" />
                {!cartItems[id]
                    ? <img className='add' onClick={handleAddToCart} src={assets.add_icon_white} alt='' />
                    : <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                        <p>{cartItems[id]}</p>
                        <img onClick={handleAddToCart} src={assets.add_icon_green} alt='' />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">Food provides essential nutrients for overall health and well-being</p>
                <p className="food-item-price">{formatPrice(price)}</p>
            </div>
        </div>
    );
};

export default FoodItem;
