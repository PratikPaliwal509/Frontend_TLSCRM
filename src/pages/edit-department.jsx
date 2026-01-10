import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import DepartmentsHeader from '@/components/departments/DepartmentsHeader'
import DepartmentContent from '@/components/departments/DepartmentContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import DepartmentsHeader from '@/components/departments/DepartmentsHeader'
import DepartmentEditHeader from '@/components/departments/DepartmentEditHeader'

const DepartmentEdit = () => {
    const { id } = useParams() // department id from URL
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        department_name: '',
        department_code: '',
        description: '',
        is_active: true,
    })

    /* ================= VERIFY PERMISSION ================= */
    // useEffect(() => {
    //     verifyPagePermission('departments', 'edit', navigate)
    // }, [])

    /* ================= FETCH DEPARTMENT ================= */
    useEffect(() => {
        if (!id) return

        const fetchDepartment = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const response = await fetch(`http://localhost:5000/api/departments/only-one/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                console.log('Fetched department:', data)

                setFormData({
                    department_name: data.data.department_name || '',
                    department_code: data.data.department_code || '',
                    description: data.data.description || '',
                    is_active: data.data.is_active ?? true,
                })
            } catch (error) {
                console.error('Fetch department error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDepartment()
    }, [id])

    /* ================= HANDLE INPUT ================= */
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    /* ================= UPDATE DEPARTMENT ================= */
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            console.log('Updating department with data:', formData)

            const response = await fetch(`http://localhost:5000/api/departments/${id}`, {
                method: 'PUT', // use PUT for update
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw errorData
            }

            const data = await response.json()
            console.log('Department updated successfully:', data)
            navigate(`/settings/departments/view/${data.data.department_id}`)
        } catch (error) {
            console.error('Update department error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <PageHeader>
                <DepartmentEditHeader
                    loading={loading}
                    onSave={handleSubmit}
                />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <DepartmentContent
                        formData={formData}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    )
}

export default DepartmentEdit
