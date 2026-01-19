import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, json } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import DepartmentsViewHeader from '@/components/departments/DepartmentsViewHeader'
import DepartmentsViewContent from '@/components/departments/DepartmentsViewContent'
import DepartmentsViewTabs from '@/components/departments/DepartmentsViewTabs'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import TabSubDepartments from '@/components/departments/TabSubDepartments'
import { Tab } from 'bootstrap'
const DepartmentsView = () => {
    const { id } = useParams()
    const [departments, setDepartments] = useState(null)
    const [loading, setLoading] = useState(true)
    // const triggerTab = document.querySelector(
    //     '[data-bs-target="#profileTab"]'
    // )

    const navigate = useNavigate()
    // const tab = new Tab(triggerTab)
    // tab.show()

    useEffect(() => {
        verifyPagePermission('departments', 'view', navigate)
    }, [])

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const token = localStorage.getItem('token')

                const res = await fetch(
                    // `http://localhost:5000/api/departments/only-one/1`,
                    `http://localhost:5000/api/departments/only-one/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const data = await res.json()
                setDepartments(data.data)
            } catch (error) {
                console.error('Failed to load department', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDepartment()
    }, [id])

    useEffect(() => {
    const triggerTab = document.querySelector(
      '[data-bs-target="#profileTab"]'
    )

    if (triggerTab) {
      const tab = new Tab(triggerTab)
      tab.show()
    }
  }, [departments])

    if (loading) return <p>Loading department...</p>
    if (!departments) return <p>Department not found</p>

    return (
        <>
            <PageHeader>
                <DepartmentsViewHeader departments={departments} />
            </PageHeader>

            <DepartmentsViewTabs departments={departments} />

            <div className="main-content">
                <div className="tab-content">
                    <DepartmentsViewContent departments={departments} />
                </div>
            </div>
        </>
    )
}

export default DepartmentsView
