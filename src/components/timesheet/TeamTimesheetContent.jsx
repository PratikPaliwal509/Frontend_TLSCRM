import TeamMemberAccordion from './TeamMemberAccordion'

const TeamTimesheetContent = ({ data }) => {
  return (
    <div className="accordion mt-3" id="teamTimesheetAccordion">
      {data.users.map((user, index) => (
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
