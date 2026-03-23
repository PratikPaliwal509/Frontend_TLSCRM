import React from 'react'
import Select from 'react-select'

const MultiSelectTags = ({
    options,
    value,
    defaultSelect,
    placeholder = 'Select tags',
    onChange,
}) => {
    return (
       <Select
    isMulti
    name="tags"
    options={options}
    value={value}                 // ✅ ONLY controlled value
    onChange={onChange}
    placeholder={placeholder}
    className="basic-multi-select"
    classNamePrefix="select"
    hideSelectedOptions={false}
    isSearchable={false}
    styles={{
        control: (baseStyles, state) => ({
            ...baseStyles,
            padding: state.hasValue ? '6px 12px' : '13px',
        }),
    }}
    formatOptionLabel={(tags) => (
        <div className="user-option d-flex align-items-center gap-2">
            <span
                className="wd-7 ht-7 rounded-circle"
                style={{ backgroundColor: tags.color }}
            />
            <span>{tags.label}</span>
        </div>
    )}
/>
    )
}

export default MultiSelectTags
