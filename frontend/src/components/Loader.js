import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ loading }) => {
  return (
    loading && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      >
        <ClipLoader color={'#3B82F6'} loading={loading} size={50} />
      </div>
    )
  );
};

export default Loader;
