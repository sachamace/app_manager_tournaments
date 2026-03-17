
import React from 'react';
import '../../assets/css/index.css';

const Badge = ({ children, status }) => {
  const badgeClass = `badge ${status === 'en_cours' ? 'active' : 'pending'}`;
  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
};

export default Badge;
