import { useState } from "react";
import { Search, Plus, Edit, Trash, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import CategoryModal from "./CategoryModal";
import { updateCategory, createCategory, deleteCategory } from "../../redux/Category/Actions";

const CategoryTable = ({ categories }) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Filter categories based on search term
    const filteredCategories = categories.filter((category) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current categories
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleAddNew = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (name) => {
        if (selectedCategory) {
            // Handle update
            const success = await dispatch(updateCategory(selectedCategory.id, { name }));
            if (success) {
                setIsModalOpen(false);
            }
        } else {
            // Handle create
            const success = await dispatch(createCategory(name));
            if (success) {
                setIsModalOpen(false);
            }
        }
    };

    const handleDelete = async (category) => {
        if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
            await dispatch(deleteCategory(category.id));
        }
    };

    return (
        <>
            <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="p-5 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center">
                    <h3 className="text-lg font-medium text-white mb-3 sm:mb-0">Category List</h3>
                    <div className="flex w-full sm:w-auto gap-3">
                        <div className="relative flex-grow sm:flex-grow-0">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left bg-gray-700/50">
                                <th className="p-4 font-medium text-gray-200">Name</th>
                                <th className="p-4 font-medium text-gray-200">Number of Products</th>
                                <th className="p-4 font-medium text-gray-200">Status</th>
                                <th className="p-4 font-medium text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length > 0 ? (
                                currentCategories.map((category) => (
                                    <tr key={category.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                                        <td className="p-4 text-gray-300">{category.name}</td>
                                        <td className="p-4 text-gray-300">{category.productCount || 0}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                                                ? "bg-red-900/40 text-red-400"
                                                : "bg-green-900/40 text-green-400"
                                                }`}>
                                                {category.isActive ? "Inactive" : "Active"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="p-1 rounded-full hover:bg-gray-700"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <Edit className="h-4 w-4 text-yellow-400" />
                                                </button>
                                                <button 
                                                    className="p-1 rounded-full hover:bg-gray-700"
                                                    onClick={() => handleDelete(category)}
                                                >
                                                    <Trash className="h-4 w-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-400">
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCategories.length > itemsPerPage && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-700">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastItem, filteredCategories.length)}
                                    </span>{" "}
                                    of <span className="font-medium">{filteredCategories.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    {Array.from({ length: Math.ceil(filteredCategories.length / itemsPerPage) }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${currentPage === index + 1
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                } border border-gray-600`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                category={selectedCategory}
            />
        </>
    );
};

export default CategoryTable; 