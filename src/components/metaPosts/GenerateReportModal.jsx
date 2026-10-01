import React, { useState } from "react";
import { FiDownload, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { createFacebookReportPdf } from "./facebookReportPdf";

// Move this to your environment config (e.g. .env) for production
const API_BASE_URL = "https://api-0ggv.onrender.com";

const GenerateReportModal = ({ show, onClose }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fromDate: "",
        toDate: "",
        compareType: "previous_period",
        compareFromDate: "",
        compareToDate: "",
    });

    if (!show) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!formData.fromDate || !formData.toDate) {
            toast.error("Please select From and To dates");
            return false;
        }

        if (formData.fromDate > formData.toDate) {
            toast.error("From date must be on or before To date");
            return false;
        }

        if (
            formData.compareType === "custom" &&
            (!formData.compareFromDate || !formData.compareToDate)
        ) {
            toast.error("Please select comparison dates");
            return false;
        }

        return true;
    };

    const handleDownload = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const params = new URLSearchParams({
                fromDate: formData.fromDate,
                toDate: formData.toDate,
                compareType: formData.compareType,
            });

            if (formData.compareType === "custom") {
                params.append("compareFromDate", formData.compareFromDate);
                params.append("compareToDate", formData.compareToDate);
            }

            const response = await fetch(
                `${API_BASE_URL}/api/facebook/reports/posts?${params.toString()}`,
                { method: "GET", headers: { Authorization: `Bearer ${token}` } }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result?.message || "Failed to generate report");
            }

            // All layout, charts and tables are built in facebookReportPdf.js
            const pdf = createFacebookReportPdf(result.data, {
                preparedFor: "Business Owner / Management",
                preparedBy: "Digital Analytics & Marketing Team",
            });

            pdf.save(
                `facebook-page-performance-report-${formData.fromDate}-to-${formData.toDate}.pdf`
            );

            toast.success("Report downloaded successfully");
            onClose();
        } catch (error) {
            console.error("Report download error:", error);
            toast.error(error.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Generate Facebook Report</h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />
                    </div>

                    {/* BODY */}
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">To Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Compare With</label>

                            <select
                                className="form-select"
                                name="compareType"
                                value={formData.compareType}
                                onChange={handleChange}
                            >
                                <option value="previous_period">Previous Period</option>
                                <option value="previous_month">Previous Month</option>
                                <option value="custom">Custom Period</option>
                            </select>
                        </div>

                        {formData.compareType === "custom" && (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Compare From</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="compareFromDate"
                                        value={formData.compareFromDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Compare To</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="compareToDate"
                                        value={formData.compareToDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <p className="text-muted small mb-0">
                            The PDF includes an executive summary, period comparison,
                            audience metrics, post-by-post table, charts, insights and
                            recommendations.
                        </p>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <FiX className="me-1" />
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleDownload}
                            disabled={loading}
                        >
                            <FiDownload className="me-2" />
                            {loading ? "Generating..." : "Download Report"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateReportModal;
