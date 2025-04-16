
import React from 'react';
import { AuthProvider } from './AuthContext';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

const AuthContextWrapper: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AuthContextWrapper;
