import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../components/shared/pageHeader/PageHeader';
import Footer from '../components/shared/Footer';

import MetaFormsHeader from '../components/metaForms/MetaFormsHeader';
import MetaFormsContent from '../components/metaForms/MetaFormsContent';
import CreateMetaFormModal from '../components/metaForms/CreateMetaFormModal';

import { toast } from 'react-toastify';

const MetaForms = () => {

    const navigate = useNavigate();

    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    /* ================= FETCH FORMS ================= */

    const fetchForms = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem('token');

            const response = await fetch(
                'https://api-0ggv.onrender.com/api/meta-leads/forms',
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
                    'Failed to fetch Facebook forms'
                );
            }

            setForms(result.data?.data || []);

        } catch (error) {

            console.error(
                'Facebook forms fetch error:',
                error
            );

            toast.error(
                error.message ||
                'Failed to fetch Facebook forms'
            );

        } finally {

            setLoading(false);

        }

    };

    /* ================= INITIAL FETCH ================= */

    useEffect(() => {
        fetchForms();
    }, []);

    /* ================= FORM CREATED ================= */

    const handleFormCreated = (createdForm) => {

        toast.success(
            'Facebook lead form created successfully!'
        );

        /*
         * Refresh forms from Meta so the newly
         * created form appears in the list.
         */

        fetchForms();

    };

    /* ================= OPEN FORM ================= */

    const handleFormClick = (form) => {

        navigate(
            `/meta/forms/${encodeURIComponent(form.id)}/leads`,
            {
                state: {
                    formName: form.name,
                    formStatus: form.status,
                },
            }
        );

    };

    return (
        <>
            {/* ================= PAGE HEADER ================= */}

            <PageHeader>

                <MetaFormsHeader
                    loading={loading}
                    formCount={forms.length}
                    onRefresh={fetchForms}
                    onCreateForm={() =>
                        setShowCreateModal(true)
                    }
                />

            </PageHeader>

            {/* ================= MAIN CONTENT ================= */}

            <div className="main-content">

                <div
                    className="row"
                    style={{ minHeight: '60vh' }}
                >

                    <MetaFormsContent
                        forms={forms}
                        loading={loading}
                        onFormClick={handleFormClick}
                    />

                </div>

            </div>

            <Footer />

            {/* ================= CREATE FORM MODAL ================= */}

            <CreateMetaFormModal
                show={showCreateModal}
                onClose={() =>
                    setShowCreateModal(false)
                }
                onSuccess={handleFormCreated}
            />

        </>
    );
};

export default MetaForms;