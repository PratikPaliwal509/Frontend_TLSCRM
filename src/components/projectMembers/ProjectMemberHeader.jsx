
import React from 'react'

import { FiEdit3 } from 'react-icons/fi'
const ProjectMemberHeader = () => {
  return (
   <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
      <button
        className="btn btn-primary"
        onClick={onUpdate}
        disabled={saving}
      >
        {/* <FiEdit3 className="me-2" />
        {saving ? 'Updating...' : 'Update Project'} */}
      </button>
    </div>
  )
}

export default ProjectMemberHeader