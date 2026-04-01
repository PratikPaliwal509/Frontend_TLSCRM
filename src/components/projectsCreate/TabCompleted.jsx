import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TabCompleted = ({ formData, resetForm }) => {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleCreateProject = async () => {
    setStatus('loading')
    setError(null)

    try {
      const token = localStorage.getItem('token')

      const res = await fetch('https://api-0ggv.onrender.com/api/projects', {
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

      setStatus('success')

      resetForm && resetForm()

      // small delay for UX (optional)
      setTimeout(() => {
        navigate(`/projects/view/${data.data.project_id}`)
      }, 1000)

    } catch (err) {
      console.error(err)
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <section className="step-body mt-4 text-center">
      <img
        src="/images/general/completed-steps.png"
        alt="Completed"
        className="img-fluid wd-300 mb-4"
      />

      {/* ✅ Dynamic Heading */}
      <h4 className="fw-bold">
        {status === 'success'
          ? 'Project Created!'
          : status === 'loading'
          ? 'Creating Project...'
          : status === 'error'
          ? 'Something went wrong'
          : 'Ready to Create Project'}
      </h4>

      {/* ✅ Dynamic Message */}
      <p className="text-muted mt-2">
        {status === 'error'
          ? `Error: ${error}`
          : status === 'success'
          ? 'Your project is ready.'
          : 'Click below to create your project.'}
      </p>

      <div className="d-flex justify-content-center gap-1 mt-5">
        <button
          className="btn btn-primary"
          onClick={handleCreateProject}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </section>
  )
}

export default TabCompleted