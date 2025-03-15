import { motion } from "framer-motion";
import { Edit, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShopFood, updateFoodStatus } from "../../redux/Food/Actions";
import { formatPrice } from "../../utils/format";
import UpdateFoodModal from './UpdateFoodModal';
import { getAllCategory } from "../../redux/Category/Actions";
import AddFoodModal from './AddFoodModal';

const ProductsTable = () => {
	const dispatch = useDispatch();

	const food = useSelector((state) => state.food?.shopFoods);
	const user = useSelector((state) => state.user?.userInfo);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(food);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [selectedFood, setSelectedFood] = useState(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	useEffect(() => {
		dispatch(getShopFood(user.shopId));
		dispatch(getAllCategory());
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

	const handleUpdateClick = (food) => {
		setSelectedFood(food);
		setIsUpdateModalOpen(true);
	};

	const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentItems = filteredProducts.slice(startIndex, endIndex);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const handleItemsPerPageChange = (e) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};

	return (
		<>
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className='flex justify-between items-center mb-6'>
					<div className="flex items-center gap-4">
						<h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
						<button
							onClick={() => setIsAddModalOpen(true)}
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
						>
							<Plus size={18} />
							Add
						</button>
					</div>
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
					<div className="flex items-center mb-4">
						<select
							value={itemsPerPage}
							onChange={handleItemsPerPageChange}
							className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value={10}>10 per page</option>
							<option value={20}>20 per page</option>
							<option value={50}>50 per page</option>
							<option value={100}>100 per page</option>
						</select>
					</div>

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
									Status
								</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-700'>
							{currentItems.map((item) => (
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
										<button 
											className='text-indigo-400 hover:text-indigo-300 mr-2'
											onClick={() => handleUpdateClick(item)}
										>
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

					<div className="flex items-center justify-between mt-4">
						<div className="text-sm text-gray-400">
							Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} entries
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft size={20} />
							</button>
							{Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`px-3 py-1 rounded-lg ${
										currentPage === page
											? 'bg-blue-600'
											: 'bg-gray-700'
									} text-white`}
								>
									{page}
								</button>
							))}
							<button
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === pageCount}
								className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRight size={20} />
							</button>
						</div>
					</div>
				</div>
			</motion.div>

			<UpdateFoodModal
				isOpen={isUpdateModalOpen}
				onClose={() => setIsUpdateModalOpen(false)}
				food={selectedFood}
			/>
			<AddFoodModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
			/>
		</>
	);
};
export default ProductsTable;
