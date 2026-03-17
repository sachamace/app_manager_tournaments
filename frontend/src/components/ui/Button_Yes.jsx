
import React from 'react';
import '../../assets/css/index.css';

const ButtonYes = ({ children, onClick, type = 'button', className = 'btn-yes' }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonYes;
