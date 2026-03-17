
import React from 'react';
import '../../assets/css/index.css';

const ButtonDanger = ({ children, onClick, type = 'button', className = 'btn-danger' }) => {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonDanger;
