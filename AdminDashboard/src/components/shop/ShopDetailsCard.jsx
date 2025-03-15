import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Mail, Globe, Upload, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { updateShop, updateShopStatement } from "../../redux/Shop/Actions";
import { useDispatch } from "react-redux";

const ShopDetailsCard = ({ shop }) => {
    const dispatch = useDispatch();
    const [shopStatus, setShopStatus] = useState(shop?.isOpen);

    // Add useEffect to update local state when shop prop changes
    useEffect(() => {
        setShopStatus(shop?.isOpen);
    }, [shop?.isOpen]);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: shop?.name || "",
        description: shop?.description || "",
        address: shop?.address || "",
        bank: shop?.bank || "",
    });
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(shop?.image || "/placeholder.jpg");
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        const fileType = file.type;
        if (fileType !== "image/jpeg" && fileType !== "image/png") {
            setErrors({ ...errors, image: "Only JPG and PNG files are accepted" });
            return;
        }

        // Clear file error if exists
        if (errors.image) {
            setErrors({ ...errors, image: null });
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        setFormData({ ...formData, photo: file });
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Shop Name is required";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Shop Name must have at least 3 characters";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.name)) {
            newErrors.name = "Shop Name must not contain special characters";
        }

        // Address validation
        if (!formData.address.trim()) {
            newErrors.address = "Shop Address is required";
        } else if (formData.address.trim().length < 3) {
            newErrors.address = "Shop Address must have at least 3 characters";
        }

        // Bank validation
        if (!formData.bank) {
            newErrors.bank = "Bank is required";
        } else if (!/^\d+$/.test(formData.bank)) {
            newErrors.bank = "Bank must contain only numbers";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please correct the errors in the form");
            return;
        }

        // Create form data for API submission including image
        const submitData = new FormData();
        for (const key in formData) {
            if (key === 'photo' && formData[key]) {
                submitData.append(key, formData[key]);
            } else if (key === 'description') {
                // Only append description if it's not empty
                if (formData[key]?.trim()) {
                    submitData.append(key, formData[key]);
                }
            } else if (key !== 'photo') {
                submitData.append(key, formData[key]);
            }
        }

        // Dispatch updateShop action
        dispatch(updateShop(submitData));
        setIsEditing(false);
    };

    const handleToggleStatus = async () => {
        try {
            await dispatch(updateShopStatement(shop.name));
            // Update local state with the opposite of current status
            setShopStatus(!shopStatus);
        } catch (error) {
            toast.error("Failed to update shop status");
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Image and Status Section */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative group">
                            <img
                                src={previewImage}
                                alt={formData.name}
                                className={`w-48 h-48 rounded-2xl object-cover border-4 ${errors.image ? 'border-red-500' : 'border-blue-500/30'
                                    } shadow-xl transition-transform group-hover:scale-105`}
                            />
                            {isEditing && (
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Upload className="w-12 h-12 text-white/90" />
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={!isEditing}
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

                        {/* Status Toggle - Now Independent of Edit Mode */}
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-gray-400 font-medium">Shop Status</span>
                            <button
                                type="button"
                                onClick={handleToggleStatus}
                                className={`px-6 py-2 rounded-full flex items-center justify-center transition-all shadow-lg ${shopStatus
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                    }`}
                            >
                                {shopStatus ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        <span className="font-medium">Open</span>
                                    </>
                                ) : (
                                    <>
                                        <X className="w-5 h-5 mr-2" />
                                        <span className="font-medium">Close</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-gray-700/30 rounded-xl p-6 backdrop-blur-sm">
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="text-gray-400 text-sm font-medium mb-1 block">Shop Name</label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border-2 focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.name ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </>
                                    ) : (
                                        <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                            {formData.name || "No name provided"}
                                        </h2>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label className="text-gray-400 text-sm font-medium mb-1 block">Description</label>
                                    {isEditing ? (
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full p-3 rounded-lg bg-gray-700/50 text-white border-2 border-gray-600 focus:ring-2 focus:ring-blue-500/50 transition-all h-24"
                                        />
                                    ) : (
                                        <p className="text-gray-300 leading-relaxed bg-gray-700/20 p-4 rounded-lg">
                                            {formData.description || "No description provided"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Fields */}
                            <div className="bg-gray-700/30 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-300 mb-4">Contact Information</h3>
                                {[
                                    { icon: MapPin, label: "Address", name: "address", error: errors.address }
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="text-gray-400 text-sm font-medium mb-1 block">{field.label}</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className={`w-full pl-12 pr-4 py-3 rounded-lg bg-gray-700/50 text-white border-2 focus:ring-2 focus:ring-blue-500/50 transition-all ${field.error ? 'border-red-500' : 'border-gray-600'
                                                        }`}
                                                />
                                                {field.error && <p className="text-red-500 text-sm mt-1">{field.error}</p>}
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3 bg-gray-700/20 p-3 rounded-lg">
                                                <field.icon className="w-5 h-5 text-blue-400" />
                                                <span className="text-gray-300">{formData[field.name] || `No ${field.label.toLowerCase()} provided`}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Banking Information */}
                            <div className="bg-gray-700/30 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-300 mb-4">Banking Information</h3>
                                <div>
                                    <label className="text-gray-400 text-sm font-medium mb-1 block">Bank Account</label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                name="bank"
                                                value={formData.bank}
                                                onChange={handleChange}
                                                className={`w-full p-3 rounded-lg bg-gray-700/50 text-white border-2 focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.bank ? 'border-red-500' : 'border-gray-600'
                                                    }`}
                                            />
                                            {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank}</p>}
                                        </>
                                    ) : (
                                        <div className="bg-gray-700/20 p-4 rounded-lg">
                                            <p className="text-gray-300 font-mono">{formData.bank || "No bank information provided"}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-8 space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all shadow-lg hover:shadow-xl"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-lg hover:shadow-xl"
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all shadow-lg hover:shadow-xl"
                        >
                            Edit Details
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ShopDetailsCard;
