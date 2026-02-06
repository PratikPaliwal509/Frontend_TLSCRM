const TimeLogsTable = ({ logs }) => {
  if (!logs.length) {
    return <p className="text-center mt-3">No time logs found</p>
  }

  return (
    <div className="card mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Project</th>
              <th>Task</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Billable</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.log_id}>
                <td>{log.project_name}</td>
                <td>{log.task_title}</td>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td>{log.hours}</td>
                <td>
                  {log.is_billable ? (
                    <span className="badge bg-success">Yes</span>
                  ) : (
                    <span className="badge bg-secondary">No</span>
                  )}
                </td>
                <td className="text-end">₹{log.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TimeLogsTable
