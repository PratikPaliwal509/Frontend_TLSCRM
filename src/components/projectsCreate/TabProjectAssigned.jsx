
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
const TabProjectAssigned = ({ formData = {}, setFormData, error }) => {
  const [managers, setManagers] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!formData.agency_id) {
      setManagers([])
      return
    }

    const token = localStorage.getItem('token')
    setLoading(true)
    fetch(
      `https://api-0ggv.onrender.com/api/users/user`,
      // `https://api-0ggv.onrender.com/api/users/users/by-agency`,
      // `https://api-0ggv.onrender.com/api/users/managers/${Number(formData.agency_id)}`,
      // fetch(
      //   `https://api-0ggv.onrender.com/api/users/by-agency?agency_id=${Number(
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
         toast.error(
          err?.message || 'Unable to fetch project managers'
        )
      }).finally(() => {
        setLoading(false)
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
        <option value="">
          {loading ? 'Loading managers…' : 'Select Manager'}
        </option>


        {!loading && managers.length > 0 &&
          managers.map((m) => (
            <option key={m.user_id} value={m.user_id}>
              {m.full_name}
            </option>
          ))}


        {!loading && managers.length === 0 && (
          <option disabled value="">
            No users available
          </option>
        )}
      </select>
      {error && <p className="text-danger mt-2">Manager ID is required</p>}
    </section>
  )
}

export default TabProjectAssigned
