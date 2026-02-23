// import React, { useState } from 'react'
// import { FiFilter, FiPlus } from 'react-icons/fi'
// import Checkbox from '@/components/shared/Checkbox'
// import { Link } from 'react-router-dom'
// import DateRange from '../DateRange'

// const filterItems = ["Role", "Team", "Email", "Member", "Recommendation"]

// const PageHeaderDate = ({ filters, setFilters }) => {
//   const [toggleDateRange, setToggleDateRange] = useState(false)

//   // ✅ Handle Checkbox Change
//   const handleCheckboxChange = (name) => {
//     setFilters((prev) => {
//       const alreadySelected = prev.selectedFilters.includes(name)

//       return {
//         ...prev,
//         selectedFilters: alreadySelected
//           ? prev.selectedFilters.filter((item) => item !== name)
//           : [...prev.selectedFilters, name]
//       }
//     })
//   }

//   // ✅ Handle Date Change (Receive from DateRange)
//   const handleDateChange = (startDate, endDate) => {
//     setFilters((prev) => ({
//       ...prev,
//       startDate,
//       endDate
//     }))
//   }

//   return (
//     <div className="d-flex align-items-center  gap-2 page-header-right-items-wrapper">

//       {/* ✅ DATE RANGE */}
//       <div
//         className="position-relative  date-picker-field"
//         onClick={() => setToggleDateRange(!toggleDateRange)}
//       >
//         <DateRange
//           toggleDateRange={toggleDateRange}
//           setToggleDateRange={setToggleDateRange}
//           onDateChange={handleDateChange}   // 👈 Pass callback
//         />
//       </div>

//       {/* ✅ FILTER DROPDOWN */}
//       <div className="filter-dropdown">
//         <Link
//           className="btn btn-md btn-light-brand"
//           data-bs-toggle="dropdown"
//           data-bs-offset="0, 10"
//           data-bs-auto-close="outside"
//         >
//           <i className="me-2"><FiFilter /></i>
//           <span>Filter</span>
//         </Link>

//         <div className="dropdown-menu dropdown-menu-end">

//           {filterItems.map((name, index) => (
//             <div key={index} className="dropdown-item">
//               <Checkbox
//                 name={name}
//                 id={index}
//                 checked={filters.selectedFilters?.includes(name)}
//                 onChange={() => handleCheckboxChange(name)}
//               />
//             </div>
//           ))}

//           <div className="dropdown-divider"></div>

//           <Link to="#" className="dropdown-item">
//             <FiPlus size={16} className="me-3" />
//             <span>Create New</span>
//           </Link>

//           <Link to="#" className="dropdown-item">
//             <FiFilter size={16} className="me-3" />
//             <span>Manage Filter</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PageHeaderDate

import React, { useState } from "react"
import { FiFilter, FiPlus, FiCalendar } from "react-icons/fi"
import { Link } from "react-router-dom"

const filterItems = ["Role", "Team", "Email", "Member", "Recommendation"]

const PageHeaderDate = ({ filters, setFilters }) => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  /* ===============================
     DATE UTILITIES
  =============================== */

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const setPresetRange = (type) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (type) {
      case "today":
        break

      case "yesterday":
        start.setDate(today.getDate() - 1)
        end = new Date(start)
        break

      case "thisWeek":
        const firstDay = today.getDate() - today.getDay()
        start = new Date(today.setDate(firstDay))
        end = new Date()
        break

      case "lastWeek":
        const lastWeekStart = new Date()
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7)
        start = new Date(lastWeekStart)

        const lastWeekEnd = new Date()
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1)
        end = new Date(lastWeekEnd)
        break

      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        end = new Date()
        break

      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        end = new Date(today.getFullYear(), today.getMonth(), 0)
        break

      default:
        break
    }

    setFilters((prev) => ({
      ...prev,
      startDate: formatDate(start),
      endDate: formatDate(end)
    }))

    setShowDatePicker(false)
  }

  /* ===============================
     HANDLE CUSTOM DATE CHANGE
  =============================== */

  const handleDateChange = (e) => {
    const { name, value } = e.target

    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  /* ===============================
     HANDLE CHECKBOX
  =============================== */

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target

    setFilters((prev) => {
      let updated = [...(prev.selectedFilters || [])]

      if (checked) updated.push(value)
      else updated = updated.filter((item) => item !== value)

      return { ...prev, selectedFilters: updated }
    })
  }

  return (
    <div className="d-flex align-items-center gap-3">

      {/* DATE PICKER */}
      <div className="position-relative ">
        <button
          className="btn btn-md btn-light-brand " style={{marginRight:"5rem"}}
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <FiCalendar className="me-2" />
          {filters.startDate && filters.endDate
            ? `${filters.startDate} - ${filters.endDate}`
            : "Select Date"}
        </button>

        {showDatePicker && (
          <div className="card p-3 shadow position-absolute end-0" style={{ zIndex: 1000, width: 280 }}>
            
            <div className="mb-3 fw-semibold">Quick Select</div>

            <div className="d-flex flex-wrap gap-2 mb-3">
              <button className="btn btn-sm btn-outline-primary" onClick={() => setPresetRange("today")}>Today</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setPresetRange("yesterday")}>Yesterday</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setPresetRange("thisWeek")}>This Week</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setPresetRange("lastWeek")}>Last Week</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setPresetRange("thisMonth")}>This Month</button>
              <button className="btn btn-sm btn-outline-primary" onClick={() => setPresetRange("lastMonth")}>Last Month</button>
            </div>

            <hr />

            <div className="mb-2 fw-semibold">Custom Range</div>

            <input
              type="date"
              name="startDate"
              value={filters.startDate || ""}
              onChange={handleDateChange}
              className="form-control mb-2"
            />

            <input
              type="date"
              name="endDate"
              value={filters.endDate || ""}
              onChange={handleDateChange}
              className="form-control mb-2"
            />

            <button
              className="btn btn-sm btn-primary w-100"
              onClick={() => setShowDatePicker(false)}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* FILTER DROPDOWN d-none */}
      <div className="dropdown d-none">
        <button
          className="btn btn-md btn-light-brand dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          <FiFilter className="me-2" />
          Filter
        </button>

        <div className="dropdown-menu dropdown-menu-end p-3">
          {filterItems.map((item, index) => (
            <div key={index} className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                value={item}
                checked={filters.selectedFilters?.includes(item) || false}
                onChange={handleCheckboxChange}
                id={`filter-${index}`}
              />
              <label className="form-check-label" htmlFor={`filter-${index}`}>
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default PageHeaderDate