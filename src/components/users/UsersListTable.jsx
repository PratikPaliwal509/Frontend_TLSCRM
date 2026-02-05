import React from 'react'
import { FiEdit, FiEye } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Loader from '../loader'

const UsersListTable = ({ users, loading }) => {
    const navigate = useNavigate()

    return (
        <div className="col-12">{loading ? (
            <Loader />
        ) : (
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Two Factor Enabled</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Created By</th>
                                    <th>Date Of Joining</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            No users found
                                        </td>
                                    </tr>
                                )}

                                {users.map(user => (
                                    <tr key={user.user_id}>
                                        <td>{user.user_id}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                className={`badge ${user.is_active ? "bg-success" : "bg-secondary"

                                                    }`}
                                            >
                                                {user.is_active ? "TRUE" : "FALSE"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge 
                                                     ${user.two_factor_enabled ? "bg-success" : "bg-secondary"}`}
                                            >
                                                {user.two_factor_enabled ? "TRUE" : "FALSE"}
                                            </span>
                                        </td>
                                        <td className="text-capitalize">
                                            {user.created_at}
                                        </td>
                                        <td className="text-capitalize">
                                            {user.updated_at}
                                        </td>
                                        <td className="text-capitalize">
                                            {user.created_by ? user.created_by : "-"}
                                        </td>
                                        <td className="text-capitalize">
                                            {user.date_of_joining ? user.date_of_joining : "-"}
                                        </td>
                                        <td className="text-capitalize">
                                            {user.role_id}
                                        </td>
                                        <td>
                                            {user.department?.department_name || '—'}
                                        </td>
                                        <td className="">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={() =>
                                                    navigate(`/user/view/${user.user_id}`)
                                                }
                                            >
                                                <FiEye />
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() =>
                                                    navigate(`/user/edit/${user.user_id}`)
                                                }
                                            >
                                                <FiEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

export default UsersListTable
