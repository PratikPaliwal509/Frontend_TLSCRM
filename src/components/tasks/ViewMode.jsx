import React, { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiList, FiColumns, FiCalendar } from 'react-icons/fi'
export const VIEW_MODES = [
  { label: 'List View', value: 'list' },
  { label: 'Kanban View', value: 'kanban' },
  { label: 'Calendar View', value: 'calendar' },
]
const icons = {
  list: <FiList />,
  kanban: <FiColumns />,
  calendar: <FiCalendar />
}

const ViewModeSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className="position-relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        className="btn btn-light-brand btn-sm rounded-pill dropdown-toggle d-flex align-items-center gap-1"
        onClick={() => setOpen(v => !v)}
      >
        {icons[value]}
        <span className="ms-1 text-capitalize">{value} view</span>
        <FiChevronDown size={14} />
      </button>

      {/* Menu */}
      {open && (
        <ul className="dropdown-menu show">
          {VIEW_MODES.map((mode) => (
            <li key={mode.value}>
              <button
                type="button"
                className={`dropdown-item d-flex align-items-center gap-2 ${
                  value === mode.value ? 'active' : ''
                }`}
                onClick={() => {
                  onChange(mode.value)
                  setOpen(false)
                }}
              >
                {icons[mode.value]}
                {mode.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ViewModeSelect
