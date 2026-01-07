// import React, { useEffect, useRef, useState } from 'react'
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
// import getIcon from '@/utils/getIcon'

// const SelectDropdown = ({
//     options = [],
//     selectedOption,
//     onSelectOption,
//     className,
//     defaultSelect
// }) => {
//     const [isOpen, setIsOpen] = useState(false)
//     const [searchTerm, setSearchTerm] = useState('')
//     const [openUpwards, setOpenUpwards] = useState(false)
//     const [localSelectedOption, setLocalSelectedOption] = useState(null)

//     const dropdownRef = useRef(null)

//     /* ---------------- SAFE DEFAULT SELECT ---------------- */
//     useEffect(() => {
//         if (!defaultSelect || !options.length) {
//             setLocalSelectedOption(null)
//             return
//         }

//         // Case 1: defaultSelect is already an option object
//         if (typeof defaultSelect === 'object' && defaultSelect.value) {
//             setLocalSelectedOption(defaultSelect)
//             return
//         }

//         // Case 2: defaultSelect is string / number
//         const defaultValue = String(defaultSelect).toLowerCase()

//         const matchedOption = options.find(
//             (option) =>
//                 String(option.value).toLowerCase() === defaultValue
//         )

//         setLocalSelectedOption(matchedOption || null)
//     }, [defaultSelect, options])

//     /* ---------------- CLICK OUTSIDE ---------------- */
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false)
//             }
//         }
//         document.addEventListener('click', handleClickOutside)
//         return () => document.removeEventListener('click', handleClickOutside)
//     }, [])

//     /* ---------------- OPEN DIRECTION ---------------- */
//     useEffect(() => {
//         if (!isOpen) return
//         const rect = dropdownRef.current.getBoundingClientRect()
//         if (rect.bottom + 200 > window.innerHeight) {
//             setOpenUpwards(true)
//         } else {
//             setOpenUpwards(false)
//         }
//     }, [isOpen])

//     const toggleDropdown = () => setIsOpen((prev) => !prev)

//     const handleOptionClick = (option) => {
//         setLocalSelectedOption(option)
//         onSelectOption?.(option)
//         setIsOpen(false)
//     }

//     const filteredOptions = options.filter(option =>
//         option.label?.toLowerCase().includes(searchTerm.toLowerCase())
//     )

//     return (
//         <div
//             className={`select-dropdown ${className || ''} ${openUpwards ? 'open-upwards' : ''}`}
//             ref={dropdownRef}
//         >
//             <div className="select-box" onClick={toggleDropdown}>
//                 <span className="selected-label">
//                     {localSelectedOption?.color && (
//                         <span
//                             className="status-dot"
//                             style={{ backgroundColor: localSelectedOption.color }}
//                         />
//                     )}

//                     {localSelectedOption?.icon && (
//                         <span className={`lh-1 fs-16 ${localSelectedOption.iconClassName}`}>
//                             {getIcon(localSelectedOption.icon)}
//                         </span>
//                     )}

//                     {localSelectedOption?.img && (
//                         <img
//                             src={localSelectedOption.img}
//                             className="avatar-image avatar-sm"
//                             alt=""
//                         />
//                     )}

//                     {localSelectedOption?.label || '—'}
//                 </span>

//                 <span className="arrow">
//                     {isOpen ? <FiChevronUp /> : <FiChevronDown />}
//                 </span>
//             </div>

//             {isOpen && (
//                 <div className="dropdown-list">
//                     <div className="search-input-outer">
//                         <input
//                             type="text"
//                             className="search-input"
//                             placeholder="Search..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>

//                     <ul>
//                         {filteredOptions.length ? (
//                             filteredOptions.map((option) => (
//                                 <li
//                                     key={option.value}
//                                     className={option.value === localSelectedOption?.value ? 'active' : ''}
//                                     onClick={() => handleOptionClick(option)}
//                                 >
//                                     {option.color && (
//                                         <span
//                                             className="status-dot"
//                                             style={{ backgroundColor: option.color }}
//                                         />
//                                     )}

//                                     {option.icon && (
//                                         <span className={`lh-1 me-3 fs-16 ${option.iconClassName}`}>
//                                             {getIcon(option.icon)}
//                                         </span>
//                                     )}

//                                     {option.img && (
//                                         <img
//                                             src={option.img}
//                                             className="avatar-image avatar-sm me-2"
//                                             alt=""
//                                         />
//                                     )}

//                                     {option.label}
//                                 </li>
//                             ))
//                         ) : (
//                             <li className="no-result">No results found</li>
//                         )}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default SelectDropdown
import React from 'react'
import { FiChevronDown } from 'react-icons/fi'

const SelectDropdown = ({ options, selectedOption, onSelectOption }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div className="dropdown">
            <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{ minWidth: '120px' }}
            >
                {selectedOption?.label || '—'}
                <FiChevronDown size={14} />
            </button>
            
            {isOpen && (
                <div className="dropdown-menu show">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className="dropdown-item"
                            onClick={() => {
                                onSelectOption(option)
                                setIsOpen(false)
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SelectDropdown