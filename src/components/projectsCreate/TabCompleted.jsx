
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify';
const TabCompleted = ({ formData, resetForm }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleCreateProject = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')

      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create project')
      }
      // ✅ Optional: reset form
      resetForm && resetForm()
      // toast.success('Project created successfully');
      // ✅ Navigate to project view page
      navigate(`/projects/view/${data.data.project_id}`)

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="step-body mt-4 text-center">
      <img src="/images/general/completed-steps.png" alt="Completed" className="img-fluid wd-300 mb-4" />
      <h4 className="fw-bold">Project Created!</h4>
      <p className="text-muted mt-2">
        {error ? `Error: ${error}` : 'Your project is ready.'}
      </p>

      <div className="d-flex justify-content-center gap-1 mt-5">
        <button
          className="btn btn-light"
          onClick={handleCreateProject}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create New Project'}
        </button>

        {/* Optional: Preview project link */}
        {/* <Link to="/projects/view" className="btn btn-primary">
          Preview Project
        </Link> */}
      </div>
    </section>
  )
}

export default TabCompleted
