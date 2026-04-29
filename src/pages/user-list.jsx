import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import UsersListHeader from '@/components/users/UsersListHeader'
import UsersListTable from '@/components/users/UsersListTable'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'

const UsersList = () => {
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState("all")

    useEffect(() => {
        verifyPagePermission('users', 'view', navigate)
    }, [])

    const filteredUsers = users.filter(u => {
        if (filter === "active") return u.status.status === "active"
        if (filter === "inactive") return u.status.status === "inactive"
        return true
    })

    return (
        <>
            <PageHeader>
                <UsersListHeader onFilter={setFilter} />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <UsersListTable
                        users={filteredUsers}
                        setUsers={setUsers}
                    />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default UsersList