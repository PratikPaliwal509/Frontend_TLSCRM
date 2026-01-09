import React from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'

const TaskStatus = ({ label, value, options, onChange }) => {
    return (
        <div className="form-group mb-4">
            <label className="form-label">{label}</label>
            <SelectDropdown
                options={options}
                value={value}              // controlled value
                onSelectOption={onChange}  // directly pass onChange
            />
        </div>
    )
}

export default TaskStatus
