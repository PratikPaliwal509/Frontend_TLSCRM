import React from 'react'
import { FiArrowLeft, FiEdit2, FiPlus, FiSave } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const TeamHeader = ({
  mode = 'list',          // list | create | edit | view
  loading = false,
  onSave,
  backTo = '/teams/list',
}) => {
  const config = {
    list: {
      title: 'Teams',
      subtitle: 'Manage all teams',
      primaryText: 'Create Team',
      primaryIcon: <FiPlus />,
      primaryLink: '/teams/create',
    },
    create: {
      title: 'Create Team',
      subtitle: 'Add a new team',
      primaryText: loading ? 'Creating...' : 'Create Team',
      primaryIcon: <FiPlus />,
    },
    edit: {
      title: 'Edit Team',
      subtitle: 'Update team details',
      primaryText: loading ? 'Saving...' : 'Save Changes',
      primaryIcon: <FiSave />,
    },
    view: {
      title: 'Team Details',
      subtitle: 'View team information',
      primaryText: 'Edit Team',
      primaryIcon: <FiEdit2 />,
    },
  }

  const current = config[mode]

  return (
    <div className="d-flex align-items-center justify-content-between w-100">
      {/* Left */}
      <div>
        <h5 className="mb-1 fw-bold">{current.title}</h5>
        <span className="fs-12 text-muted">{current.subtitle}</span>
      </div>

      {/* Right Actions */}
      <div className="d-flex gap-2">
        <Link to={backTo} className="btn btn-light">
          <FiArrowLeft className="me-2" />
          Back
        </Link>

        {/* LIST MODE */}
        {mode === 'list' && (
          <Link to={current.primaryLink} className="btn btn-primary">
            {current.primaryIcon}
            <span className="ms-2">{current.primaryText}</span>
          </Link>
        )}

        {/* CREATE / EDIT */}
        {(mode === 'create' || mode === 'edit') && (
          <button
            className="btn btn-primary"
            onClick={onSave}
            disabled={loading}
          >
            {current.primaryIcon}
            <span className="ms-2">{current.primaryText}</span>
          </button>
        )}

        {/* VIEW */}
        {mode === 'view' && (
          <Link to={`${backTo}/edit`} className="btn btn-primary">
            {current.primaryIcon}
            <span className="ms-2">{current.primaryText}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default TeamHeader
