import React, { useState } from 'react'
import { FiEdit, FiEye } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Loader from '../loader'
import TablePagination from '@/utils/TablePagination'

const UsersListTable = ({ users, loading }) => {
    const navigate = useNavigate()

    const usersPerPage = 5

    const [currentPage, setCurrentPage] = useState(1)

    // Calculate indexes
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

    const totalPages = Math.ceil(users.length / usersPerPage)
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

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

                                    {/* <th>Two Factor Enabled</th> */}
                                    {/* <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Created By</th> */}

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

                                {currentUsers.map(user => (
                                    <tr key={user.user_id}>
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer">{user.user_id}</td>
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer">{user.first_name}</td>
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer">{user.last_name}</td>
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer">{user.email}</td>
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer">
                                            <span
                                                className={`badge ${user.is_active ? "bg-success" : "bg-secondary"

                                                    }`}
                                            >
                                                {user.is_active ? "TRUE" : "FALSE"}
                                            </span>
                                        </td>
                                        {/* <td>
                                            <span
                                                className={`badge 
                                                     ${user.two_factor_enabled ? "bg-success" : "bg-secondary"}`}
                                            >
                                                {user.two_factor_enabled ? "TRUE" : "FALSE"}
                                            </span>
                                        </td> */}
                                        {/* <td className="text-capitalize">
                                            {user.created_at}
                                        </td>
                                        <td className="text-capitalize">
                                            {user.updated_at}
                                        </td>
                                        <td className="text-capitalize">
                                            {user.created_by ? user.created_by : "-"}
                                        </td> */}
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer text-capitalize">
                                            {user.date_of_joining ? user.date_of_joining : "-"}
                                        </td>
                                        <td onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        } className="cursor-pointer text-capitalize">
                                            {user.role.role_name}
                                        </td>
                                        <td className='cursor-pointer' onClick={() =>
                                            navigate(`/user/view/${user.user_id}`)
                                        }>
                                            {user.department?.department_name || '—'}
                                        </td>
                                        <td className="d-flex">
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
                    {/* Pagination Section */}
                    {totalPages > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">

                            {/* Left Side Info */}
                            <div>
                                Showing {indexOfFirstUser + 1} to{" "}
                                {Math.min(indexOfLastUser, users.length)} of {users.length} entries
                            </div>

                            {/* Right Side Controls */}
                            <nav>
                                <ul className="pagination mb-0">

                                    {/* Previous */}
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${currentPage === index + 1 ? "active" : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}

                                    {/* Next */}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </button>
                                    </li>

                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>)}

        </div>
    )
}

export default UsersListTable
