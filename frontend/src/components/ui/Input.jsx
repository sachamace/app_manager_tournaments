
import React from 'react';
import '../../assets/css/index.css';

const Input = ({ label, type, className = 'form-input', placeholder, value, onChange, required = false }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default Input;
