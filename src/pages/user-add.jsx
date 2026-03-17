import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/shared/pageHeader/PageHeader'
import UsersCreateHeader from '../components/users/UserCreateHeader'
import UsersCreateContent from '../components/users/UsersCreateContent'
import { verifyPagePermission } from '../utils/verifyPagePermission'
import { toast } from 'react-toastify'
import Footer from '@/components/shared/Footer'

const UsersCreate = () => {
    const navigate = useNavigate()
    const [rolesLoading, setRolesLoading] = useState(true)
    const [departmentsLoading, setDepartmentsLoading] = useState(true)
    const [teamsLoading, setTeamsLoading] = useState(false)

    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [departments, setDepartments] = useState([])
    const [teams, setTeams] = useState([])

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        role_id: '',
        department_id: '',
        team_id: '',
        status: 'active',
        // agency_id: 2,
        first_name: '',
        last_name: '',
        bio: '',
        date_of_joining: '',
        hourly_rate: '',
        job_title: ''
    })

    /* ================= PERMISSION ================= */
    useEffect(() => {
        verifyPagePermission('users', 'create', navigate)
    }, [])

    /* ================= FETCH DEPARTMENTS ================= */
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setRolesLoading(true)
                const token = localStorage.getItem('token')
                const res = await fetch('https://api-0ggv.onrender.com/api/roles', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const result = await res.json()
                setRoles(result.data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setRolesLoading(false)
            }
        }

        fetchRoles()
    }, [])
    /* ================= FETCH DEPARTMENTS ================= */
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setDepartmentsLoading(true)
                const token = localStorage.getItem('token')
                const res = await fetch('https://api-0ggv.onrender.com/api/departments', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setDepartments(data.data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setDepartmentsLoading(false)
            }

        }

        fetchDepartments()
    }, [])

    /* ================= FETCH TEAMS (based on department) ================= */
    useEffect(() => {
        if (!formData.department_id) return

        const fetchTeams = async () => {
            try {
                setTeamsLoading(true)
                const token = localStorage.getItem('token')
                const res = await fetch(
                    `https://api-0ggv.onrender.com/api/teams/`,
                    // `https://api-0ggv.onrender.com/api/teams?department_id=${formData.department_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const data = await res.json()
                setTeams(data.data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setTeamsLoading(false)
            }
        }

        fetchTeams()
    }, [formData.department_id])

    /* ================= CHANGE ================= */
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        if (!formData.first_name.trim()) {
            toast.error('First name is required')
            return false
        }

        if (!formData.last_name.trim()) {
            toast.error('Last name is required')
            return false
        }

        if (!formData.email.trim()) {
            toast.error('Email is required')
            return false
        }

        if (!formData.role_id) {
            toast.error('Role is required')
            return false
        }

        if (!formData.password) {
            toast.error('Password is required')
            return false
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return false
        }

        if (!formData.confirm_password) {
            toast.error('Confirm password is required')
            return false
        }

        if (formData.password !== formData.confirm_password) {
            toast.error('Passwords do not match')
            return false
        }

        return true
    }

    /* ================= SUBMIT ================= */
    const handleSubmit = async (type = 'create') => {
        if (!validateForm()) return
        try {
            setLoading(true)
            const token = localStorage.getItem('token')

            const res = await fetch('https://api-0ggv.onrender.com/api/users/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    // ...formData,
                    formData
                    // status: type === 'draft' ? 'inactive' : 'active',
                }),
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || 'Failed to create user')
                return
            }

            toast.success('User created successfully')
            setFormData({
                email: '',
                password: '',
                confirm_password: '',
                role_id: '',
                department_id: '',
                team_id: '',
                status: 'active',
                // agency_id: 2,
                first_name: '',
                last_name: '',
                bio: '',
                date_of_joining: '',
                hourly_rate: '',
                job_title: ''
            })
            // navigate('/users')
        } catch (err) {
            toast.error('Server error while creating user')
            console.error(err)
        } finally {

            setLoading(false)
        }
    }

    return (
        <>
            <PageHeader>
                <UsersCreateHeader
                    loading={loading}
                    onCreate={() => handleSubmit('create')}
                    onDraft={() => handleSubmit('draft')}
                />
            </PageHeader>

            <div className="main-content">
                <UsersCreateContent
                    formData={formData}
                    roles={roles}
                    rolesLoading={rolesLoading}
                    departments={departments}
                    departmentsLoading={departmentsLoading}
                    teams={teams}
                    teamsLoading={teamsLoading}
                    onChange={handleChange}
                />
            </div>
            <Footer />
        </>
    )
}

export default UsersCreate
