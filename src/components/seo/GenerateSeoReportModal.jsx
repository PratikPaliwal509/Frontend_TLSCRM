import React, { useState } from "react";
import { FiX, FiFileText, FiDownload, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";

const REPORT_SECTIONS = [
    { id: "traffic", label: "Website traffic" },
    { id: "organic", label: "Organic traffic" },
    { id: "clicksImpressions", label: "Clicks & impressions" },
    { id: "ctrPosition", label: "CTR & average position" },
    { id: "keywords", label: "Keyword rankings" },
    { id: "trafficSources", label: "Traffic sources" },
    { id: "topPages", label: "Top pages" }
];

const ALL_SECTIONS = REPORT_SECTIONS.reduce(
    (acc, s) => ({ ...acc, [s.id]: true }),
    {}
);

const GenerateSeoReportModal = ({ show, onClose, website }) => {
    const [currentStart, setCurrentStart] = useState("2026-08-01");
    const [currentEnd, setCurrentEnd] = useState("2026-08-31");
    const [previousStart, setPreviousStart] = useState("2026-07-01");
    const [previousEnd, setPreviousEnd] = useState("2026-07-31");

    const [fetching, setFetching] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    const [reportData, setReportData] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [selectedSections, setSelectedSections] = useState(ALL_SECTIONS);

    if (!show) return null;

    const busy = fetching || generating;

    /* ---------------- helpers ---------------- */

    const formatNumber = (value) =>
        new Intl.NumberFormat("en-IN").format(Number(value || 0));

    const formatChange = (value) => {
        const number = Number(value || 0);
        return `${number >= 0 ? "+" : ""}${number}%`;
    };

    const resetFetchedData = () => {
        setDataFetched(false);
        setReportData(null);
        setKeywords([]);
        setSelectedKeywords([]);
    };

    // Changing a date makes the fetched data stale -> force a new fetch
    const handleDateChange = (setter) => (e) => {
        setter(e.target.value);
        resetFetchedData();
    };

    const toggleSection = (id) =>
        setSelectedSections((prev) => ({ ...prev, [id]: !prev[id] }));

    const selectAllSections = () => setSelectedSections(ALL_SECTIONS);

    const clearAllSections = () =>
        setSelectedSections(
            REPORT_SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: false }), {})
        );

    const toggleKeyword = (keyword) =>
        setSelectedKeywords((prev) =>
            prev.includes(keyword)
                ? prev.filter((k) => k !== keyword)
                : [...prev, keyword]
        );

    const selectAllKeywords = () =>
        setSelectedKeywords(keywords.map((item) => item.keyword));

    const clearAllKeywords = () => setSelectedKeywords([]);

    const anySectionSelected = Object.values(selectedSections).some(Boolean);

    const keywordsInvalid =
        selectedSections.keywords && selectedKeywords.length === 0;

    const canGenerate =
        dataFetched && !busy && anySectionSelected && !keywordsInvalid;

    /* ---------------- fetch ---------------- */

    const fetchSeoData = async () => {
        try {
            setFetching(true);

            const params = new URLSearchParams({
                siteUrl: website.url,
                currentStart,
                currentEnd,
                previousStart,
                previousEnd
            });

            const response = await fetch(
                `https://api-0ggv.onrender.com/api/seo/report?${params.toString()}`
            );
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to fetch SEO data");
            }

            setReportData(result.data);

            const fetchedKeywords = result.data?.keywordRanking || [];
            setKeywords(fetchedKeywords);
            setSelectedKeywords(fetchedKeywords.map((item) => item.keyword));

            setDataFetched(true);

            toast.success(
                `SEO data fetched successfully. ${fetchedKeywords.length} keywords found.`
            );
        } catch (error) {
            console.error("SEO FETCH ERROR:", error);
            toast.error(error.message || "Failed to fetch SEO data");
        } finally {
            setFetching(false);
        }
    };

    /* ---------------- PDF ---------------- */
const resetForm = () => {
    // Reset dates
    setCurrentStart("2026-08-01");
    setCurrentEnd("2026-08-31");
    setPreviousStart("2026-07-01");
    setPreviousEnd("2026-07-31");

    // Reset fetched data
    setDataFetched(false);
    setReportData(null);
    setKeywords([]);
    setSelectedKeywords([]);

    // Reset report sections
    setSelectedSections(ALL_SECTIONS);
};
    const generatePDF = async () => {
        try {
            if (!reportData) {
                toast.error("Please fetch SEO data first");
                return;
            }
            if (!anySectionSelected) {
                toast.error("Please select at least one report section");
                return;
            }
            if (keywordsInvalid) {
                toast.error("Please select at least one keyword");
                return;
            }

            setGenerating(true);

            const report = {
                ...reportData,
                keywordRanking: (reportData.keywordRanking || []).filter(
                    (item) => selectedKeywords.includes(item.keyword)
                )
            };

            const jsPDF = (await import("jspdf")).default;
            const autoTable = (await import("jspdf-autotable")).default;

            const doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const navy = [24, 39, 75];
            const blue = [37, 99, 235];
            const green = [22, 163, 74];
            const red = [220, 38, 38];
            const gray = [100, 116, 139];
            const lightGray = [241, 245, 249];
            const zebra = [248, 250, 252];

            const addHeader = () => {
                doc.setFillColor(...navy);
                doc.rect(0, 0, pageWidth, 28, "F");

                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(20);
                doc.text("SEO & WEBSITE ANALYTICS", 15, 13);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text("Performance Report", 15, 21);
                doc.text(
                    `Generated: ${new Date().toLocaleDateString("en-IN")}`,
                    pageWidth - 15,
                    17,
                    { align: "right" }
                );
            };

            const addFooter = () => {
                const pages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pages; i++) {
                    doc.setPage(i);
                    doc.setDrawColor(226, 232, 240);
                    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(...gray);
                    doc.text("SEO Analytics Report", 15, pageHeight - 9);
                    doc.text(`Page ${i} of ${pages}`, pageWidth - 15, pageHeight - 9, {
                        align: "right"
                    });
                }
            };

            const addSectionTitle = (title, y) => {
                doc.setFillColor(...lightGray);
                doc.roundedRect(15, y - 6, pageWidth - 30, 11, 2, 2, "F");
                doc.setTextColor(...navy);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.text(title, 19, y + 1);
            };

            const changeColor = (change, reverse = false) => {
                const positive = Number(change) >= 0;
                if (reverse) return positive ? red : green;
                return positive ? green : red;
            };

            // Start a new page if the next block would not fit
            const ensureSpace = (y, needed = 40) => {
                if (y + needed > pageHeight - 20) {
                    doc.addPage();
                    addHeader();
                    return 40;
                }
                return y;
            };

            const sel = selectedSections;
            const mc = report.metricComparison || {};

            /* ===== PAGE 1: TITLE ===== */

            addHeader();

            doc.setTextColor(...navy);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("Website SEO Report", 15, 48);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...gray);
            doc.text(`Website: ${website?.name || ""} (${website?.url || ""})`, 15, 56);
            doc.text(`Current Period: ${currentStart} → ${currentEnd}`, 15, 63);
            doc.text(`Comparison Period: ${previousStart} → ${previousEnd}`, 15, 70);

            let y = 85;

            /* ===== METRIC CARDS (only selected) ===== */

            const cardMetrics = [
                { section: "traffic", title: "Total Traffic", data: mc.totalTraffic },
                { section: "organic", title: "Organic Traffic", data: mc.totalOrganicTraffic },
                { section: "clicksImpressions", title: "Clicks", data: mc.clicks },
                { section: "clicksImpressions", title: "Impressions", data: mc.impressions }
            ].filter((m) => sel[m.section] && m.data);

            if (cardMetrics.length > 0) {
                const cardWidth = (pageWidth - 45) / 2;

                cardMetrics.forEach((metric, index) => {
                    const col = index % 2;
                    const row = Math.floor(index / 2);
                    const x = 15 + col * (cardWidth + 15);
                    const cy = y + row * 42;

                    doc.setFillColor(...zebra);
                    doc.roundedRect(x, cy, cardWidth, 34, 3, 3, "F");

                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(...gray);
                    doc.setFontSize(9);
                    doc.text(metric.title, x + 7, cy + 9);

                    doc.setTextColor(...navy);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(17);
                    doc.text(formatNumber(metric.data.current), x + 7, cy + 22);

                    const color = changeColor(metric.data.change);
                    doc.setTextColor(...color);
                    doc.setFontSize(9);
                    doc.text(formatChange(metric.data.change), x + cardWidth - 7, cy + 22, {
                        align: "right"
                    });
                });

                y += Math.ceil(cardMetrics.length / 2) * 42 + 8;
            }

            /* ===== METRIC COMPARISON TABLE (only selected rows) ===== */

            const comparisonRows = [];

            if (sel.traffic && mc.totalTraffic) {
                comparisonRows.push({
                    label: "Total Traffic",
                    d: mc.totalTraffic,
                    fmt: formatNumber
                });
            }
            if (sel.organic && mc.totalOrganicTraffic) {
                comparisonRows.push({
                    label: "Total Organic Traffic",
                    d: mc.totalOrganicTraffic,
                    fmt: formatNumber
                });
            }
            if (sel.clicksImpressions) {
                if (mc.clicks)
                    comparisonRows.push({ label: "Clicks", d: mc.clicks, fmt: formatNumber });
                if (mc.impressions)
                    comparisonRows.push({
                        label: "Impressions",
                        d: mc.impressions,
                        fmt: formatNumber
                    });
            }
            if (sel.ctrPosition) {
                if (mc.ctr)
                    comparisonRows.push({
                        label: "CTR",
                        d: mc.ctr,
                        fmt: (v) => `${v}%`
                    });
                if (mc.avgPosition)
                    comparisonRows.push({
                        label: "Avg. Position",
                        d: mc.avgPosition,
                        fmt: (v) => v,
                        reverse: true // lower position number = better
                    });
            }

            if (comparisonRows.length > 0) {
                y = ensureSpace(y, 30 + comparisonRows.length * 12);

                addSectionTitle("Metric Comparison", y);

                autoTable(doc, {
                    startY: y + 10,
                    margin: { top: 35 },
                    head: [["Metric", "Current Period", "Previous Period", "Change"]],
                    body: comparisonRows.map((r) => [
                        r.label,
                        r.fmt(r.d.current),
                        r.fmt(r.d.previous),
                        formatChange(r.d.change)
                    ]),
                    theme: "grid",
                    headStyles: { fillColor: navy, textColor: 255, fontStyle: "bold" },
                    alternateRowStyles: { fillColor: zebra },
                    styles: { fontSize: 9, cellPadding: 5 },
                    didParseCell: (data) => {
                        if (data.section === "body" && data.column.index === 3) {
                            const row = comparisonRows[data.row.index];
                            data.cell.styles.textColor = changeColor(
                                row.d.change,
                                row.reverse
                            );
                            data.cell.styles.fontStyle = "bold";
                        }
                    }
                });

                y = doc.lastAutoTable.finalY + 15;
            }

            /* ===== KEYWORD RANKING ===== */

            if (sel.keywords) {
                doc.addPage();
                addHeader();
                addSectionTitle("Keyword Ranking", 40);

                autoTable(doc, {
                    startY: 50,
                    margin: { top: 35 },
                    head: [
                        [
                            "Keyword",
                            "Current",
                            "Previous",
                            "Change",
                            "Clicks",
                            "Impressions",
                            "CTR"
                        ]
                    ],
                    body: report.keywordRanking.map((k) => [
                        k.keyword,
                        k.currentPosition,
                        k.previousPosition ?? "-",
                        k.positionChange ?? "-",
                        formatNumber(k.clicks),
                        formatNumber(k.impressions),
                        `${k.ctr}%`
                    ]),
                    theme: "grid",
                    headStyles: { fillColor: blue, textColor: 255, fontStyle: "bold" },
                    styles: { fontSize: 7.5, cellPadding: 3 },
                    alternateRowStyles: { fillColor: zebra },
                    columnStyles: { 0: { cellWidth: 48 } }
                });

                y = doc.lastAutoTable.finalY + 15;
            }

            /* ===== TRAFFIC SOURCES ===== */

            if (sel.trafficSources) {
                const sources = report.trafficSources || [];

                // New page if this is the first block after a keyword table, or no room
                y = sel.keywords || cardMetrics.length || comparisonRows.length
                    ? ensureSpace(y, 50)
                    : y;

                addSectionTitle("Traffic Sources", y);

                autoTable(doc, {
                    startY: y + 10,
                    margin: { top: 35 },
                    head: [["Channel", "Sessions", "Users"]],
                    body: sources.map((s) => [
                        s.channel,
                        formatNumber(s.sessions),
                        formatNumber(s.users)
                    ]),
                    theme: "grid",
                    headStyles: { fillColor: navy, textColor: 255 },
                    styles: { fontSize: 9, cellPadding: 4 },
                    alternateRowStyles: { fillColor: zebra }
                });

                y = doc.lastAutoTable.finalY + 15;
            }

            /* ===== TOP PAGES ===== */

            if (sel.topPages) {
                y = ensureSpace(y, 50);

                addSectionTitle("Top Pages", y);

                autoTable(doc, {
                    startY: y + 10,
                    margin: { top: 35 },
                    head: [["Page", "Title", "Views", "Users"]],
                    body: (report.topPages || []).map((p) => [
                        p.page,
                        p.title,
                        formatNumber(p.views),
                        formatNumber(p.users)
                    ]),
                    theme: "grid",
                    headStyles: { fillColor: blue, textColor: 255 },
                    styles: { fontSize: 8, cellPadding: 4 },
                    alternateRowStyles: { fillColor: zebra }
                });
            }

            addFooter();

            doc.save(`seo-report-${currentStart}-${currentEnd}.pdf`);

            toast.success("SEO report generated successfully");
            onClose();
            resetForm();
        } catch (error) {
            console.error("SEO PDF ERROR:", error);
            toast.error(error.message || "Failed to generate SEO report");
        } finally {
            setGenerating(false);
        }
    };
    
    /* ---------------- UI ---------------- */

    const dateFields = [
        {
            title: "Current Period",
            fields: [
                { label: "From", value: currentStart, setter: setCurrentStart },
                { label: "To", value: currentEnd, setter: setCurrentEnd }
            ]
        },
        {
            title: "Comparison Period",
            fields: [
                { label: "From", value: previousStart, setter: setPreviousStart },
                { label: "To", value: previousEnd, setter: setPreviousEnd }
            ]
        }
    ];

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <FiFileText className="me-2" />
                            Generate SEO Report
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={busy}
                        />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* Website */}
                        <div className="alert alert-primary">
                            <strong>Website:</strong>
                            <span className="ms-2">{website?.name}</span>
                            <div className="small text-muted mt-1">{website?.url}</div>
                        </div>

                        {/* Dates */}
                        <div className="row">
                            {dateFields.map((group) => (
                                <div className="col-md-6" key={group.title}>
                                    <h6 className="mb-3">{group.title}</h6>
                                    {group.fields.map((field) => (
                                        <div className="mb-3" key={field.label}>
                                            <label className="form-label">{field.label}</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={field.value}
                                                onChange={handleDateChange(field.setter)}
                                                disabled={busy}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Fetch data */}
                        <div className="border rounded p-3 mt-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-1">SEO Data</h6>
                                    <small className="text-muted">
                                        {dataFetched
                                            ? "Data fetched. Change a date to fetch again."
                                            : "Fetch the complete SEO data for the selected periods."}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className={`btn ${dataFetched ? "btn-success" : "btn-primary"}`}
                                    onClick={fetchSeoData}
                                    disabled={fetching || generating || dataFetched}
                                >
                                    {fetching ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Fetching Data...
                                        </>
                                    ) : dataFetched ? (
                                        <>
                                            <FiCheckCircle className="me-1" />
                                            Data Fetched
                                        </>
                                    ) : (
                                        <>
                                            <FiDownload className="me-1" />
                                            Fetch Data
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Report includes (selectable) */}
                        <div className="card border mt-3">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Report includes</strong>
                                    <span className="badge bg-primary ms-2">
                                        {Object.values(selectedSections).filter(Boolean).length} /{" "}
                                        {REPORT_SECTIONS.length}
                                    </span>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={selectAllSections}
                                        disabled={busy}
                                    >
                                        Select All
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={clearAllSections}
                                        disabled={busy}
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="row">
                                    {REPORT_SECTIONS.map((section) => (
                                        <div className="col-md-6 mb-2" key={section.id}>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id={`section-${section.id}`}
                                                    checked={!!selectedSections[section.id]}
                                                    onChange={() => toggleSection(section.id)}
                                                    disabled={busy}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`section-${section.id}`}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {section.label}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {!anySectionSelected && (
                                    <div className="text-danger small mt-2">
                                        Select at least one section to include in the report.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Keyword selection (only if Keyword rankings is selected and data fetched) */}
                        {dataFetched && selectedSections.keywords && (
                            <div className="card border mt-3">
                                <div className="card-header bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Select Keywords</strong>
                                            <span className="badge bg-primary ms-2">
                                                {selectedKeywords.length} / {keywords.length}
                                            </span>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={selectAllKeywords}
                                                disabled={busy}
                                            >
                                                Select All
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={clearAllKeywords}
                                                disabled={busy}
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="card-body"
                                    style={{ maxHeight: "300px", overflowY: "auto" }}
                                >
                                    {keywords.length === 0 ? (
                                        <div className="text-center text-muted py-4">
                                            No keywords found.
                                        </div>
                                    ) : (
                                        <div className="row">
                                            {keywords.map((item, index) => (
                                                <div
                                                    className="col-md-6 mb-2"
                                                    key={`${item.keyword}-${index}`}
                                                >
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`keyword-${index}`}
                                                            checked={selectedKeywords.includes(
                                                                item.keyword
                                                            )}
                                                            onChange={() => toggleKeyword(item.keyword)}
                                                            disabled={busy}
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`keyword-${index}`}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            {item.keyword}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                            disabled={busy}
                        >
                            <FiX className="me-1" />
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={generatePDF}
                            disabled={!canGenerate}
                            title={!dataFetched ? "Fetch data first" : undefined}
                        >
                            {generating ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FiDownload className="me-1" />
                                    Generate PDF
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateSeoReportModal;