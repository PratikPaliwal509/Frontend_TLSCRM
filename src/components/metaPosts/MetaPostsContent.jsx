
import React, { useState } from 'react';
import {
    FiExternalLink,
    FiTrash2,
    FiClock,
    FiFacebook,
    FiFileText,
} from 'react-icons/fi';

const MetaPostsContent = ({
    posts,
    loading,
    deletingId,
    onDelete,
}) => {
    const [expandedPosts, setExpandedPosts] = useState({});

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

    /* ================= TOGGLE MESSAGE ================= */
    const toggleMessage = (postId) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    /* ================= LOADING ================= */
    if (loading && posts.length === 0) {
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
    if (!loading && posts.length === 0) {
        return (
            <div className="col-12">
                <div className="card stretch stretch-full">
                    <div className="card-body text-center py-5">

                        <div className="mb-3">
                            <FiFacebook
                                size={50}
                                className="text-muted"
                            />
                        </div>

                        <h5 className="mb-2">
                            No Facebook Posts Found
                        </h5>

                        <p className="text-muted mb-0">
                            No posts are currently available for the
                            connected Facebook Page.
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
            {/* <div className="card stretch stretch-full mb-4"> */}

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
                                Facebook Page
                            </p>
                        </div>

                        <div className="ms-auto text-end">
                            <h5 className="mb-0">
                                {posts.length}
                            </h5>

                            <span className="fs-12 text-muted">
                                Total Posts
                            </span>
                        </div>

                    </div>

                </div>

            </div>

            {/* ================= POSTS GRID ================= */}
            <div className="row">

                {posts.map((post) => {

                    const isExpanded = expandedPosts[post.id];

                    const message = post.message || 'No caption available';

                    const shouldShowReadMore =
                        message.length > 220;

                    return (
                        <div
                            className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 mb-4"
                            key={post.id}
                        >

                            <div className="card stretch stretch-full h-100 overflow-hidden">

                                {/* ================= IMAGE ================= */}
                                <div
                                    className="position-relative"
                                    style={{
                                        background: '#f5f5f5',
                                    }}
                                >

                                    {post.full_picture ? (
                                        <img
                                            src={post.full_picture}
                                            alt="Facebook post"
                                            className="w-100"
                                            style={{
                                                height: '260px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                height: '260px',
                                            }}
                                        >
                                            <FiFileText
                                                size={50}
                                                className="text-muted"
                                            />
                                        </div>
                                    )}

                                    {/* Facebook badge */}
                                    <span
                                        className="position-absolute top-0 end-0 m-3 badge bg-primary"
                                    >
                                        <FiFacebook
                                            size={12}
                                            className="me-1"
                                        />

                                        Facebook
                                    </span>

                                </div>

                                {/* ================= BODY ================= */}
                                <div className="card-body">

                                    {/* DATE */}
                                    <div className="d-flex align-items-center mb-3">

                                        <FiClock
                                            size={14}
                                            className="text-muted me-2"
                                        />

                                        <span className="fs-12 text-muted">
                                            {formatDate(
                                                post.created_time
                                            )}
                                        </span>

                                    </div>

                                    {/* MESSAGE */}
                                    <div className="mb-3">

                                        <p
                                            className="fs-13 text-dark mb-0"
                                            style={{
                                                whiteSpace: 'pre-line',
                                                lineHeight: '1.6',
                                                display:
                                                    !shouldShowReadMore ||
                                                    isExpanded
                                                        ? 'block'
                                                        : '-webkit-box',
                                                WebkitLineClamp:
                                                    !isExpanded
                                                        ? 6
                                                        : 'unset',
                                                WebkitBoxOrient:
                                                    'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {message}
                                        </p>

                                        {shouldShowReadMore && (
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 mt-2 fs-12 text-decoration-none"
                                                onClick={() =>
                                                    toggleMessage(
                                                        post.id
                                                    )
                                                }
                                            >
                                                {isExpanded
                                                    ? 'Show Less'
                                                    : 'Read More'}
                                            </button>
                                        )}

                                    </div>

                                    {/* POST ID */}
                                    <div className="bg-light rounded p-2">

                                        <span className="fs-11 text-muted d-block mb-1">
                                            POST ID
                                        </span>

                                        <span
                                            className="fs-11 text-dark d-block"
                                            style={{
                                                wordBreak: 'break-all',
                                            }}
                                        >
                                            {post.id}
                                        </span>

                                    </div>

                                </div>

                                {/* ================= FOOTER ================= */}
                                <div className="card-footer bg-white border-top">

                                    <div className="d-flex align-items-center gap-2">

                                        {/* View Facebook */}
                                        {post.permalink_url && (
                                            <a
                                                href={post.permalink_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-light-brand flex-grow-1"
                                            >
                                                <FiExternalLink
                                                    size={14}
                                                    className="me-2"
                                                />

                                                View Post
                                            </a>
                                        )}

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            className="btn btn-light-danger"
                                            disabled={
                                                deletingId === post.id
                                            }
                                            onClick={() =>
                                                onDelete(post.id)
                                            }
                                            title="Delete Post"
                                        >
                                            {deletingId === post.id ? (
                                                <span
                                                    className="spinner-border spinner-border-sm"
                                                    role="status"
                                                ></span>
                                            ) : (
                                                <FiTrash2 size={16} />
                                            )}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default MetaPostsContent;
