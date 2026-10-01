import React from 'react';
import { FiRefreshCw, FiPlus, FiFileText } from 'react-icons/fi';

const MetaPostsHeader = ({
    loading,
    postCount,
    onRefresh,
    onCreatePost,
    onGenerateReport,
}) => {
    return (
        <div className="d-flex align-items-center justify-content-between w-100">

            {/* ================= TITLE ================= */}
            <div>
                <h5 className="mb-1">
                    Facebook Posts
                </h5>

                <p className="fs-12 text-muted mb-0">
                    Manage all posts published on your Facebook Page
                </p>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

                <span className="badge bg-soft-primary text-primary px-3 py-2">
                    {postCount} Posts
                </span>

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

                {/* Generate Report */}
                <button
                    type="button"
                    className="btn btn-light-brand"
                    disabled={loading}
                    onClick={onGenerateReport}
                >
                    <FiFileText size={16} className="me-2" />
                    Generate Report
                </button>

                {/* Create Post */}
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={onCreatePost}
                >
                    <FiPlus size={16} className="me-2" />
                    Create Post
                </button>

            </div>
        </div>
    );
};

export default MetaPostsHeader;