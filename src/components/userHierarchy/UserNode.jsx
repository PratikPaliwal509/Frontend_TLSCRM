import React from "react"

const UserNode = ({ user }) => {
  return (
    <div className="text-muted mb-1">
      👤 {user.first_name} {user.last_name}
    </div>
  )
}

export default UserNode