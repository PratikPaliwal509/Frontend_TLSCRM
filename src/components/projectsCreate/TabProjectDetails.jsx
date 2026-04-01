import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const TabProjectDetails = ({ formData = {}, setFormData, error }) => {
  const [value, setValue] = useState(formData.description || '')
  const [startDate, setStartDate] = useState(formData.start_date ? new Date(formData.start_date) : new Date())
  const [endDate, setEndDate] = useState(formData.end_date ? new Date(formData.end_date) : null)

  const projectTypesOptions = [
        { label: 'Software', value: 'SOFTWARE' },
        { label: 'Hardware', value: 'HARDWARE' },
        { label: 'Consulting', value: 'CONSULTING' },
        { label: 'Marketing', value: 'MARKETING' },
    ]


  useEffect(() => {
    // Sync editor value with formData
    setValue(formData.description || '')
  }, [formData.description])

  const handleChange = (field, val) => {
    setFormData({ ...formData, [field]: val })
  }

  const handleProjectTypeChange = (e) => {
  const { value } = e.target

  setFormData(prev => ({
    ...prev,
    project_type: value,
    task_prefix: value ? value.substring(0, 3).toUpperCase() : '',
    estimated_hours: '',
  }))
}

  return (
    <section className="step-body mt-4 body current">
      <form id="project-details">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Project details</h2>
            <p className="text-muted">Your project details go here.</p>
          </div>

          {/* Project Name */}
          <div className="mb-4">
            <label htmlFor="projectName" className="form-label">
              Project Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="projectName"
              value={formData.project_name || ''}
              onChange={(e) => handleChange('project_name', e.target.value)}
              required
            />
          </div>
          {error && formData.project_name === "" && <p className="text-danger mt-2">Project Name is required</p>}
          {/* Project Type */}
          {/* <div className="mb-4">
            <label htmlFor="projectType" className="form-label">
              Project Type <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="projectType"
              value={formData.project_type || ''}
              onChange={(e) => handleChange('project_type', e.target.value)}
              required
            />
          </div> */}
          <div className="mb-4">
            <label className="form-label">
              Project Type <span className="text-danger">*</span>
            </label>

            <select
              className="form-control"
              value={formData.project_type}
              onChange={handleProjectTypeChange}
            >
              <option value="">Select Project Type</option>
              {projectTypesOptions.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
             {error && formData.project_type === "" && <p className="text-danger mt-2">Project Type is required</p>}
         
          </div>
          {/* <div className="mb-4">
            <label htmlFor="projectCode" className="form-label">
              Project Code <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="projectCode"
              value={formData.project_code || ''}
              onChange={(e) => handleChange('project_code', e.target.value)}
              required
            />
          </div> */}

          {/* Project Description */}
          <div className="mb-4">
            <label className="form-label">
              Project Description <span className="text-danger">*</span>
            </label>
            {/* <ReactQuillSafe
              theme="snow"
              value={value}
              onChange={(val) => {
                setValue(val)
                handleChange('description', val)
              }} */}
            {/* /> */}
            <textarea
              className="form-control"
              rows={5}
              placeholder="Enter project description..."
              value={formData.description || ''}
              onChange={(e) =>
                handleChange('description', e.target.value)
              }
            />
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label htmlFor="projectStartDate" className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date)
                handleChange('start_date', date)
              }}
              placeholderText="Pick start date"
              className="form-control"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          {/* End / Release Date */}
          <div className="mb-4 ">
            <label htmlFor="projectEndDate" className="form-label " style={{ marginRight: '4px' }}>
              End Date / Release Date 
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date)
                handleChange('end_date', date)
              }}
              placeholderText="Pick end date"
              className="form-control "
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
            />
          </div>
        </fieldset>
      </form>
    </section>
  )
}

export default TabProjectDetails
