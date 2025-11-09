import { Dialog, Menu, Transition } from '@headlessui/react';
import { FaBars, FaBell, FaBrain, FaChartLine, FaCog, FaCoins, FaFolder, FaPlay, FaQuestionCircle, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import { Fragment, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Avatar from './ui/Avatar';
import VideoModal from './ui/VideoModal';
import { VscRobot } from 'react-icons/vsc';
import { getProfessionalCategoryLabel } from '../utils/user';
import { getUserState } from '../utils/stateHelpers';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import { useLogout } from '../hooks/useLogout';
import { useVideoModal } from '../hooks/useVideoModal';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user from Redux store
  const { currentUser, isAuthenticated } = useAppSelector(getUserState);

  // Video modal hook
  const { isVideoModalOpen, closeVideoModal, openVideoModal } = useVideoModal();

  // Logout hook
  const { logout, loading: logoutLoading } = useLogout();

  const [notifications] = useState<Array<{ id: number; message: string; time: string; unread: boolean }>>([]);

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
      icon: VscRobot,
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

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavigateToLanding = () => {
    navigate('/');
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (currentUser) {
      return `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Utilisateur';
    }
    return 'Utilisateur';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <motion.nav className="bg-white border-b border-gray-200 sticky top-0 z-50" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.3 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div className="flex items-center cursor-pointer" whileHover={{ scale: 1.05 }} onClick={() => handleNavigate('/app/dashboard')}>
              <img src="/logo.png" alt="AssuBot Logo" className="h-8 w-auto mr-2" />
              <span className="text-2xl font-bold text-[#1e51ab] hidden sm:block">AssuBot</span>
            </motion.div>

            {/* Navigation Links (desktop) */}
            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigate(item.path)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.current ? 'text-[#1e51ab] bg-blue-50' : 'text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50'
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
            <div className="flex items-center space-x-3">
              {currentUser?.creditBalance !== undefined && (
                <button
                  onClick={() => handleNavigate('/app/credits')}
                  className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-[#1e51ab] inline">{currentUser.creditBalance}</span>
                  <FaCoins className="h-4 w-4 text-[#1e51ab]" />
                </button>
              )}

              <Menu as="div" className="relative hidden md:inline-block">
                <Menu.Button className="relative p-2 text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50 rounded-lg transition-colors">
                  <FaBell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadNotifications}</span>
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
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                              <div className={`px-4 py-3 cursor-pointer ${active ? 'bg-gray-50' : ''} ${notification.unread ? 'bg-blue-50' : ''}`}>
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">Il y a {notification.time}</p>
                                  </div>
                                  {notification.unread && <div className="w-2 h-2 bg-[#1e51ab] rounded-full ml-2 mt-1"></div>}
                                </div>
                              </div>
                            )}
                          </Menu.Item>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <FaBell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Aucune notification</p>
                          <p className="text-xs text-gray-400 mt-1">Vous serez notifié des nouvelles activités</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button onClick={() => handleNavigate('/app/notifications')} className="text-sm text-[#1e51ab] hover:text-[#163d82] font-medium">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <Menu as="div" className="relative hidden md:inline-block">
                <Menu.Button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-[#1e51ab] hover:bg-gray-50 rounded-lg transition-colors">
                  <Avatar user={currentUser || undefined} size="sm" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    {currentUser?.email && <p className="text-xs text-gray-500">{currentUser.email}</p>}
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
                          <Avatar user={currentUser} size="md" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{getUserDisplayName()}</p>
                            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                            {currentUser.professionalCategory && <p className="text-xs text-gray-400">{getProfessionalCategoryLabel(currentUser.professionalCategory)}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={() => handleNavigate('/app/profil')} className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-50' : ''}`}>
                          <FaUser className="h-4 w-4 mr-3" />
                          Mon Profil
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-50' : ''}`}>
                          <FaCog className="h-4 w-4 mr-3" />
                          Paramètres
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={() => handleNavigate('/faq')} className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-50' : ''}`}>
                          <FaQuestionCircle className="h-4 w-4 mr-3" />
                          FAQ
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={openVideoModal} className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-50' : ''}`}>
                          <FaPlay className="h-4 w-4 mr-3" />
                          Voir la vidéo AssuBot
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
                            disabled={logoutLoading}
                            className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                              active ? 'bg-red-50' : ''
                            } ${logoutLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {logoutLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-3"></div>
                                Déconnexion...
                              </>
                            ) : (
                              <>
                                <FaSignOutAlt className="h-4 w-4 mr-3" />
                                Se déconnecter
                              </>
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    ) : (
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={handleNavigateToLanding} className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 ${active ? 'bg-gray-50' : ''}`}>
                            <FaSignOutAlt className="h-4 w-4 mr-3" />
                            Retour à l'accueil
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Mobile Hamburger */}
              <button
                className="md:hidden inline-flex items-center justify-center p-2 text-gray-600 hover:text-[#1e51ab] hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Ouvrir le menu mobile"
              >
                <FaBars className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <Transition show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative w-full max-w-xs bg-white shadow-xl pb-6 flex flex-col">
                  <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src="/logo.png" alt="AssuBot" className="h-7 w-auto" />
                      <span className="text-lg font-semibold text-[#1e51ab]">AssuBot</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-[#1e51ab]" aria-label="Fermer le menu">
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar user={currentUser || undefined} size="md" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                        {currentUser?.email && <p className="text-xs text-gray-500">{currentUser.email}</p>}
                      </div>
                    </div>
                  </div>

                  {currentUser?.creditBalance !== undefined && (
                    <button onClick={() => handleNavigate('/app/credits')} className="mx-4 mt-4 flex items-center justify-between px-4 py-2 rounded-lg bg-blue-50 text-[#1e51ab]">
                      <span className="text-sm font-medium">Crédits : {currentUser.creditBalance}</span>
                      <FaCoins className="h-4 w-4" />
                    </button>
                  )}

                  <nav className="mt-4 flex-1 overflow-y-auto">
                    <ul className="px-3 space-y-1">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.name}>
                            <button
                              onClick={() => {
                                handleNavigate(item.path);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                item.current ? 'bg-blue-50 text-[#1e51ab]' : 'text-gray-700 hover:bg-gray-50 hover:text-[#1e51ab]'
                              }`}
                            >
                              <Icon className="h-4 w-4 mr-3" />
                              {item.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="px-4 space-y-1 border-t border-gray-100 pt-3">
                    <button
                      onClick={() => {
                        handleNavigate('/faq');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FaQuestionCircle className="h-4 w-4 mr-3" />
                      FAQ
                    </button>
                    <button
                      onClick={() => {
                        openVideoModal();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FaPlay className="h-4 w-4 mr-3" />
                      Voir la vidéo AssuBot
                    </button>
                    <button
                      onClick={async () => {
                        await handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="h-4 w-4 mr-3" />
                      {isAuthenticated ? 'Se déconnecter' : "Retour à l'accueil"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Outlet />
      </main>

      {/* Video Modal */}
      <VideoModal isOpen={isVideoModalOpen} onClose={closeVideoModal} autoPlay={true} videoSrc="/assubot-video.mp4" title="Bienvenue sur AssuBot" />
    </div>
  );
};

export default AppLayout;
