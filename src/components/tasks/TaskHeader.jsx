import React, { useState } from 'react'
import Dropdown from '@/components/shared/Dropdown'
import { emailActions, emailMoreOptions, tagsItems } from '../emails/EmailHeader'
import { FiActivity, FiAirplay, FiAlignLeft, FiArrowLeft, FiCheckCircle, FiChevronLeft, FiChevronRight, FiClock, FiEye, FiFolderPlus, FiHash, FiPlus, FiSearch, FiTag } from 'react-icons/fi'
import HeaderSearchForm from '@/components/shared/pageHeader/HeaderSearchForm'
import SimpleDropdown from './SimpleDropdown'
import ViewModeSelect from './ViewMode'

export const taskOptions = [
    { label: "All Tasks", icon: <FiHash /> },
    { label: "My Tasks", icon: <FiCheckCircle /> },
    { label: "Overviews", icon: <FiAirplay /> },
    { label: "Pending Tasks", icon: <FiClock /> },
    { label: "InProgress Tasks", icon: <FiActivity /> },
]

export const taskFilter = [
    { label: "Title", icon: "" },
    { label: "Priority", icon: "" },
    { label: "Category", icon: "" },
    { label: "Time & Date", icon: "" },
    { type: "divider" },
    { label: "Newest", icon: "" },
    { label: "Oldest", icon: "" },
    { type: "divider" },
    { label: "Ascending", icon: "" },
    { label: "Descending", icon: "" },
]
export const labels = [
    {
        id: "l_item_1",
        label: "Updates",
        checkbox: true,
        checked: true,
    },
    {
        id: "l_item_2",
        label: "Socials",
        checkbox: true,
        checked: false,
    },
    {
        id: "l_item_3",
        label: "Primary",
        checkbox: true,
        checked: true,
    },
    {
        id: "l_item_4",
        label: "Forums",
        checkbox: true,
        checked: false,
    },
    {
        id: "l_item_5",
        label: "Promotions",
        checkbox: true,
        checked: false,
    },
    { type: "divider" },
    { label: "Create Tag", icon: <FiPlus /> },
    { label: "Manages Tag", icon: <FiTag /> },
];

export const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'inprogress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
]
export const priorityOptions = [
    { label: 'All', value: 'all' },
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
]


const TaskHeader = ({ setSidebarOpen,
    activeFilter,
    setActiveFilter,
    viewMode,
    setViewMode }) => {
    const [active, setActive] = useState("Newest")
    const handleFilter = (e) => {
        setActive(e)
    }
    return (
        <div className="content-area-header sticky-top">
            <div className="page-header-left d-flex align-items-center gap-2">
                <a href="#" className="app-sidebar-open-trigger me-2" onClick={() => setSidebarOpen(true)}>
                    <FiAlignLeft className='fs-20' />
                </a>
                {/* <Dropdown
                    dropdownItems={taskOptions}
                    triggerIcon={<FiCheckCircle size={16} className='me-2' />}
                    triggerText="My Tasks"
                    triggerPosition={"0,18"}
                    triggerClass='btn btn-light-brand dropdown-toggle'
                    isAvatar={false}
                /> */}

                <SimpleDropdown
                activeFilter={activeFilter}
                    label="Status"
                    items={[
                        { label: 'All', value: 'all' },
                        { label: 'To_Do', value: 'to_do' },
                        { label: 'InProgress', value: 'inprogress' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Rejected', value: 'rejected' },
                    ]}
                    onSelect={(item) =>
                        setActiveFilter({ type: 'status', value: item.label.toLowerCase() })
                    }
                />

                <SimpleDropdown
                activeFilter={activeFilter}
                 label="Priority" 
                 items={[{ label: 'All', value: 'all' },
                { label: 'Low', value: 'low' },
                { label: 'Normal', value: 'normal' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },]} onSelect={(item) =>
                    setActiveFilter({ type: 'priority', value: item.value })
                } />


                {/* <Dropdown
                    dropdownItems={emailActions}
                    triggerIcon={<FiEye />}
                    triggerPosition={"0,22"}
                    triggerClass='avatar-md'
                />
                <Dropdown
                    dropdownItems={tagsItems}
                    triggerIcon={<FiTag />}
                    triggerPosition={"0,22"}
                    triggerClass='avatar-md'
                    dropdownAutoClose='outside'
                    tooltipTitle={"Tags"}
                />

                <Dropdown
                    dropdownItems={labels}
                    triggerIcon={<FiFolderPlus />}
                    triggerPosition={"0,22"}
                    triggerClass='avatar-md'
                    dropdownAutoClose='outside'
                    tooltipTitle={"Labels"}
                /> */}

            </div>



            <div className="page-header-right ms-auto">
                <div className="hstack gap-2">
                    <HeaderSearchForm />
                    {/* <a href="#" className="d-none d-sm-flex">
                        <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Newest">
                            <FiChevronLeft />
                        </div>
                    </a>
                    <a href="#" className="d-none d-sm-flex">
                        <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Oldest">
                            <FiChevronRight />
                        </div>
                    </a> */}
                    <ViewModeSelect
                        value={viewMode}
                        onChange={setViewMode}
                    />

                    {/* <button
                        className="btn btn-light-brand btn-sm rounded-pill dropdown-toggle"
                        // className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            setViewMode(v => (v === 'list' ? 'kanban' : 'list'))
                        }
                    >
                        {viewMode === 'list' ? 'Kanban View' : 'List View'}
                    </button> */}
                    {/* <Dropdown
                        dropdownItems={taskFilter}
                        triggerPosition={"0,23"}
                        triggerClass='btn btn-light-brand btn-sm rounded-pill dropdown-toggle'
                        isAvatar={false}
                        triggerIcon={active}
                        dropdownPosition='dropdown-menu-start'
                        dropdownParentStyle={"d-none d-sm-flex"}
                        onClick={handleFilter}
                        active={active}
                    /> */}
                    {/* <Dropdown
                        dropdownItems={emailMoreOptions}
                        triggerPosition={"0,22"}
                        triggerClass='avatar-md'
                        tooltipTitle={"More Options"}
                        dropdownParentStyle={"d-none d-sm-flex"}
                    /> */}
                    <div className='py-1 btn-primary'>
                        <button
                            className="btn btn-primary btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#addNewTasks"
                        >
                            <FiPlus className="me-1" />
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskHeader