import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { getCartByUser, removeItemFromCart } from "../../redux/Cart/Actions";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from '../../utils/format'
import { FaTrashAlt } from 'react-icons/fa';

const Cart = () => {
  // const { cartItems, food_list, removeFromCart, getTotalCartAmount } =
  //   useContext(StoreContext);

  // const navigate = useNavigate();

  // if (!food_list || !cartItems) {
  //   return <div>Loading...</div>;
  // }
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  // Get cart data from Redux store
  const carts = useSelector((state) => state.cart?.carts || []);

  useEffect(() => {
    dispatch(getCartByUser());
  }, [dispatch]);

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeItemFromCart(cartItemId));
  };

  const handleItemSelect = (cartItemId) => {
    setSelectedItems(prev => {
      if (prev.includes(cartItemId)) {
        return prev.filter(id => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  const getTotalCartAmount = () => {
    return carts
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed to checkout");
      return;
    }
    navigate("/checkout", { state: { selectedCartItemIds: selectedItems } });
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Select</p>
          <p>Image</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Action</p>
        </div>
        <br />
        <hr />
        {carts.map((item, index) => {
          return (
            <div key={index}>
              <div className="cart-items-title cart-items-item">
                <input 
                  type="checkbox" 
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleItemSelect(item.id)}
                />
                <img src={item.food.image} alt="" />
                <p>{item.food.name}</p>
                <p>{formatPrice(item.price)}</p>
                <p>{item.quantity}</p>
                <p>{formatPrice(item.price * item.quantity)}</p>
                <div className="remove-button-container">
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatPrice(getTotalCartAmount())}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>{formatPrice(0)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>{formatPrice(getTotalCartAmount())}</p>
            </div>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={selectedItems.length === 0}
            style={{ 
              opacity: selectedItems.length === 0 ? 0.5 : 1,
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
