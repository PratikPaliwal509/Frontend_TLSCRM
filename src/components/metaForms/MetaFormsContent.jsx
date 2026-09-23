import React from 'react';
import {
    FiFacebook,
    FiFileText,
    FiClock,
    FiChevronRight,
} from 'react-icons/fi';

const MetaFormsContent = ({
    forms,
    loading,
    onFormClick,
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

    /* ================= LOADING ================= */
    if (loading && forms.length === 0) {
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
    if (!loading && forms.length === 0) {
        return (
            <div className="col-12">
                <div className="card stretch stretch-full">
                    <div className="card-body text-center py-5">

                        <div className="mb-3">
                            <FiFileText
                                size={50}
                                className="text-muted"
                            />
                        </div>

                        <h5 className="mb-2">
                            No Lead Forms Found
                        </h5>

                        <p className="text-muted mb-0">
                            No Facebook lead forms are currently available.
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="col-12">

            {/* ================= PAGE SUMMARY ================= */}
            <div className="card mb-4">
                <div className="card-body">

                    <div className="d-flex align-items-center">

                        <div
                            className="avatar-text avatar-md bg-soft-primary text-primary me-3"
                        >
                            <FiFacebook size={20} />
                        </div>

                        <div>
                            <h6 className="mb-1">
                                TechLeela Solutions Pvt. Ltd.
                            </h6>

                            <p className="fs-12 text-muted mb-0">
                                Facebook Lead Forms
                            </p>
                        </div>

                        <div className="ms-auto text-end">
                            <h5 className="mb-0">
                                {forms.length}
                            </h5>

                            <span className="fs-12 text-muted">
                                Total Forms
                            </span>
                        </div>

                    </div>

                </div>
            </div>

            {/* ================= FORMS GRID ================= */}
            <div className="row">

                {forms.map((form) => (

                    <div
                        className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 mb-4"
                        key={form.id}
                    >

                        <div
                            className="card stretch stretch-full h-100"
                        >

                            {/* ================= CARD BODY ================= */}
                            <div className="card-body">

                                {/* Icon + Status */}
                                <div className="d-flex align-items-start mb-4">

                                    <div
                                        className="avatar-text avatar-md bg-soft-primary text-primary me-3"
                                    >
                                        <FiFileText size={20} />
                                    </div>

                                    <div className="flex-grow-1">

                                        <h6
                                            className="mb-1"
                                            style={{
                                                wordBreak: 'break-word',
                                            }}
                                        >
                                            {form.name || 'Untitled Form'}
                                        </h6>

                                        <span
                                            className={`badge ${
                                                form.status === 'ACTIVE'
                                                    ? 'bg-soft-success text-success'
                                                    : 'bg-soft-secondary text-secondary'
                                            }`}
                                        >
                                            {form.status}
                                        </span>

                                    </div>

                                </div>

                                {/* Created Date */}
                                <div className="d-flex align-items-center mb-3">

                                    <FiClock
                                        size={14}
                                        className="text-muted me-2"
                                    />

                                    <span className="fs-12 text-muted">
                                        Created {formatDate(form.created_time)}
                                    </span>

                                </div>

                                {/* Form ID */}
                                <div className="bg-light rounded p-2">

                                    <span className="fs-11 text-muted d-block mb-1">
                                        FORM ID
                                    </span>

                                    <span
                                        className="fs-11 text-dark d-block"
                                        style={{
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        {form.id}
                                    </span>

                                </div>

                            </div>

                            {/* ================= FOOTER ================= */}
                            <div className="card-footer bg-white border-top">

                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={() => onFormClick(form)}
                                >
                                    View Leads

                                    <FiChevronRight
                                        size={16}
                                        className="ms-2"
                                    />
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MetaFormsContent;