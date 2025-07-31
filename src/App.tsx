import './App.css';

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { persistor, store } from './store/index';

import AppLayout from './components/AppLayout';
import AuthInitializer from './components/AuthInitializer';
import ChatbotModule from './components/ChatbotModule';
import ComparateurModule from './components/ComparateurModule';
import ContractDetailsPage from './components/ContractDetailsPage';
import ContratsModule from './components/ContratsModule';
import Dashboard from './components/Dashboard';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import GoogleCallbackPage from './components/GoogleCallbackPage';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import NotificationsModule from './components/NotificationsModule';
import { PersistGate } from 'redux-persist/integration/react';
import ProfilModule from './components/ProfilModule';
import ProtectedRoute from './components/ProtectedRoute';
import { Provider } from 'react-redux';
import ResetPasswordForm from './components/ResetPasswordForm';
import SignupForm from './components/SignupForm';
import Spinner from './components/ui/Spinner';
import VerifyPage from './components/VerifyPage';

function App() {
	return (
		<Provider store={store}>
			<PersistGate
				loading={
					<div className="flex items-center justify-center h-screen">
						<Spinner />
					</div>
				}
				persistor={persistor}
			>
				<AuthInitializer>
					<Router>
						<Routes>
							{/* Landing page route */}
							<Route path="/" element={<LandingPage />} />

							{/* App routes with layout - Protected */}
							<Route
								path="/app"
								element={
									<ProtectedRoute>
										<AppLayout />
									</ProtectedRoute>
								}
							>
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
							<Route path="/verify" element={<VerifyPage />} />
							<Route path="/signup" element={<SignupForm />} />
							<Route path="/login" element={<LoginForm />} />
							<Route path="/forgot-password" element={<ForgotPasswordForm />} />
							<Route path="/reset-password" element={<ResetPasswordForm />} />
							<Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
						</Routes>
					</Router>
				</AuthInitializer>
			</PersistGate>
		</Provider>
	);
}

export default App;
