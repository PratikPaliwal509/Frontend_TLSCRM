import React from "react"
import UserNode from "./UserNode"

const TeamNode = ({ team }) => {
  return (
    <div className="mb-3">
      <div className="fw-semibold text-dark">
        👥 {team.team_name} – Lead:{" "}
        {team.team_lead
          ? `${team.team_lead.first_name} ${team.team_lead.last_name}`
          : "N/A"}
      </div>

      <div className="ms-4 mt-1">
        {team.users?.length ? (
          team.users.map((user) => <UserNode key={user.user_id} user={user} />)
        ) : (
          <div className="text-muted">No Users</div>
        )}
      </div>
    </div>
  )
}

export default TeamNode