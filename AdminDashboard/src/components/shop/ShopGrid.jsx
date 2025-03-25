import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { MapPin, CreditCard, Power, InfoIcon, Loader2 } from "lucide-react";
import { updateShopStatus } from "../../redux/Shop/Actions"; // Update import

const ShopGrid = ({ shops, loading }) => {
    const dispatch = useDispatch();
    const [processingIds, setProcessingIds] = useState([]);

    const handleToggleStatus = async (shop) => {
        setProcessingIds(prev => [...prev, shop.id]);
        try {
            await dispatch(updateShopStatus(shop.id)); // Updated to use shop.id
        } finally {
            setProcessingIds(prev => prev.filter(id => id !== shop.id));
        }
    };

    if (loading && shops.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                <p className="ml-3 text-gray-400">Loading shops...</p>
            </div>
        );
    }

    if (shops.length === 0) {
        return (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
                <InfoIcon className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300">No shops found</h3>
                <p className="mt-2 text-gray-400">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop, index) => (
                <motion.div
                    key={shop.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={shop.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                            alt={shop.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 p-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${shop.status ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"
                                }`}>
                                {shop.status ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="text-xl font-semibold text-white mb-3">{shop.name}</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300 text-sm">{shop.address}</p>
                            </div>

                            <div className="flex items-start">
                                <CreditCard className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300 text-sm">{shop.bank}</p>
                            </div>
                        </div>


                        <div className="mb-4 min-h-[80px]">
                            <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                            <p className="text-gray-300 text-sm line-clamp-3">
                                {shop.description || 'No description available'}
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                            <button
                                onClick={() => handleToggleStatus(shop)}
                                disabled={processingIds.includes(shop.id)}
                                className="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 
                                    bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
                            >
                                {processingIds.includes(shop.id) ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Power className="h-4 w-4" />
                                        {shop.status ? "Activate" : "Deactivate"}
                                    </>
                                )}
                            </button>

                            <button
                                className="px-4 py-2 text-sm font-medium rounded-lg
                                    bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ShopGrid; 