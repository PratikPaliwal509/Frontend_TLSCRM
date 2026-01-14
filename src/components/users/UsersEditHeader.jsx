import React from 'react'
import { FiSave, FiEdit2 } from 'react-icons/fi'

const UsersEditHeader = ({ onUpdate, loading }) => {
  return (
    <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <button
        type="button"
        className="btn btn-primary"
        disabled={loading}
        onClick={onUpdate}
      >
        <FiEdit2 size={16} className="me-2" />
        Update User
      </button>

      <button
        type="button"
        className="btn btn-light-brand"
        disabled={loading}
        onClick={onUpdate} // can optionally have separate save
      >
        <FiSave size={16} className="me-2" />
        Save Changes
      </button>
    </div>
  )
}

export default UsersEditHeader


