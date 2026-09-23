import React, { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams,
    useLocation,
} from 'react-router-dom';

import PageHeader from '../components/shared/pageHeader/PageHeader';
import Footer from '../components/shared/Footer';

import MetaLeadsHeader from '../components/metaForms/MetaLeadsHeader';
import MetaLeadsContent from '../components/metaForms/MetaLeadsContent';

import { toast } from 'react-toastify';

const MetaFormLeads = () => {

    const navigate = useNavigate();

    const { formId } = useParams();

    const location = useLocation();

    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ================= FORM DETAILS ================= */

    const formName =
        location.state?.formName || 'Facebook Leads';

    /* ================= FETCH LEADS ================= */

    const fetchLeads = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem('token');

            const response = await fetch(
                `https://api-0ggv.onrender.com/api/meta-leads/forms/${encodeURIComponent(formId)}/leads`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {

                throw new Error(
                    `HTTP error! Status: ${response.status}`
                );

            }

            const result = await response.json();

            if (!result.success) {

                throw new Error(
                    result.message ||
                    'Failed to fetch Facebook leads'
                );

            }

            /*
             * Expected:
             *
             * {
             *   success: true,
             *   data: {
             *      data: [...]
             *   }
             * }
             */

            setLeads(
                result.data?.data || []
            );

        } catch (error) {

            console.error(
                'Facebook leads fetch error:',
                error
            );

            toast.error(
                error.message ||
                'Failed to fetch Facebook leads'
            );

        } finally {

            setLoading(false);

        }

    };

    /* ================= FETCH ON FORM CHANGE ================= */

    useEffect(() => {

        if (formId) {
            fetchLeads();
        }

    }, [formId]);

    /* ================= BACK ================= */

    const handleBack = () => {

        navigate('/meta/forms');

    };

    return (
        <>
            {/* ================= PAGE HEADER ================= */}

            <PageHeader>

                <MetaLeadsHeader
                    loading={loading}
                    leadCount={leads.length}
                    formName={formName}
                    onBack={handleBack}
                    onRefresh={fetchLeads}
                />

            </PageHeader>

            {/* ================= MAIN CONTENT ================= */}

            <div className="main-content">

                <div
                    className="row"
                    style={{ minHeight: '60vh' }}
                >

                    <MetaLeadsContent
                        leads={leads}
                        loading={loading}
                    />

                </div>

            </div>

            <Footer />
        </>
    );
};

export default MetaFormLeads;