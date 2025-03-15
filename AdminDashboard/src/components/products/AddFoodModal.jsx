import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createFood } from '../../redux/Food/Actions';

const AddFoodModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.category?.categories);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        image: null,
        categoryId: ''
    });

    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        quantity: '',
        image: '',
        categoryId: ''
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const validTypes = ['image/jpeg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setErrors({ ...errors, image: 'Only JPG and PNG files are allowed.' });
                return;
            }
            setFormData({ ...formData, image: file });
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setErrors({ ...errors, image: '' }); // Clear error if valid
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            // Prevent typing space as first character
            if (value.length === 1 && value === ' ') {
                return;
            }
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        // Name validation
        if (!formData.name) {
            tempErrors.name = 'Food name is required.';
            isValid = false;
        } else if (formData.name.length > 100) {
            tempErrors.name = 'Food name cannot exceed 100 characters.';
            isValid = false;
        } else if (!/^[a-zA-Z0-9 ]*$/.test(formData.name)) {
            tempErrors.name = 'Food name must not contain special characters.';
            isValid = false;
        } else if (formData.name.startsWith(' ')) {
            tempErrors.name = 'Food name cannot start with spaces.';
            isValid = false;
        }

        // Price validation
        const price = parseFloat(formData.price);
        if (!formData.price) {
            tempErrors.price = 'Price is required.';
            isValid = false;
        } else if (price < 0.01 || price > 999999.99) {
            tempErrors.price = 'Price must be between 0.01 and 999999.99.';
            isValid = false;
        }

        // Quantity validation
        const quantity = parseInt(formData.quantity);
        if (!formData.quantity) {
            tempErrors.quantity = 'Quantity is required.';
            isValid = false;
        } else if (quantity < 1) {
            tempErrors.quantity = 'Quantity must be at least 1.';
            isValid = false;
        }

        // Category validation
        if (!formData.categoryId) {
            tempErrors.categoryId = 'Category ID is required.';
            isValid = false;
        }

        // Image validation
        if (!formData.image) {
            tempErrors.image = 'Image is required.';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const formDataToSend = new FormData();

        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('quantity', formData.quantity);
        formDataToSend.append('categoryId', formData.categoryId);
        if (formData.image) formDataToSend.append('image', formData.image);

        // Correct way to inspect FormData contents
        // console.log('Form data contents:');
        // for (let pair of formDataToSend.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        await dispatch(createFood(formDataToSend));
        onClose();
        // Reset form
        setFormData({
            name: '',
            price: '',
            quantity: '',
            image: null,
            categoryId: ''
        });
        setImagePreview('');
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

                    <h2 className="text-xl font-semibold text-white mb-6">Add New Food</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-gray-300 block mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                required
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-gray-300 block mb-1">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-300 block mb-1">Price</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-gray-300 block mb-1">Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: Math.floor(Number(e.target.value)) })}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                    step="1"
                                    min="1"
                                    required
                                />
                                {errors.quantity && (
                                    <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                                )}
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
                                accept="image/jpeg,image/png"
                                onChange={handleImageChange}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                                required
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                            )}
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
                                Add Food
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddFoodModal;
