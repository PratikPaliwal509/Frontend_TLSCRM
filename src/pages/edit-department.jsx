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
    
      const [departments, setDepartments] = useState([])
const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        department_name: '',
        department_code: '',
        description: '',
        is_active: true,
    })

    const [is_sub_department, SetIs_sub_department] = useState(false)
    /* ================= VERIFY PERMISSION ================= */
    useEffect(() => {
        verifyPagePermission('departments', 'edit', navigate)
    }, [])

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

                setFormData({
                    department_name: data.data.department_name || '',
                    department_code: data.data.department_code || '',
                    description: data.data.description || '',
                    is_active: data.data.is_active ?? true,
                    parent_department_id: data.data.parent_department_id,
                    manager_id: data.data.manager_id || 0,
                })
                SetIs_sub_department(data.data.parent_department_id !== null)
            } catch (error) {
                console.error('Fetch department error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchDepartment()
    }, [id])
    useEffect(() => {
        const fetchDepartments = async () => {
          try {
            const token = localStorage.getItem('token')
            const response = await fetch(
              'http://localhost:5000/api/departments',
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            const data = await response.json()
            setDepartments(data.data || [])
          } catch (err) {
            console.error('Fetch departments error:', err)
          }
        }
        fetchDepartments()
      }, [])
    
     useEffect(() => {
        const fetchUsers = async () => {
          const token = localStorage.getItem('token')
          const res = await fetch(
            // 'http://localhost:5000/api/users/users/by-agency',
            'http://localhost:5000/api/users/users/by-agency',
            { headers: { Authorization: `Bearer ${token}` } }
          )
          const data = await res.json()
          setUsers(data.data || [])
        }
        fetchUsers()
      }, [])
    /* ================= HANDLE INPUT ================= */
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    /* ================= UPDATE DEPARTMENT ================= */
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')

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
            navigate(`/departments/view/${data.data.department_id}`)
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
                    
          SetIs_sub_department={SetIs_sub_department}
          
          is_sub_department={is_sub_department}
                        formData={formData}
                        onChange={handleChange}
                        users={users}
                        
            departments={departments}
                    />
                </div>
            </div>
        </>
    )
}

export default DepartmentEdit
