
import React from 'react';
import { AuthProvider } from './AuthContext';
import App from '../App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '../App';

// Create the router using the routes exported from App.tsx
const router = createBrowserRouter(routes);

const AuthContextWrapper: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <App />
    </AuthProvider>
  );
};

export default AuthContextWrapper;
