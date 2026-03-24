
import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ClientsCreateHeader from '@/components/clientsViewCreate/ClientsCreateHeader'
import ClientsCreateContent from '@/components/clientsViewCreate/ClientsCreateContent'
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer';
// import { c } from 'vite/dist/node/types.d-aGj9QkWt'
// import { add } from 'date-fns'
const ClientsCreate = () => {
    const [agencies, setAgencies] = useState([])
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(true);

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        agency_id: '',
        company_name: '',
        industry: '',
        company_size: '',
        website: '',
        primary_contact_name: '',
        primary_contact_email: '',
        primary_contact_phone: '',
        billing_email: '',
        country: '',
        state: '',
        city: '',
        postal_code: '',
        address: '',
        billing_address: '',
        notes: '',
        brand_colors: {},              // 👈 IMPORTANT
        brand_guidelines_url: '',
        status: 'active',
        tax_id: '',
    })


    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('clients', 'create', navigate);
        };
        checkPermission();
    }, []);
    /* ================= FETCH Users ================= */
    useEffect(() => {
        const fetchUsers = async () => {
            setUsersLoading(true);
            try {
                const token = localStorage.getItem('token')

                const response = await fetch('https://api-0ggv.onrender.com/api/users/client-portal-users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) throw new Error('Failed to fetch users')

                const data = await response.json()
                setUsers(data.data || [])
            } catch (error) {
                console.error('Users fetch error', error)
            } finally {
                setUsersLoading(false);
            }
        }

        fetchUsers()
    }, [])

    /* ================= FETCH AGENCIES ================= */
    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const token = localStorage.getItem('token') // use correct key

                const response = await fetch('https://api-0ggv.onrender.com/api/agencies', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                setAgencies(data || [])

            } catch (error) {
                console.error('Agency fetch error', error)
            }
        }

        fetchAgencies()
    }, [])

    /* ================= HANDLE INPUT ================= */
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    /* ================= CREATE CLIENT ================= */
    const handleSubmit = async (type = 'create') => {
        if (!formData.company_name?.trim()) {
            toast.error('Company Name is required');
            return false;
        }

        // if (!formData.portal_user_id) {
        //     toast.error('Portal User is required');
        //     return false;
        // }

        if (!formData.primary_contact_name?.trim()) {
            toast.error('Primary Contact Name is required');
            return false;
        }

        if (!formData.primary_contact_email?.trim()) {
            toast.error('Primary Contact Email is required');
            return false;
        }
        try {
            setLoading(true)

            const token = localStorage.getItem('token') // use correct key
            const response = await fetch('https://api-0ggv.onrender.com/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    status: type === 'draft' ? 'inactive' : 'active',
                }),
            })
            setFormData({
                agency_id: '',
                portal_user_id: '',
                company_name: '',
                industry: '',
                company_size: '',
                website: '',
                primary_contact_name: '',
                primary_contact_email: '',
                primary_contact_phone: '',
                country: '',
                state: '',
                city: '',
                address: '',
                postal_code: '',
                notes: '',
                status: 'active',
                tax_id: '',
                billing_address: '',
                brand_guidelines_url: '',
            })
            if (!response.ok) {
                const errorData = await response.json()
                toast.error("Something went wrong")
                throw new Error(errorData?.message || 'Something went wrong')
            }

            const data = await response.json()
            console.log(data)
            const clientId = data?.data?.id;

            // ✅ SUCCESS TOAST
            toast.success('Client created successfully');
            navigate(`/clients/view/${clientId}`) // or your listing page
        } catch (error) {
            console.error('Create client error', error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            <PageHeader>
                <ClientsCreateHeader
                    loading={loading}
                    onCreate={() => handleSubmit('create')}
                    onDraft={() => handleSubmit('draft')}
                />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <ClientsCreateContent
                        formData={formData}
                        agencies={agencies}
                        users={users}
                        onChange={handleChange}
                        usersLoading={usersLoading}
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ClientsCreate
