import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamHeader from '../components/teams/TeamHeader'
import TeamContent from '@/components/teams/TeamContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission';

const TeamCreate = () => {
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

  useEffect(() => {
    const checkPermission = async () => {
      await verifyPagePermission('teams', 'create', navigate);
    };

    checkPermission();
  }, []);
  /* ================= FETCH USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(
          'http://localhost:5000/api/users/users/without-team',
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
          'http://localhost:5000/api/departments',
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

      const res = await fetch('http://localhost:5000/api/teams', {
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
        {/* <TeamCreateHeader loading={loading} onSave={handleSubmit} /> */}
        <TeamHeader mode="create"
          loading={loading}
          onSave={handleSubmit} />
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

export default TeamCreate
