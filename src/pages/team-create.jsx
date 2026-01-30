import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamHeader from '../components/teams/TeamHeader'
import TeamContent from '@/components/teams/TeamContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'
import { toast } from 'react-toastify'
const TeamCreate = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])

  const [formData, setFormData] = useState({
    team_name: '',
    description: '',
    department_id: '',
    team_lead_id: '',
    is_active: true,
  })

  /* ================= PERMISSION ================= */
  useEffect(() => {
    verifyPagePermission('teams', 'create', navigate)
  }, [])

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
        console.error(err)
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
        console.error(err)
      }
    }
    fetchDepartments()
  }, [])

  /* ================= HANDLE INPUT ================= */
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /* ================= TEAM MEMBERS LOGIC ================= */
  const handleSelectMember = (e) => {
    const userId = Number(e.target.value)
    if (!userId) return

    if (!selectedMembers.includes(userId)) {
      setSelectedMembers(prev => [...prev, userId])
    }
  }

  const removeMember = (id) => {
    setSelectedMembers(prev => prev.filter(u => u !== id))
  }

  /* ================= CREATE TEAM ================= */
  const handleSubmit = async () => {
    try {
      if (!formData.team_name.trim()) {
        toast.error('Team name is required')
        return
      }

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

      // 1️⃣ Create team
      const res = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        let message = 'Something went wrong'

        try {
          const json = JSON.parse(text)
          message = json.message || message
        } catch {
          message = text
        }

        console.error('Create Team API Error:', {
          status: res.status,
          body: text,
        })

        toast.error(message)
        return
      }
      const data = await res.json()
      const teamId = data.data.team_id

      // 2️⃣ Add members
      if (selectedMembers.length) {
        const membersRes = await fetch(`http://localhost:5000/api/teams/${teamId}/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_ids: selectedMembers }),
        })
        if (!membersRes.ok) {
          const errorData = await parseError(membersRes)

          console.error('Add Team Members Error:', {
            teamId,
            errorData,
          })

          toast.warning(
            'Team created, but failed to add some members'
          )
        }

      }
      toast.success('Team created successfully!')
      navigate(`/teams/view/${teamId}`)
    } catch (err) {
      console.error('Create team error:', err)
      toast.error(
        err?.message || 'Unexpected error occurred while creating team'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader>
        <TeamHeader
          mode="create"
          loading={loading}
          onSave={handleSubmit}
        />
      </PageHeader>

      <div className="main-content mb-3">
        <div className="row">
          {/* LEFT SIDE – TEAM FORM */}
          <TeamContent
            formData={formData}
            onChange={handleChange}
            users={users}
            departments={departments}
          />

          {/* RIGHT SIDE – TEAM MEMBERS */}
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">Team Members</h5>
              </div>

              <div className="card-body">
                {/* Add Members */}
                <div className="form-group mb-3">
                  <label className="form-label">Add Members</label>
                  <select
                    className="form-control"
                    value=""
                    onChange={handleSelectMember}
                  >
                    <option value="">Select user</option>
                    {users.map(user => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Members */}
                {selectedMembers.length > 0 && (
                  <div >
                    <label className="form-label">Selected Members</label>
                    <div className="border rounded p-2">
                      {selectedMembers.map(id => {
                        const user = users.find(u => u.user_id === id)
                        return (
                          <span
                            key={id}
                            className="badge bg-primary me-2 mb-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeMember(id)}
                          >
                            {user?.first_name} {user?.last_name} ✕
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default TeamCreate
