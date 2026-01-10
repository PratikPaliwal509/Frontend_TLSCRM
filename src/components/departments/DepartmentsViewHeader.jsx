import React from 'react'
import {
    FiDelete,
    FiEdit,
    FiMoreHorizontal,
    FiPlus,
    FiPrinter,
    FiTrash2,
    FiUsers,
} from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import { Link, useNavigate } from 'react-router-dom'
import topTost from '@/utils/topTost'

const DepartmentsViewHeader = ({ departments }) => {
    const navigate = useNavigate()

    const options = [
        { icon: <FiUsers />, label: 'Disable Department' },
        { icon: <FiDelete />, label: 'Archive Department' },
        { icon: <FiTrash2 />, label: 'Delete Department' },
    ]

    const handleAddTeam = () => {
        topTost(`Team added to "${departments?.name}" department`)
    }

    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
            {/* Print */}
            <button className="btn btn-icon btn-light-brand">
                <FiPrinter size={16} strokeWidth={1.6} />
            </button>

            {/* Edit Department */}
            <Link
                to={`/departments/edit/${departments?.id}`}
                className="btn btn-icon btn-light-brand"
            >
                <FiEdit size={16} strokeWidth={1.6} />
            </Link>

            {/* More Actions */}
            <Dropdown
                dropdownItems={options}
                dropdownAutoClose="outside"
                triggerPosition="0, 10"
                triggerClass="btn btn-icon btn-light-brand"
                triggerIcon={<FiMoreHorizontal size={16} />}
            />

            {/* Add Team */}
            <button
                className="btn btn-primary"
                onClick={handleAddTeam}
            >
                <FiPlus size={16} className="me-2" />
                <span>Add Team</span>
            </button>
        </div>
    )
}

export default DepartmentsViewHeader
