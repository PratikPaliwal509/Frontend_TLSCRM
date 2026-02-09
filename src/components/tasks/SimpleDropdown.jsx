import React, { useState, useRef, useEffect } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const SimpleDropdown = ({
    label,
    activeFilter,
    items,
    onSelect,
    triggerClass = 'btn btn-light-brand dropdown-toggle',
    menuPosition = 'dropdown-menu-end'
}) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const isActive = (type, value) =>
        activeFilter?.type === type && activeFilter?.value === value
    console.log("active fi", activeFilter)
    // close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="dropdown position-relative" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                className={triggerClass}
                onClick={() => setOpen((v) => !v)}
            >
                <span className="me-1">{label}</span>
                {/* <FiChevronDown size={14} /> */}
            </button>

            {/* Menu */}
            {open && (
                <ul className={`dropdown-menu show ${menuPosition}`}>
                    {items.map((item, index) => (
                        <li key={index} className={` ${isActive(activeFilter.type, item.label.toLowerCase()) ? 'bg-light' : ''}`}>
                            <button
                                type="button"
                                className="dropdown-item "
                                onClick={() => {
                                    onSelect(item)
                                    setOpen(false)
                                }}
                            >
                                {item.icon && (
                                    <span className="me-2 ">{item.icon}</span>
                                )}
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SimpleDropdown
