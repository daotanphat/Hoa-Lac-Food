import React, { useContext, useEffect } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { getTopFoods } from '../../redux/Food/Actions'
import { useDispatch, useSelector } from 'react-redux'

const FoodDisplay = ({ category }) => {
  const dispatch = useDispatch();
  
  const foods = useSelector((state) => state.food?.foods || []);

  useEffect(() => {
    dispatch(getTopFoods());
  }, [dispatch]);
  console.log(foods);


  return (
    <div className='food-display' id='food-display'>
      <h2>Top foods near you</h2>
      <div className="food-display-list">

        {foods.map((item, index) => {

          if (category === "All" || category === item.categoryName) {
            return <FoodItem key={index} id={item.id} name={item.name} price={item.price} image={item.image} />
          }

        })}
      </div>
    </div>
  )
}

export default FoodDisplay