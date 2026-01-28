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

    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [departments, setDepartments] = useState([])
    const [teams, setTeams] = useState([])

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role_id: '',
        department_id: '',
        team_id: '',
        status: 'active',
        agency_id: 2,
        first_name: '',
        last_name: '',
    })

    /* ================= PERMISSION ================= */
    useEffect(() => {
        verifyPagePermission('users', 'create', navigate)
    }, [])

    /* ================= FETCH DEPARTMENTS ================= */
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:5000/api/roles', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const result = await res.json()
                setRoles(result.data || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchRoles()
    }, [])
    /* ================= FETCH DEPARTMENTS ================= */
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:5000/api/departments', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setDepartments(data.data || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchDepartments()
    }, [])

    /* ================= FETCH TEAMS (based on department) ================= */
    useEffect(() => {
        if (!formData.department_id) return

        const fetchTeams = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(
                    `http://localhost:5000/api/teams/`,
                    // `http://localhost:5000/api/teams?department_id=${formData.department_id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const data = await res.json()
                setTeams(data.data || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchTeams()
    }, [formData.department_id])

    /* ================= CHANGE ================= */
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    /* ================= SUBMIT ================= */
    const handleSubmit = async (type = 'create') => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')

            await fetch('http://localhost:5000/api/users/users', {
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
            setFormData({
                email: '',
                password: '',
                role_id: '',
                department_id: '',
                team_id: '',
                status: 'active',
                agency_id: 2,
                first_name: '',
                last_name: '',
            })
            //   toast.success('User created successfully')
            // navigate('/users')
        } catch (err) {
            toast.error('Failed to create user')
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
                    departments={departments}
                    teams={teams}
                    onChange={handleChange}
                />
            </div>
            <Footer/>
        </>
    )
}

export default UsersCreate
