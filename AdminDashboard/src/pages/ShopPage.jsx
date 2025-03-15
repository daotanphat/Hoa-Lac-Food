import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store, DollarSign, Users, Clock } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { getShopById } from "../redux/Shop/Actions";
import ShopDetailsCard from "../components/shop/ShopDetailsCard";
import ShopRevenueChart from "../components/shop/ShopRevenueChart";
import ShopStatusChart from "../components/shop/ShopStatusChart";

const ShopPage = () => {
    const dispatch = useDispatch();
    const shopId = useSelector((state) => state.user?.userInfo.shopId);
    const shop = useSelector((state) => state.shop?.shop);

    useEffect(() => {
        // Replace with actual shop ID
        dispatch(getShopById(shopId));
    }, [dispatch]);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Shop Information' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Stats Section */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Total Products'
                        icon={Store}
                        value={shop?.totalProducts || 0}
                        color='#6366F1'
                    />
                    <StatCard
                        name='Total Revenue'
                        icon={DollarSign}
                        value={shop?.totalRevenue || 0}
                        color='#10B981'
                    />
                    <StatCard
                        name='Total Orders'
                        icon={Users}
                        value={shop?.totalOrders || 0}
                        color='#F59E0B'
                    />
                    <StatCard
                        name='Operating Hours'
                        icon={Clock}
                        value={shop?.operatingHours || '24/7'}
                        color='#EF4444'
                    />
                </motion.div>

                {/* Shop Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <ShopDetailsCard shop={shop} />
                </motion.div>

                {/* Charts Section */}
                <motion.div
                    className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <ShopRevenueChart />
                    <ShopStatusChart />
                </motion.div>
            </main>
        </div>
    );
};

export default ShopPage;
