import TimesheetSummaryCard from './TimesheetSummaryCard'
import TimeLogsTable from './TimeLogsTable'

const TeamMemberAccordion = ({ user, index }) => {
  return (
    <div className="accordion-item mb-3">
      <h2 className="accordion-header">
        <button
          className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
          data-bs-toggle="collapse"
          data-bs-target={`#user-${user.user_id}`}
        >
          {user.user_name}
        </button>
      </h2>

      <div
        id={`user-${user.user_id}`}
        className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
      >
        <div className="accordion-body">
          <TimesheetSummaryCard summary={user.summary} />
          <TimeLogsTable logs={user.logs} />
        </div>
      </div>
    </div>
  )
}

export default TeamMemberAccordion
