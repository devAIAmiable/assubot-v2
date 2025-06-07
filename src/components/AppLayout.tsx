import {
	FaBell,
	FaBrain,
	FaChartLine,
	FaCog,
	FaFolder,
	FaQuestionCircle,
	FaRobot,
	FaSignOutAlt,
	FaUser,
} from 'react-icons/fa';
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';

import { getUserState } from '../utils/stateHelpers';
import { logout } from '../store/userSlice';
import { motion } from 'framer-motion';

const AppLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();

	// Get user from Redux store
	const { currentUser, isAuthenticated } = useAppSelector(getUserState);

	const [notifications] = useState([
		{ id: 1, message: 'Votre contrat santé expire dans 45 jours', time: '2h', unread: true },
		{ id: 2, message: 'Nouvelle offre auto disponible', time: '1j', unread: true },
		{ id: 3, message: 'Paiement effectué avec succès', time: '3j', unread: false },
	]);

	const getCurrentModule = () => {
		const pathParts = location.pathname.split('/');
		return pathParts[pathParts.length - 1] || 'dashboard';
	};

	const navigation = [
		{
			name: 'Dashboard',
			path: '/app/dashboard',
			icon: FaChartLine,
			current: getCurrentModule() === 'dashboard',
		},
		{
			name: 'Contrats',
			path: '/app/contrats',
			icon: FaFolder,
			current: getCurrentModule() === 'contrats',
		},
		{
			name: "AI'A",
			path: '/app/chatbot',
			icon: FaRobot,
			current: getCurrentModule() === 'chatbot',
		},
		{
			name: 'Comparateur',
			path: '/app/comparateur',
			icon: FaBrain,
			current: getCurrentModule() === 'comparateur',
		},
	];

	const unreadNotifications = notifications.filter((n) => n.unread).length;

	const handleNavigate = (path: string) => {
		navigate(path);
	};

	const handleLogout = () => {
		dispatch(logout());
		navigate('/');
	};

	const handleNavigateToLanding = () => {
		navigate('/');
	};

	// Get user initials for avatar
	const getUserInitials = () => {
		if (currentUser) {
			const firstInitial = currentUser.first_name?.charAt(0) || '';
			const lastInitial = currentUser.last_name?.charAt(0) || '';
			return (firstInitial + lastInitial).toUpperCase() || 'U';
		}
		return 'U';
	};

	// Get user display name
	const getUserDisplayName = () => {
		if (currentUser) {
			return (
				currentUser.name ||
				`${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() ||
				'Utilisateur'
			);
		}
		return 'Utilisateur';
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Top Navigation Bar */}
			<motion.nav
				className="bg-white border-b border-gray-200 sticky top-0 z-50"
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<motion.div
							className="flex items-center cursor-pointer"
							whileHover={{ scale: 1.05 }}
							onClick={() => handleNavigate('/app/dashboard')}
						>
							<img src="/logo.png" alt="AssuBot Logo" className="h-8 w-auto mr-2" />
							<span className="text-2xl font-bold text-[#1e51ab] hidden sm:block">AssuBot</span>
						</motion.div>

						{/* Navigation Links */}
						<div className="hidden md:flex space-x-8">
							{navigation.map((item) => {
								const Icon = item.icon;
								return (
									<motion.button
										key={item.name}
										onClick={() => handleNavigate(item.path)}
										className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
											item.current
												? 'text-[#1e51ab] bg-blue-50'
												: 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50'
										}`}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Icon className="h-4 w-4 mr-2" />
										{item.name}
									</motion.button>
								);
							})}
						</div>

						{/* Right Side - Notifications and User */}
						<div className="flex items-center space-x-4">
							{/* Notifications */}
							<Menu as="div" className="relative">
								<Menu.Button className="relative p-2 text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50 rounded-lg transition-colors">
									<FaBell className="h-5 w-5" />
									{unreadNotifications > 0 && (
										<span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
											{unreadNotifications}
										</span>
									)}
								</Menu.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										<div className="px-4 py-2 border-b border-gray-100">
											<h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
										</div>
										<div className="max-h-64 overflow-y-auto">
											{notifications.map((notification) => (
												<Menu.Item key={notification.id}>
													{({ active }) => (
														<div
															className={`px-4 py-3 cursor-pointer ${
																active ? 'bg-gray-50' : ''
															} ${notification.unread ? 'bg-blue-50' : ''}`}
														>
															<div className="flex justify-between items-start">
																<div className="flex-1">
																	<p className="text-sm text-gray-900 line-clamp-2">
																		{notification.message}
																	</p>
																	<p className="text-xs text-gray-500 mt-1">
																		Il y a {notification.time}
																	</p>
																</div>
																{notification.unread && (
																	<div className="w-2 h-2 bg-[#1e51ab] rounded-full ml-2 mt-1"></div>
																)}
															</div>
														</div>
													)}
												</Menu.Item>
											))}
										</div>
										<div className="px-4 py-2 border-t border-gray-100">
											<button
												onClick={() => handleNavigate('/app/notifications')}
												className="text-sm text-[#1e51ab] hover:text-[#163d82] font-medium"
											>
												Voir toutes les notifications
											</button>
										</div>
									</Menu.Items>
								</Transition>
							</Menu>

							{/* User Menu */}
							<Menu as="div" className="relative">
								<Menu.Button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50 rounded-lg transition-colors">
									{currentUser?.avatar ? (
										<img
											src={currentUser.avatar}
											alt="Avatar"
											className="w-8 h-8 rounded-full object-cover"
										/>
									) : (
										<div className="w-8 h-8 bg-gradient-to-br from-[#1e51ab] to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
											{getUserInitials()}
										</div>
									)}
									<div className="hidden sm:block text-left">
										<p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
										{currentUser?.email && (
											<p className="text-xs text-gray-500">{currentUser.email}</p>
										)}
									</div>
								</Menu.Button>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										{/* User Info Header */}
										{currentUser && (
											<div className="px-4 py-3 border-b border-gray-100">
												<div className="flex items-center space-x-3">
													{currentUser.avatar ? (
														<img
															src={currentUser.avatar}
															alt="Avatar"
															className="w-10 h-10 rounded-full object-cover"
														/>
													) : (
														<div className="w-10 h-10 bg-gradient-to-br from-[#1e51ab] to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
															{getUserInitials()}
														</div>
													)}
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-gray-900 truncate">
															{getUserDisplayName()}
														</p>
														<p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
														{currentUser.professional_category && (
															<p className="text-xs text-gray-400">
																{currentUser.professional_category}
															</p>
														)}
													</div>
												</div>
											</div>
										)}

										<Menu.Item>
											{({ active }) => (
												<button
													onClick={() => handleNavigate('/app/profil')}
													className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${
														active ? 'bg-gray-50' : ''
													}`}
												>
													<FaUser className="h-4 w-4 mr-3" />
													Mon Profil
												</button>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${
														active ? 'bg-gray-50' : ''
													}`}
												>
													<FaCog className="h-4 w-4 mr-3" />
													Paramètres
												</button>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<button
													className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${
														active ? 'bg-gray-50' : ''
													}`}
												>
													<FaQuestionCircle className="h-4 w-4 mr-3" />
													Aide
												</button>
											)}
										</Menu.Item>
										<div className="border-t border-gray-100 my-1"></div>

										{/* Logout vs Return to Landing based on auth status */}
										{isAuthenticated ? (
											<Menu.Item>
												{({ active }) => (
													<button
														onClick={handleLogout}
														className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
															active ? 'bg-red-50' : ''
														}`}
													>
														<FaSignOutAlt className="h-4 w-4 mr-3" />
														Se déconnecter
													</button>
												)}
											</Menu.Item>
										) : (
											<Menu.Item>
												{({ active }) => (
													<button
														onClick={handleNavigateToLanding}
														className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${
															active ? 'bg-gray-50' : ''
														}`}
													>
														<FaSignOutAlt className="h-4 w-4 mr-3" />
														Retour à l'accueil
													</button>
												)}
											</Menu.Item>
										)}
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden border-t border-gray-200">
					<div className="px-4 py-2 space-x-1 flex overflow-x-auto">
						{navigation.map((item) => {
							const Icon = item.icon;
							return (
								<button
									key={item.name}
									onClick={() => handleNavigate(item.path)}
									className={`flex items-center px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
										item.current
											? 'text-[#1e51ab] bg-blue-50'
											: 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50'
									}`}
								>
									<Icon className="h-3 w-3 mr-1" />
									{item.name}
								</button>
							);
						})}
					</div>
				</div>
			</motion.nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Outlet />
			</main>
		</div>
	);
};

export default AppLayout;
