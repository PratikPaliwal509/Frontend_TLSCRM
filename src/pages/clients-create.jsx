
import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ClientsCreateHeader from '@/components/clientsViewCreate/ClientsCreateHeader'
import ClientsCreateContent from '@/components/clientsViewCreate/ClientsCreateContent'

import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
// import { c } from 'vite/dist/node/types.d-aGj9QkWt'
// import { add } from 'date-fns'
const ClientsCreate = () => {
    const [agencies, setAgencies] = useState([])
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
    /* ================= FETCH AGENCIES ================= */
    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const token = localStorage.getItem('token') // use correct key

                const response = await fetch('http://localhost:5000/api/agencies', {
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
        try {
            setLoading(true)

            const token = localStorage.getItem('token') // use correct key
            const response = await fetch('http://localhost:5000/api/clients', {
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
            console.log("formdata" + JSON.stringify(formData))
            setFormData({
                agency_id: '',
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
                throw errorData
            }

            const data = await response.json()

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
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    )
}

export default ClientsCreate
