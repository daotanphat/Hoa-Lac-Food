import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { AlertTriangle, Package, TrendingUp, Info } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { useSelector } from "react-redux";

const ProductsPage = () => {
	const food = useSelector((state) => state.food?.shopFoods);
	
	const totalStock = food?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
	const lowStockCount = food?.filter(item => item.quantity < 10).length || 0;

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Products' icon={Package} value={food?.length || 0} color='#6366F1' />
					<StatCard name='Total Stock' icon={TrendingUp} value={totalStock} color='#10B981' />
					<StatCard 
						name='Low Stock' 
						icon={AlertTriangle} 
						value={lowStockCount} 
						color='#F59E0B'
						tooltip={
							<div className="absolute top-3 right-3 group">
								<Info className="h-4 w-4 text-gray-400 cursor-help" />
								<div className="hidden group-hover:block absolute right-0 top-6 bg-gray-800 text-white text-xs rounded p-2 w-48">
									Number food have quantity &lt; 10
								</div>
							</div>
						}
					/>
				</motion.div>

				<ProductsTable />

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<SalesTrendChart />
					<CategoryDistributionChart />
				</div>
			</main>
		</div>
	);
};
export default ProductsPage;
