import React from "react"
import TeamNode from "./TeamNode"

const DepartmentNode = ({ department }) => {
  return (
    <div className="mb-4">
      <div className="fw-bold text-primary fs-16">
        🏢 {department.department_name} – Manager:{" "}
        {department.manager
          ? `${department.manager.first_name} ${department.manager.last_name}`
          : "N/A"}
      </div>

      <div className="ms-4 mt-2">
        {department.teams?.map((team) => (
          <TeamNode key={team.team_id} team={team} />
        ))}
      </div>
    </div>
  )
}

export default DepartmentNode