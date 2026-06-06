import { createRoot } from 'react-dom/client';
import "remixicon/fonts/remixicon.css";

import './index.css';
import App from './App.jsx';
import AuthProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);