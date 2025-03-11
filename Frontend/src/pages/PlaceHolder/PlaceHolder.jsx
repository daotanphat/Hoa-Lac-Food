import React, { useContext, useEffect, useState } from 'react'
import './PlaceHolder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatPrice } from '../../utils/format'
import { createOrder } from '../../redux/Order/Actions'

const PlaceHolder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');

  const selectedCartItemIds = location.state?.selectedCartItemIds || [];
  const allCartItems = useSelector((state) => state.cart?.carts || []);
  const user = useSelector((state) => state.user?.userInfo || null);

  useEffect(() => {
    // Set initial address from user data only if address hasn't been modified
    if (user?.address && !address) {
      setAddress(user.address);
    }
  }, [user, address]);

  // Filter only selected items
  const selectedItems = allCartItems.filter(item =>
    selectedCartItemIds.includes(item.id)
  );

  // Calculate totals
  const subtotal = selectedItems.reduce((total, item) =>
    total + (item.price * item.quantity), 0
  );

  const deliveryFee = 0; // You can modify this based on your delivery fee logic
  const total = subtotal + deliveryFee;

  useEffect(() => {
    // Redirect back to cart if no items were selected
    if (selectedCartItemIds.length === 0) {
      navigate('/cart');
    }
  }, [selectedCartItemIds, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      cartItemIds: selectedCartItemIds,
      address: address
    };
    console.log(orderData);

    dispatch(createOrder(orderData, navigate));
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={user?.userName || ''}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={user?.fullName || ''}
              disabled
              className="disabled-input"
            />
          </div>
        </div>
        <div className="input-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter your delivery address"
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="disabled-input"
          />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={user?.phoneNumber || ''}
            disabled
            className="disabled-input"
          />
        </div>

        <div className="selected-items">
          <h3>Selected Items</h3>
          {selectedItems.map((item) => (
            <div key={item.id} className="selected-item">
              <img src={item.food.image} alt={item.food.name} />
              <div className="item-details">
                <p className="item-name">{item.food.name}</p>
                <p className="item-price">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <p className="item-total">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{formatPrice(subtotal)}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>{formatPrice(deliveryFee)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>{formatPrice(total)}</p>
            </div>
          </div>
          <button type="submit">
            PROCEED TO PAYMENT
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceHolder
