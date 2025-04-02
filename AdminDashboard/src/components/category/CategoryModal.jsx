import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const CategoryModal = ({ isOpen, onClose, onSubmit, category = null }) => {
    const isLoading = useSelector(state => state.category?.loading);
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (category) {
            setCategoryName(category.name || '');
        } else {
            setCategoryName('');
        }
    }, [category]);

    const validateName = () => {
        // Name validation based on API requirements
        if (!categoryName.trim()) {
            setError('Category name cannot be empty.');
            return false;
        }
        if (categoryName.length > 100) {
            setError('Category name cannot exceed 100 characters.');
            return false;
        }
        if (categoryName.length < 3) {
            setError('Category name must be at least 3 characters long.');
            return false;
        }
        if (!/^[\p{L}0-9 ]*$/u.test(categoryName)) {
            setError('Category name cannot contain special characters.');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateName()) {
            onSubmit(categoryName.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white mb-6">
                    {category ? 'Update Category' : 'Add New Category'}
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className={`w-full px-3 py-2 bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-600'
                                } rounded-lg text-white focus:outline-none focus:border-indigo-500`}
                            placeholder="Enter category name"
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-50 flex items-center"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {category ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal; 