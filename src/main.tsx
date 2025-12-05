import './index.css';
// Import test utilities to make them available globally
import './utils/testFormData';

import AnalyticsProvider from './providers/AnalyticsProvider.tsx';
import App from './App.tsx';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <AnalyticsProvider>
    <App />
  </AnalyticsProvider>
);
