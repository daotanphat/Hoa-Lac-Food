import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createShop } from '../redux/Shop/Actions';
import { FaStore, FaUpload } from 'react-icons/fa';
import './CreateShop/CreateShop.css';

const CreateShop = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [shopData, setShopData] = useState({
        name: '',
        description: '',
        address: '',
        image: null,
        bank: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        address: '',
        bank: '',
        image: ''
    });

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value) return 'Shop Name is required';
                if (value.length < 3) return 'Shop Name must have at least 3 characters';
                if (!/^[a-zA-Z0-9\s]+$/.test(value)) return 'Shop Name must not contain special characters';
                return '';
            case 'address':
                if (!value) return 'Shop Address is required';
                if (value.length < 3) return 'Shop Address must have at least 3 characters';
                return '';
            case 'bank':
                if (!value) return 'Bank information is required';
                if (!/^\d+$/.test(value)) return 'Bank must contain only numbers';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopData({ ...shopData, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                setErrors({ ...errors, image: 'Please select only JPG or PNG images' });
                return;
            }
            setErrors({ ...errors, image: '' });
            setShopData({ ...shopData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        const newErrors = {
            name: validateField('name', shopData.name),
            address: validateField('address', shopData.address),
            bank: validateField('bank', shopData.bank),
            image: !shopData.image ? 'Shop Image is required' : ''
        };

        setErrors(newErrors);

        // Check if there are any errors
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }

        setLoading(true);

        const formData = new FormData();
        Object.keys(shopData).forEach(key => {
            formData.append(key, shopData[key]);
        });

        // console.log('Form data contents:');
        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        //await dispatch(createShop(formData, navigate));
        setLoading(false);
    };

    return (
        <div className="create-shop-container p-4">
            <div className="create-shop-card max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                {/* Header Section */}
                <div className="text-center mb-4">
                    <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaStore className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Create Your Shop</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Set up your shop profile to start selling on our platform
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="form-group flex-1">
                            <label>Shop Name</label>
                            <input
                                type="text"
                                name="name"
                                value={shopData.name}
                                onChange={handleChange}
                                className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="form-group flex-1">
                            <label>Bank Information</label>
                            <input
                                type="text"
                                name="bank"
                                value={shopData.bank}
                                onChange={handleChange}
                                className={`form-input ${errors.bank ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={shopData.description}
                            onChange={handleChange}
                            rows="3"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={shopData.address}
                            onChange={handleChange}
                            className={`form-input ${errors.address ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="form-group">
                        <label>Shop Image</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleImageClick}
                            className="upload-button w-full py-3 px-4 rounded-md flex items-center justify-center"
                        >
                            <FaUpload className="mr-2" />
                            Upload Image
                        </button>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        {previewUrl && (
                            <div className="image-preview">
                                <img src={previewUrl} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
                    >
                        {loading ? 'Creating...' : 'Create Shop'}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default CreateShop;
