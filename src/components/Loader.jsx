import React from 'react';
import PropTypes from 'prop-types';

function Loader({ show }) {
  if (!show) return null;

  return (
    <div className="global-loader">
      <div className="spinner"></div>
    </div>
  );
}

Loader.propTypes = {
  show: PropTypes.bool.isRequired
};

export default Loader; 