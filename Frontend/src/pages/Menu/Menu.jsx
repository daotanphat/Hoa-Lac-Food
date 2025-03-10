import { useState, useEffect } from "react";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import FoodList from "../../components/FoodList/FoodList";
import Pagination from "../../components/Pagination/Pagination";
import "./Menu.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "../../redux/Category/Actions";
import { getAllFoods } from "../../redux/Food/Actions";

const MenuPage = () => {
    const dispatch = useDispatch();

    const foods = useSelector((state) => state.food?.foods || []);
    const categories = useSelector((state) => state.category?.categories || []);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        dispatch(getAllCategory());
        dispatch(getAllFoods());
    }, [dispatch]);

    const filteredFoods = foods
        .filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(food => selectedCategory ? food.categoryName === selectedCategory : true);

    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
    const paginatedFoods = filteredFoods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="menu-container">
            <div className="menu-sidebar">
                <CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            </div>
            <div className="menu-content">
                <input type="text" placeholder="Search food..." className="search-box" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <FoodList foods={paginatedFoods} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default MenuPage;