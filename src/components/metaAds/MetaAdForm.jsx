import React, { useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "https://api-0ggv.onrender.com";

const MetaAdForm = ({
    type,
    initialData = {},
    editId = null
}) => {

    const navigate = useNavigate();

    const {
        campaignId,
        adSetId
    } = useParams();

    // =========================================
    // FORM STATE
    // =========================================

    const [form, setForm] = useState({

        // Common
        name:
            initialData.name ||
            "",

        status:
            initialData.status ||
            "PAUSED",

        // Campaign
        objective:
            initialData.objective ||
            "",

        // Ad Set
        dailyBudget:
            initialData.dailyBudget ||
            initialData.daily_budget ||
            "",

        optimizationGoal:
            initialData.optimizationGoal ||
            initialData.optimization_goal ||
            "LINK_CLICKS",

        billingEvent:
            initialData.billingEvent ||
            initialData.billing_event ||
            "IMPRESSIONS",

        bidStrategy:
            initialData.bidStrategy ||
            initialData.bid_strategy ||
            "LOWEST_COST_WITHOUT_CAP",

        bidAmount:
            initialData.bidAmount ||
            initialData.bid_amount ||
            "",
        ageMin:
            initialData.ageMin ||
            initialData.age_min ||
            18,

        ageMax:
            initialData.ageMax ||
            initialData.age_max ||
            45,

        country:
            initialData.country ||
            "IN",

        advantageAudience:
            initialData.advantageAudience ??
            0,

        // Ad
        adSetId:
            initialData.adSetId ||
            initialData.adset_id ||
            "",

        creativeId:
            initialData.creativeId ||
            initialData.creative_id ||
            "",

        // Creative
        creativeName:
            initialData.creativeName ||
            "",

        message:
            initialData.message || initialData?.object_story_spec?.link_data?.message ||
            "",

        link:
            initialData.link || initialData?.object_story_spec?.link_data?.link ||
            "",

        imageHash:
            initialData.imageHash ||
            initialData.image_hash ||
            "",

        // New image
        image:
            null
    });

    const [loading, setLoading] =
        useState(false);

    // =========================================
    // HANDLE CHANGE
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value,
            files
        } = e.target;

        if (name === "image") {

            setForm((prev) => ({
                ...prev,
                image:
                    files?.[0] ||
                    null
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================================
    // CREATE IMAGE
    // =========================================

    const createImage = async (token) => {

        if (!form.image) {

            throw new Error(
                "Please select an image"
            );
        }

        const formData =
            new FormData();

        formData.append(
            "image",
            form.image
        );

        const res = await fetch(
            `${API_URL}/api/meta-ads/images`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                },

                body: formData
            }
        );

        const result =
            await res.json();

        console.log(
            "IMAGE RESPONSE:",
            result
        );

        if (!res.ok) {

            throw new Error(
                result.message ||
                "Image upload failed"
            );
        }

        const images =
            result.data?.images;

        const imageHash =
            images
                ? Object.values(images)[0]?.hash
                : null;

        if (!imageHash) {

            throw new Error(
                "Image uploaded but imageHash was not returned"
            );
        }

        return imageHash;
    };

    // =========================================
    // CREATE CREATIVE
    // =========================================

    const createCreative = async (
        token,
        imageHash
    ) => {

        const creativeData = {

            name:
                form.creativeName ||
                `${form.name} Creative`,

            message:
                form.message,

            imageHash:
                imageHash,

            link:
                form.link
        };

        console.log(
            "CREATIVE REQUEST:",
            creativeData
        );

        const res = await fetch(
            `${API_URL}/api/meta-ads/creatives`,
            {
                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        creativeData
                    )
            }
        );

        const result =
            await res.json();

        console.log(
            "CREATIVE RESPONSE:",
            result
        );

        if (!res.ok) {

            throw new Error(
                result.message ||
                "Creative creation failed"
            );
        }

        const creativeId =
            result.data?.id ||
            result.data?.creativeId ||
            result.creativeId ||
            result.id;

        if (!creativeId) {

            throw new Error(
                "Creative created but creativeId was not returned"
            );
        }

        return creativeId;
    };

    // =========================================
    // CREATE AD
    // =========================================

    const createAd = async (
        token,
        creativeId
    ) => {

        const actualAdSetId =
            adSetId ||
            form.adSetId;

        if (!actualAdSetId) {

            throw new Error(
                "Ad Set ID is missing"
            );
        }

        const adData = {

            name:
                form.name,

            adSetId:
                actualAdSetId,

            creativeId:
                creativeId,

            status:
                form.status
        };

        console.log(
            "AD REQUEST:",
            adData
        );

        const res = await fetch(
            `${API_URL}/api/meta-ads/ads`,
            {
                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        adData
                    )
            }
        );

        const result =
            await res.json();

        console.log(
            "AD RESPONSE:",
            result
        );

        if (!res.ok) {

            throw new Error(
                result.message ||
                "Ad creation failed"
            );
        }

        return result;
    };

    // =========================================
    // UPDATE AD
    // =========================================

    const updateAd = async (token) => {

        if (!editId) {

            throw new Error(
                "Ad ID is missing"
            );
        }

        const adData = {

            name:
                form.name,

            status:
                form.status

        };

        console.log(
            "UPDATE AD REQUEST:",
            adData
        );

        const res = await fetch(
            `${API_URL}/api/meta-ads/ads/${editId}`,
            {
                method: "PUT",

                headers: {

                    Authorization:
                        `Bearer ${token}`,

                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        adData
                    )
            }
        );

        const result =
            await res.json();

        console.log(
            "UPDATE AD RESPONSE:",
            result
        );

        if (!res.ok) {

            throw new Error(
                result.message ||
                "Ad update failed"
            );
        }

        return result;
    };

    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const token =
                localStorage.getItem("token");

            // =====================================
            // AD
            // =====================================

            if (type === "ad") {

                // ---------------------------------
                // EDIT AD
                // ---------------------------------

                if (editId) {

                    toast.info(
                        "Updating ad..."
                    );

                    await updateAd(token);

                    toast.success(
                        "Ad updated successfully"
                    );

                    navigate(-1);

                    return;
                }

                // ---------------------------------
                // CREATE AD
                // ---------------------------------

                const actualAdSetId =
                    adSetId ||
                    form.adSetId;

                if (!actualAdSetId) {

                    toast.error(
                        "Ad Set ID is missing"
                    );

                    return;
                }

                // STEP 1
                toast.info(
                    "Uploading image..."
                );

                const imageHash =
                    await createImage(token);

                console.log(
                    "IMAGE HASH:",
                    imageHash
                );

                // STEP 2
                toast.info(
                    "Creating creative..."
                );

                const creativeId =
                    await createCreative(
                        token,
                        imageHash
                    );

                console.log(
                    "CREATIVE ID:",
                    creativeId
                );

                // STEP 3
                toast.info(
                    "Creating ad..."
                );

                await createAd(
                    token,
                    creativeId
                );

                toast.success(
                    "Ad, creative and image created successfully"
                );

                navigate(-1);

                return;
            }

            // =====================================
            // OTHER TYPES
            // =====================================

            let endpoint = "";
            let requestData = {};

            // =====================================
            // CAMPAIGN
            // =====================================

            if (type === "campaign") {

                endpoint = editId
                    ? `/api/meta-ads/campaigns/${editId}`
                    : `/api/meta-ads/campaigns`;

                requestData = {

                    name:
                        form.name,

                    objective:
                        form.objective,

                    status:
                        form.status
                };
            }

            // =====================================
            // AD SET
            // =====================================

            if (type === "adset") {

                if (editId) {

                    endpoint =
                        `/api/meta-ads/adsets/${editId}`;

                } else {

                    if (!campaignId) {

                        toast.error(
                            "Campaign ID is missing from URL"
                        );

                        return;
                    }

                    endpoint =
                        `/api/meta-ads/adsets/${campaignId}`;
                }

                requestData = {

                    name:
                        form.name,

                    dailyBudget:
                        Number(
                            form.dailyBudget
                        ),

                    billingEvent:
                        form.billingEvent,

                    optimizationGoal:
                        form.optimizationGoal,

                    bidStrategy:
                        form.bidStrategy,

                    bidAmount:
                        form.bidAmount
                            ? Number(form.bidAmount)
                            : undefined,

                    targeting: {

                        geo_locations: {

                            countries: [
                                form.country
                            ]
                        },

                        age_min:
                            Number(
                                form.ageMin
                            ),

                        age_max:
                            Number(
                                form.ageMax
                            ),

                        targeting_automation: {

                            advantage_audience:
                                Number(
                                    form.advantageAudience
                                )
                        }
                    },

                    status:
                        form.status
                };
            }

            // =====================================
            // CREATIVE
            // =====================================

            if (type === "creative") {

                endpoint = editId
                    ? `/api/meta-ads/creatives/${editId}`
                    : `/api/meta-ads/creatives`;

                requestData = {

                    name:
                        form.name,

                    message:
                        form.message,

                    imageHash:
                        form.imageHash,

                    link:
                        form.link
                };
            }

            if (!endpoint) {

                throw new Error(
                    "Invalid form type"
                );
            }

            const method =
                editId
                    ? "PUT"
                    : "POST";

            console.log(
                "REQUEST:",
                {
                    method,
                    endpoint,
                    requestData
                }
            );

            const res = await fetch(
                `${API_URL}${endpoint}`,
                {

                    method,

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            requestData
                        )
                }
            );

            const result =
                await res.json();

            console.log(
                "API RESPONSE:",
                result
            );

            if (!res.ok) {

                throw new Error(
                    result.message ||
                    "Request failed"
                );
            }

            toast.success(
                editId
                    ? "Updated successfully"
                    : "Created successfully"
            );

            navigate(-1);

        } catch (error) {

            console.error(
                "META FORM ERROR:",
                error
            );

            toast.error(
                error.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================
    // UI
    // =========================================

    return (

        <form
            onSubmit={handleSubmit}
            className="card border-0 shadow-sm"
        >

            <div className="card-body p-4">

                {/* ================================= */}
                {/* AD FORM */}
                {/* ================================= */}

                {type === "ad" && (

                    <>

                        <div className="mb-4">

                            <h5 className="mb-1">

                                {editId
                                    ? "Edit Ad"
                                    : "Create Ad"
                                }

                            </h5>

                            <p className="text-muted mb-0">

                                {editId
                                    ? "Update your existing Meta ad."
                                    : "Create an ad with a new creative."
                                }

                            </p>

                        </div>

                        {/* AD SET ID */}

                        <div className="mb-4">

                            <label className="form-label fw-semibold">
                                Ad Set
                            </label>

                            <div className="input-group">

                                <span className="input-group-text">
                                    Ad Set ID
                                </span>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        adSetId ||
                                        form.adSetId ||
                                        ""
                                    }
                                    readOnly
                                />

                            </div>

                            <small className="text-muted">
                                Ad Set ID associated with this ad.
                            </small>

                        </div>

                        <hr className="my-4" />

                        {/* AD DETAILS */}

                        <h6 className="mb-3">
                            Ad Details
                        </h6>

                        <div className="row g-4">

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Ad Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="TLS Test Ad"
                                    required
                                />

                            </div>

                            {editId && (

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="form-select"
                                    >

                                        <option value="PAUSED">
                                            Paused
                                        </option>

                                        <option value="ACTIVE">
                                            Active
                                        </option>

                                    </select>

                                </div>

                            )}

                        </div>

                        {/* ================================= */}
                        {/* CREATE ONLY CREATIVE SECTION */}
                        {/* ================================= */}

                        {!editId && (

                            <>

                                <hr className="my-4" />

                                <h6 className="mb-3">
                                    Creative
                                </h6>

                                <div className="row g-4">

                                    {/* CREATIVE NAME */}

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Creative Name
                                        </label>

                                        <input
                                            type="text"
                                            name="creativeName"
                                            value={
                                                form.creativeName
                                            }
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="TLS Test Creative"
                                            required
                                        />

                                    </div>

                                    {/* WEBSITE */}

                                    <div className="col-md-6">

                                        <label className="form-label fw-semibold">
                                            Website Link
                                        </label>

                                        <input
                                            type="url"
                                            name="link"
                                            value={form.link}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="https://techleela.com"
                                            required
                                        />

                                    </div>

                                    {/* MESSAGE */}

                                    <div className="col-md-12">

                                        <label className="form-label fw-semibold">
                                            Message
                                        </label>

                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            className="form-control"
                                            rows="4"
                                            placeholder="Discover our services. Contact us today."
                                            required
                                        />

                                    </div>

                                    {/* IMAGE */}

                                    <div className="col-md-12">

                                        <label className="form-label fw-semibold">
                                            Image
                                        </label>

                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />

                                        <small className="text-muted">
                                            Image will be uploaded first,
                                            then used to create the creative.
                                        </small>

                                    </div>

                                </div>

                                <div className="alert alert-light border mt-4 mb-0">

                                    <strong>
                                        Creation flow:
                                    </strong>

                                    <div className="mt-2">

                                        <span>
                                            1. Upload Image
                                        </span>

                                        <span className="mx-2">
                                            →
                                        </span>

                                        <span>
                                            2. Create Creative
                                        </span>

                                        <span className="mx-2">
                                            →
                                        </span>

                                        <span>
                                            3. Create Ad
                                        </span>

                                    </div>

                                </div>

                            </>

                        )}

                    </>

                )}

                {/* ================================= */}
                {/* CAMPAIGN */}
                {/* ================================= */}

                {type === "campaign" && (

                    <div className="row g-4">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Campaign Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Objective
                            </label>

                            <select
                                name="objective"
                                value={form.objective}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >

                                <option value="">
                                    Select Objective
                                </option>

                                <option value="OUTCOME_TRAFFIC">
                                    Traffic
                                </option>

                                <option value="OUTCOME_LEADS">
                                    Leads
                                </option>

                                <option value="OUTCOME_SALES">
                                    Sales
                                </option>

                                <option value="OUTCOME_ENGAGEMENT">
                                    Engagement
                                </option>

                            </select>

                        </div>

                    </div>
                )}

                {/* ================================= */}
                {/* AD SET */}
                {/* ================================= */}

                {type === "adset" && (

                    <div className="row g-4">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Ad Set Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Daily Budget
                            </label>

                            <input
                                type="number"
                                name="dailyBudget"
                                value={form.dailyBudget}
                                onChange={handleChange}
                                className="form-control"
                                min="1"
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Optimization Goal
                            </label>

                            <select
                                name="optimizationGoal"
                                value={form.optimizationGoal}
                                onChange={handleChange}
                                className="form-select"
                            >

                                <option value="LINK_CLICKS">
                                    Link Clicks
                                </option>

                                <option value="LANDING_PAGE_VIEWS">
                                    Landing Page Views
                                </option>

                                <option value="LEAD_GENERATION">
                                    Lead Generation
                                </option>

                                <option value="IMPRESSIONS">
                                    Impressions
                                </option>

                            </select>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Billing Event
                            </label>

                            <select
                                name="billingEvent"
                                value={form.billingEvent}
                                onChange={handleChange}
                                className="form-select"
                            >

                                <option value="IMPRESSIONS">
                                    Impressions
                                </option>

                            </select>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Bid Strategy
                            </label>

                            <select
                                name="bidStrategy"
                                value={form.bidStrategy}
                                onChange={handleChange}
                                className="form-select"
                            >

                                <option value="LOWEST_COST_WITHOUT_CAP">
                                    Lowest Cost
                                </option>

                                <option value="LOWEST_COST_WITH_BID_CAP">
                                    Lowest Cost With Bid Cap
                                </option>

                            </select>

                        </div>
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Bid Amount
                            </label>

                            <input
                                type="number"
                                name="bidAmount"
                                value={form.bidAmount}
                                onChange={handleChange}
                                className="form-control"
                                min="1"
                                placeholder="Example: 100"
                                disabled={
                                    form.bidStrategy ===
                                    "LOWEST_COST_WITHOUT_CAP"
                                }
                            />

                            <small className="text-muted">
                                Required when using Bid Cap or Target Cost.
                            </small>

                        </div>
                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Country
                            </label>

                            <select
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="form-select"
                            >

                                <option value="IN">
                                    India
                                </option>

                                <option value="US">
                                    United States
                                </option>

                                <option value="GB">
                                    United Kingdom
                                </option>

                            </select>

                        </div>

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Minimum Age
                            </label>

                            <input
                                type="number"
                                name="ageMin"
                                value={form.ageMin}
                                onChange={handleChange}
                                className="form-control"
                                min="13"
                                max="65"
                            />

                        </div>

                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Maximum Age
                            </label>

                            <input
                                type="number"
                                name="ageMax"
                                value={form.ageMax}
                                onChange={handleChange}
                                className="form-control"
                                min="13"
                                max="65"
                            />

                        </div>

                    </div>
                )}

                {/* ================================= */}
                {/* CREATIVE DIRECT */}
                {/* ================================= */}

                {type === "creative" && (

                    <div className="row g-4">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Creative Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Website Link
                            </label>
                            <input
                                type="url"
                                name="link"
                                value={form.link}
                                disabled={true}
                                onChange={handleChange}
                                className="form-control"
                            />

                        </div>

                        <div className="col-md-12">

                            <label className="form-label fw-semibold">
                                Message
                            </label>

                            <textarea
                                disabled={true}
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                className="form-control"
                                rows="4"
                            />

                        </div>

                        {/* <div className="col-md-12">

                            <label className="form-label fw-semibold">
                                Image Hash
                            </label>

                            <input
                                type="text"
                                name="imageHash"
                                value={form.imageHash}
                                onChange={handleChange}
                                className="form-control"
                            />

                        </div> */}

                    </div>
                )}

                {/* ================================= */}
                {/* STATUS */}
                {/* ================================= */}

                {type !== "ad" && (

                    <div className="row mt-4">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="form-select"
                            >

                                <option value="PAUSED">
                                    Paused
                                </option>

                                <option value="ACTIVE">
                                    Active
                                </option>

                            </select>

                        </div>

                    </div>

                )}

            </div>

            {/* ================================= */}
            {/* FOOTER */}
            {/* ================================= */}

            <div className="card-footer bg-white border-top d-flex justify-content-end gap-2 p-3">

                <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                        navigate(-1)
                    }
                    disabled={loading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >

                    {loading
                        ? editId
                            ? "Updating..."
                            : type === "ad"
                                ? "Creating Ad..."
                                : "Saving..."
                        : editId
                            ? "Update"
                            : type === "ad"
                                ? "Create Ad"
                                : "Create"
                    }

                </button>

            </div>

        </form>
    );
};

export default MetaAdForm;