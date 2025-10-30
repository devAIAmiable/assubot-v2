import './App.css';

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { persistor, store } from './store/index';

import AdminContractUpload from './pages/AdminContractUpload';
import AdminPanel from './pages/AdminPanel';
import AdminTemplateContractDetails from './pages/AdminTemplateContractDetails';
import AdminTemplateContractEdit from './pages/AdminTemplateContractEdit';
import AppLayout from './components/AppLayout';
import AuthInitializer from './components/AuthInitializer';
import ChatModule from './components/ChatModule';
import ComparateurModule from './components/ComparateurModule';
import ContractDetailsPage from './components/ContractDetailsPage';
import ContractsModule from './components/ContractsModule';
import CreditPage from './components/CreditPage';
import Dashboard from './components/Dashboard';
import EnvironmentBanner from './components/ui/EnvironmentBanner';
import FAQPage from './components/FAQPage';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import GeneralTermsPage from './components/GeneralTermsPage';
import GoogleCallbackPage from './components/GoogleCallbackPage';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import NotificationsModule from './components/NotificationsModule';
import ComparateurResultsPage from './pages/ComparateurResultsPage';
import PaymentCancelPage from './components/PaymentCancelPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import { PersistGate } from 'redux-persist/integration/react';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ProfileCompletionGuard from './components/ProfileCompletionGuard';
import ProfileModule from './components/ProfileModule';
import ProtectedRoute from './components/ProtectedRoute';
import { Provider } from 'react-redux';
import RealTimeProvider from './components/RealTimeProvider';
import ResetPasswordForm from './components/ResetPasswordForm';
import SignupForm from './components/SignupForm';
import Spinner from './components/ui/Spinner';
import ToastContainer from './components/ui/Toast';
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
          <RealTimeProvider>
            <Router>
              <EnvironmentBanner>
                <Routes>
                  {/* Landing page route */}
                  <Route path="/" element={<LandingPage />} />

                  {/* FAQ page - Public */}
                  <Route path="/faq" element={<FAQPage />} />

                  {/* General Terms page - Public */}
                  <Route path="/general-terms" element={<GeneralTermsPage />} />

                  {/* Privacy Policy page - Public */}
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

                  {/* App routes with layout - Protected */}
                  <Route
                    path="/app"
                    element={
                      <ProtectedRoute>
                        <ProfileCompletionGuard>
                          <AppLayout />
                        </ProfileCompletionGuard>
                      </ProtectedRoute>
                    }
                  >
                    {/* Default redirect to dashboard */}
                    <Route index element={<Navigate to="/app/dashboard" replace />} />

                    {/* Module routes */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="contrats" element={<ContractsModule />} />
                    <Route path="contrats/:contractId" element={<ContractDetailsPage />} />
                    <Route path="chatbot" element={<ChatModule />} />
                    <Route path="comparateur" element={<ComparateurModule />} />
                    <Route path="comparateur/:sessionId/resultats" element={<ComparateurResultsPage />} />
                    <Route path="credits" element={<CreditPage />} />
                    <Route path="notifications" element={<NotificationsModule />} />
                    <Route path="profil" element={<ProfileModule />} />
                    <Route path="admin" element={<AdminPanel />} />
                    <Route path="admin/upload-contract" element={<AdminContractUpload />} />
                    <Route path="admin/templates/:contractId/edit" element={<AdminTemplateContractEdit />} />
                    <Route path="admin/templates/:contractId" element={<AdminTemplateContractDetails />} />
                  </Route>

                  {/* Catch all route - redirect to landing */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/signup" element={<SignupForm />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                  <Route path="/reset-password" element={<ResetPasswordForm />} />
                  <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                </Routes>
              </EnvironmentBanner>
            </Router>
          </RealTimeProvider>
        </AuthInitializer>
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;
