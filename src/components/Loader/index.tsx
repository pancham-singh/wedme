import * as React from 'react';

export default ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="full-page-spinner__overlay">
      <div className="loading" />
    </div>
  );
};
