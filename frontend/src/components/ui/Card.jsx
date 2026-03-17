
import React from 'react';
import '../../assets/css/index.css';

const Card = ({ children }) => {
  return (
    <div className="auth-card">
      {children}
    </div>
  );
};

export default Card;
