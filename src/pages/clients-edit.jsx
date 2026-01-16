import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import ClientsEditHeader from '@/components/clientsViewCreate/ClientsEditHeader';
import ClientsCreateContent from '@/components/clientsViewCreate/ClientsCreateContent';
import ClientsEditContent from '@/components/clientsViewCreate/ClientsEditContent';
import Swal from 'sweetalert2';
import { verifyPagePermission } from '@/utils/verifyPagePermission'

const ClientEdit = () => {
    const { id } = useParams(); // get client id from route
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(false);
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
        country: '',
        status: 'active',
    });

    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('clients', 'edit', navigate);
        };
        checkPermission();
    }, []);
    /* ================= FETCH AGENCIES ================= */
    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/agencies', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setAgencies(data || []);
            } catch (error) {
                console.error('Agency fetch error', error);
            }
        };

        fetchAgencies();
    }, []);

    /* ================= FETCH CLIENT DATA ================= */
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/clients/client/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();

                setFormData({
                    agency_id: data.data.agency_id || '',
                    company_name: data.data.company_name || '',
                    industry: data.data.industry || '',
                    company_size: data.data.company_size || '',
                    website: data.data.website || '',
                    primary_contact_name: data.data.primary_contact_name || '',
                    primary_contact_email: data.data.primary_contact_email || '',
                    primary_contact_phone: data.data.primary_contact_phone || '',
                    country: data.data.country || '',
                    status: data.data.status || 'active',
                });
            } catch (error) {
                console.error('Client fetch error', error);
            }
        };

        fetchClient();
    }, [id]);

    /* ================= HANDLE INPUT ================= */
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* ================= UPDATE CLIENT ================= */
    const handleUpdate = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData;
            }

            const data = await response.json();
            await Swal.fire({
                icon: 'success',
                title: 'Client Updated',
                text: 'Client details updated successfully.',
                confirmButtonText: 'OK',
            });

            // ✅ REDIRECT TO PREVIOUS PAGE
            navigate(-1);

        } catch (error) {
            console.error('Update client error', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHeader>
                <ClientsEditHeader
                    loading={loading}
                    onUpdate={handleUpdate}
                />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <ClientsEditContent
                        formData={formData}
                        agencies={agencies}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    );
};

export default ClientEdit;
