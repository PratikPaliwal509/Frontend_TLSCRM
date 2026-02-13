import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/shared/pageHeader/PageHeader'
import UsersListHeader from '../components/users/UsersListHeader'
import UsersListTable from '../components/users/UsersListTable'
import { verifyPagePermission } from '../utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'

const UsersList = () => {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    /* ================= PERMISSION ================= */
    useEffect(() => {
        verifyPagePermission('users', 'view', navigate)
    }, [])

    /* ================= FETCH USERS ================= */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')

                const res = await fetch('https://api-0ggv.onrender.com/api/users/user', {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const json = await res.json()
                setUsers(json.data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <>
            <PageHeader>
                <UsersListHeader />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <UsersListTable
                        users={users}
                        loading={loading}
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default UsersList
