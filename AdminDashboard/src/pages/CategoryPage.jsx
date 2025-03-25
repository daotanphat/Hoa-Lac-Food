import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Folder, Tag, Grid, BookOpen } from "lucide-react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CategoryTable from "../components/category/CategoryTable";
import { getAllCategory } from "../redux/Category/Actions"; // Assuming you have this action

const CategoryPage = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.category?.categories || []);

    useEffect(() => {
        dispatch(getAllCategory());
    }, [dispatch]);

    const activeCategories = categories.filter(cat => cat.isActive).length;
    const inactiveCategories = categories.length - activeCategories;

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Categories' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Categories' icon={Folder} value={categories.length} color='#6366F1' />
                    <StatCard name='Active Categories' icon={Tag} value={inactiveCategories} color='#10B981' />
                    <StatCard name='Inactive Categories' icon={BookOpen} value={activeCategories} color='#F59E0B' />
                    {/* <StatCard name='Product Types' icon={Grid} value={categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)} color='#EC4899' /> */}
                </motion.div>

                {/* CATEGORY TABLE */}
                <CategoryTable categories={categories} />
            </main>
        </div>
    );
};

export default CategoryPage; 