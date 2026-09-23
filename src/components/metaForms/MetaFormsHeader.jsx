import React from 'react';
import { FiRefreshCw, FiFacebook, FiPlus } from 'react-icons/fi';

const MetaFormsHeader = ({
    loading,
    formCount,
    onRefresh,
    onCreateForm,
}) => {
    return (
        <div className="d-flex align-items-center justify-content-between w-100">

            {/* ================= TITLE ================= */}
            <div>
                <h5 className="mb-1">
                    Facebook Lead Forms
                </h5>

                <p className="fs-12 text-muted mb-0">
                    Manage lead forms connected to your Facebook Page
                </p>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="d-flex align-items-center gap-2">

                {/* Total Forms */}
                <span className="badge bg-soft-primary text-primary px-3 py-2">
                    {formCount} Forms
                </span>

                {/* Create Form */}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onCreateForm}
                >
                    <FiPlus size={16} className="me-2" />
                    Create Meta Form
                </button>

                {/* Refresh */}
                <button
                    type="button"
                    className="btn btn-light-brand"
                    disabled={loading}
                    onClick={onRefresh}
                >
                    <FiRefreshCw
                        size={16}
                        className={`me-2 ${loading ? 'spin' : ''}`}
                    />

                    Refresh
                </button>

            </div>
        </div>
    );
};

export default MetaFormsHeader;