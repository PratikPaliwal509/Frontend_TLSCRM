
import React, { useEffect, useState } from 'react'
import useDatePicker from '@/hooks/useDatePicker'
import { customerListTagsOptions, taskAssigneeOptions } from '@/utils/options'
import MultiSelectTags from '@/components/shared/MultiSelectTags'

const TabProjectTarget = ({ formData, setFormData }) => {
    const [value, setValue] = useState('')
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker()
    const priorityOptions = [
        { label: 'Low', value: 'LOW' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'High', value: 'HIGH' },
    ]

    const statusOptions = [
        { label: 'Planning', value: 'planning' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'On Hold', value: 'on_hold' },
    ]

    useEffect(() => {
        setStartDate(new Date())
        setValue(`
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Asperiores beatae inventore reiciendis ipsum natus.
        `)
    }, [])

    // ✅ Update project tags in formData
    const handleTagsChange = (selectedTags) => {
        setFormData(prev => ({
            ...prev,
            tags: selectedTags.map(tag => tag.value), // ✅ ARRAY
        }))
    }
    const handlePriorityChange = (e) => {
        setFormData(prev => ({
            ...prev,
            priority: e.target.value,
        }))
    }

    const handleStatusChange = (e) => {
        setFormData(prev => ({
            ...prev,
            status: e.target.value,
        }))
    }

    const handleNotesChange = (e) => {
        setFormData(prev => ({
            ...prev,
            notes: e.target.value,
        }))
    }
const handleEstimatedHoursChange = (e) => {
    let value = e.target.value

    if (value === '') {
        setFormData(prev => ({ ...prev, estimated_hours: '' }))
        return
    }

    if (!/^\d*\.?\d*$/.test(value)) return

    const num = Number(value)
    if (num < 0 || num > 10000) return

    setFormData(prev => ({
        ...prev,
        estimated_hours: value,
    }))
}

    return (
        <section className="step-body mt-4 body current">
            <form id="project-target">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Project target</h2>
                        <p className="text-muted">
                            If you need more info, please check <a href="#">help center</a>
                        </p>
                    </div>

                    <fieldset>
                        <div className="mb-4">
                            {/* <label htmlFor="tragetAssigned" className="form-label">
                                Taget assigned<span className="text-danger">*</span>
                            </label> */}

                            {/* Target assigned – logic intentionally skipped for now */}
                            {/* <MultiSelectImg
                                options={taskAssigneeOptions}
                                defaultSelect={[taskAssigneeOptions[0]]}
                            /> */}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="tragetTags" className="form-label">
                                Project tags <span className="text-danger">*</span>
                            </label>

                            <MultiSelectTags
                                options={customerListTagsOptions}
                                // defaultSelect={[
                                //     customerListTagsOptions[0],
                                //     customerListTagsOptions[2],
                                //     customerListTagsOptions[4]
                                // ]}
                                onChange={handleTagsChange}
                            />
                        </div>
                        {/* PRIORITY */}
                        <div className="mb-4">
                            <label className="form-label">
                                Priority <span className="text-danger">*</span>
                            </label>

                            <select
                                className="form-control"
                                value={formData.priority}
                                onChange={handlePriorityChange}
                            >
                                <option value="">Select priority</option>
                                {priorityOptions.map(p => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* STATUS */}
                        <div className="mb-4">
                            <label className="form-label">
                                Status <span className="text-danger">*</span>
                            </label>

                            <select
                                className="form-control"
                                value={formData.status}
                                onChange={handleStatusChange}
                            >
                                {statusOptions.map(s => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estimated Hours */}
                        <div className="mb-4">
                            <label className="form-label">
                                Estimated Hours
                            </label>

                            <input
                                className="form-control"
                                value={formData.estimated_hours}
                                onChange={handleEstimatedHoursChange}
                                placeholder="Add estimated hours..."
                                rows={4}
                            />
                        </div>
                        {/* NOTES */}
                        <div className="mb-4">
                            <label className="form-label">
                                Notes
                            </label>

                            <textarea
                                className="form-control"
                                value={formData.notes}
                                onChange={handleNotesChange}
                                placeholder="Add internal notes..."
                                rows={4}
                            />
                        </div>

                    </fieldset>

                    <hr className="my-5" />

                    <div className="custom-control custom-checkbox mb-2">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="allowChanges_2"
                            defaultChecked
                        />
                        <label
                            className="custom-control-label c-pointer"
                            htmlFor="allowChanges_2"
                        >
                            Allow Changes in Budget.
                        </label>
                    </div>

                    <div className="custom-control custom-checkbox mb-2">
                        <input
                            type="checkbox"
                            className="custom-control-input"
                            id="allowNotifications_2"
                            defaultChecked
                        />
                        <label
                            className="custom-control-label c-pointer"
                            htmlFor="allowNotifications_2"
                        >
                            Allow Notifications by Phone or Email.
                        </label>
                    </div>
                </fieldset>
            </form>
        </section>
    )
}

export default TabProjectTarget
