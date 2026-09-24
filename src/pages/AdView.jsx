import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiEdit3,
    FiExternalLink,
    FiRefreshCw,
} from "react-icons/fi";

import PageHeader from "@/components/shared/pageHeader/PageHeader";

const AdView = () => {
    const { adId } = useParams();
    const navigate = useNavigate();
console.log("Rendering AdView component with adId:", useParams());
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdDetails();
    }, [adId]);

    const fetchAdDetails = async () => {
        try {
            setLoading(true);
            setError("");
console.log("Fetching ad details for adId:", adId);
            const response = await fetch(
                `https://api-0ggv.onrender.com/api/meta-ads/ads/${adId}`
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to fetch ad details"
                );
            }

            setAd(result.data);

        } catch (error) {
            console.error("Fetch Ad Details Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toUpperCase()) {
            case "ACTIVE":
                return "badge bg-soft-success text-success";

            case "PAUSED":
                return "badge bg-soft-warning text-warning";

            case "DELETED":
            case "ARCHIVED":
                return "badge bg-soft-danger text-danger";

            default:
                return "badge bg-soft-secondary text-secondary";
        }
    };

    if (loading) {
        return (
            <>
                <PageHeader>
                    <h5 className="m-b-0">Ad Details</h5>
                </PageHeader>

                <div className="main-content">
                    <div className="card stretch stretch-full">
                        <div className="card-body text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p className="mt-3 mb-0">
                                Loading ad details...
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader>
                    <h5 className="m-b-0">Ad Details</h5>
                </PageHeader>

                <div className="main-content">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <div className="alert alert-danger">
                                <strong>Error:</strong> {error}
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={fetchAdDetails}
                            >
                                <FiRefreshCw className="me-2" />
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader>
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div>
                        <h5 className="m-b-0">
                            Ad Details
                        </h5>

                        <small className="text-muted">
                            Ad ID: {ad?.id}
                        </small>
                    </div>

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => navigate(-1)}
                        >
                            <FiArrowLeft className="me-2" />
                            Back
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(`/meta-ads/ads/edit/${ad?.id}`)
                            }
                        >
                            <FiEdit3 className="me-2" />
                            Edit
                        </button>

                    </div>
                </div>
            </PageHeader>

            <div className="main-content">

                {/* Basic Information */}
                <div className="card stretch stretch-full mb-4">

                    <div className="card-header">
                        <h5 className="card-title">
                            Ad Information
                        </h5>
                    </div>

                    <div className="card-body">

                        <div className="row g-4">

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Ad Name
                                </label>

                                <h6 className="mb-0">
                                    {ad?.name || "-"}
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Ad ID
                                </label>

                                <h6 className="mb-0">
                                    {ad?.id || "-"}
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Status
                                </label>

                                <div>
                                    <span
                                        className={getStatusClass(
                                            ad?.status
                                        )}
                                    >
                                        {ad?.status || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Effective Status
                                </label>

                                <div>
                                    <span
                                        className={getStatusClass(
                                            ad?.effective_status
                                        )}
                                    >
                                        {ad?.effective_status || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Configured Status
                                </label>

                                <h6 className="mb-0">
                                    {ad?.configured_status || "-"}
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Created At
                                </label>

                                <h6 className="mb-0">
                                    {ad?.created_time
                                        ? new Date(
                                              ad.created_time
                                          ).toLocaleString()
                                        : "-"}
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Updated At
                                </label>

                                <h6 className="mb-0">
                                    {ad?.updated_time
                                        ? new Date(
                                              ad.updated_time
                                          ).toLocaleString()
                                        : "-"}
                                </h6>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Campaign / Ad Set */}
                <div className="card stretch stretch-full mb-4">

                    <div className="card-header">
                        <h5 className="card-title">
                            Campaign & Ad Set
                        </h5>
                    </div>

                    <div className="card-body">

                        <div className="row g-4">

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Campaign ID
                                </label>

                                <h6 className="mb-0">
                                    {ad?.campaign_id || "-"}
                                </h6>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-muted">
                                    Ad Set ID
                                </label>

                                <h6 className="mb-0">
                                    {ad?.adset_id || "-"}
                                </h6>
                            </div>

                        </div>

                    </div>
                </div>

                {/* Creative */}
                <div className="card stretch stretch-full mb-4">

                    <div className="card-header d-flex align-items-center justify-content-between">

                        <h5 className="card-title mb-0">
                            Creative
                        </h5>

                        {ad?.creative?.id && (
                            <button
                                type="button"
                                className="btn btn-sm btn-light"
                                onClick={() =>
                                    navigate(
                                        `/meta-ads/creatives/view/${ad.creative.id}`
                                    )
                                }
                            >
                                <FiExternalLink className="me-2" />
                                View Creative
                            </button>
                        )}

                    </div>

                    <div className="card-body">

                        {ad?.creative ? (
                            <div className="row g-4">

                                <div className="col-md-6">
                                    <label className="form-label text-muted">
                                        Creative ID
                                    </label>

                                    <h6 className="mb-0">
                                        {ad.creative.id || "-"}
                                    </h6>
                                </div>

                            </div>
                        ) : (
                            <p className="text-muted mb-0">
                                No creative information available.
                            </p>
                        )}

                    </div>
                </div>

                {/* Raw Data */}
                {/* <div className="card stretch stretch-full">

                    <div className="card-header">
                        <h5 className="card-title">
                            API Response
                        </h5>
                    </div>

                    <div className="card-body">

                        <pre
                            className="mb-0"
                            style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {JSON.stringify(ad, null, 2)}
                        </pre>

                    </div>

                </div> */}

            </div>
        </>
    );
};

export default AdView;