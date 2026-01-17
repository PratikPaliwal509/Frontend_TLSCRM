
import React, { useEffect, useState } from 'react'

const TabProjectAssigned = ({ formData = {}, setFormData }) => {
  const [managers, setManagers] = useState([])

  useEffect(() => {
    if (!formData.agency_id) {
      setManagers([])
      return
    }

    const token = localStorage.getItem('token')

    fetch(
      `http://localhost:5000/api/users/users/by-agency`,
      // `http://localhost:5000/api/users/managers/${Number(formData.agency_id)}`,
      // fetch(
      //   `http://localhost:5000/api/users/by-agency?agency_id=${Number(
      //     formData.agency_id
      //   )}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(res => {
        setManagers(res.data || [])
      })
      .catch(err => {
        console.error(err)
        setManagers([])
      })
  }, [formData.agency_id]) // ✅ IMPORTANT

  return (
    <section>
      <label className="form-label">Project Manager</label>

      <select
        className="form-select"
        value={formData.project_manager_id || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            project_manager_id: e.target.value
              ? Number(e.target.value)
              : null,
          })
        }
      >
        {/* ✅ Placeholder */}
        <option value="">Select Manager</option>

        {managers.length > 0 ? (
          managers.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.first_name}
            </option>
          ))
        ) : (
          <option disabled value="">
            No users available
          </option>
        )}
      </select>
    </section>
  )
}

export default TabProjectAssigned
