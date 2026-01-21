import React from 'react';

const RolesEditHeader = ({ loading, onUpdate }) => {
  return (
    <div className="d-flex justify-content-between flex-row align-items-center mb-4">
      <h4 className="fw-bold mb-0">Edit Role</h4>
      <div className="d-flex flex-row">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary p-2"
          onClick={onUpdate}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            'Update Role'
          )}
        </button>
      </div>
    </div>
  );
};

export default RolesEditHeader;
