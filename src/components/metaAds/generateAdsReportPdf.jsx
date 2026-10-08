/**
 * Builds the Meta Ads PDF from the report returned by
 * GET /api/facebook/campaigns/reports/ads
 *
 * Only the sections listed in report.sections are rendered.
 * Charts are drawn with plain jsPDF shapes (no extra chart library needed).
 */

const C = {
    navy: [15, 23, 42],
    blue: [37, 99, 235],
    green: [22, 163, 74],
    red: [220, 38, 38],
    gray: [100, 116, 139],
    light: [241, 245, 249],
    purple: [124, 58, 237],
    white: [255, 255, 255],
    line: [226, 232, 240],
};

const M = 14; // page margin (mm)

// better: which direction is "good" for colouring changes
const METRICS = [
    { key: "spend", label: "Ad Spend", type: "money", better: "neutral" },
    { key: "impressions", label: "Impressions", type: "int", better: "up" },
    { key: "reach", label: "Reach", type: "int", better: "up" },
    { key: "clicks", label: "Clicks", type: "int", better: "up" },
    { key: "ctr", label: "CTR", type: "pct", better: "up" },
    { key: "cpc", label: "CPC", type: "money", better: "down" },
    { key: "cpm", label: "CPM", type: "money", better: "down" },
    { key: "leads", label: "Leads", type: "int", better: "up" },
    { key: "costPerLead", label: "Cost / Lead", type: "money", better: "down" },
];

/* ---------------------------------------------------------
   FORMATTERS
--------------------------------------------------------- */

const makeFormatters = (currency = "INR") => {
    // Default PDF fonts cannot print the ₹ glyph, so use "Rs."
    const prefix = currency === "INR" ? "Rs. " : `${currency} `;

    const num = (n, d = 2) =>
        Number(n || 0).toLocaleString("en-IN", {
            minimumFractionDigits: d,
            maximumFractionDigits: d,
        });

    const money = (n) => `${prefix}${num(n, 2)}`;
    const int = (n) => Number(n || 0).toLocaleString("en-IN");
    const pct = (n) => `${num(n, 2)}%`;

    const compact = (n) => {
        n = Number(n || 0);
        if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
        if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
        return n.toFixed(n % 1 === 0 ? 0 : 1);
    };

    const value = (type, v) =>
        type === "money" ? money(v) : type === "pct" ? pct(v) : int(v);

    const growth = (g) =>
        g === null || g === undefined || Number.isNaN(Number(g))
            ? "N/A"
            : `${g > 0 ? "+" : ""}${Number(g).toFixed(1)}%`;

    return { money, int, pct, compact, value, growth };
};

const growthColor = (g, better) => {
    if (g === null || g === undefined || Math.abs(g) < 0.05) return C.gray;
    if (better === "neutral") return C.blue;
    const improved = better === "up" ? g > 0 : g < 0;
    return improved ? C.green : C.red;
};

const shortDate = (str) => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
    });
};

const longDate = (str) => {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
};

/* ---------------------------------------------------------
   CHART HELPERS
--------------------------------------------------------- */

const drawLineChart = (doc, f, { x, y, w, h, title, labels, values, color }) => {
    doc.setFontSize(10);
    doc.setTextColor(...C.navy);
    doc.text(title, x, y);

    const top = y + 5;
    const left = x + 18;
    const cw = w - 20;
    const ch = h - 16;
    const max = Math.max(...values, 1);

    doc.setFontSize(7);
    doc.setTextColor(...C.gray);
    doc.setDrawColor(...C.line);
    doc.setLineWidth(0.2);

    for (let i = 0; i <= 4; i++) {
        const gy = top + ch - (ch * i) / 4;
        doc.line(left, gy, left + cw, gy);
        doc.text(f.compact((max * i) / 4), left - 2, gy + 1, { align: "right" });
    }

    const step = values.length > 1 ? cw / (values.length - 1) : 0;
    const pts = values.map((v, i) => [left + i * step, top + ch - (v / max) * ch]);

    doc.setDrawColor(...color);
    doc.setLineWidth(0.7);
    for (let i = 1; i < pts.length; i++) {
        doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    }

    doc.setFillColor(...color);
    if (pts.length <= 31) {
        pts.forEach(([px, py]) => doc.circle(px, py, 0.7, "F"));
    }

    doc.setTextColor(...C.gray);
    const every = Math.ceil(labels.length / 8);
    labels.forEach((label, i) => {
        if (i % every === 0) {
            doc.text(label, pts[i][0], top + ch + 5, { align: "center" });
        }
    });

    doc.setLineWidth(0.2);
};

// Horizontal bar chart. Returns used height.
const drawHBars = (doc, { x, y, w, items, color, format, labelW = 70 }) => {
    const barH = 6;
    const gap = 3;
    const max = Math.max(...items.map((i) => i.value), 1);
    const maxBarW = w - labelW - 32;

    items.forEach((item, i) => {
        const by = y + i * (barH + gap);
        const bw = Math.max((item.value / max) * maxBarW, 0.5);

        doc.setFontSize(8);
        doc.setTextColor(...C.navy);
        const label =
            item.label.length > 38 ? `${item.label.slice(0, 37)}…` : item.label;
        doc.text(label, x, by + 4.2);

        doc.setFillColor(...C.light);
        doc.rect(x + labelW, by, maxBarW, barH, "F");
        doc.setFillColor(...color);
        doc.rect(x + labelW, by, bw, barH, "F");

        doc.setTextColor(...C.gray);
        doc.text(format(item.value), x + labelW + maxBarW + 3, by + 4.2);
    });

    return items.length * (barH + gap);
};

/* ---------------------------------------------------------
   INSIGHTS (generated from real numbers)
--------------------------------------------------------- */

const buildInsights = (report, f) => {
    const improved = [];
    const declined = [];
    const other = [];

    const { current, previous, growth } = report.summary;

    if (report.comparison && growth) {
        METRICS.forEach((m) => {
            const g = growth[m.key];
            if (g === null || g === undefined) return;

            if (Math.abs(g) < 0.05) {
                other.push(`${m.label} stayed flat at ${f.value(m.type, current[m.key])}.`);
                return;
            }

            const text = `${m.label} ${g > 0 ? "increased" : "decreased"} by ${Math.abs(
                g
            ).toFixed(1)}% (${f.value(m.type, previous[m.key])} to ${f.value(
                m.type,
                current[m.key]
            )}).`;

            if (m.better === "neutral") other.push(text);
            else if ((m.better === "up") === g > 0) improved.push(text);
            else declined.push(text);
        });
    }

    const totalSpend = current.spend;
    const top = report.campaigns[0];
    if (top && totalSpend > 0 && report.campaigns.length > 1) {
        other.push(
            `"${top.name}" received the largest share of spend (${(
                (top.current.spend / totalSpend) *
                100
            ).toFixed(1)}%).`
        );
    }

    const bestCpl = report.campaigns
        .filter((c) => c.current.leads > 0)
        .sort((a, b) => a.current.costPerLead - b.current.costPerLead)[0];
    if (bestCpl && report.campaigns.length > 1) {
        other.push(
            `"${bestCpl.name}" had the lowest cost per lead (${f.money(
                bestCpl.current.costPerLead
            )}).`
        );
    }

    return [
        { title: "Improved", color: C.green, items: improved },
        { title: "Needs attention", color: C.red, items: declined },
        { title: "Other observations", color: C.blue, items: other },
    ].filter((g) => g.items.length > 0);
};

/* ---------------------------------------------------------
   MAIN
--------------------------------------------------------- */

export const generateAdsReportPdf = async (report, { withGraphs = false } = {}) => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF("l", "mm", "a4");
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    const f = makeFormatters(report.currency);
    const has = (key) => report.sections.includes(key);
    const hasComparison = !!report.comparison;

    // Flatten for ad set / ad tables
    const adSetRows = [];
    const adRows = [];
    report.campaigns.forEach((c) =>
        c.adSets.forEach((s) => {
            adSetRows.push({ campaign: c.name, ...s });
            s.ads.forEach((a) => adRows.push({ campaign: c.name, adSet: s.name, ...a }));
        })
    );

    let y = 0;

    /* ---------- layout helpers ---------- */

    const newPage = (title, subtitle) => {
        doc.addPage();
        doc.setFillColor(...C.navy);
        doc.rect(0, 0, W, 20, "F");
        doc.setTextColor(...C.white);
        doc.setFontSize(15);
        doc.text(title, M, 13);
        if (subtitle) {
            doc.setFontSize(9);
            doc.text(subtitle, W - M, 13, { align: "right" });
        }
        y = 30;
    };

    const ensureSpace = (h) => {
        if (y + h > H - 16) {
            doc.addPage();
            y = 20;
        }
    };

    const heading = (text) => {
        ensureSpace(14);
        doc.setFontSize(12);
        doc.setTextColor(...C.navy);
        doc.text(text, M, y);
        y += 4;
    };

    const table = (opts) => {
        autoTable(doc, {
            startY: y,
            theme: "striped",
            headStyles: { fillColor: C.navy, fontSize: 8, textColor: C.white },
            styles: { fontSize: 8, cellPadding: 1.8 },
            alternateRowStyles: { fillColor: C.light },
            margin: { left: M, right: M, bottom: 16 },
            ...opts,
        });
        y = doc.lastAutoTable.finalY + 8;
    };

    const gcell = (g, better) => ({
        content: f.growth(g),
        styles: { textColor: growthColor(g, better), fontStyle: "bold" },
    });

    const subtitle = `${longDate(report.period.from)} - ${longDate(report.period.to)}`;

    /* ======================================================
       COVER
    ====================================================== */

    doc.setFillColor(...C.navy);
    doc.rect(0, 0, W, H, "F");
    doc.setFillColor(...C.purple);
    doc.rect(0, 0, 6, H, "F");

    doc.setTextColor(...C.white);
    doc.setFontSize(30);
    doc.text("META ADS PERFORMANCE REPORT", M + 10, 62);

    doc.setFontSize(14);
    doc.setTextColor(180, 190, 210);
    doc.text(report.account?.name || "Meta Ads Account", M + 10, 74);

    doc.setFontSize(11);
    doc.setTextColor(...C.white);
    let cy = 96;
    const coverLine = (label, value) => {
        doc.setTextColor(150, 160, 185);
        doc.text(label, M + 10, cy);
        doc.setTextColor(...C.white);
        doc.text(value, M + 60, cy);
        cy += 9;
    };

    coverLine("Reporting period", subtitle);
    coverLine(
        "Compared with",
        hasComparison
            ? `${longDate(report.comparison.from)} - ${longDate(report.comparison.to)}`
            : "No comparison"
    );
    coverLine(
        "Scope",
        report.scope.type === "all"
            ? "All campaigns"
            : report.scope.campaigns.map((c) => c.name).join(", ").slice(0, 90)
    );
    coverLine(
        "Contains",
        `${report.counts.campaigns} campaigns / ${report.counts.adSets} ad sets / ${report.counts.ads} ads`
    );

    /* ======================================================
       EXECUTIVE SUMMARY
    ====================================================== */

    if (has("summary")) {
        newPage("Executive Summary", subtitle);

        const cards = METRICS.slice(0, 8);
        const gapX = 6;
        const cardW = (W - 2 * M - 3 * gapX) / 4;
        const cardH = 27;

        cards.forEach((m, i) => {
            const cx = M + (i % 4) * (cardW + gapX);
            const cardY = y + Math.floor(i / 4) * (cardH + 6);

            doc.setFillColor(...C.light);
            doc.roundedRect(cx, cardY, cardW, cardH, 2, 2, "F");
            doc.setFillColor(...C.blue);
            doc.rect(cx, cardY + 3, 1.2, cardH - 6, "F");

            doc.setFontSize(8);
            doc.setTextColor(...C.gray);
            doc.text(m.label.toUpperCase(), cx + 5, cardY + 7);

            doc.setFontSize(15);
            doc.setTextColor(...C.navy);
            doc.text(f.value(m.type, report.summary.current[m.key]), cx + 5, cardY + 16);

            if (hasComparison) {
                const g = report.summary.growth[m.key];
                doc.setFontSize(9);
                doc.setTextColor(...growthColor(g, m.better));
                doc.text(`${f.growth(g)} vs previous`, cx + 5, cardY + 23);
            }
        });

        y += 2 * (cardH + 6) + 6;

        heading("Overall Performance");
        y += 2;

        table({
            head: [hasComparison
                ? ["Metric", "Current", "Previous", "Change"]
                : ["Metric", "Current"]],
            body: METRICS.map((m) =>
                hasComparison
                    ? [
                        m.label,
                        f.value(m.type, report.summary.current[m.key]),
                        f.value(m.type, report.summary.previous[m.key]),
                        gcell(report.summary.growth[m.key], m.better),
                    ]
                    : [m.label, f.value(m.type, report.summary.current[m.key])]
            ),
        });
    }

    /* ======================================================
       TRENDS
    ====================================================== */

    if (has("trends")) {
        newPage("Spend & Performance Trend", subtitle);

        if (report.dailyTrend.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...C.gray);
            doc.text("No daily data available for this period.", M, y);
        } else if (withGraphs) {
            const labels = report.dailyTrend.map((d) => shortDate(d.date));
            const half = (W - 2 * M - 10) / 2;

            drawLineChart(doc, f, {
                x: M, y, w: half, h: 70, color: C.blue,
                title: "Daily Ad Spend",
                labels,
                values: report.dailyTrend.map((d) => d.spend),
            });
            drawLineChart(doc, f, {
                x: M + half + 10, y, w: half, h: 70, color: C.purple,
                title: "Daily Clicks",
                labels,
                values: report.dailyTrend.map((d) => d.clicks),
            });
            y += 80;

            drawLineChart(doc, f, {
                x: M, y, w: half, h: 70, color: C.green,
                title: "Daily Impressions",
                labels,
                values: report.dailyTrend.map((d) => d.impressions),
            });
            drawLineChart(doc, f, {
                x: M + half + 10, y, w: half, h: 70, color: C.red,
                title: "Daily Leads",
                labels,
                values: report.dailyTrend.map((d) => d.leads),
            });
            y += 80;
        } else {
            table({
                head: [["Date", "Spend", "Impressions", "Reach", "Clicks", "Leads"]],
                body: report.dailyTrend.map((d) => [
                    longDate(d.date),
                    f.money(d.spend),
                    f.int(d.impressions),
                    f.int(d.reach),
                    f.int(d.clicks),
                    f.int(d.leads),
                ]),
            });
        }
    }

    /* ======================================================
       CAMPAIGN PERFORMANCE
    ====================================================== */

    if (has("campaigns")) {
        newPage(
            report.scope.type === "all" ? "Campaign Performance" : "Selected Campaign Performance",
            subtitle
        );

        if (report.campaigns.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...C.gray);
            doc.text("No campaign data for this period.", M, y);
        } else {
            table({
                head: [["Campaign", "Spend", "Impressions", "Reach", "Clicks", "CTR", "Leads", "CPC", "CPM", "Cost/Lead"]],
                body: report.campaigns.map((c) => [
                    c.name,
                    f.money(c.current.spend),
                    f.int(c.current.impressions),
                    f.int(c.current.reach),
                    f.int(c.current.clicks),
                    f.pct(c.current.ctr),
                    f.int(c.current.leads),
                    f.money(c.current.cpc),
                    f.money(c.current.cpm),
                    c.current.leads ? f.money(c.current.costPerLead) : "-",
                ]),
            });

            if (withGraphs) {
                const items = report.campaigns.slice(0, 10).map((c) => ({
                    label: c.name,
                    value: c.current.spend,
                }));
                ensureSpace(14 + items.length * 9);
                heading("Spend by Campaign");
                y += 4;
                y += drawHBars(doc, {
                    x: M, y, w: W - 2 * M, items, color: C.blue, format: f.money,
                }) + 6;
            }
        }
    }

    /* ======================================================
       CAMPAIGN COMPARISON
    ====================================================== */

    if (has("comparison") && hasComparison) {
        newPage("Campaign Comparison", `vs ${longDate(report.comparison.from)} - ${longDate(report.comparison.to)}`);

        table({
            head: [["Campaign", "Spend", "Prev Spend", "Change", "Clicks", "Prev Clicks", "Change", "Leads", "Prev Leads", "Change"]],
            body: report.campaigns.map((c) => [
                c.name,
                f.money(c.current.spend),
                f.money(c.previous.spend),
                gcell(c.growth.spend, "neutral"),
                f.int(c.current.clicks),
                f.int(c.previous.clicks),
                gcell(c.growth.clicks, "up"),
                f.int(c.current.leads),
                f.int(c.previous.leads),
                gcell(c.growth.leads, "up"),
            ]),
        });

        if (withGraphs && report.campaigns.length > 0) {
            // current vs previous spend, side by side bars
            const items = report.campaigns.slice(0, 8);
            ensureSpace(20 + items.length * 18);
            heading("Spend: Current vs Previous");
            y += 4;
            const max = Math.max(
                ...items.flatMap((c) => [c.current.spend, c.previous.spend]), 1
            );
            const maxW = W - 2 * M - 110;

            items.forEach((c) => {
                doc.setFontSize(8);
                doc.setTextColor(...C.navy);
                doc.text(c.name.length > 38 ? `${c.name.slice(0, 37)}…` : c.name, M, y + 4);

                doc.setFillColor(...C.blue);
                doc.rect(M + 70, y, Math.max((c.current.spend / max) * maxW, 0.5), 5, "F");
                doc.setFillColor(180, 190, 210);
                doc.rect(M + 70, y + 6, Math.max((c.previous.spend / max) * maxW, 0.5), 5, "F");

                doc.setTextColor(...C.gray);
                doc.text(f.money(c.current.spend), M + 74 + maxW, y + 4);
                doc.text(f.money(c.previous.spend), M + 74 + maxW, y + 10);
                y += 15;
            });

            doc.setFillColor(...C.blue);
            doc.rect(M + 70, y, 4, 3, "F");
            doc.setTextColor(...C.gray);
            doc.text("Current", M + 76, y + 2.5);
            doc.setFillColor(180, 190, 210);
            doc.rect(M + 100, y, 4, 3, "F");
            doc.text("Previous", M + 106, y + 2.5);
            y += 8;
        }
    }

    /* ======================================================
       AD SETS
    ====================================================== */

    if (has("adsets")) {
        newPage("Ad Set Performance", subtitle);

        if (adSetRows.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...C.gray);
            doc.text("No ad set data for this period.", M, y);
        } else {
            table({
                head: [hasComparison
                    ? ["Campaign", "Ad Set", "Spend", "Impressions", "Clicks", "CTR", "Leads", "CPC", "Spend Chg"]
                    : ["Campaign", "Ad Set", "Spend", "Impressions", "Clicks", "CTR", "Leads", "CPC"]],
                body: adSetRows.map((s) => {
                    const row = [
                        s.campaign,
                        s.name,
                        f.money(s.current.spend),
                        f.int(s.current.impressions),
                        f.int(s.current.clicks),
                        f.pct(s.current.ctr),
                        f.int(s.current.leads),
                        f.money(s.current.cpc),
                    ];
                    if (hasComparison) row.push(gcell(s.growth.spend, "neutral"));
                    return row;
                }),
            });
        }
    }

    /* ======================================================
       ADS
    ====================================================== */

    if (has("ads")) {
        newPage("Ad Performance", subtitle);

        if (adRows.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...C.gray);
            doc.text("No ad data for this period.", M, y);
        } else {
            // Top performers
            const pick = (list, cmp) => [...list].sort(cmp)[0];
            const tops = [
                ["Highest CTR", pick(adRows.filter((a) => a.current.impressions >= 100), (a, b) => b.current.ctr - a.current.ctr), (a) => f.pct(a.current.ctr)],
                ["Lowest CPC", pick(adRows.filter((a) => a.current.clicks > 0), (a, b) => a.current.cpc - b.current.cpc), (a) => f.money(a.current.cpc)],
                ["Most leads", pick(adRows.filter((a) => a.current.leads > 0), (a, b) => b.current.leads - a.current.leads), (a) => f.int(a.current.leads)],
                ["Lowest cost / lead", pick(adRows.filter((a) => a.current.leads > 0), (a, b) => a.current.costPerLead - b.current.costPerLead), (a) => f.money(a.current.costPerLead)],
            ].filter((t) => t[1]);

            if (tops.length) {
                heading("Top Performing Ads");
                y += 2;
                table({
                    head: [["Metric", "Ad", "Ad Set", "Value"]],
                    body: tops.map(([label, ad, fmt]) => [label, ad.name, ad.adSet, fmt(ad)]),
                    headStyles: { fillColor: C.purple, fontSize: 8, textColor: C.white },
                });
            }

            heading("All Ads");
            y += 2;
            table({
                head: [["Campaign", "Ad Set", "Ad", "Spend", "Impressions", "Clicks", "CTR", "Leads", "CPC", "Cost/Lead"]],
                body: adRows.map((a) => [
                    a.campaign,
                    a.adSet,
                    a.name,
                    f.money(a.current.spend),
                    f.int(a.current.impressions),
                    f.int(a.current.clicks),
                    f.pct(a.current.ctr),
                    f.int(a.current.leads),
                    f.money(a.current.cpc),
                    a.current.leads ? f.money(a.current.costPerLead) : "-",
                ]),
            });
        }
    }

    /* ======================================================
       BILLING
    ====================================================== */

    if (has("billing")) {
        newPage("Billing & Spend", subtitle);

        const b = report.billing;
        const rows = [
            ["Total ad spend (selected period)", f.money(b.totalSpend)],
            ["Days in period", String(b.days)],
            ["Average daily spend", f.money(b.averageDailySpend)],
        ];
        if (b.costPerLead > 0) rows.push(["Cost per lead", f.money(b.costPerLead)]);
        if (hasComparison) {
            rows.push(["Spend in comparison period", f.money(report.summary.previous.spend)]);
            rows.push(["Spend change", f.growth(report.summary.growth.spend)]);
        }
        if (b.accountAmountSpent !== null) rows.push(["Account lifetime amount spent", f.money(b.accountAmountSpent)]);
        if (b.accountBalance !== null) rows.push(["Account balance (due)", f.money(b.accountBalance)]);
        if (b.accountSpendCap !== null) rows.push(["Account spending limit", f.money(b.accountSpendCap)]);

        table({
            head: [["Item", "Amount"]],
            body: rows,
            columnStyles: { 1: { halign: "right" } },
            tableWidth: 160,
        });

        doc.setFontSize(8);
        doc.setTextColor(...C.gray);
        doc.text(
            "Ad spend is reported by Meta Insights for the selected period. It is not an invoice or payment receipt.",
            M,
            y
        );
        y += 8;
    }

    /* ======================================================
       FUNNEL
    ====================================================== */

    if (has("funnel")) {
        newPage("Conversion Funnel", subtitle);

        const cur = report.summary.current;
        const steps = [
            ["Impressions", cur.impressions],
            ["Clicks", cur.clicks],
            ["Landing Page Views", cur.landingPageViews],
            ["Leads", cur.leads],
            ["Purchases", cur.purchases],
        ].filter(([label, v], i) => i < 2 || v > 0);

        if (withGraphs) {
            const maxW = W - 2 * M - 40;
            const top = Math.max(steps[0][1], 1);
            const colors = [C.navy, C.blue, C.purple, C.green, C.red];

            steps.forEach(([label, value], i) => {
                const bw = Math.max((value / top) * maxW, 40);
                const bx = (W - bw) / 2;

                doc.setFillColor(...colors[i % colors.length]);
                doc.roundedRect(bx, y, bw, 13, 2, 2, "F");
                doc.setFontSize(10);
                doc.setTextColor(...C.white);
                doc.text(`${label}: ${f.int(value)}`, W / 2, y + 8.5, { align: "center" });

                if (i > 0 && steps[i - 1][1] > 0) {
                    doc.setFontSize(8);
                    doc.setTextColor(...C.gray);
                    doc.text(
                        `${((value / steps[i - 1][1]) * 100).toFixed(2)}% of previous step`,
                        bx + bw + 4,
                        y + 8.5
                    );
                }
                y += 19;
            });
        } else {
            table({
                head: [["Stage", "Count", "% of previous stage"]],
                body: steps.map(([label, value], i) => [
                    label,
                    f.int(value),
                    i > 0 && steps[i - 1][1] > 0
                        ? `${((value / steps[i - 1][1]) * 100).toFixed(2)}%`
                        : "-",
                ]),
            });
        }
    }

    /* ======================================================
       INSIGHTS
    ====================================================== */

    if (has("insights")) {
        newPage("Key Insights", subtitle);

        const groups = buildInsights(report, f);

        if (groups.length === 0) {
            doc.setFontSize(10);
            doc.setTextColor(...C.gray);
            doc.text("Not enough data to generate insights.", M, y);
        }

        groups.forEach((g) => {
            ensureSpace(16);
            doc.setFontSize(12);
            doc.setTextColor(...g.color);
            doc.text(g.title, M, y);
            y += 6;

            doc.setFontSize(10);
            doc.setTextColor(...C.navy);
            g.items.forEach((item) => {
                const lines = doc.splitTextToSize(item, W - 2 * M - 8);
                ensureSpace(lines.length * 5 + 2);
                doc.setFillColor(...g.color);
                doc.circle(M + 1.5, y - 1.2, 0.9, "F");
                doc.text(lines, M + 6, y);
                y += lines.length * 5 + 2;
            });
            y += 5;
        });
    }

    /* ======================================================
       APPENDIX
    ====================================================== */

    if (has("appendix")) {
        newPage("Appendix", subtitle);

        table({
            head: [["Metric", "Definition"]],
            body: [
                ["Ad Spend", "Total amount spent on ads in the selected period."],
                ["Impressions", "Number of times the ads were shown."],
                ["Reach", "Number of people who saw the ads at least once. Totals are summed from ad-level rows, so overlapping audiences can be counted more than once."],
                ["Clicks", "Total clicks on the ads."],
                ["CTR", "Clicks divided by impressions."],
                ["CPC", "Spend divided by clicks."],
                ["CPM", "Cost per 1,000 impressions."],
                ["Leads", "Lead actions reported by Meta (lead forms / pixel lead events)."],
                ["Cost / Lead", "Spend divided by leads."],
            ],
            columnStyles: { 0: { cellWidth: 40, fontStyle: "bold" } },
        });

        table({
            head: [["Item", "Value"]],
            body: [
                ["Currency", report.currency],
                ["Report period", subtitle],
                ["Comparison period", hasComparison ? `${longDate(report.comparison.from)} - ${longDate(report.comparison.to)}` : "None"],
                ["Data source", "Meta Marketing API - Insights"],
                ["Generated on", new Date().toLocaleString("en-GB")],
            ],
            columnStyles: { 0: { cellWidth: 40, fontStyle: "bold" } },
        });
    }

    /* ======================================================
       FOOTER ON EVERY PAGE (except cover)
    ====================================================== */

    const pages = doc.getNumberOfPages();
    for (let i = 2; i <= pages; i++) {
        doc.setPage(i);
        doc.setDrawColor(...C.line);
        doc.line(M, H - 11, W - M, H - 11);
        doc.setFontSize(7.5);
        doc.setTextColor(...C.gray);
        doc.text("Meta Ads Performance Report", M, H - 6);
        doc.text(`Period: ${subtitle}`, W / 2, H - 6, { align: "center" });
        doc.text(`Page ${i - 1} of ${pages - 1}`, W - M, H - 6, { align: "right" });
    }

    const scopeName = report.scope.type === "all" ? "all-campaigns" : "selected-campaigns";
    doc.save(`meta-ads-report-${scopeName}-${report.period.from}-to-${report.period.to}.pdf`);
};
