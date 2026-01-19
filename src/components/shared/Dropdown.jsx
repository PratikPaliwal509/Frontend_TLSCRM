import React from 'react'
import { Link } from 'react-router-dom'
import Checkbox from './Checkbox'
import { FiMoreVertical } from 'react-icons/fi'

// This dropdown component is used by task list(TaskContent)
const Dropdown = ({
    triggerPosition,
    triggerClass = "avatar-sm",
    triggerIcon,
    triggerText,
    dropdownItems = [],
    dropdownPosition = "dropdown-menu-end",
    dropdownAutoClose,
    dropdownParentStyle,
    dataBsToggle = "modal",
    tooltipTitle,
    dropdownMenuStyle,
    iconStrokeWidth = 1.7,
    isItemIcon = true,
    isAvatar = true,
    onClick, // legacy support
    active,
    id,
    onDeleteAssignment
}) => {

    const handleItemClick = (item) => {
        // 1️⃣ Item specific onClick (preferred)
        if (typeof item.onClick === 'function') {
            item.onClick()
            return
        }

        // 2️⃣ Fallback to old handler (backward compatibility)
        if (typeof onClick === 'function') {
            onClick(item.label, id)
        }
    }

    return (
        <div className={`filter-dropdown ${dropdownParentStyle}`}>
            {/* ---------- Trigger ---------- */}
            {
                tooltipTitle ? (
                    <span
                        className="d-flex cursor-pointer"
                        data-bs-toggle="dropdown"
                        data-bs-offset={triggerPosition}
                        data-bs-auto-close={dropdownAutoClose}
                    >
                        {
                            isAvatar ? (
                                <div
                                    className={`avatar-text ${triggerClass}`}
                                    data-bs-toggle="tooltip"
                                    title={tooltipTitle}
                                >
                                    {triggerIcon || <FiMoreVertical />}
                                    {triggerText}
                                </div>
                            ) : (
                                <div className={triggerClass}>
                                    {triggerIcon || <FiMoreVertical />}
                                    {triggerText}
                                </div>
                            )
                        }
                    </span>
                ) : (
                    <Link
                        to="#"
                        className={isAvatar ? `avatar-text ${triggerClass}` : triggerClass}
                        data-bs-toggle="dropdown"
                        data-bs-offset={triggerPosition}
                        data-bs-auto-close={dropdownAutoClose}
                    >
                        {triggerIcon || <FiMoreVertical />}
                        {triggerText}
                    </Link>
                )
            }

            {/* ---------- Menu ---------- */}
            <ul className={`dropdown-menu ${dropdownMenuStyle} ${dropdownPosition}`}>
                {dropdownItems.map((item, index) => {

                    if (item.type === "divider") {
                        return <li key={index} className="dropdown-divider" />
                    }

                    return (
                        <li key={index}>
                            {
                                item.checkbox ? (
                                    <Checkbox
                                        checked={item.checked}
                                        id={item.id}
                                        name={item.label}
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        className={`dropdown-item ${active === item.label ? "active" : ""}`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        {
                                            isItemIcon ? (
                                                item.icon && React.cloneElement(item.icon, {
                                                    className: "me-3",
                                                    size: 16,
                                                    strokeWidth: iconStrokeWidth
                                                })
                                            ) : (
                                                <span className={`wd-7 ht-7 rounded-circle me-3 ${item.color}`} />
                                            )
                                        }
                                        <span>{item.label}</span>
                                    </button>
                                )
                            }
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Dropdown
