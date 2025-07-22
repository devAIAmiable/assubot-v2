import './App.css'

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { persistor, store } from './store/index'

import AppLayout from './components/AppLayout'
import ChatbotModule from './components/ChatbotModule'
import ComparateurModule from './components/ComparateurModule'
import ContractDetailsPage from './components/ContractDetailsPage'
import ContratsModule from './components/ContratsModule'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import NotificationsModule from './components/NotificationsModule'
import { PersistGate } from 'redux-persist/integration/react'
import ProfilModule from './components/ProfilModule'
import { Provider } from 'react-redux'

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e51ab]"></div>
			</div>} persistor={persistor}>
				<Router>
					<Routes>
						{/* Landing page route */}
						<Route path="/" element={<LandingPage />} />
						
						{/* App routes with layout */}
						<Route path="/app" element={<AppLayout />}>
							{/* Default redirect to dashboard */}
							<Route index element={<Navigate to="/app/dashboard" replace />} />
							
							{/* Module routes */}
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="contrats" element={<ContratsModule />} />
							<Route path="contrats/:contractId" element={<ContractDetailsPage />} />
							<Route path="chatbot" element={<ChatbotModule />} />
							<Route path="comparateur" element={<ComparateurModule />} />
							<Route path="notifications" element={<NotificationsModule />} />
							<Route path="profil" element={<ProfilModule />} />
						</Route>
						
						{/* Catch all route - redirect to landing */}
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Router>
			</PersistGate>
		</Provider>
	)
}

export default App
