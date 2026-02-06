import React, { useEffect, useState } from 'react'
import DepartmentsEmptyCard from './DepartmentsEmptyCard'
import { useNavigate } from 'react-router-dom'
import { FiEye } from 'react-icons/fi'
const TabSubDepartments = ({ departmentId }) => {
    const [subDepartments, setSubDepartments] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        if (!departmentId) return

        const fetchSubDepartments = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')

                const response = await fetch(
                    `https://api-0ggv.onrender.com/api/departments/${departmentId}/sub-departments`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const data = await response.json()
                setSubDepartments(data.data || [])
            } catch (error) {
                console.error('Fetch sub-departments error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubDepartments()
    }, [departmentId])

    if (loading) {
        return <p className="text-muted">Loading sub-departments...</p>
    }

    if (!subDepartments.length) {
        return (
            <DepartmentsEmptyCard
                title="No sub-departments"
                description="This department does not have any sub-departments yet."
            />
            //   <h1>No Department</h1>
        )
    }

    return (
        <div className="card">
            <div className="card-body text-white">
                <ul className="list-group  list-group-flush">
                    {subDepartments.map(dep => (
                        <li
                            key={dep.department_id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{dep.department_name}</strong>
                                <div className="text-muted small">
                                    Code: {dep.department_code || '—'}
                                </div>
                            </div>
                            <div className="flex-row d-flex align-items-center">

                                <span className="avatar-text avatar-md m-2">
                                    <FiEye
                                        onClick={() => navigate(`/departments/view/${dep.department_id}`)}
                                        className="cursor-pointer"
                                    />
                                </span>
                                <span
                                    className={`h-50 badge ${dep.is_active ? 'bg-success' : 'bg-secondary'
                                        }`}
                                >
                                    {dep.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default TabSubDepartments
