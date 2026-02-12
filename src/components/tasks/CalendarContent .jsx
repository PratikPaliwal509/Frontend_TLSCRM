import React, { useMemo, useState } from 'react'
import moment from 'moment'

const CalendarContent = ({ tasks = [], onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(moment())

  const startOfMonth = currentMonth.clone().startOf('month')
  const startDate = startOfMonth.clone().startOf('week')

  // Always 6 rows × 7 days = 42 cells
  const days = Array.from({ length: 42 }).map((_, i) =>
    startDate.clone().add(i, 'day')
  )

  // Group tasks by due_date
  const tasksByDate = useMemo(() => {
    const grouped = {}

    tasks.forEach(task => {
      if (!task.due_date) return

      const dateKey = moment(task.due_date).format('YYYY-MM-DD')

      if (!grouped[dateKey]) grouped[dateKey] = []
      grouped[dateKey].push(task)
    })

    return grouped
  }, [tasks])

  return (
    <div className="calendar-wrapper " >

      {/* HEADER */}
      <div className="calendar-header-top d-flex justify-content-between align-items-center">
        <button
          className="btn btn-sm btn-light"
          onClick={() =>
            setCurrentMonth(prev => prev.clone().subtract(1, 'month'))
          }
        >
          ◀
        </button>

        <h5 className="mb-0">
          {currentMonth.format('MMMM YYYY')}
        </h5>

        <button
          className="btn btn-sm btn-light"
          onClick={() =>
            setCurrentMonth(prev => prev.clone().add(1, 'month'))
          }
        >
          ▶
        </button>
      </div>

      {/* WEEK DAYS */}
      <div className="calendar-week-header">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
          <div key={day} className="week-cell">
            {day}
          </div>
        ))}
      </div>

      {/* SCROLLABLE BODY */}
      <div className="calendar-scroll-body">
        <div className="calendar-grid">
          {days.map(day => {
            const dateKey = day.format('YYYY-MM-DD')
            const dayTasks = tasksByDate[dateKey] || []
            const isToday = day.isSame(moment(), 'day')
            const isCurrentMonth = day.isSame(currentMonth, 'month')

            return (
              <div
                key={dateKey}
                className={`calendar-cell ${
                  !isCurrentMonth ? 'muted' : ''
                }`}
              >
                <div className={`calendar-date ${isToday ? 'today' : ''}`}>
                  {day.format('D')}
                </div>

                <div className="calendar-tasks">
                  {dayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`calendar-task bg-${task.statusColor || 'primary'}`}
                      onClick={() => onSelect(task)}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CalendarContent
