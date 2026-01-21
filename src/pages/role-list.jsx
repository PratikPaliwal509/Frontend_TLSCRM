import React, { useEffect } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import RolesHeader from '@/components/Roles/RolesHeader'
import RolesTable from '@/components/roles/RolesTable'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'

const RolesList = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('roles', 'view', navigate)
        }
        checkPermission()
    }, [])

    return (
        <>
            <PageHeader>
                <RolesHeader />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <RolesTable />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default RolesList
