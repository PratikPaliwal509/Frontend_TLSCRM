import React from 'react'
import { FiArchive, FiBriefcase, FiCast, FiCheckCircle, FiCommand, FiLayers, FiPlus, FiStar, FiTool, FiUser, FiX } from 'react-icons/fi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { notesData } from '@/utils/fackData/notesData'

const NotesSidebar = ({ setSelectTab, selectTab, sidebarOpen, setSidebarOpen, setShowAddModal }) => {
    const filteredCategory = ["alls"]
    notesData.forEach(({ category }) => {
        if (!filteredCategory.includes(category)) filteredCategory.push(category)
    })

    return (
        <div className={`content-sidebar content-sidebar-md ${sidebarOpen ? "app-sidebar-open" : ""}`}>
            <PerfectScrollbar>
                <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
                    <h4 className="fw-bolder mb-0">Notes</h4>
                    <button className="app-sidebar-close-trigger" onClick={() => setSidebarOpen(false)}>
                        <FiX />
                    </button>
                </div>

                <div className="content-sidebar-header">
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                        Add Note
                    </button>

                </div>

                <div className="content-sidebar-body">
                    <ul className="nav d-flex flex-column nxl-content-sidebar-item">
                        {filteredCategory.map(category => (
                            <li className="nav-item" key={category}>
                                <button
                                    className={`nav-link note-link text-capitalize ${selectTab === category ? "active" : ""}`}
                                    onClick={() => setSelectTab(category)}
                                >
                                    {getIcon(category)}
                                    <span>{category}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </PerfectScrollbar>
        </div>
    )
}

export default NotesSidebar

const getIcon = (category) => {
    switch (category) {
        case "alls": return <FiLayers size={16} />
        case "tasks": return <FiCheckCircle size={16} />
        case "important": return <FiStar size={16} />
        case "works": return <FiTool size={16} />
        case "business": return <FiBriefcase size={16} />
        case "archive": return <FiArchive size={16} />
        case "personal": return <FiUser size={16} />
        case "priority": return <FiCommand size={16} />
        case "social": return <FiCast size={16} />
        default: return null
    }
}
