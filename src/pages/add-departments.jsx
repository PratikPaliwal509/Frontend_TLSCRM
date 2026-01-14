import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import DepartmentContent from '@/components/departments/DepartmentContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import DepartmentCreateHeader from '@/components/departments/DepartmentCreateHeader'
// import { jwtDecode } from 'jwt-decode'

const AddDepartment = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    department_name: '',
    department_code: '',
    description: '',
    is_active: true,
    agency_id: '',
    manager_id: 0
  })

  /* ================= VERIFY PERMISSION ================= */
  // useEffect(() => {
  //     verifyPagePermission('departments', 'create', navigate)
  // }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(
          'http://localhost:5000/api/users/users/by-agency', // or /users?role=manager
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()

        setUsers(data.data || [])
      } catch (error) {
        console.error('Fetch users error:', error)
      }
    }

    fetchUsers()
  }, [])


  /* ================= HANDLE INPUT ================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= CREATE DEPARTMENT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      //             const decoded = jwtDecode(token)
      const payload = {
        ...formData,
        manager_id: Number(formData.manager_id),
      }

      const response = await fetch('http://localhost:5000/api/departments', {
        method: 'POST', // POST for creation
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData
      }

      const data = await response.json()
      setFormData({
        department_name: '',
        department_code: '',
        description: '',
        is_active: true,
      })
      navigate(`/settings/departments/view/${data.data.department_id}`) // redirect after success

    } catch (error) {
      console.error('Create department error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader>
        <DepartmentCreateHeader
          loading={loading}
          onSave={handleSubmit}
        />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <DepartmentContent
            formData={formData}
            onChange={handleChange}
            users={users}
          />
        </div>
      </div>
    </>
  )
}

export default AddDepartment
