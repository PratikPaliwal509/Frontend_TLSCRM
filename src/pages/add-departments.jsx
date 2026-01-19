import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import DepartmentContent from '@/components/departments/DepartmentContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import DepartmentCreateHeader from '@/components/departments/DepartmentCreateHeader'

const AddDepartment = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])

    const [is_sub_department, SetIs_sub_department] = useState(false)
  const [formData, setFormData] = useState({
    department_name: '',
    department_code: '',
    description: '',
    is_active: true,
    agency_id: '',
    manager_id: 0,
    parent_department_id: null,
  })

  /* ================= VERIFY PERMISSION ================= */
  useEffect(() => {
    verifyPagePermission('departments', 'create', navigate)
  }, [])

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          'http://localhost:5000/api/users/users/by-agency',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await response.json()
        setUsers(data.data || [])
      } catch (err) {
        console.error('Fetch users error:', err)
      }
    }
    fetchUsers()
  }, [])

  /* ================= FETCH DEPARTMENTS ================= */
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

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= CREATE DEPARTMENT ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const payload = {
        ...formData,
        manager_id: Number(formData.manager_id),
        parent_department_id: is_sub_department
          ? Number(formData.parent_department_id)
          : null,
      }

      const response = await fetch(
        'http://localhost:5000/api/departments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) throw await response.json()

      const data = await response.json()

      navigate(
        payload.parent_department_id
          ? `/settings/departments/view/${payload.parent_department_id}`
          : `/settings/departments/view/${data.data.department_id}`
      )
    } catch (err) {
      console.error('Create department error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader>
        <DepartmentCreateHeader loading={loading} onSave={handleSubmit} />
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

export default AddDepartment
