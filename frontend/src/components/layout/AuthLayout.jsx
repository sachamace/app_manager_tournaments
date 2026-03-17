
import React from 'react';
import '../../assets/css/index.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-wrapper">
      {children}
    </div>
  );
};

export default AuthLayout;
