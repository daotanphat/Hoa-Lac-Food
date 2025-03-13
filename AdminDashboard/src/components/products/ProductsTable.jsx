import { motion } from "framer-motion";
import { Edit, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShopFood, updateFoodStatus } from "../../redux/Food/Actions";
import { formatPrice } from "../../utils/format";
import { toast } from "react-toastify";

const PRODUCT_DATA = [
	{ id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200 },
	{ id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800 },
	{ id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650 },
	{ id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950 },
	{ id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720 },
];

const ProductsTable = () => {
	const dispatch = useDispatch();

	const food = useSelector((state) => state.food?.shopFoods);
	const user = useSelector((state) => state.user?.userInfo);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(food);

	useEffect(() => {
		dispatch(getShopFood(user.shopId));
	}, [user, dispatch]);

	useEffect(() => {
		setFilteredProducts(food);
	}, [food]);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = food.filter(
			(item) => item.name.toLowerCase().includes(term) || item.categoryName.toLowerCase().includes(term)
		);

		setFilteredProducts(filtered);
	};

	const handleToggleStatus = async (id) => {
		await dispatch(updateFoodStatus(id));
	};
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search products...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Category
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Price
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Stock
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Update
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Inactive
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredProducts.map((item) => (
							<motion.tr
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
									<img
										src={item.image}
										alt='Product img'
										className='size-10 rounded-full'
									/>
									{item.name}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{item.categoryName}
								</td>

								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									{formatPrice(item.price)}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{item.quantity}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<button className='text-indigo-400 hover:text-indigo-300 mr-2'>
										<Edit size={18} />
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm'>
									<button
										onClick={() => handleToggleStatus(item.id)}
										className={`px-4 py-2 rounded-md ${item.available
											? 'bg-green-600 hover:bg-green-700'
											: 'bg-red-600 hover:bg-red-700'
											}`}
									>
										{item.available ? 'Active' : 'Inactive'}
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default ProductsTable;
