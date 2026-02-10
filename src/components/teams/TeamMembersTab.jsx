import React from 'react'

const TeamMembersTab = ({ members = [] }) => {
  return (
    <div className="tab-pane fade" id="membersTab" role="tabpanel">
      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">Team Members</h5>

          {members.length === 0 ? (
            <p className="text-muted mb-0">No members assigned to this team.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.user_id}>
                      <td>{member.first_name+" "+member.last_name}</td>
                      <td>{member.email}</td>
                      <td>{member.role?.role_name}</td>
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

export default TeamMembersTab
