const TeamTimesheetTabs = () => {
  return (
    <div className="bg-white border-bottom">
      <ul className="nav nav-tabs px-4">
        <li className="nav-item">
          <span className="nav-link active">Overview</span>
        </li>
        <li className="nav-item">
          <span className="nav-link disabled">Weekly</span>
        </li>
        <li className="nav-item">
          <span className="nav-link disabled">Monthly</span>
        </li>
      </ul>
    </div>
  )
}

export default TeamTimesheetTabs
