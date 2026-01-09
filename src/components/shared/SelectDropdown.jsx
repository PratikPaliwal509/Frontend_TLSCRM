
import React from 'react'

const SelectDropdown = ({ options, value, onSelectOption }) => {
    return (
        <select
            className="form-control"
            value={value}
            onChange={(e) => onSelectOption(e.target.value)}
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    )
}

export default SelectDropdown
