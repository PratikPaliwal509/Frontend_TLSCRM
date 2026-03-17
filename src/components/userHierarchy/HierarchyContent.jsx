import React from "react"
import DepartmentNode from "./DepartmentNode"

const HierarchyContent = ({ departments, loading }) => {
  if (loading) return <div className="p-4">Loading hierarchy...</div>

  return (
    <div className="col-12">
      <div className="card p-4">
        <h5 className="mb-4">Organization Structure</h5>
        {departments.map((dep) => (
          <DepartmentNode key={dep.department_id} department={dep} />
        ))}
      </div>
    </div>
  )
}

export default HierarchyContent