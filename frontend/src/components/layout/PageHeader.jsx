
import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, buttonText, buttonTo }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 className="tournament-header">{title}</h1>
      {buttonText && buttonTo && (
        <Link to={buttonTo} className="btn-primary" style={{ textDecoration: 'none' , width: 'auto' }}>
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
