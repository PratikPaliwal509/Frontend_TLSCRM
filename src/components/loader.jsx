// components/shared/Loader.js
import React from 'react'

const Loader = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '1rem'
    }}>
      <div className="spinner" />
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0,0,0,0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #007bff;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Loader
