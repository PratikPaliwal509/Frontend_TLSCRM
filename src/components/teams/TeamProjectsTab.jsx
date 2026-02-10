import React from 'react'
import LeadsEmptyCard from '../leadsViewCreate/LeadsEmptyCard'

const TeamProjectsTab = ({ projects = [] }) => {
  return (
    <div className="tab-pane fade" id="projectsTab" role="tabpanel">
      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Assigned Projects</h5>

          {projects.length === 0 ? (
            <LeadsEmptyCard
             title="No projects yet.!"
                    description={`No projects assigned to this team.`}
                    />
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Client</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.project_id}>
                      <td>{project.project_name}</td>
                      <td>
                        <span className="badge bg-info">
                          {project.status}
                        </span>
                      </td>
                      <td>{project.client?.company_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamProjectsTab
