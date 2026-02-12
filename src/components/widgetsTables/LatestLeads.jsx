import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit, FiEye, FiMoreVertical, FiTrash, FiTrash2 } from 'react-icons/fi'
import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import { userList } from '@/utils/fackData/userList'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardLoader from '@/components/shared/CardLoader'


const LatestLeads = ({ title }) => {
    
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem('token')
    /* -------- FETCH CLIENTS -------- */
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true)
                const res = await fetch('http://localhost:5000/api/clients', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) throw new Error('Failed to fetch clients')

                const result = await res.json()
                setClients(result?.data || [])
            } catch (err) {
                console.error(err)
                toast.error('Failed to load clients')
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [refreshKey])

    if (isRemoved) return null


    return (
        <div className="col-xxl-8">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr className="border-b">
                                    <th scope="row">Users</th>
                                    <th>Industry</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th className="">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    clients.slice(0, 5).map(({ created_at, client_id, industry, primary_contact_email, user_img, company_name, is_active, color }) => (
                                        <tr key={client_id} className='chat-single-item'>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {
                                                        user_img ?
                                                            <div className="avatar-image">
                                                                <img src={user_img} alt="user-img" className="img-fluid" />
                                                            </div>
                                                            :
                                                            <div className="text-white avatar-text user-avatar-text">{company_name.substring(0, 1)}</div>
                                                    }
                                                    <a href={`/clients/view/${client_id}`}>
                                                        <span className="d-block ">{company_name}</span>
                                                        <span className="fs-12 d-block fw-normal text-muted">{primary_contact_email}</span>
                                                    </a>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-gray-200 text-dark">{industry}</span>
                                            </td>
                                            <td>{new Date(created_at).toISOString().split('T')[0]}</td>
                                            <td>
                                                <span className={`badge ${is_active
                                                    ? 'bg-soft-success text-success'
                                                    : 'bg-soft-danger text-danger'
                                                    }`}>{is_active ? "Active" : "Inactive"}</span>
                                            </td>
                                          
                                            <td className="">
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                        type="button"
                                                         style={{ width: "32px", height: "32px", padding: 0 }}
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <FiMoreVertical size={16} />
                                                    </button>

                                                    <ul className="dropdown-menu dropdown-menu-end">
                                                        <li>
                                                            <Link className="dropdown-item d-flex align-items-center gap-2" to={`/clients/view/${client_id}`}>
                                                                <FiEye size={14} /> View
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item d-flex align-items-center gap-2" to={`/clients/edit/${client_id}`}>
                                                                <FiEdit size={14} /> Edit
                                                            </Link>
                                                        </li>
                                                        {/* <li>
                                                            <button
                                                                className="dropdown-item text-danger d-flex align-items-center gap-2"
                                                                onClick={() => handleDelete(client_id)}
                                                            >
                                                                <FiTrash2 size={14} /> Delete
                                                            </button>
                                                        </li> */}
                                                    </ul>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                    )
                                }
                            </tbody>
                            {/* <tbody>
                                {
                                    userList(0, 5).map(({ date, id, proposal, user_email, user_img, user_name, user_status, color }) => (
                                        <tr key={id} className='chat-single-item'>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {
                                                        user_img ?
                                                            <div className="avatar-image">
                                                                <img src={user_img} alt="user-img" className="img-fluid" />
                                                            </div>
                                                            :
                                                            <div className="text-white avatar-text user-avatar-text">{user_name.substring(0, 1)}</div>
                                                    }
                                                    <a href="#">
                                                        <span className="d-block">{user_name}</span>
                                                        <span className="fs-12 d-block fw-normal text-muted">{user_email}</span>
                                                    </a>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-gray-200 text-dark">{proposal}</span>
                                            </td>
                                            <td>{date}</td>
                                            <td>
                                                <span className={`badge bg-soft-${color} text-${color}`}>{user_status}</span>
                                            </td>
                                            <td className="text-end">
                                                <Link to="#"><FiMoreVertical size={16} /></Link>
                                            </td>
                                        </tr>
                                    )
                                    )
                                }
                            </tbody> */}
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Pagination />
                </div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default LatestLeads
