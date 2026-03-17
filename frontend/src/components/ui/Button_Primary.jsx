
import React from 'react';
import '../../assets/css/index.css';

const ButtonPrimary = ({ children, onClick, type = 'button', className = 'btn-primary' }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonPrimary;
