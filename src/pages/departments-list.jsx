import React, { useEffect } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'

import Footer from '@/components/shared/Footer'
import DepartmentsHeader from '@/components/departments/DepartmentsHeader'
import DepartmentsTable from '@/components/departments/DepartmentsTable'

import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'

const DepartmentsList = () => {
    const navigate = useNavigate()

    useEffect(() => {
        verifyPagePermission('departments', 'view', navigate)
    }, [])

    return (
        <>
            <PageHeader>
                <DepartmentsHeader />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <DepartmentsTable />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default DepartmentsList
