import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ======================================================
// DESIGN TOKENS
// ======================================================

const COLORS = {
    navy: [15, 23, 42],
    blue: [37, 99, 235],
    green: [16, 185, 129],
    amber: [245, 158, 11],
    red: [239, 68, 68],
    purple: [139, 92, 246],
    gray: [100, 116, 139],
    light: [241, 245, 249],
    border: [226, 232, 240],
    white: [255, 255, 255],
    blueSoft: [239, 246, 255],
    greenSoft: [236, 253, 245],
};

const PAGE = { w: 210, h: 297, m: 14, top: 22, bottom: 281 };
const CW = PAGE.w - PAGE.m * 2; // content width = 182mm

const MAX_CHART_POSTS = 15;

// ======================================================
// FORMATTERS
// ======================================================

const isMissing = (v) => v === null || v === undefined;

const num = (v) => (isMissing(v) ? "N/A" : Number(v).toLocaleString("en-IN"));

const pct = (v, digits = 2) => (isMissing(v) ? "N/A" : `${Number(v).toFixed(digits)}%`);

const growthText = (g, unit = "%") => {
    if (isMissing(g)) return "N/A";
    if (g === 0) return `0.0${unit}`;
    return `${g > 0 ? "+" : ""}${Number(g).toFixed(1)}${unit}`;
};

const growthColor = (g) => {
    if (isMissing(g) || g === 0) return COLORS.gray;
    return g > 0 ? COLORS.green : COLORS.red;
};

const monthShort = (d) => d.toLocaleDateString("en-US", { month: "short" });

const longDate = (iso) => {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    return `${String(d.getDate()).padStart(2, "0")} ${monthShort(d)} ${d.getFullYear()}`;
};

const shortDate = (iso) => {
    if (!iso) return "";
    const d = new Date(`${iso}T00:00:00`);
    return `${monthShort(d)} ${String(d.getDate()).padStart(2, "0")}`;
};

const truncate = (str, max) => {
    const s = String(str || "");
    return s.length > max ? `${s.slice(0, max - 3)}...` : s;
};

// Round an axis maximum up to a "nice" number and pick a tick step
const niceScale = (max, ticks = 4) => {
    if (!max || max <= 0) return { max: 1, step: 0.25 };

    const raw = max / ticks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;

    return { max: Math.ceil(max / step) * step, step };
};

// If there are too many posts to chart legibly, keep the top N (in date order)
const limitPosts = (posts, key) => {
    if (posts.length <= MAX_CHART_POSTS) return posts;

    return [...posts]
        .sort((a, b) => (b[key] || 0) - (a[key] || 0))
        .slice(0, MAX_CHART_POSTS)
        .sort((a, b) => a.index - b.index);
};

// ======================================================
// MAIN
// ======================================================

export const createFacebookReportPdf = (report, options = {}) => {
    const {
        preparedFor = "Business Owner / Management",
        preparedBy = "Digital Analytics & Marketing Team",
    } = options;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const state = { y: PAGE.top };

    const current = report.current || {};
    const previous = report.previous || {};
    const growth = report.growth || {};
    const posts = report.posts || [];
    const formats = report.formats || [];
    const highlights = report.highlights || {};
    const takeaways = report.takeaways || {};
    const pageName = report.meta?.pageName || "Facebook Page";
    const periodLabel = `${longDate(report.period.from)} - ${longDate(report.period.to)}`;
    const comparisonLabel = `${longDate(report.comparison.from)} - ${longDate(report.comparison.to)}`;
    const hasPosts = posts.length > 0;
    const hasReach = posts.some((p) => !isMissing(p.reach));

    // ==================================================
    // DRAWING PRIMITIVES
    // ==================================================

    const text = (str, x, y, o = {}) => {
        const { size = 10, style = "normal", color = COLORS.navy, align = "left", angle } = o;

        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
        pdf.text(Array.isArray(str) ? str : String(str), x, y, { align, angle });
    };

    // Draws wrapped text and returns the height it used
    const paragraph = (str, x, y, w, o = {}) => {
        const { size = 9.5, style = "normal", color = COLORS.navy, lineH = 4.6 } = o;

        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        pdf.setTextColor(...color);

        const lines = pdf.splitTextToSize(String(str), w);
        pdf.text(lines, x, y);

        return lines.length * lineH;
    };

    const measure = (str, w, size = 9.5, style = "normal") => {
        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        return pdf.splitTextToSize(String(str), w);
    };

    const card = (x, y, w, h, o = {}) => {
        const { fill = COLORS.white, border = COLORS.border } = o;

        pdf.setFillColor(...fill);
        pdf.setDrawColor(...border);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(x, y, w, h, 2, 2, "FD");
    };

    const newPage = () => {
        pdf.addPage();
        state.y = PAGE.top;
    };

    const ensureSpace = (h) => {
        if (state.y + h > PAGE.bottom) newPage();
    };

    const sectionHeader = (number, title, subtitle, minSpace = 55) => {
        ensureSpace(minSpace);

        text(`${number}. ${title}`, PAGE.m, state.y + 5, { size: 14, style: "bold" });

        if (subtitle) {
            text(subtitle, PAGE.m, state.y + 11, { size: 9, color: COLORS.gray });
        }

        pdf.setDrawColor(...COLORS.border);
        pdf.setLineWidth(0.6);
        pdf.line(PAGE.m, state.y + 14.5, PAGE.w - PAGE.m, state.y + 14.5);

        state.y += 21;
    };

    const bulletList = (items, o = {}) => {
        const { color = COLORS.blue } = o;
        const w = CW - 6;

        items.forEach((item) => {
            const lines = measure(item, w, 9.5);
            const h = lines.length * 4.6 + 2;

            ensureSpace(h);

            pdf.setFillColor(...color);
            pdf.circle(PAGE.m + 1.5, state.y + 1.6, 0.9, "F");
            paragraph(item, PAGE.m + 6, state.y + 2.4, w);

            state.y += h;
        });

        state.y += 2;
    };

    const takeawayBox = (label, body) => {
        if (!body) return;

        const w = CW - 10;
        const lines = measure(body, w, 9);
        const h = 12 + lines.length * 4.4;

        ensureSpace(h + 4);

        card(PAGE.m, state.y, CW, h, { fill: COLORS.blueSoft, border: [191, 219, 254] });
        text(label, PAGE.m + 5, state.y + 6, { size: 8.5, style: "bold", color: COLORS.blue });
        paragraph(body, PAGE.m + 5, state.y + 11.5, w, { size: 9, lineH: 4.4 });

        state.y += h + 5;
    };

    const kpiGrid = (items, cols = 3) => {
        const gap = 4;
        const w = (CW - gap * (cols - 1)) / cols;
        const h = 27;

        for (let i = 0; i < items.length; i += cols) {
            ensureSpace(h + gap);

            const rowY = state.y;

            items.slice(i, i + cols).forEach((item, c) => {
                const x = PAGE.m + c * (w + gap);

                card(x, rowY, w, h);
                pdf.setFillColor(...item.color);
                pdf.rect(x, rowY + 2, 1.4, h - 4, "F");

                text(item.label.toUpperCase(), x + 5, rowY + 7, { size: 7, style: "bold", color: COLORS.gray });
                text(item.value, x + 5, rowY + 16.5, { size: 17, style: "bold" });
                text(item.sub, x + 5, rowY + 22.5, { size: 7.5, color: COLORS.gray });

                if (item.growth !== undefined) {
                    text(growthText(item.growth, item.unit), x + w - 4, rowY + 7, {
                        size: 8.5,
                        style: "bold",
                        color: growthColor(item.growth),
                        align: "right",
                    });
                    text("vs previous", x + w - 4, rowY + 11, { size: 6.5, color: COLORS.gray, align: "right" });
                }
            });

            state.y += h + gap;
        }
    };

    // Cards with a title and wrapped description (used for insights, glossary...)
    const infoCards = (items, o = {}) => {
        const { cols = 2, numbered = false, accent = COLORS.blue } = o;
        const gap = 4;
        const w = (CW - gap * (cols - 1)) / cols;
        const pad = 4.5;
        const badge = numbered ? 9 : 0;
        const textW = w - pad * 2 - badge;

        for (let i = 0; i < items.length; i += cols) {
            const row = items.slice(i, i + cols);
            const bodies = row.map((item) => measure(item.detail, textW, 8.5));
            const h = Math.max(...bodies.map((b) => 13 + b.length * 4));

            ensureSpace(h + gap);

            row.forEach((item, c) => {
                const x = PAGE.m + c * (w + gap);
                const y = state.y;

                card(x, y, w, h);
                pdf.setFillColor(...accent);
                pdf.rect(x, y + 2, 1.4, h - 4, "F");

                if (numbered) {
                    pdf.setFillColor(...accent);
                    pdf.circle(x + pad + 3.5, y + 7.5, 3.5, "F");
                    text(String(i + c + 1), x + pad + 3.5, y + 8.7, {
                        size: 9,
                        style: "bold",
                        color: COLORS.white,
                        align: "center",
                    });
                }

                text(truncate(item.title, 60), x + pad + badge, y + 7.5, { size: 9.5, style: "bold" });
                text(bodies[c], x + pad + badge, y + 12.5, { size: 8.5, color: [51, 65, 85] });
            });

            state.y += h + gap;
        }
    };

    const table = ({ head, body, foot, columnStyles, styles = {}, didParseCell }) => {
        // Short tables stay on one page; long ones (post table) may flow across pages
        ensureSpace(body.length <= 14 ? (body.length + 1) * 9 + 6 : 35);

        autoTable(pdf, {
            startY: state.y,
            head: [head],
            body,
            foot: foot ? [foot] : undefined,
            showFoot: "lastPage",
            theme: "grid",
            margin: { left: PAGE.m, right: PAGE.m, top: PAGE.top, bottom: 18 },
            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 2.6,
                lineColor: COLORS.border,
                lineWidth: 0.2,
                textColor: COLORS.navy,
                valign: "middle",
                ...styles,
            },
            headStyles: { fillColor: COLORS.navy, textColor: COLORS.white, fontStyle: "bold", halign: "center" },
            footStyles: { fillColor: COLORS.light, textColor: COLORS.navy, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles,
            didParseCell,
        });

        state.y = pdf.lastAutoTable.finalY + 6;
    };

    // Colours a "change" column green / red
    const colorChangeColumn = (columnIndex) => (data) => {
        if (data.section !== "body" || data.column.index !== columnIndex) return;

        const value = String(data.cell.text[0] || "");

        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = value.startsWith("+")
            ? COLORS.green
            : value.startsWith("-")
              ? COLORS.red
              : COLORS.gray;
    };

    // ==================================================
    // CHART HELPERS
    // ==================================================

    const drawLegend = (items, xRight, y) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);

        let x = xRight;

        [...items].reverse().forEach((item) => {
            const labelW = pdf.getTextWidth(item.label);

            x -= labelW;
            text(item.label, x, y, { size: 7.5, color: COLORS.gray });

            x -= 2;

            if (item.dash) {
                pdf.setDrawColor(...item.color);
                pdf.setLineWidth(0.6);
                pdf.setLineDashPattern([1.2, 1], 0);
                pdf.line(x - 5, y - 1, x, y - 1);
                pdf.setLineDashPattern([], 0);
                x -= 7;
            } else {
                pdf.setFillColor(...item.color);
                pdf.rect(x - 2.6, y - 2.6, 2.6, 2.6, "F");
                x -= 4.5;
            }

            x -= 3;
        });
    };

    const chartFrame = ({ title, note, legend, height }, draw) => {
        ensureSpace(height + 4);

        const x = PAGE.m;
        const y = state.y;

        card(x, y, CW, height);
        text(title, x + 5, y + 7, { size: 10, style: "bold" });

        if (legend) {
            drawLegend(legend, x + CW - 5, y + 7);
        } else if (note) {
            text(note, x + CW - 5, y + 7, { size: 7.5, color: COLORS.gray, align: "right" });
        }

        draw({ x: x + 5, y: y + 12, w: CW - 10, h: height - 16 });

        state.y = y + height + 5;
    };

    const drawYAxis = (px, py, pw, ph, scale, o = {}) => {
        const { color = COLORS.gray, side = "left", grid = true } = o;

        for (let v = 0; v <= scale.max + scale.step * 0.001; v += scale.step) {
            const yy = py + ph - (v / scale.max) * ph;

            if (grid) {
                pdf.setDrawColor(...COLORS.border);
                pdf.setLineWidth(0.15);
                pdf.line(px, yy, px + pw, yy);
            }

            text(num(Math.round(v * 100) / 100), side === "left" ? px - 1.5 : px + pw + 1.5, yy + 0.9, {
                size: 6.5,
                color,
                align: side === "left" ? "right" : "left",
            });
        }
    };

    // Horizontal bars (e.g. reach per post)
    const drawHBars = (items, area) => {
        const labelW = 58;
        const valueW = 16;
        const axisH = 6;
        const bx = area.x + labelW;
        const bw = area.w - labelW - valueW;
        const ph = area.h - axisH;
        const scale = niceScale(Math.max(...items.map((i) => i.value), 0));

        for (let v = 0; v <= scale.max + scale.step * 0.001; v += scale.step) {
            const gx = bx + (v / scale.max) * bw;

            pdf.setDrawColor(...COLORS.border);
            pdf.setLineWidth(0.15);
            pdf.line(gx, area.y, gx, area.y + ph);
            text(num(v), gx, area.y + ph + 4, { size: 6.5, color: COLORS.gray, align: "center" });
        }

        const rowH = ph / items.length;
        const barH = Math.min(rowH * 0.62, 6);

        items.forEach((item, i) => {
            const cy = area.y + i * rowH + rowH / 2;
            const w = (item.value / scale.max) * bw;

            text(item.label, area.x, cy + 1, { size: 7.5, style: item.top ? "bold" : "normal" });

            pdf.setFillColor(...item.color);
            pdf.rect(bx, cy - barH / 2, Math.max(w, 0.4), barH, "F");

            text(`${num(item.value)}${item.top ? "  TOP" : ""}`, bx + w + 1.5, cy + 1, {
                size: 7.5,
                style: "bold",
                color: item.top ? COLORS.green : COLORS.navy,
            });
        });
    };

    // Vertical stacked bars (interaction types per post)
    const drawStackedBars = (list, series, area) => {
        const leftPad = 12;
        const bottomPad = 7;
        const px = area.x + leftPad;
        const pw = area.w - leftPad;
        const py = area.y + 4;
        const ph = area.h - bottomPad - 4;

        const totals = list.map((p) => series.reduce((s, k) => s + (p[k.key] || 0), 0));
        const scale = niceScale(Math.max(...totals, 0));

        drawYAxis(px, py, pw, ph, scale);

        const slot = pw / list.length;
        const bw = Math.min(slot * 0.6, 14);

        list.forEach((post, i) => {
            const bx = px + i * slot + (slot - bw) / 2;
            let yy = py + ph;

            series.forEach((s) => {
                const h = ((post[s.key] || 0) / scale.max) * ph;

                if (h > 0) {
                    pdf.setFillColor(...s.color);
                    pdf.rect(bx, yy - h, bw, h, "F");
                    yy -= h;
                }
            });

            text(num(totals[i]), bx + bw / 2, yy - 1.2, { size: 6.5, style: "bold", align: "center" });
            text(`P${post.index}`, bx + bw / 2, py + ph + 4.5, { size: 7, color: COLORS.gray, align: "center" });
        });
    };

    // Grouped bars: current vs previous
    const drawGroupedBars = (categories, area) => {
        const leftPad = 14;
        const bottomPad = 7;
        const px = area.x + leftPad;
        const pw = area.w - leftPad;
        const py = area.y + 4;
        const ph = area.h - bottomPad - 4;

        const max = Math.max(...categories.flatMap((c) => [c.current || 0, c.previous || 0]), 0);
        const scale = niceScale(max);

        drawYAxis(px, py, pw, ph, scale);

        const slot = pw / categories.length;
        const bw = Math.min(slot * 0.26, 16);

        categories.forEach((cat, i) => {
            const cx = px + i * slot + slot / 2;

            [
                { value: cat.previous || 0, color: [147, 197, 253], x: cx - bw - 0.5 },
                { value: cat.current || 0, color: COLORS.blue, x: cx + 0.5 },
            ].forEach((bar) => {
                const h = (bar.value / scale.max) * ph;

                pdf.setFillColor(...bar.color);
                pdf.rect(bar.x, py + ph - h, bw, Math.max(h, 0.3), "F");
                text(num(bar.value), bar.x + bw / 2, py + ph - h - 1.2, { size: 6.5, style: "bold", align: "center" });
            });

            text(cat.label, cx, py + ph + 4.5, { size: 7.5, color: COLORS.gray, align: "center" });
        });
    };

    // Scatter: reach (x) vs engagement (y)
    const drawScatter = (list, area, topId, lowId) => {
        const leftPad = 16;
        const bottomPad = 11;
        const px = area.x + leftPad;
        const pw = area.w - leftPad - 4;
        const py = area.y + 4;
        const ph = area.h - bottomPad - 4;

        const xScale = niceScale(Math.max(...list.map((p) => p.reach || 0), 0));
        const yScale = niceScale(Math.max(...list.map((p) => p.engagement || 0), 0));

        drawYAxis(px, py, pw, ph, yScale);

        for (let v = 0; v <= xScale.max + xScale.step * 0.001; v += xScale.step) {
            const gx = px + (v / xScale.max) * pw;

            text(num(v), gx, py + ph + 4, { size: 6.5, color: COLORS.gray, align: "center" });
        }

        text("Reach (people)", px + pw / 2, py + ph + 9, { size: 7.5, color: COLORS.gray, align: "center" });
        text("Engagement", area.x + 1.5, py + ph / 2, { size: 7.5, color: COLORS.gray, angle: 90, align: "center" });

        list.forEach((post) => {
            const cx = px + ((post.reach || 0) / xScale.max) * pw;
            const cy = py + ph - ((post.engagement || 0) / yScale.max) * ph;
            const color = post.id === topId ? COLORS.green : post.id === lowId ? COLORS.amber : COLORS.blue;

            pdf.setFillColor(...color);
            pdf.circle(cx, cy, post.id === topId ? 2.2 : 1.7, "F");

            text(post.id === topId ? `P${post.index} (Top)` : `P${post.index}`, cx, cy - 3, {
                size: 6.5,
                style: post.id === topId ? "bold" : "normal",
                color: post.id === topId ? COLORS.green : COLORS.gray,
                align: "center",
            });
        });
    };

    // Dual-axis line chart over time
    const drawTrend = (list, seriesList, area, peakId) => {
        const leftPad = 14;
        const rightPad = seriesList.length > 1 ? 14 : 4;
        const bottomPad = 8;
        const px = area.x + leftPad;
        const pw = area.w - leftPad - rightPad;
        const py = area.y + 4;
        const ph = area.h - bottomPad - 4;
        const n = list.length;

        const xAt = (i) => (n === 1 ? px + pw / 2 : px + (i * pw) / (n - 1));

        seriesList.forEach((s, si) => {
            const scale = niceScale(Math.max(...list.map((p) => p[s.key] || 0), 0));

            drawYAxis(px, py, pw, ph, scale, { color: s.color, side: si === 0 ? "left" : "right", grid: si === 0 });

            const yAt = (v) => py + ph - ((v || 0) / scale.max) * ph;

            pdf.setDrawColor(...s.color);
            pdf.setLineWidth(0.7);

            if (s.dash) pdf.setLineDashPattern([1.6, 1.2], 0);

            for (let i = 1; i < n; i++) {
                pdf.line(xAt(i - 1), yAt(list[i - 1][s.key]), xAt(i), yAt(list[i][s.key]));
            }

            pdf.setLineDashPattern([], 0);

            list.forEach((post, i) => {
                pdf.setFillColor(...s.color);
                pdf.circle(xAt(i), yAt(post[s.key]), post.id === peakId ? 1.6 : 0.9, "F");
            });
        });

        const step = n > 10 ? 2 : 1;

        list.forEach((post, i) => {
            if (i % step === 0) {
                text(shortDate(post.date), xAt(i), py + ph + 5, { size: 6.5, color: COLORS.gray, align: "center" });
            }
        });
    };

    // ==================================================
    // 0. COVER PAGE
    // ==================================================

    const drawCover = () => {
        pdf.setFillColor(...COLORS.navy);
        pdf.rect(0, 0, PAGE.w, 112, "F");
        pdf.setFillColor(...COLORS.blue);
        pdf.rect(0, 112, PAGE.w, 2.5, "F");

        text(truncate(pageName.toUpperCase(), 48), PAGE.m, 28, { size: 11, style: "bold", color: [147, 197, 253] });
        text("MARKETING ANALYTICS", PAGE.m, 36, { size: 8.5, color: [148, 163, 184] });

        text("Facebook Page", PAGE.m, 68, { size: 30, style: "bold", color: COLORS.white });
        text("Performance Report", PAGE.m, 81, { size: 30, style: "bold", color: COLORS.white });

        paragraph(
            "A clear, data-driven analysis of page visibility, audience engagement and post-level performance.",
            PAGE.m,
            94,
            140,
            { size: 10.5, color: [203, 213, 225], lineH: 5 }
        );

        text("REPORT DETAILS", PAGE.m, 132, { size: 9, style: "bold", color: COLORS.blue });

        const generated = report.meta?.generatedAt ? new Date(report.meta.generatedAt) : new Date();
        const generatedLabel = `${String(generated.getDate()).padStart(2, "0")} ${generated.toLocaleDateString("en-US", { month: "long" })} ${generated.getFullYear()}`;

        [
            ["FACEBOOK PAGE", pageName],
            ["REPORTING PERIOD", periodLabel],
            ["COMPARED WITH", comparisonLabel],
            ["GENERATED DATE", generatedLabel],
            ["PREPARED FOR", preparedFor],
        ].forEach(([label, value], i) => {
            const y = 145 + i * 18;

            text(label, PAGE.m, y, { size: 7.5, style: "bold", color: COLORS.gray });
            text(truncate(value, 60), PAGE.m, y + 6.5, { size: 12, style: "bold" });

            pdf.setDrawColor(...COLORS.border);
            pdf.setLineWidth(0.3);
            pdf.line(PAGE.m, y + 10.5, PAGE.w - PAGE.m, y + 10.5);
        });

        text(
            `Data Source: Meta Graph API ${report.meta?.apiVersion || ""}     Format: Executive Organic Performance`,
            PAGE.m,
            262,
            { size: 8.5, color: COLORS.gray }
        );
    };

    drawCover();
    newPage();

    // ==================================================
    // 1. EXECUTIVE SUMMARY
    // ==================================================

    sectionHeader("1", "Executive Summary", `High-level overview of page activity and audience response, ${periodLabel}`);

    kpiGrid([
        { label: "Posts Published", value: num(current.postsCount), sub: "Organic feed posts", growth: growth.postsCount, color: COLORS.blue },
        { label: "Total Reach", value: num(current.reach), sub: "Sum of people reached per post", growth: growth.reach, color: COLORS.blue },
        { label: "Total Views", value: num(current.views), sub: "Times content was displayed", growth: growth.views, color: COLORS.purple },
        { label: "Total Engagements", value: num(current.engagement), sub: "Reactions, comments, shares, clicks", growth: growth.engagement, color: COLORS.green },
        { label: "Reactions", value: num(current.reactions), sub: "Likes, loves, wow and more", growth: growth.reactions, color: COLORS.green },
        { label: "Comments", value: num(current.comments), sub: "User conversations", growth: growth.comments, color: COLORS.green },
        { label: "Shares", value: num(current.shares), sub: "Content amplification", growth: growth.shares, color: COLORS.amber },
        { label: "Link Clicks", value: num(current.clicks), sub: "Traffic to store / website", growth: growth.clicks, color: COLORS.amber },
        { label: "Engagement Rate", value: pct(current.engagementRate), sub: "Engagements / Reach", growth: growth.engagementRate, unit: " pts", color: COLORS.red },
    ]);

    if (hasPosts && (report.summaryPoints || []).length) {
        text("Key Highlights", PAGE.m, state.y + 4, { size: 11, style: "bold" });
        state.y += 9;
        bulletList(report.summaryPoints);
    }

    (() => {
        const items = [
            "Reach measures how many individual people saw your content at least once.",
            "Views represent the total number of times your content was displayed on screen, including repeat views.",
            "Engagements show how many times people actively interacted: reacting, commenting, sharing or clicking.",
        ];
        const w = CW - 10;
        const heights = items.map((s) => measure(s, w - 5, 8.5).length * 4.2 + 1.5);
        const h = 13 + heights.reduce((a, b) => a + b, 0);

        ensureSpace(h + 4);

        card(PAGE.m, state.y, CW, h, { fill: COLORS.light });
        text("What do these numbers mean?", PAGE.m + 5, state.y + 7, { size: 10, style: "bold" });

        let yy = state.y + 13;

        items.forEach((item, i) => {
            pdf.setFillColor(...COLORS.blue);
            pdf.circle(PAGE.m + 6.5, yy - 1, 0.8, "F");
            paragraph(item, PAGE.m + 10, yy, w - 5, { size: 8.5, lineH: 4.2 });
            yy += heights[i];
        });

        state.y += h + 6;
    })();

    // ==================================================
    // 2. PERIOD COMPARISON
    // ==================================================

    sectionHeader("2", "Period Comparison", `Current period versus ${comparisonLabel}`, 130);

    table({
        head: ["Metric", "Current", "Previous", "Change"],
        body: [
            ["Posts Published", num(current.postsCount), num(previous.postsCount), growthText(growth.postsCount)],
            ["Total Reach", num(current.reach), num(previous.reach), growthText(growth.reach)],
            ["Total Views", num(current.views), num(previous.views), growthText(growth.views)],
            ["Reactions", num(current.reactions), num(previous.reactions), growthText(growth.reactions)],
            ["Comments", num(current.comments), num(previous.comments), growthText(growth.comments)],
            ["Shares", num(current.shares), num(previous.shares), growthText(growth.shares)],
            ["Link Clicks", num(current.clicks), num(previous.clicks), growthText(growth.clicks)],
            ["Total Engagement", num(current.engagement), num(previous.engagement), growthText(growth.engagement)],
            ["Engagement Rate", pct(current.engagementRate), pct(previous.engagementRate), growthText(growth.engagementRate, " pts")],
            ["Avg. Engagement per Post", num(current.avgEngagement), num(previous.avgEngagement), growthText(growth.avgEngagement)],
        ],
        columnStyles: {
            0: { cellWidth: 70 },
            1: { halign: "center" },
            2: { halign: "center" },
            3: { halign: "center" },
        },
        didParseCell: colorChangeColumn(3),
    });

    chartFrame(
        {
            title: "Interactions: Current vs Previous Period",
            legend: [
                { label: "Previous", color: [147, 197, 253] },
                { label: "Current", color: COLORS.blue },
            ],
            height: 62,
        },
        (area) =>
            drawGroupedBars(
                [
                    { label: "Reactions", current: current.reactions, previous: previous.reactions },
                    { label: "Comments", current: current.comments, previous: previous.comments },
                    { label: "Shares", current: current.shares, previous: previous.shares },
                    { label: "Link Clicks", current: current.clicks, previous: previous.clicks },
                ],
                area
            )
    );

    // ==================================================
    // 3. AUDIENCE PERFORMANCE
    // ==================================================

    sectionHeader("3", "Audience Performance", "Follower growth and page visits during the reporting period", 85);

    table({
        head: ["Metric", "Current", "Previous", "Change"],
        body: [
            ["Followers (end of period)", num(current.followers), num(previous.followers), growthText(growth.followers)],
            ["New Followers", num(current.newFollowers), num(previous.newFollowers), growthText(growth.newFollowers)],
            ["Unfollows", num(current.unfollows), num(previous.unfollows), "N/A"],
            ["Net Follower Growth", num(current.netFollowers), num(previous.netFollowers), growthText(growth.netFollowers)],
            ["Page Visits", num(current.pageVisits), num(previous.pageVisits), growthText(growth.pageVisits)],
        ],
        columnStyles: {
            0: { cellWidth: 70 },
            1: { halign: "center" },
            2: { halign: "center" },
            3: { halign: "center" },
        },
        didParseCell: colorChangeColumn(3),
    });

    if (!hasPosts) {
        takeawayBox("Note:", "No posts were published in this period, so post-level sections are not shown.");
    }

    // ==================================================
    // POST-LEVEL SECTIONS
    // ==================================================

    if (hasPosts) {
        const top = highlights.topEngagement;
        const topReachId = highlights.topReach?.id;
        const lowReachId = highlights.lowestReach?.id;

        // ---------------- 4. REACH PER POST ----------------

        sectionHeader("4", "Post Reach Comparison", "Comparing the audience size reached by each individual post");

        if (hasReach) {
            const reachPosts = limitPosts(posts.filter((p) => !isMissing(p.reach)), "reach");

            chartFrame(
                {
                    title: "Unique People Reached per Post",
                    note: reachPosts.length < posts.length ? `Top ${reachPosts.length} of ${posts.length} posts` : `Average: ${num(current.avgReach)}`,
                    height: Math.max(48, reachPosts.length * 7.5 + 22),
                },
                (area) =>
                    drawHBars(
                        reachPosts.map((p) => ({
                            label: `P${p.index}: ${truncate(p.title, 26)}`,
                            value: p.reach,
                            color: p.id === topReachId ? COLORS.green : p.id === lowReachId ? COLORS.amber : COLORS.blue,
                            top: p.id === topReachId,
                        })),
                        area
                    )
            );

            takeawayBox("KEY TAKEAWAY", takeaways.reach);
        } else {
            takeawayBox("NOTE", "Reach data was not returned by Meta for this period, so reach charts are omitted.");
        }

        // ---------------- 5. ENGAGEMENT BREAKDOWN ----------------

        sectionHeader("5", "Engagement Breakdown", "Detailed breakdown of interactions across all published posts");

        const engagementPosts = limitPosts(posts, "engagement");

        chartFrame(
            {
                title: "Interaction Types per Post",
                legend: [
                    { label: "Reactions", color: COLORS.blue },
                    { label: "Comments", color: COLORS.green },
                    { label: "Shares", color: COLORS.amber },
                    { label: "Link Clicks", color: COLORS.purple },
                ],
                height: 72,
            },
            (area) =>
                drawStackedBars(
                    engagementPosts,
                    [
                        { key: "reactions", color: COLORS.blue },
                        { key: "comments", color: COLORS.green },
                        { key: "shares", color: COLORS.amber },
                        { key: "clicks", color: COLORS.purple },
                    ],
                    area
                )
        );

        takeawayBox("KEY TAKEAWAY", takeaways.engagement);

        // ---------------- 6. TOP PERFORMING CONTENT ----------------

        sectionHeader("6", "Top Performing Content", "Standout posts by key performance metric");

        const avgReach = current.avgReach;

        const cards = [
            highlights.topReach && {
                label: "HIGHEST REACH",
                color: COLORS.blue,
                post: highlights.topReach,
                value: `${num(highlights.topReach.reach)} people`,
                note: avgReach ? `${(highlights.topReach.reach / avgReach).toFixed(1)}x the average post reach.` : "Reached the widest audience.",
            },
            top && {
                label: "HIGHEST ENGAGEMENT",
                color: COLORS.green,
                post: top,
                value: `${num(top.engagement)} total actions`,
                note: `${num(top.reactions)} reactions, ${num(top.comments)} comments, ${num(top.shares)} shares, ${num(top.clicks)} clicks.`,
            },
            highlights.topRate && {
                label: "HIGHEST ENGAGEMENT RATE",
                color: COLORS.purple,
                post: highlights.topRate,
                value: `${pct(highlights.topRate.engagementRate)} rate`,
                note: `About ${Math.round(highlights.topRate.engagementRate)} in every 100 people who saw it interacted with it.`,
            },
            highlights.topShares && highlights.topShares.shares > 0 && {
                label: "MOST SHARED",
                color: COLORS.amber,
                post: highlights.topShares,
                value: `${num(highlights.topShares.shares)} shares`,
                note: "The most amplified post, spreading to new audiences.",
            },
            highlights.topClicks && highlights.topClicks.clicks > 0 && {
                label: "MOST LINK CLICKS",
                color: COLORS.blue,
                post: highlights.topClicks,
                value: `${num(highlights.topClicks.clicks)} clicks`,
                note: current.clicks ? `${((highlights.topClicks.clicks / current.clicks) * 100).toFixed(1)}% of all link clicks this period.` : "Drove the most referral traffic.",
            },
            highlights.lowestReach && {
                label: "NEEDS ATTENTION",
                color: COLORS.red,
                post: highlights.lowestReach,
                value: `${num(highlights.lowestReach.reach)} people`,
                note: "Lowest reach of the period. Review timing, visual and topic.",
            },
        ].filter(Boolean);

        (() => {
            const gap = 4;
            const w = (CW - gap) / 2;
            const h = 32;

            for (let i = 0; i < cards.length; i += 2) {
                ensureSpace(h + gap);

                cards.slice(i, i + 2).forEach((c, k) => {
                    const x = PAGE.m + k * (w + gap);
                    const y = state.y;

                    card(x, y, w, h);
                    pdf.setFillColor(...c.color);
                    pdf.rect(x, y + 2, 1.4, h - 4, "F");

                    text(c.label, x + 5, y + 6.5, { size: 7, style: "bold", color: c.color });
                    text(truncate(`P${c.post.index}: ${c.post.title}`, 38), x + 5, y + 12.5, { size: 9.5, style: "bold" });
                    text(c.value, x + 5, y + 19.5, { size: 12, style: "bold", color: c.color });
                    paragraph(c.note, x + 5, y + 25, w - 9, { size: 7.5, color: COLORS.gray, lineH: 3.6 });
                });

                state.y += h + gap;
            }
        })();

        // ---------------- 7. POST-BY-POST TABLE ----------------

        sectionHeader("7", "Post-by-Post Performance", "Complete data breakdown for every post published in the period");

        table({
            head: ["#", "Date", "Post", "Format", "Reach", "Views", "React.", "Comm.", "Shares", "Clicks", "Total Eng.", "Eng. Rate"],
            body: posts.map((p) => [
                p.index,
                shortDate(p.date),
                p.title,
                p.format.charAt(0) + p.format.slice(1).toLowerCase(),
                num(p.reach),
                num(p.views),
                num(p.reactions),
                num(p.comments),
                num(p.shares),
                num(p.clicks),
                num(p.engagement),
                pct(p.engagementRate),
            ]),
            foot: [
                "",
                "",
                "Total",
                "",
                num(current.reach),
                num(current.views),
                num(current.reactions),
                num(current.comments),
                num(current.shares),
                num(current.clicks),
                num(current.engagement),
                pct(current.engagementRate),
            ],
            styles: { fontSize: 7.5, cellPadding: 1.6 },
            columnStyles: {
                0: { cellWidth: 7, halign: "center" },
                1: { cellWidth: 15, halign: "center" },
                2: { cellWidth: 33 },
                3: { cellWidth: 17, halign: "center" },
                4: { cellWidth: 14, halign: "center" },
                5: { cellWidth: 14, halign: "center" },
                6: { cellWidth: 13, halign: "center" },
                7: { cellWidth: 13, halign: "center" },
                8: { cellWidth: 14, halign: "center" },
                9: { cellWidth: 12, halign: "center" },
                10: { cellWidth: 14, halign: "center" },
                11: { cellWidth: 16, halign: "center" },
            },
            didParseCell: (data) => {
                if (data.section === "body" && top && posts[data.row.index]?.id === top.id) {
                    data.cell.styles.fillColor = COLORS.greenSoft;
                    data.cell.styles.fontStyle = "bold";
                }
            },
        });

        text("Green row = highest total engagement. Total Engagement = Reactions + Comments + Shares + Clicks. Engagement Rate = Total Engagement / Reach x 100.", PAGE.m, state.y, {
            size: 7.5,
            color: COLORS.gray,
        });
        state.y += 8;

        // ---------------- 8. CONTENT TYPE ANALYSIS ----------------

        sectionHeader("8", "Content Type Analysis", "How different post formats performed on average", 75);

        table({
            head: ["Format", "Posts", "Avg. Reach", "Avg. Views", "Avg. Engagement", "Eng. Rate"],
            body: formats.map((f) => [
                f.label,
                f.count,
                num(f.avgReach),
                num(f.avgViews),
                num(f.avgEngagement),
                pct(f.engagementRate),
            ]),
            columnStyles: {
                0: { cellWidth: 40, fontStyle: "bold" },
                1: { halign: "center" },
                2: { halign: "center" },
                3: { halign: "center" },
                4: { halign: "center" },
                5: { halign: "center" },
            },
        });

        takeawayBox("ANALYSIS", takeaways.contentType);

        // ---------------- 9. REACH VS ENGAGEMENT ----------------

        if (hasReach) {
            sectionHeader("9", "Reach vs. Engagement Relationship", "Each dot is a post: how far it travelled versus how much people interacted", 115);

            chartFrame(
                {
                    title: "Reach (x-axis) vs Engagement (y-axis)",
                    legend: [
                        { label: "Top post", color: COLORS.green },
                        { label: "Lowest reach", color: COLORS.amber },
                        { label: "Other posts", color: COLORS.blue },
                    ],
                    height: 82,
                },
                (area) => drawScatter(posts.filter((p) => !isMissing(p.reach)), area, top?.id, lowReachId)
            );

            takeawayBox("EXPLANATION", takeaways.relationship);
        }

        // ---------------- 10. PERFORMANCE TREND ----------------

        sectionHeader("10", "Performance Trend Over Time", "Chronological trend of post reach and engagement", 105);

        const trendSeries = [
            hasReach && { key: "reach", label: "Reach", color: COLORS.blue, dash: false },
            { key: "engagement", label: "Engagement", color: COLORS.green, dash: true },
        ].filter(Boolean);

        chartFrame(
            {
                title: `Timeline View (${shortDate(posts[0].date)} - ${shortDate(posts[posts.length - 1].date)})`,
                legend: trendSeries.map((s) => ({ label: s.label, color: s.color, dash: s.dash })),
                height: 70,
            },
            (area) => drawTrend(posts, trendSeries, area, top?.id)
        );

        takeawayBox("TREND INSIGHT", takeaways.trend);
    }

    // ==================================================
    // 11. KEY DATA INSIGHTS
    // ==================================================

    sectionHeader("11", "Key Data Insights", "Factual takeaways derived directly from the reporting data");
    infoCards(report.insights || [], { cols: 1, accent: COLORS.blue });

    // ==================================================
    // 12. STRATEGIC RECOMMENDATIONS
    // ==================================================

    sectionHeader("12", "Strategic Recommendations", "Practical steps to improve the next reporting period");
    infoCards(report.recommendations || [], { cols: 1, numbered: true, accent: COLORS.green });

    // ==================================================
    // 13. GLOSSARY
    // ==================================================

    sectionHeader("13", "Understanding Your Meta Report", "Simple definitions of the metrics used in this report");
    infoCards(
        [
            { title: "Reach", detail: "The number of unique people who saw your post at least once." },
            { title: "Views", detail: "The total number of times your content was displayed. One person can generate several views." },
            { title: "Engagement", detail: "Any action taken on a post: reactions, comments, shares and link clicks." },
            { title: "Engagement Rate", detail: "The share of people reached who interacted: Total Engagement / Reach x 100." },
            { title: "Link Clicks", detail: "Clicks on links inside your posts that lead to your website or catalogue." },
            { title: "Shares", detail: "When people repost your content to their own profile, spreading it to new audiences." },
        ],
        { cols: 2, accent: COLORS.purple }
    );

    // ==================================================
    // 14. DATA QUALITY
    // ==================================================

    sectionHeader("14", "Data Quality & Platform Limitations", "Important context about how this data was collected");
    infoCards(report.dataNotes || [], { cols: 1, accent: COLORS.amber });

    // ==================================================
    // 15. FINAL SUMMARY
    // ==================================================

    sectionHeader("15", "Final Executive Summary", `Overall performance synthesis for ${pageName}`, 88);

    (() => {
        const lines = measure(report.summary || "", CW - 12, 10);
        const h = 20 + lines.length * 5;

        ensureSpace(h + 30);

        card(PAGE.m, state.y, CW, h, { fill: COLORS.blueSoft, border: [191, 219, 254] });
        text("Performance Conclusion", PAGE.m + 6, state.y + 8, { size: 11, style: "bold", color: COLORS.blue });
        text(lines, PAGE.m + 6, state.y + 15, { size: 10 });

        state.y += h + 10;

        text("Report Prepared By:", PAGE.m, state.y, { size: 8.5, color: COLORS.gray });
        text(preparedBy, PAGE.m, state.y + 6, { size: 11, style: "bold" });
        text("Confidential - For Internal & Client Use Only", PAGE.m, state.y + 13, { size: 8, color: COLORS.gray });
    })();

    // ==================================================
    // HEADERS & FOOTERS (all pages except the cover)
    // ==================================================

    const totalPages = pdf.internal.getNumberOfPages();

    for (let page = 2; page <= totalPages; page++) {
        pdf.setPage(page);

        text(truncate(pageName, 40), PAGE.m, 11, { size: 8, style: "bold", color: COLORS.gray });
        text("Facebook Page Performance Report", PAGE.w - PAGE.m, 11, { size: 8, color: COLORS.gray, align: "right" });

        pdf.setDrawColor(...COLORS.border);
        pdf.setLineWidth(0.3);
        pdf.line(PAGE.m, 13.5, PAGE.w - PAGE.m, 13.5);
        pdf.line(PAGE.m, 287, PAGE.w - PAGE.m, 287);

        text(`${truncate(pageName, 40)} - Meta Performance Report`, PAGE.m, 292, { size: 8, color: COLORS.gray });
        text(`Page ${page} of ${totalPages}`, PAGE.w - PAGE.m, 292, { size: 8, color: COLORS.gray, align: "right" });
    }

    pdf.setProperties({
        title: `${pageName} - Facebook Page Performance Report`,
        subject: periodLabel,
        creator: preparedBy,
    });

    return pdf;
};
