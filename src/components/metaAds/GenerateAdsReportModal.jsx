import React, { useState, useEffect, useMemo } from "react";
import { FiX, FiFileText, FiBarChart2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { generateAdsReportPdf } from "./generateAdsReportPdf";

// Change this for production (or read it from your env config)
const API_BASE = "https://api-0ggv.onrender.com/api/facebook/campaigns";

const SECTION_OPTIONS = [
    { key: "summary", label: "Executive Summary (KPI cards)" },
    { key: "trends", label: "Spend & Performance Trend" },
    { key: "campaigns", label: "Campaign Performance" },
    { key: "comparison", label: "Campaign Comparison (needs comparison)" },
    { key: "adsets", label: "Ad Set Performance" },
    { key: "ads", label: "Ad Performance + Top Ads" },
    { key: "billing", label: "Billing & Spend" },
    { key: "funnel", label: "Conversion Funnel" },
    { key: "insights", label: "Key Insights" },
    { key: "appendix", label: "Appendix / Definitions" },
];

const allSectionsSelected = () =>
    SECTION_OPTIONS.reduce((acc, s) => ({ ...acc, [s.key]: true }), {});

const toISO = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
    ).padStart(2, "0")}`;

const GenerateAdsReportModal = ({ show, onClose }) => {
    // Dates
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Comparison
    const [compareType, setCompareType] = useState("previous_period");
    const [compareFromDate, setCompareFromDate] = useState("");
    const [compareToDate, setCompareToDate] = useState("");

    // Scope: all campaigns OR specific campaigns
    const [scope, setScope] = useState("all");
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignIds, setSelectedCampaignIds] = useState([]);
    const [campaignSearch, setCampaignSearch] = useState("");
    const [campaignsLoading, setCampaignsLoading] = useState(false);

    // Report content (everything selected by default)
    const [sections, setSections] = useState(allSectionsSelected());

    const [loading, setLoading] = useState(false);

    const getToken = () => localStorage.getItem("token");

    const authHeaders = () => ({
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
    });

    /* ---------------- load campaigns when modal opens ---------------- */

    useEffect(() => {
        if (!show || campaigns.length > 0) return;

        const loadCampaigns = async () => {
            try {
                setCampaignsLoading(true);

                const res = await fetch(`${API_BASE}/reports/campaign-options`, {
                    headers: authHeaders(),
                });
                const result = await res.json();

                if (!res.ok || !result.success) {
                    throw new Error(result.message || "Failed to load campaigns");
                }

                setCampaigns(result.data || []);
            } catch (error) {
                console.error("Campaign list error:", error);
                toast.error(error.message || "Failed to load campaigns");
            } finally {
                setCampaignsLoading(false);
            }
        };

        loadCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const visibleCampaigns = useMemo(() => {
        const q = campaignSearch.trim().toLowerCase();
        return q
            ? campaigns.filter((c) => c.name.toLowerCase().includes(q))
            : campaigns;
    }, [campaigns, campaignSearch]);

    if (!show) return null;

    /* ---------------- helpers ---------------- */

    const applyPreset = (preset) => {
        const today = new Date();
        let from;
        let to = new Date(today);

        if (preset === "last7") {
            from = new Date(today);
            from.setDate(from.getDate() - 6);
        } else if (preset === "last30") {
            from = new Date(today);
            from.setDate(from.getDate() - 29);
        } else if (preset === "thisMonth") {
            from = new Date(today.getFullYear(), today.getMonth(), 1);
        } else if (preset === "lastMonth") {
            from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            to = new Date(today.getFullYear(), today.getMonth(), 0);
        }

        setFromDate(toISO(from));
        setToDate(toISO(to));
    };

    const toggleCampaign = (id) =>
        setSelectedCampaignIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const toggleSection = (key) =>
        setSections((prev) => ({ ...prev, [key]: !prev[key] }));

    const setAllSections = (value) =>
        setSections(
            SECTION_OPTIONS.reduce((acc, s) => ({ ...acc, [s.key]: value }), {})
        );

    /* ---------------- generate ---------------- */

    const generateReport = async (withGraph = false) => {
        if (!fromDate || !toDate) {
            toast.error("Please select report dates");
            return;
        }

        if (fromDate > toDate) {
            toast.error("From date cannot be after To date");
            return;
        }

        if (
            compareType === "custom" &&
            (!compareFromDate || !compareToDate)
        ) {
            toast.error("Please select comparison dates");
            return;
        }

        if (scope === "selected" && selectedCampaignIds.length === 0) {
            toast.error("Please select at least one campaign");
            return;
        }

        const selectedSections = SECTION_OPTIONS.filter(
            (s) => sections[s.key]
        ).map((s) => s.key);

        if (selectedSections.length === 0) {
            toast.error("Please select at least one report section");
            return;
        }

        try {
            setLoading(true);

            const params = new URLSearchParams({
                fromDate,
                toDate,
                compareType,
                sections: selectedSections.join(","),
            });

            if (compareType === "custom") {
                params.append("compareFromDate", compareFromDate);
                params.append("compareToDate", compareToDate);
            }

            // Empty campaignIds = ALL campaigns
            if (scope === "selected") {
                params.append("campaignIds", selectedCampaignIds.join(","));
            }

            const response = await fetch(
                `${API_BASE}/reports/ads?${params.toString()}`,
                { method: "GET", headers: authHeaders() }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to generate report");
            }

            await generateAdsReportPdf(result.data, { withGraphs: withGraph });

            toast.success("Report generated successfully");
        } catch (error) {
            console.error("Report Error:", error);
            toast.error(error.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    const allSectionsChecked = SECTION_OPTIONS.every((s) => sections[s.key]);

    /* ---------------- UI ---------------- */

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Generate Meta Ads Report</h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        >
                            <FiX />
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">
                        {/* ---------- DATE RANGE ---------- */}
                        <h6 className="fw-bold mb-2">1. Report Period</h6>

                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {[
                                ["last7", "Last 7 days"],
                                ["last30", "Last 30 days"],
                                ["thisMonth", "This month"],
                                ["lastMonth", "Last month"],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => applyPreset(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <label className="form-label">From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">To Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Compare With</label>
                                <select
                                    className="form-select"
                                    value={compareType}
                                    onChange={(e) => setCompareType(e.target.value)}
                                >
                                    <option value="previous_period">Previous Period</option>
                                    <option value="previous_month">Previous Month</option>
                                    <option value="previous_year">Previous Year</option>
                                    <option value="custom">Custom Period</option>
                                    <option value="none">No Comparison</option>
                                </select>
                            </div>

                            {compareType === "custom" && (
                                <>
                                    <div className="col-md-6" />

                                    <div className="col-md-6">
                                        <label className="form-label">Comparison From</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={compareFromDate}
                                            onChange={(e) =>
                                                setCompareFromDate(e.target.value)
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Comparison To</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={compareToDate}
                                            onChange={(e) =>
                                                setCompareToDate(e.target.value)
                                            }
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ---------- SCOPE ---------- */}
                        <h6 className="fw-bold mb-2">2. Campaigns</h6>

                        <div className="mb-2">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="scopeAll"
                                    checked={scope === "all"}
                                    onChange={() => setScope("all")}
                                />
                                <label className="form-check-label" htmlFor="scopeAll">
                                    All campaigns (with all ad sets &amp; ads)
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="scopeSelected"
                                    checked={scope === "selected"}
                                    onChange={() => setScope("selected")}
                                />
                                <label className="form-check-label" htmlFor="scopeSelected">
                                    Specific campaign(s)
                                </label>
                            </div>
                        </div>

                        {scope === "selected" && (
                            <div className="border rounded p-2 mb-4">
                                <input
                                    type="text"
                                    className="form-control form-control-sm mb-2"
                                    placeholder="Search campaign..."
                                    value={campaignSearch}
                                    onChange={(e) => setCampaignSearch(e.target.value)}
                                />

                                <div className="d-flex justify-content-between mb-2">
                                    <small className="text-muted">
                                        {selectedCampaignIds.length} selected
                                    </small>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm p-0 me-3"
                                            onClick={() =>
                                                setSelectedCampaignIds(
                                                    visibleCampaigns.map((c) => c.id)
                                                )
                                            }
                                        >
                                            Select all
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-link btn-sm p-0"
                                            onClick={() => setSelectedCampaignIds([])}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                <div style={{ maxHeight: 180, overflowY: "auto" }}>
                                    {campaignsLoading && (
                                        <div className="text-muted small">
                                            Loading campaigns...
                                        </div>
                                    )}

                                    {!campaignsLoading &&
                                        visibleCampaigns.length === 0 && (
                                            <div className="text-muted small">
                                                No campaigns found
                                            </div>
                                        )}

                                    {visibleCampaigns.map((c) => (
                                        <div className="form-check" key={c.id}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`camp-${c.id}`}
                                                checked={selectedCampaignIds.includes(c.id)}
                                                onChange={() => toggleCampaign(c.id)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`camp-${c.id}`}
                                            >
                                                {c.name}{" "}
                                                <span className="badge bg-light text-dark">
                                                    {c.status}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {scope === "all" && <div className="mb-4" />}

                        {/* ---------- SECTIONS ---------- */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0">3. Report Content</h6>

                            <button
                                type="button"
                                className="btn btn-link btn-sm p-0"
                                onClick={() => setAllSections(!allSectionsChecked)}
                            >
                                {allSectionsChecked ? "Clear all" : "Select all"}
                            </button>
                        </div>

                        <div className="row">
                            {SECTION_OPTIONS.map((s) => (
                                <div className="col-md-6" key={s.key}>
                                    <div className="form-check mb-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`sec-${s.key}`}
                                            checked={!!sections[s.key]}
                                            onChange={() => toggleSection(s.key)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`sec-${s.key}`}
                                        >
                                            {s.label}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={loading}
                            onClick={() => generateReport(false)}
                        >
                            <FiFileText size={16} className="me-2" />
                            {loading ? "Generating..." : "Generate PDF"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-success"
                            disabled={loading}
                            onClick={() => generateReport(true)}
                        >
                            <FiBarChart2 size={16} className="me-2" />
                            {loading ? "Generating..." : "PDF with Graph"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateAdsReportModal;
