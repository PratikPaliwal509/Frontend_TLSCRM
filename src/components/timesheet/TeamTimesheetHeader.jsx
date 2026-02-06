const TeamTimesheetHeader = ({ data }) => {
  return (
    <div>
      <h4 className="mb-1">Team Timesheet</h4>
      <p className="text-muted mb-0">
        Total Members: {data.total_members}
      </p>
    </div>
  )
}

export default TeamTimesheetHeader
