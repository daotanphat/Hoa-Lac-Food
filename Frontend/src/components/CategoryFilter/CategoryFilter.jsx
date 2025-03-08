import "./CategoryFilter.css";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    console.log(categories);
    return (
        <div className="category-filter">
            <h2>Categories</h2>
            <ul>
                <li className={!selectedCategory ? "active" : ""} onClick={() => onSelectCategory("")}>
                    All Categories
                </li>
                {categories.map((category, index) => (
                    <li key={index} className={selectedCategory === category.name ? "active" : ""} onClick={() => onSelectCategory(category.name)}>
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryFilter;