import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import { FiArrowLeft, FiEdit, FiImage, FiVideo } from "react-icons/fi";
import { toast } from "react-toastify";
import CreativesHeader from "@/components/metaAds/CreativesHeader";
import Footer from "@/components/shared/Footer";

const CreativeView = () => {
    const { creativeId, adId } = useParams();
    const navigate = useNavigate();

    const [creative, setCreative] = useState(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {
    console.log("Creative ID:", creativeId);

    if (creativeId) {
        fetchCreative();
    } else {
        setLoading(false);
    }
}, [creativeId]);

  const fetchCreative = async () => {
    try {
        setLoading(true);

        const url = `https://api-0ggv.onrender.com/api/meta-ads/creatives/${creativeId}`;

        console.log("1. Fetching creative:", url);

        const response = await fetch(url);

        console.log("2. Response received:", response.status);

        const text = await response.text();

        console.log("3. Raw response:", text);

        let result;

        try {
            result = JSON.parse(text);
        } catch (parseError) {
            throw new Error(
                `Invalid JSON response from server: ${text}`
            );
        }

        console.log("4. Creative response:", result);

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Failed to fetch creative"
            );
        }

        setCreative(result.data);

    } catch (error) {
        console.error("Fetch Creative Error:", error);

        toast.error(
            error.message || "Failed to fetch creative"
        );

        setCreative(null);

    } finally {
        console.log("5. Loading finished");
        setLoading(false);
    }
};

    const getImageUrl = () => {
        if (!creative) return null;

        return (
            creative.image_url ||
            creative.thumbnail_url ||
            creative.object_story_spec?.link_data?.picture ||
            creative.object_story_spec?.video_data?.image_url ||
            null
        );
    };

    const getBody = () => {
        if (!creative) return "";

        return (
            creative.body ||
            creative.object_story_spec?.link_data?.message ||
            creative.object_story_spec?.video_data?.message ||
            ""
        );
    };

    const getTitle = () => {
        if (!creative) return "";

        return (
            creative.title ||
            creative.object_story_spec?.link_data?.name ||
            creative.object_story_spec?.video_data?.title ||
            ""
        );
    };

    if (loading) {
        return (
            <>
                <PageHeader>
                    <h5 className="m-0">
                        Creative Details
                    </h5>
                </PageHeader>

                <div className="main-content">
                    <div className="container-fluid">
                        <div className="card">
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
                                    Loading creative...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!creative) {
        return (
            <>
                <PageHeader>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={() =>
                                navigate(-1)
                            }
                        >
                            <FiArrowLeft />
                        </button>

                        <h5 className="m-0">
                            Creative Details
                        </h5>
                    </div>
                </PageHeader>

                <div className="main-content">
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <h6>
                                    Creative not found
                                </h6>

                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() =>
                                        navigate(-1)
                                    }
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const imageUrl = getImageUrl();
    const body = getBody();
    const title = getTitle();

    return (
        <>
           <PageHeader>
    <div className="d-flex align-items-center justify-content-between w-100">

        {/* <div className="d-flex align-items-center gap-2">

            <button
                type="button"
                className="btn btn-light"
                onClick={() => navigate(-1)}
            >
                <FiArrowLeft />
            </button>

            <div>
                <h5 className="m-0">
                    Creative Details
                </h5>

                <small className="text-muted">
                    {creative?.name || "Creative"}
                </small>
            </div>

        </div> */}

        <CreativesHeader
            adId={
                adId ||
                creative?.ad_id ||
                creative?.adId ||
                creative?.ad?.id
            }
        />

    </div>
</PageHeader>
            <div className="main-content">
                <div className="container-fluid">

                    {/* Basic Details */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                Creative Information
                            </h6>
                        </div>

                        <div className="card-body">
                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">
                                        Creative ID
                                    </label>

                                    <div className="fw-semibold">
                                        {creative.id || "-"}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">
                                        Name
                                    </label>

                                    <div className="fw-semibold">
                                        {creative.name || "-"}
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">
                                        Status
                                    </label>

                                    <div>
                                        <span
                                            className={`badge ${
                                                creative.status ===
                                                "ACTIVE"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                            }`}
                                        >
                                            {creative.status ||
                                                "UNKNOWN"}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-muted">
                                        Created Time
                                    </label>

                                    <div>
                                        {creative.created_time
                                            ? new Date(
                                                  creative.created_time
                                              ).toLocaleString()
                                            : "-"}
                                    </div>
                                </div>

                                {creative.updated_time && (
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-muted">
                                            Updated Time
                                        </label>

                                        <div>
                                            {new Date(
                                                creative.updated_time
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                )}

                                {creative.video_id && (
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-muted">
                                            Video ID
                                        </label>

                                        <div>
                                            {creative.video_id}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        {/* Creative Preview */}
                        <div className="col-lg-7 mb-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h6 className="mb-0">
                                        Creative Preview
                                    </h6>
                                </div>

                                <div className="card-body">

                                    {imageUrl ? (
                                        <div className="text-center mb-4">
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    creative.name ||
                                                    "Creative"
                                                }
                                                className="img-fluid rounded"
                                                style={{
                                                    maxHeight:
                                                        "450px",
                                                    objectFit:
                                                        "contain"
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-5 text-muted">
                                            <FiImage
                                                size={45}
                                            />

                                            <p className="mt-2">
                                                No image preview
                                                available
                                            </p>
                                        </div>
                                    )}

                                    {title && (
                                        <div className="mb-3">
                                            <label className="form-label text-muted">
                                                Title
                                            </label>

                                            <h6>
                                                {title}
                                            </h6>
                                        </div>
                                    )}

                                    {body && (
                                        <div>
                                            <label className="form-label text-muted">
                                                Primary Text
                                            </label>

                                            <p className="mb-0">
                                                {body}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Creative Data */}
                        <div className="col-lg-5 mb-4">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h6 className="mb-0">
                                        Creative Data
                                    </h6>
                                </div>

                                <div className="card-body">

                                    <div className="mb-4">
                                        <label className="form-label text-muted">
                                            Image URL
                                        </label>

                                        {creative.image_url ? (
                                            <a
                                                href={
                                                    creative.image_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-break"
                                            >
                                                {creative.image_url}
                                            </a>
                                        ) : (
                                            <div>
                                                -
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-muted">
                                            Thumbnail URL
                                        </label>

                                        {creative.thumbnail_url ? (
                                            <a
                                                href={
                                                    creative.thumbnail_url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-break"
                                            >
                                                {
                                                    creative.thumbnail_url
                                                }
                                            </a>
                                        ) : (
                                            <div>
                                                -
                                            </div>
                                        )}
                                    </div>

                                    {creative.video_id && (
                                        <div className="mb-4">
                                            <label className="form-label text-muted">
                                                Video
                                            </label>

                                            <div className="d-flex align-items-center gap-2">
                                                <FiVideo />

                                                <span>
                                                    {
                                                        creative.video_id
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="form-label text-muted">
                                            Creative Type
                                        </label>

                                        <div>
                                            {creative.video_id
                                                ? "Video"
                                                : imageUrl
                                                ? "Image"
                                                : "Other"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Object Story Spec */}
                    {/* {creative.object_story_spec && (
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="mb-0">
                                    Object Story Specification
                                </h6>
                            </div>

                            <div className="card-body">
                                <pre
                                    className="bg-light p-3 rounded mb-0"
                                    style={{
                                        maxHeight: "400px",
                                        overflow: "auto",
                                        fontSize: "13px"
                                    }}
                                >
                                    {JSON.stringify(
                                        creative.object_story_spec,
                                        null,
                                        2
                                    )}
                                </pre>
                            </div>
                        </div>
                    )} */}

                </div>
            </div>
            <Footer/>
        </>
    );
};

export default CreativeView;