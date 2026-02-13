import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamCreateHeader from '@/components/teams/TeamCreateHeader'
import TeamContent from '@/components/teams/TeamContent'

const AddTeam = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])

  const [formData, setFormData] = useState({
    team_name: '',
    description: '',
    department_id: '',
    team_lead_id: '',
    is_active: true,
  })

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(
          'https://api-0ggv.onrender.com/api/users/users/by-agency',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
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
        const res = await fetch(
          'https://api-0ggv.onrender.com/api/departments',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const data = await res.json()
        setDepartments(data.data || [])
      } catch (err) {
        console.error('Fetch departments error:', err)
      }
    }
    fetchDepartments()
  }, [])

  /* ================= HANDLE INPUT ================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= CREATE TEAM ================= */
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const payload = {
        ...formData,
        department_id: formData.department_id
          ? Number(formData.department_id)
          : null,
        team_lead_id: formData.team_lead_id
          ? Number(formData.team_lead_id)
          : null,
      }

      const res = await fetch('https://api-0ggv.onrender.com/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw await res.json()

      const data = await res.json()
      navigate(`/settings/teams/view/${data.data.team_id}`)
    } catch (err) {
      console.error('Create team error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader>
        <TeamCreateHeader loading={loading} onSave={handleSubmit} />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <TeamContent
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

export default AddTeam
