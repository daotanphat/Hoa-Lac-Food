import { User, LogOut } from "lucide-react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/Authentication/Actions';
import SettingSection from "./SettingSection";

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		navigate('/login');
	};

	return (
		<SettingSection icon={User} title={"Profile"}>
			<div className='flex flex-col sm:flex-row items-center mb-6'>
				<img
					src='https://randomuser.me/api/portraits/men/3.jpg'
					alt='Profile'
					className='rounded-full w-20 h-20 object-cover mr-4'
				/>

				<div>
					<h3 className='text-lg font-semibold text-gray-100'>John Doe</h3>
					<p className='text-gray-400'>john.doe@example.com</p>
				</div>
			</div>

			<div className='flex flex-col sm:flex-row gap-4 mt-6'>
				<button className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'>
					Edit Profile
				</button>
				<button 
					onClick={handleLogout}
					className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto flex items-center justify-center gap-2'
				>
					<LogOut size={18} />
					Logout
				</button>
			</div>
		</SettingSection>
	);
};
export default Profile;
