import React from 'react';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiUsers,
} from 'react-icons/fi';

const MetaLeadsContent = ({
    leads,
    loading,
}) => {

    /* ================= FORMAT DATE ================= */

    const formatDate = (date) => {

        if (!date) return '-';

        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    };

    /* ================= FORMAT FIELD NAME ================= */

    const formatFieldName = (name) => {

        if (!name) return '-';

        return name
            .replace(/_/g, ' ')
            .replace(/\?/g, '')
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );

    };

    /* ================= GET FIELD ================= */

    const getFieldValue = (lead, fieldName) => {

        const field = lead.field_data?.find(
            (item) => item.name === fieldName
        );

        return field?.values?.join(', ') || '-';

    };

    /* ================= LOADING ================= */

    if (loading && leads.length === 0) {

        return (
            <div className="col-12">

                <div className="card stretch stretch-full">

                    <div className="card-body">

                        <div className="d-flex justify-content-center align-items-center py-5">

                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );

    }

    /* ================= EMPTY ================= */

    if (!loading && leads.length === 0) {

        return (
            <div className="col-12">

                <div className="card stretch stretch-full">

                    <div className="card-body text-center py-5">

                        <div className="mb-3">

                            <FiUsers
                                size={50}
                                className="text-muted"
                            />

                        </div>

                        <h5 className="mb-2">
                            No Leads Found
                        </h5>

                        <p className="text-muted mb-0">
                            No leads have been submitted through this form.
                        </p>

                    </div>

                </div>

            </div>
        );

    }

    return (
        <div className="col-12">

            <div className="card stretch stretch-full">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover mb-0">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Lead
                                    </th>

                                    <th>
                                        Contact
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Company
                                    </th>

                                    <th>
                                        Job Title
                                    </th>

                                    <th>
                                        Submitted
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {leads.map((lead, index) => {

                                    const name = getFieldValue(
                                        lead,
                                        'full_name'
                                    );

                                    const email = getFieldValue(
                                        lead,
                                        'email'
                                    );

                                    const phone = getFieldValue(
                                        lead,
                                        'phone_number'
                                    );

                                    const city = getFieldValue(
                                        lead,
                                        'city'
                                    );

                                    const company = getFieldValue(
                                        lead,
                                        'company_name'
                                    );

                                    const jobTitle = getFieldValue(
                                        lead,
                                        'job_title'
                                    );

                                    return (

                                        <tr key={lead.id}>

                                            {/* INDEX */}

                                            <td>
                                                {index + 1}
                                            </td>

                                            {/* LEAD */}

                                            <td>

                                                <div className="d-flex align-items-center">

                                                    <div
                                                        className="avatar-text avatar-sm bg-soft-primary text-primary me-2"
                                                    >
                                                        <FiUser size={14} />
                                                    </div>

                                                    <div>

                                                        <span className="fw-semibold d-block">
                                                            {name}
                                                        </span>

                                                        <span className="fs-11 text-muted">
                                                            ID: {lead.id}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* CONTACT */}

                                            <td>

                                                <div className="mb-1">

                                                    <FiMail
                                                        size={13}
                                                        className="me-2 text-muted"
                                                    />

                                                    <span className="fs-12">
                                                        {email}
                                                    </span>

                                                </div>

                                                <div>

                                                    <FiPhone
                                                        size={13}
                                                        className="me-2 text-muted"
                                                    />

                                                    <span className="fs-12">
                                                        {phone}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* LOCATION */}

                                            <td>

                                                <FiMapPin
                                                    size={14}
                                                    className="me-2 text-muted"
                                                />

                                                <span className="fs-12">
                                                    {city}
                                                </span>

                                            </td>

                                            {/* COMPANY */}

                                            <td>
                                                <span className="fs-12">
                                                    {company}
                                                </span>
                                            </td>

                                            {/* JOB TITLE */}

                                            <td>
                                                <span className="fs-12">
                                                    {jobTitle}
                                                </span>
                                            </td>

                                            {/* DATE */}

                                            <td>

                                                <div className="d-flex align-items-center">

                                                    <FiCalendar
                                                        size={13}
                                                        className="me-2 text-muted"
                                                    />

                                                    <span className="fs-12">
                                                        {formatDate(
                                                            lead.created_time
                                                        )}
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default MetaLeadsContent;