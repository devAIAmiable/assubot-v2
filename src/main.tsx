import './index.css';
// Import test utilities to make them available globally
import './utils/testFormData';

import App from './App.tsx';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(<App />);
