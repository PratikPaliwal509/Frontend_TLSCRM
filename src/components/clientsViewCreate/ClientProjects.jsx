import React from 'react'
import { useNavigate } from 'react-router-dom'

const ClientProjects = ({ projects = [] }) => {
  const navigate = useNavigate()

  if (!projects.length) {
    return (
      <div className="text-center text-muted py-5">
        No projects found for this client
      </div>
    )
  }

  return (
    <div className="row g-4 " id=''>
      {projects.map((project) => (
        <div key={project.project_id} className="col-md-4">
          <div
            className="card h-100 hover-shadow"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/projects/view/${project.project_id}`)}
          >
            <div className="card-body">
              <h5 className="card-title mb-2">
                {project.name}
              </h5>

              <p className="card-text text-muted fs-13 text-truncate">
                {project.description || 'No description'}
              </p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span
                  className={`badge bg-${project.statusBg || 'secondary'}`}
                >
                  {project.status}
                </span>

                <span className="fs-12 text-muted">
                  {project.tasks.length || 0} Tasks
                </span>
              </div>
            </div>

            <div className="card-footer bg-light fs-12 text-muted">
              Client: {project.client_name}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClientProjects
