import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { updateFood } from '../../redux/Food/Actions';

const UpdateFoodModal = ({ isOpen, onClose, food }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.category?.categories);
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        quantity: '',
        image: '',
        categoryId: '',
        available: true
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (food) {
            // Find category ID from category name
            const category = categories?.find(cat => cat.name === food.categoryName);
            
            setFormData({
                id: food.id,
                name: food.name,
                price: food.price,
                quantity: food.quantity,
                image: food.image,
                categoryId: category?.id || '',  // Set categoryId from found category
                available: food.available
            });
            setImagePreview(food.image);
        }
    }, [food, categories]);  // Add categories to dependency array

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setFormData({ ...formData, image: file }); // Will be handled in form submission
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Only append non-null values
        if (formData.name) formDataToSend.append('name', formData.name);
        if (formData.price) formDataToSend.append('price', formData.price);
        if (formData.quantity) formDataToSend.append('quantity', formData.quantity);
        if (formData.categoryId) formDataToSend.append('categoryId', formData.categoryId);
        if (imageFile) formDataToSend.append('image', imageFile);

        // Correct way to inspect FormData contents
        // console.log('Form data contents:');
        // for (let pair of formDataToSend.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        await dispatch(updateFood(formData.id, formDataToSend));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-800 rounded-xl p-6 w-full max-w-md relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-semibold text-white mb-6">Update Food</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-gray-300 block mb-1">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="text-gray-300 block mb-1">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                            >
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 block mb-1">Price</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="text-gray-300 block mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-gray-300 block mb-1">Image</label>
                            {imagePreview && (
                                <div className="mb-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                            />
                        </div>

                        <div className="flex items-center">
                            <label className="text-gray-300 mr-2">Available</label>
                            <input
                                type="checkbox"
                                checked={formData.available}
                                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpdateFoodModal;
