import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import UsersViewHeader from '../components/users/UsersViewHeader'
import UsersViewContent from '@/components/users/UsersViewContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import UsersViewTabs from '@/components/users/UsersViewTabs'
import { toast } from 'react-toastify'
import Loader from '@/components/loader'

const UsersView = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    /* ================= PERMISSION ================= */
    useEffect(() => {
        verifyPagePermission('users', 'view', navigate)
    }, [])

    /* ================= FETCH USER ================= */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token')

                const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })

                const data = await res.json()
                setUser(data.data)
            } catch (error) {
                console.error('Failed to load user', error)
                toast.error('Failed to load user')
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [id])

    if (loading) return <Loader/>
    if (!user) return <p>User not found</p>

    return (
        <>
            <PageHeader>
                <UsersViewHeader user={user} />
            </PageHeader>

            <UsersViewTabs user={user} />

            <div className="main-content">
                <div className="tab-content">
                    <UsersViewContent user={user} />
                </div>
            </div>
        </>
    )
}

export default UsersView
