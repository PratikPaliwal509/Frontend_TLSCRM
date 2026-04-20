import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProjectEditForm = forwardRef((props, ref) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    project_name: '',
    project_code: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
    priority: '',
    budget_amount: '',
    billing_type: '',
    notes: '',
    is_billable: true,
    is_public: false,
  })

  /* ---------------- FETCH PROJECT ---------------- */
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(
          `https://api-0ggv.onrender.com/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const json = await res.json()
        if (!json.success) throw new Error()

        const p = json.data
        setFormData({
          project_name: p.project_name || '',
          project_code: p.project_code || '',
          description: p.description || '',
          start_date: p.start_date?.slice(0, 10) || '',
          end_date: p.end_date?.slice(0, 10) || '',
          status: p.status || 'not_started',
          priority: p.priority || 'medium',
          budget_amount: p.budget_amount || '',
          billing_type: p.billing_type || '',
          is_billable: p.is_billable,
          is_public: p.is_public,
          notes: p.notes || '',
        })
      } catch {
        toast.error('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  /* ---------------- HANDLE CHANGE ---------------- */
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value,
  //   }))
  // }
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  /* ---------------- SUBMIT ---------------- */
  const submitForm = async () => {
    if (saving) return
    setSaving(true)

    const toastId = toast.loading('Updating project...')

    try {
      const res = await fetch(
        `https://api-0ggv.onrender.com/api/projects/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const json = await res.json()

      if (json.success) {
        toast.update(toastId, {
          render: 'Project updated successfully',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        })
        navigate(`/projects/view/${id}`)
      } else {
        throw new Error()
      }
    } catch {
      toast.update(toastId, {
        render: 'Failed to update project',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
    } finally {
      setSaving(false)
    }
  }

  useImperativeHandle(ref, () => ({ submitForm }))

  if (loading) return <p>Loading...</p>

  /* ---------------- UI ---------------- */
  return (
    <form className="card p-4" onSubmit={(e) => e.preventDefault()}>
      <h5 className="mb-3">Edit Project</h5>

      <label className="form-label">Project Name</label>
      <input className="form-control mb-3" name="project_name" value={formData.project_name} onChange={handleChange} placeholder="Project Name" />

      <label className="form-label">Project Code</label>
      <input className="form-control mb-3" name="project_code" value={formData.project_code} onChange={handleChange} placeholder="Project Code" />

      <label className="form-label">Description</label>
      <textarea className="form-control mb-3" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Start Date</label>
          <input type="date" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">End Date</label>
          <input type="date" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select className="form-control mb-3" name="status" value={formData.status} onChange={handleChange}>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="finished">Finished</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Priority</label>
          <select className="form-control mb-3" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Budget Amount</label>
          <input type="number" className="form-control mb-3" name="budget_amount" value={formData.budget_amount} onChange={handleChange} placeholder="Budget Amount" />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Billing Type</label>
          <select className="form-control mb-3" name="billing_type" value={formData.billing_type} onChange={handleChange}>
            <option value="">Select Billing Type</option>
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="form-check mb-2">
        <input type="checkbox" className="form-check-input" name="is_billable" checked={formData.is_billable} onChange={handleChange} />
        <label className="form-check-label">Billable</label>
      </div>

      <div className="form-check">
        <input type="checkbox" className="form-check-input" name="is_public" checked={formData.is_public} onChange={handleChange} />
        <label className="form-check-label">Public</label>
      </div>

      <label className="form-label">Notes</label>
      <textarea
        className="form-control mb-3"
        name="notes"
        placeholder="Add project notes..."
        value={formData.notes || ''}
        onChange={handleChange}
        rows={4}
      />

    </form>
  )
})

export default ProjectEditForm
