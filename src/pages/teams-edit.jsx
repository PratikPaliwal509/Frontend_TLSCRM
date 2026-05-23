import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamHeader from '../components/teams/TeamHeader'
import TeamContent from '@/components/teams/TeamContent'
import TeamMembers from '@/components/teams/TeamMembers'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'
import { toast } from 'react-toastify'

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

  useEffect(() => {
    const checkPermission = async () => {
      await verifyPagePermission('teams', 'edit', navigate);
    };

    checkPermission();
  }, []);
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

      setUsers(prevUsers => [
        ...prevUsers,
        ...team.members.filter(
          member => !prevUsers.some(user => user.user_id === member.user_id)
        )
      ])


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

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update team')
      }

      // ✅ SUCCESS TOAST
      toast.success(data?.message || 'Team updated successfully')
    } catch (err) {
      console.error('Update team error:', err)
      toast.error(err.message || 'Something went wrong while updating team')
    } finally {
      setLoading(false)
    }
  }

  /* ================= ADD MEMBERS ================= */
  const handleAddMembers = async (selectedUserIds) => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
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
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to add members')
      }

      // ✅ SUCCESS TOAST
      toast.success(data?.message || 'Members added successfully')
      // Reload team members
      const teamRes = await fetch(
        `http://localhost:5000/api/teams/${teamId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const teamData = await teamRes.json()
      setTeamMembers(teamData.data.members || [])
    } catch (err) {
      console.error('Add members error:', err)
      toast.error(err.message || 'Something went wrong while adding members')
    } finally {
      setLoading(false)
    }
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
      <Footer />
    </>
  )
}

export default TeamEdit
