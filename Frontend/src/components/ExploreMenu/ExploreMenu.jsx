import React, { useEffect } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../../assets/assets'
import menu_1 from '../../../assets/menu_1.png'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategory } from '../../redux/Category/Actions';

const ExploreMenu = ({ category, setCategory }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category?.categories || []);

  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Category</h1>
      <p className='explore-menu-text'>Discover a variety of mouthwatering dishes, carefully curated into different categories for your convenience.
        Whether you're craving something savory, sweet, or refreshing, explore our menu to find the perfect meal for any occasion.</p>
      <div className="explore-menu-list">
        {categories.map((item, index) => {
          return (
            <div onClick={() => setCategory(prev => prev === item.name ? "All" : item.name)} key={index} className="explore-menu-list-item">
              <img className={category === item.name ? "active" : ""} src={menu_1} alt="" />
              <p>{item.name}</p>
            </div>
          )
        })}

      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
