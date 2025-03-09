import React, { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { getCartByUser } from "../../redux/Cart/Actions";
import { useDispatch, useSelector } from "react-redux";

const Cart = () => {
  // const { cartItems, food_list, removeFromCart, getTotalCartAmount } =
  //   useContext(StoreContext);

  // const navigate = useNavigate();

  // if (!food_list || !cartItems) {
  //   return <div>Loading...</div>;
  // }
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get cart data from Redux store
  const carts = useSelector((state) => state.cart?.carts || []);

  useEffect(() => {
    dispatch(getCartByUser());
  }, [dispatch]);

  console.log(carts);

  const getTotalCartAmount = () => {
    return carts.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {carts.map((item, index) => {
          return (
            <div>
              <div key={index} className="cart-items-title cart-items-item">
                <img src={item.food.image} alt="" />
                <p>{item.food.name}</p>
                <p>{item.price}</p>
                <p>{item.quantity}</p>
                <p>${item.price * item.quantity}</p>
                <p>
                  <button>
                    Remove
                  </button>
                </p>
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
              <p>${getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>$0</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount()}</p>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
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
