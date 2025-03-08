import FoodItem from "../FoodItem/FoodItem";
import "./FoodList.css";

const FoodList = ({ foods }) => {
    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-list">

                {foods.map((item, index) => {
                    return <FoodItem key={index} id={item.id} name={item.name} price={item.price} image={item.image} />
                })}
                
            </div>
        </div>
    );
};

export default FoodList;