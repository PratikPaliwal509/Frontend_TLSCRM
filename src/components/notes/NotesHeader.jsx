import React, { useState } from 'react'
import Dropdown from '@/components/shared/Dropdown'
import { emailActions, emailMoreOptions, tagsItems } from '../emails/EmailHeader'
import { FiAlignLeft, FiChevronLeft, FiChevronRight, FiEye, FiFolderPlus, FiTag } from 'react-icons/fi'
import { labels, taskFilter } from '../tasks/TaskHeader'
import HeaderSearchForm from '@/components/shared/pageHeader/HeaderSearchForm'
import { FiChevronDown } from 'react-icons/fi'
import { useRef } from 'react'
import { useEffect } from 'react'

const projectOptions = [
  { label: "Client Notes", value: "clients" },
  { label: "Project Notes", value: "projects" },
]

const NotesHeader = ({ setSidebarOpen, noteType, setNoteType }) => {
  const [active, setActive] = useState("Newest")
  const [projectFilter, setProjectFilter] = useState("Client Notes")

  const handleFilter = (e) => {
    setActive(e)
  }

  const handleProject = (item) => {
    setProjectFilter(item.label)
    setNoteType(item.value)
  }

  return (
    <div className="content-area-header sticky-top">
      <div className="page-header-left d-flex align-items-center gap-2">
        <a
          href="#"
          className="app-sidebar-open-trigger me-2"
          onClick={() => setSidebarOpen(true)}
        >
          <FiAlignLeft className="fs-20" />
        </a>

        <NotesTypeDropdown
          options={projectOptions}
          value={noteType}
          onChange={(item) => setNoteType(item.value)}
        />


        {/* <Dropdown
          dropdownItems={emailActions}
          triggerIcon={<FiEye />}
          triggerPosition={"0,22"}
          triggerClass="avatar-md"
        /> */}

        {/* <Dropdown
          dropdownItems={tagsItems}
          triggerIcon={<FiTag />}
          triggerPosition={"0,22"}
          triggerClass="avatar-md"
          dropdownAutoClose="outside"
          tooltipTitle="Tags"
        /> */}

        {/* <Dropdown
          dropdownItems={labels}
          triggerIcon={<FiFolderPlus />}
          triggerPosition={"0,22"}
          triggerClass="avatar-md"
          dropdownAutoClose="outside"
          tooltipTitle="Labels"
        /> */}
      </div>

      <div className="page-header-right ms-auto">
        <div className="hstack gap-2">
          <HeaderSearchForm />

          <a href="#" className="d-none d-sm-flex">
            <div className="avatar-text avatar-md" title="Newest">
              <FiChevronLeft />
            </div>
          </a>

          <a href="#" className="d-none d-sm-flex">
            <div className="avatar-text avatar-md" title="Oldest">
              <FiChevronRight />
            </div>
          </a>

          <Dropdown
            dropdownItems={taskFilter}
            triggerPosition={"0,23"}
            triggerClass="btn btn-light-brand btn-sm rounded-pill dropdown-toggle"
            isAvatar={false}
            triggerIcon={active}
            dropdownPosition="dropdown-menu-start"
            dropdownParentStyle="d-none d-sm-flex"
            onClick={handleFilter}
            active={active}
          />

          <Dropdown
            dropdownItems={emailMoreOptions}
            triggerPosition={"0,22"}
            triggerClass="avatar-md"
            tooltipTitle="More Options"
            dropdownParentStyle="d-none d-sm-flex"
          />
        </div>
      </div>
    </div>
  )
}

export default NotesHeader

const NotesTypeDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="dropdown" ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-light-brand dropdown-toggle"
        onClick={() => setOpen(prev => !prev)}
      >
        {selectedOption?.label || "Select Notes"} <FiChevronDown className="ms-2" />
      </button>

      {open && (
        <div
          className="dropdown-menu show"
          style={{ position: "absolute", top: "100%", left: 0 }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              className={`dropdown-item ${opt.value === value ? "active" : ""}`}
              onClick={() => {
                onChange(opt)
                setOpen(false)
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
