import React, { useEffect } from 'react';

const Popup = ({ message, onClose, status, doRedirect}) => {
  useEffect(() => {
    let timer;

    if (!status) {
      timer = setTimeout(() => {
        onClose(doRedirect);
      }, 2000);
    } else {
      timer = setTimeout(() => {
        onClose(doRedirect);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [onClose, status]);

  return (
    <div className="popup-container">
      {status ? (
        <div className="green-tick">&#10004;</div>
      ) : (
        <div className="red-exclamation">&#9888;</div>
      )}
      <div>{message}</div>
    </div>
  );
};

export default Popup;
