import TeamMemberAccordion from './TeamMemberAccordion'

const TeamTimesheetContent = ({ data }) => {
  console.log('TeamTimesheetContent data:', data.users.length)
  return (
    <div className="accordion mt-3" id="teamTimesheetAccordion">
      {data.users.length === 0 ? <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
        <h6 className="mb-1">No Team members found</h6>
        <p className="fs-12">Add a team member to get started</p>
      </div> :
        data.users.map((user, index) => (
          <TeamMemberAccordion
            key={user.user_id}
            user={user}
            index={index}
          />
        ))}
    </div>
  )
}

export default TeamTimesheetContent
