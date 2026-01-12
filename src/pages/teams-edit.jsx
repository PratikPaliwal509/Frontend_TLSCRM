import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamHeader from '../components/teams/TeamHeader'
import TeamContent from '@/components/teams/TeamContent'
import TeamMembers from '@/components/teams/TeamMembers'

const TeamEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
const teamId = id
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [teamMembers, setTeamMembers] = useState([])

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
      const token = localStorage.getItem('token')
      const res = await fetch(
        // 'http://localhost:5000/api/users/users/by-agency',
        'http://localhost:5000/api/users/users/without-team',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setUsers(data.data || [])
    }
    fetchUsers()
  }, [])

  /* ================= FETCH DEPARTMENTS ================= */
  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        'http://localhost:5000/api/departments',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      setDepartments(data.data || [])
    }
    fetchDepartments()
  }, [])

  /* ================= FETCH TEAM ================= */
  useEffect(() => {
    const fetchTeam = async () => {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `http://localhost:5000/api/teams/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      const team = data.data

      setFormData({
        team_name: team.team_name,
        description: team.description || '',
        department_id: team.department_id || '',
        team_lead_id: team.team_lead?.user_id || '',
        is_active: team.is_active,
      })

      setTeamMembers(team.members || [])
    }

    fetchTeam()
  }, [teamId])

  /* ================= HANDLE INPUT ================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= UPDATE TEAM ================= */
  const handleUpdate = async () => {
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

      const res = await fetch(
        `http://localhost:5000/api/teams/${teamId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw await res.json()
    } catch (err) {
      console.error('Update team error:', err)
    } finally {
      setLoading(false)
    }
  }

  /* ================= ADD MEMBERS ================= */
  const handleAddMembers = async (selectedUserIds) => {
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5000/api/teams/${teamId}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_ids: selectedUserIds }),
      }
    )

    // Reload team members
    const res = await fetch(
      `http://localhost:5000/api/teams/${teamId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    setTeamMembers(data.data.members || [])
  }

  return (
    <>
      <PageHeader>
        <TeamHeader
          mode="edit"
          loading={loading}
          onSave={handleUpdate}
          onCancel={() => navigate(-1)}
        />
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <TeamContent
            formData={formData}
            onChange={handleChange}
            users={users}
            departments={departments}
          />

          <TeamMembers
            users={users}
            teamMembers={teamMembers}
            onAddMembers={handleAddMembers}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  )
}

export default TeamEdit
