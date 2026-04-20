import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UsersEditHeader from '../components/users/UsersEditHeader'
import UsersEditContent from '../components/users/UsersEditContent'
// import topTost from '@/utils/topTost'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import { set } from 'date-fns'
import Footer from '@/components/shared/Footer'

const UserEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    job_title: '',
    bio: '',
    department_id: null,
    team_id: null,
    is_active: true,
  })

  const [departments, setDepartments] = useState([])
  const [teams, setTeams] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)


  /* ================= PERMISSION ================= */
  useEffect(() => {
    verifyPagePermission('users', 'edit', navigate)
  }, [])
  // Fetch user, departments, and teams directly
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch(`https://api-0ggv.onrender.com/api/users/${id}`)
        if (!userRes.ok) throw new Error('Failed to fetch user')
        const userData = await userRes.json()

        // Fetch departments
        const deptRes = await fetch('https://api-0ggv.onrender.com/api/departments/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },

        })
        if (!deptRes.ok) throw new Error('Failed to fetch departments')
        const deptData = await deptRes.json()

        // Fetch teams
        const teamRes = await fetch('https://api-0ggv.onrender.com/api/teams', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },

        })
        if (!teamRes.ok) throw new Error('Failed to fetch teams')
        const teamData = await teamRes.json()
        const rolesRes = await fetch('https://api-0ggv.onrender.com/api/roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },

        })
        if (!rolesRes.ok) throw new Error('Failed to fetch roles')
        const rolesData = await rolesRes.json()

        // Set states
        setFormData({
          first_name: userData.data.first_name ?? '',
          last_name: userData.data.last_name ?? '',
          email: userData.data.email ?? '',
          phone: userData.data.phone ?? '',
          mobile: userData.data.mobile ?? '',
          job_title: userData.data.job_title ?? '',
          bio: userData.data.bio ?? '',
          department_id: userData.data.department?.department_id ?? null,
          role_id: userData.data.role?.role_id ?? null,
          team_id: userData.data.team?.team_id ?? null,
          is_active: userData.data.is_active ?? true,
        })
        setDepartments(deptData.data)
        setTeams(teamData.data)
        setRoles(rolesData.data)
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
  const cleanPayload = Object.fromEntries(
    Object.entries(formData).filter(
      ([_, value]) => value !== '' && value !== undefined
    )
  )

  // Handle update user
  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://api-0ggv.onrender.com/api/users/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cleanPayload),
      })
      if (!res.ok) throw new Error('Failed to update user')
      //   topTost('User updated successfully')
      navigate(`/user/view/${id}`)
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
            roles={roles}
            teams={teams}
            onChange={handleChange}
          />
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default UserEditPage
