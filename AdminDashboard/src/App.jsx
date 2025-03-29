import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedLayout from "./components/layouts/ProtectedLayout";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ToastContainer } from "react-toastify";
import CreateShop from "./pages/CreateShop/CreateShop";
import ShopPage from "./pages/ShopPage";
import CategoryPage from "./pages/CategoryPage";
import AdminShopPage from "./pages/AdminShopPage";

function App() {
	const location = useLocation();
	const authRoutes = ['/login', '/signup', '/create-shop'];
	const isAuthPage = authRoutes.includes(location.pathname);
	const user = useSelector((state) => state.auth);
	const isAdmin = user?.roles?.includes('Admin');

	return (
		<div className={isAuthPage ? 'w-full h-screen' : 'flex h-screen bg-gray-900 text-gray-100'}>
			<ToastContainer position="top-right" autoClose={3000} />
			{/* BG */}
			{!isAuthPage && (
				<div className='fixed inset-0 z-0'>
					<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
					<div className='absolute inset-0' />
				</div>
			)}

			{!isAuthPage && <Sidebar />}
			<main className={!isAuthPage ? 'flex-grow overflow-auto' : ''}>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/create-shop" element={<CreateShop />} />

					{/* Protected Routes */}
					<Route element={<ProtectedLayout />}>
						{isAdmin ? (
							// Admin Routes
							<>
								<Route path='/admin/categories' element={<CategoryPage />} />
								<Route path='/admin/shops' element={<AdminShopPage />} />
							</>
						) : (
							// Non-Admin Routes
							<>
								<Route path='/' element={<OverviewPage />} />
								<Route path='/products' element={<ProductsPage />} />
								<Route path='/users' element={<UsersPage />} />
								<Route path='/sales' element={<SalesPage />} />
								<Route path='/orders' element={<OrdersPage />} />
								<Route path='/analytics' element={<AnalyticsPage />} />
								<Route path='/shop-detail' element={<ShopPage />} />
							</>
						)}
						<Route path='/settings' element={<SettingsPage />} />
					</Route>
				</Routes>
			</main>
		</div>
	);
}

export default App;
