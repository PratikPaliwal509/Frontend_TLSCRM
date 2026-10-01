import React, { useState } from "react";
import { FiX, FiFileText, FiBarChart2 } from "react-icons/fi";
import { toast } from "react-toastify";

const GenerateAdsReportModal = ({ show, onClose }) => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [compareType, setCompareType] = useState("previous_month");

    const [compareFromDate, setCompareFromDate] = useState("");
    const [compareToDate, setCompareToDate] = useState("");

    const [reportLevel, setReportLevel] = useState("overall");

    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const generateReport = async (withGraph = false) => {

        if (!fromDate || !toDate) {
            toast.error("Please select report dates");
            return;
        }

        if (
            compareType === "custom" &&
            (!compareFromDate || !compareToDate)
        ) {
            toast.error("Please select comparison dates");
            return;
        }

        try {

            setLoading(true);

            const params = new URLSearchParams({
                fromDate,
                toDate,
                compareType,
                reportLevel,
            });

            if (compareType === "custom") {
                params.append("compareFromDate", compareFromDate);
                params.append("compareToDate", compareToDate);
            }

            const response = await fetch(
                `https://api-0ggv.onrender.com/api/facebook/campaigns/reports/ads?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to generate report"
                );
            }

            const report = result.data;

            if (withGraph) {
                await generatePDFWithGraph(report);
            } else {
                await generatePDF(report);
            }

            toast.success("Report generated successfully");

        } catch (error) {

            console.error("Report Error:", error);

            toast.error(
                error.message || "Failed to generate report"
            );

        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async (report) => {

        const jsPDF = (await import("jspdf")).default;
        const autoTable = (await import("jspdf-autotable")).default;

        const doc = new jsPDF("l", "mm", "a4");

        doc.setFontSize(18);
        doc.text("META ADS PERFORMANCE REPORT", 148, 15, {
            align: "center"
        });

        doc.setFontSize(10);

        doc.text(
            `Period: ${report.period.fromDate} to ${report.period.toDate}`,
            15,
            25
        );

        doc.text(
            `Comparison: ${report.comparison.fromDate} to ${report.comparison.toDate}`,
            15,
            31
        );

        // SUMMARY

        doc.setFontSize(13);
        doc.text("Overall Performance", 15, 42);

        const current = report.summary.current;
        const previous = report.summary.previous;
        const growth = report.summary.growth;

        autoTable(doc, {
            startY: 46,

            head: [[
                "Metric",
                "Current",
                "Previous",
                "Growth"
            ]],

            body: [
                [
                    "Spend",
                    current.spend,
                    previous.spend,
                    formatGrowth(growth.spend)
                ],
                [
                    "Impressions",
                    current.impressions,
                    previous.impressions,
                    formatGrowth(growth.impressions)
                ],
                [
                    "Reach",
                    current.reach,
                    previous.reach,
                    formatGrowth(growth.reach)
                ],
                [
                    "Clicks",
                    current.clicks,
                    previous.clicks,
                    formatGrowth(growth.clicks)
                ],
                [
                    "CTR",
                    `${current.ctr}%`,
                    `${previous.ctr}%`,
                    formatGrowth(growth.ctr)
                ],
                [
                    "CPC",
                    current.cpc,
                    previous.cpc,
                    formatGrowth(growth.cpc)
                ],
                [
                    "CPM",
                    current.cpm,
                    previous.cpm,
                    formatGrowth(growth.cpm)
                ],
                [
                    "Leads",
                    current.leads,
                    previous.leads,
                    formatGrowth(growth.leads)
                ]
            ]
        });

        // CAMPAIGNS

        let startY = doc.lastAutoTable.finalY + 12;

        doc.setFontSize(13);
        doc.text("Campaign Performance", 15, startY);

        autoTable(doc, {
            startY: startY + 4,

            head: [[
                "Campaign",
                "Spend",
                "Impressions",
                "Reach",
                "Clicks",
                "CTR",
                "Leads",
                "CPC",
                "CPM"
            ]],

            body: report.campaigns.map((campaign) => [
                campaign.name,

                campaign.current.spend,

                campaign.current.impressions,

                campaign.current.reach,

                campaign.current.clicks,

                `${campaign.current.ctr}%`,

                campaign.current.leads,

                campaign.current.cpc,

                campaign.current.cpm
            ]),

            styles: {
                fontSize: 8
            }
        });

        // AD SETS

        report.campaigns.forEach((campaign) => {

            doc.addPage();

            doc.setFontSize(13);

            doc.text(
                `Ad Sets - ${campaign.name}`,
                15,
                15
            );

            autoTable(doc, {

                startY: 20,

                head: [[
                    "Ad Set",
                    "Spend",
                    "Impressions",
                    "Clicks",
                    "CTR",
                    "Leads",
                    "CPC"
                ]],

                body: campaign.adSets.map((adSet) => [
                    adSet.name,
                    adSet.current.spend,
                    adSet.current.impressions,
                    adSet.current.clicks,
                    `${adSet.current.ctr}%`,
                    adSet.current.leads,
                    adSet.current.cpc
                ]),

                styles: {
                    fontSize: 8
                }
            });

            // ADS

            campaign.adSets.forEach((adSet) => {

                doc.addPage();

                doc.setFontSize(13);

                doc.text(
                    `Ads - ${adSet.name}`,
                    15,
                    15
                );

                autoTable(doc, {

                    startY: 20,

                    head: [[
                        "Ad",
                        "Spend",
                        "Impressions",
                        "Clicks",
                        "CTR",
                        "Leads",
                        "CPC"
                    ]],

                    body: adSet.ads.map((ad) => [
                        ad.name,
                        ad.current.spend,
                        ad.current.impressions,
                        ad.current.clicks,
                        `${ad.current.ctr}%`,
                        ad.current.leads,
                        ad.current.cpc
                    ]),

                    styles: {
                        fontSize: 8
                    }
                });

            });

        });

        doc.save(
            `meta-ads-report-${fromDate}-to-${toDate}.pdf`
        );
    };

    const generatePDFWithGraph = async (report) => {

        // For now generate the normal report.
        // We can add Chart.js graphs here using report.dailyTrend.

        await generatePDF(report);
    };

    const formatGrowth = (value) => {

        if (value === null || value === undefined) {
            return "N/A";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "N/A";
        }

        return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
    };

    return (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
        >

            <div className="modal-dialog modal-lg modal-dialog-centered">

                <div className="modal-content">

                    {/* HEADER */}

                    <div className="modal-header">

                        <h5 className="modal-title">
                            Generate Meta Ads Report
                        </h5>

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

                        <div className="row g-3">

                            {/* FROM */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    From Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(e.target.value)
                                    }
                                />

                            </div>

                            {/* TO */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    To Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) =>
                                        setToDate(e.target.value)
                                    }
                                />

                            </div>

                            {/* COMPARISON */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Compare With
                                </label>

                                <select
                                    className="form-select"
                                    value={compareType}
                                    onChange={(e) =>
                                        setCompareType(e.target.value)
                                    }
                                >

                                    <option value="previous_month">
                                        Previous Month
                                    </option>

                                    <option value="previous_period">
                                        Previous Period
                                    </option>

                                    <option value="custom">
                                        Custom Period
                                    </option>

                                </select>

                            </div>

                            {/* REPORT LEVEL */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Report Level
                                </label>

                                <select
                                    className="form-select"
                                    value={reportLevel}
                                    onChange={(e) =>
                                        setReportLevel(e.target.value)
                                    }
                                >

                                    <option value="overall">
                                        Overall
                                    </option>

                                    <option value="campaign">
                                        Campaign
                                    </option>

                                    <option value="adset">
                                        Ad Set
                                    </option>

                                    <option value="ad">
                                        Ad
                                    </option>

                                </select>

                            </div>

                            {/* CUSTOM COMPARISON */}

                            {compareType === "custom" && (
                                <>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Comparison From
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={compareFromDate}
                                            onChange={(e) =>
                                                setCompareFromDate(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="col-md-6">

                                        <label className="form-label">
                                            Comparison To
                                        </label>

                                        <input
                                            type="date"
                                            className="form-control"
                                            value={compareToDate}
                                            onChange={(e) =>
                                                setCompareToDate(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </>
                            )}

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

                            <FiFileText
                                size={16}
                                className="me-2"
                            />

                            {loading
                                ? "Generating..."
                                : "Generate PDF"}

                        </button>

                        <button
                            type="button"
                            className="btn btn-success"
                            disabled={loading}
                            onClick={() => generateReport(true)}
                        >

                            <FiBarChart2
                                size={16}
                                className="me-2"
                            />

                            {loading
                                ? "Generating..."
                                : "PDF with Graph"}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default GenerateAdsReportModal;