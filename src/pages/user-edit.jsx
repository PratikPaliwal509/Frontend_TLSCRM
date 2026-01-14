import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UsersEditHeader from '../components/users/UsersEditHeader'
import UsersEditContent from '../components/users/UsersEditContent'
// import topTost from '@/utils/topTost'
import PageHeader from '@/components/shared/pageHeader/PageHeader'

const UserEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department_id: '',
    team_id: '',
    status: 'active',
    notes: '',
  })
  const [departments, setDepartments] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch user, departments, and teams directly
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`/api/users/${id}`)
        if (!userRes.ok) throw new Error('Failed to fetch user')
        const userData = await userRes.json()

        // Fetch departments
        const deptRes = await fetch('/api/departments')
        if (!deptRes.ok) throw new Error('Failed to fetch departments')
        const deptData = await deptRes.json()

        // Fetch teams
        const teamRes = await fetch('/api/teams')
        if (!teamRes.ok) throw new Error('Failed to fetch teams')
        const teamData = await teamRes.json()

        // Set states
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          role: userData.role || '',
          department_id: userData.department_id || '',
          team_id: userData.team_id || '',
          status: userData.status || 'active',
          notes: userData.notes || '',
        })
        setDepartments(deptData)
        setTeams(teamData)
      } catch (err) {
        console.error(err)
        // topTost('Failed to fetch data')
      }
    }

    fetchData()
  }, [id])

  // Handle form input changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle update user
  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to update user')
    //   topTost('User updated successfully')
      navigate(`/users/view/${id}`)
    } catch (err) {
      console.error(err)
    //   topTost('Failed to update user')                           
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Page Header */}
       <PageHeader>
      {/* <div className="d-flex align-items-center justify-content-between mb-4">
        <h3>Edit User</h3> */}
        <UsersEditHeader onUpdate={handleUpdate} loading={loading} />
      {/* </div> */}
      </PageHeader>
<div className="main-content">
                <div className="row">
      {/* Form Content */}
      <UsersEditContent
        formData={formData}
        departments={departments}
        teams={teams}
        onChange={handleChange}
      /></div></div>
    </>
  )
}

export default UserEditPage
