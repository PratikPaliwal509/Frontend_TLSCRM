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

const PAGE = {
    w: 210,
    h: 297,
    m: 12,
    top: 20,
    bottom: 280,
};

const CW = PAGE.w - PAGE.m * 2;

const MAX_CHART_POSTS = 8;

// ======================================================
// FORMATTERS
// ======================================================

const isMissing = (v) => v === null || v === undefined;

const num = (v) =>
    isMissing(v)
        ? "N/A"
        : Number(v).toLocaleString("en-IN");

const pct = (v, digits = 2) =>
    isMissing(v)
        ? "N/A"
        : `${Number(v).toFixed(digits)}%`;

const growthText = (g, unit = "%") => {
    if (isMissing(g)) return "N/A";
    if (g === 0) return `0.0${unit}`;

    return `${g > 0 ? "+" : ""}${Number(g).toFixed(1)}${unit}`;
};

const growthColor = (g) => {
    if (isMissing(g) || g === 0) return COLORS.gray;
    return g > 0 ? COLORS.green : COLORS.red;
};

const monthShort = (d) =>
    d.toLocaleDateString("en-US", {
        month: "short",
    });

const longDate = (iso) => {
    if (!iso) return "";

    const d = new Date(`${iso}T00:00:00`);

    return `${String(d.getDate()).padStart(2, "0")} ${monthShort(
        d
    )} ${d.getFullYear()}`;
};

const shortDate = (iso) => {
    if (!iso) return "";

    const d = new Date(`${iso}T00:00:00`);

    return `${monthShort(d)} ${String(d.getDate()).padStart(2, "0")}`;
};

const truncate = (str, max) => {
    const s = String(str || "");
    return s.length > max
        ? `${s.slice(0, max - 3)}...`
        : s;
};

// ======================================================
// SCALE
// ======================================================

const niceScale = (max, ticks = 4) => {
    if (!max || max <= 0) {
        return {
            max: 1,
            step: 0.25,
        };
    }

    const raw = max / ticks;
    const mag = Math.pow(
        10,
        Math.floor(Math.log10(raw))
    );

    const norm = raw / mag;

    const step =
        (norm <= 1
            ? 1
            : norm <= 2
                ? 2
                : norm <= 5
                    ? 5
                    : 10) * mag;

    return {
        max: Math.ceil(max / step) * step,
        step,
    };
};

// ======================================================
// LIMIT POSTS
// ======================================================

const limitPosts = (posts, key) => {
    if (posts.length <= MAX_CHART_POSTS) {
        return posts;
    }

    return [...posts]
        .sort(
            (a, b) =>
                (b[key] || 0) - (a[key] || 0)
        )
        .slice(0, MAX_CHART_POSTS)
        .sort(
            (a, b) =>
                (a.index || 0) - (b.index || 0)
        );
};

// ======================================================
// MAIN
// ======================================================

export const createFacebookReportPdf = (
    report,
    options = {}
) => {
    const {
        preparedFor = "Business Owner / Management",
        preparedBy = "Digital Analytics & Marketing Team",
    } = options;

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const state = {
        y: PAGE.top,
    };

    // ==================================================
    // DATA
    // ==================================================

    const current = report.current || {};
    const previous = report.previous || {};
    const growth = report.growth || {};
    const posts = report.posts || [];
    const formats = report.formats || [];
    const highlights = report.highlights || {};
    const takeaways = report.takeaways || {};

    const pageName =
        report.meta?.pageName || "Facebook Page";

    const periodLabel =
        `${longDate(report.period?.from)} - ${longDate(
            report.period?.to
        )}`;

    const comparisonLabel =
        `${longDate(report.comparison?.from)} - ${longDate(
            report.comparison?.to
        )}`;

    const hasPosts = posts.length > 0;

    const hasReach = posts.some(
        (p) => !isMissing(p.reach)
    );

    // ==================================================
    // BASIC DRAWING
    // ==================================================

    const text = (
        str,
        x,
        y,
        o = {}
    ) => {
        const {
            size = 10,
            style = "normal",
            color = COLORS.navy,
            align = "left",
            angle,
        } = o;

        pdf.setFont("helvetica", style);
        pdf.setFontSize(size);
        pdf.setTextColor(...color);

        pdf.text(
            Array.isArray(str)
                ? str
                : String(str),
            x,
            y,
            {
                align,
                angle,
            }
        );
    };

    const paragraph = (
        str,
        x,
        y,
        w,
        o = {}
    ) => {
        const {
            size = 9,
            style = "normal",
            color = COLORS.navy,
            lineH = 4,
        } = o;

        pdf.setFont(
            "helvetica",
            style
        );

        pdf.setFontSize(size);
        pdf.setTextColor(...color);

        const lines =
            pdf.splitTextToSize(
                String(str || ""),
                w
            );

        pdf.text(lines, x, y);

        return lines.length * lineH;
    };

    const measure = (
        str,
        w,
        size = 9,
        style = "normal"
    ) => {
        pdf.setFont(
            "helvetica",
            style
        );

        pdf.setFontSize(size);

        return pdf.splitTextToSize(
            String(str || ""),
            w
        );
    };

    // ==================================================
    // CARD
    // ==================================================

    const card = (
        x,
        y,
        w,
        h,
        o = {}
    ) => {
        const {
            fill = COLORS.white,
            border = COLORS.border,
        } = o;

        pdf.setFillColor(...fill);
        pdf.setDrawColor(...border);
        pdf.setLineWidth(0.25);

        pdf.roundedRect(
            x,
            y,
            w,
            h,
            1.5,
            1.5,
            "FD"
        );
    };

    // ==================================================
    // PAGE
    // ==================================================

    const newPage = () => {
        pdf.addPage();
        state.y = PAGE.top;
    };

    const ensureSpace = (h) => {
        if (
            state.y + h >
            PAGE.bottom
        ) {
            newPage();
        }
    };

    // ==================================================
    // SECTION HEADER
    // ==================================================

    const sectionHeader = (
        number,
        title,
        subtitle = "",
        minSpace = 40
    ) => {
        ensureSpace(minSpace);

        text(
            `${number}. ${title}`,
            PAGE.m,
            state.y + 4,
            {
                size: 12.5,
                style: "bold",
            }
        );

        if (subtitle) {
            text(
                truncate(subtitle, 120),
                PAGE.m,
                state.y + 9,
                {
                    size: 7.5,
                    color: COLORS.gray,
                }
            );
        }

        pdf.setDrawColor(
            ...COLORS.border
        );

        pdf.setLineWidth(0.35);

        pdf.line(
            PAGE.m,
            state.y + 12,
            PAGE.w - PAGE.m,
            state.y + 12
        );

        state.y += 17;
    };

    // ==================================================
    // KPI GRID
    // ==================================================

    const kpiGrid = (
        items,
        cols = 3
    ) => {
        const gap = 3;

        const w =
            (CW -
                gap * (cols - 1)) /
            cols;

        const h = 22;

        for (
            let i = 0;
            i < items.length;
            i += cols
        ) {
            ensureSpace(
                h + gap
            );

            const rowY =
                state.y;

            items
                .slice(i, i + cols)
                .forEach(
                    (
                        item,
                        c
                    ) => {
                        const x =
                            PAGE.m +
                            c *
                            (w + gap);

                        card(
                            x,
                            rowY,
                            w,
                            h
                        );

                        pdf.setFillColor(
                            ...item.color
                        );

                        pdf.rect(
                            x,
                            rowY + 1.5,
                            1.2,
                            h - 3,
                            "F"
                        );

                        text(
                            item.label.toUpperCase(),
                            x + 4,
                            rowY + 5.5,
                            {
                                size: 6.3,
                                style: "bold",
                                color: COLORS.gray,
                            }
                        );

                        text(
                            item.value,
                            x + 4,
                            rowY + 13.5,
                            {
                                size: 13,
                                style: "bold",
                            }
                        );

                        if (
                            item.growth !==
                            undefined
                        ) {
                            text(
                                growthText(
                                    item.growth,
                                    item.unit
                                ),
                                x +
                                w -
                                3,
                                rowY + 6,
                                {
                                    size: 7,
                                    style: "bold",
                                    color:
                                        growthColor(
                                            item.growth
                                        ),
                                    align: "right",
                                }
                            );
                        }

                        text(
                            item.sub,
                            x + 4,
                            rowY + 19,
                            {
                                size: 6.2,
                                color: COLORS.gray,
                            }
                        );
                    }
                );

            state.y +=
                h + gap;
        }
    };

    // ==================================================
    // TABLE
    // ==================================================

    const table = ({
        head,
        body,
        foot,
        columnStyles,
        styles = {},
        didParseCell,
    }) => {
        ensureSpace(
            body.length <= 12
                ? (body.length + 1) *
                    6.5 +
                    5
                : 25
        );

        autoTable(pdf, {
            startY: state.y,

            head: [head],

            body,

            foot: foot
                ? [foot]
                : undefined,

            showFoot: "lastPage",

            theme: "grid",

            margin: {
                left: PAGE.m,
                right: PAGE.m,
                top: PAGE.top,
                bottom: 17,
            },

            styles: {
                font: "helvetica",
                fontSize: 7.5,
                cellPadding: 1.8,
                lineColor:
                    COLORS.border,
                lineWidth: 0.15,
                textColor:
                    COLORS.navy,
                valign: "middle",
                ...styles,
            },

            headStyles: {
                fillColor:
                    COLORS.navy,
                textColor:
                    COLORS.white,
                fontStyle:
                    "bold",
                halign:
                    "center",
                fontSize: 7.5,
            },

            footStyles: {
                fillColor:
                    COLORS.light,
                textColor:
                    COLORS.navy,
                fontStyle:
                    "bold",
                fontSize: 7,
            },

            alternateRowStyles: {
                fillColor: [
                    248,
                    250,
                    252,
                ],
            },

            columnStyles,

            didParseCell,
        });

        state.y =
            pdf.lastAutoTable.finalY +
            4;
    };

    // ==================================================
    // CHANGE COLUMN
    // ==================================================

    const colorChangeColumn =
        (columnIndex) =>
        (data) => {
            if (
                data.section !==
                    "body" ||
                data.column.index !==
                    columnIndex
            ) {
                return;
            }

            const value =
                String(
                    data.cell
                        .text?.[0] ||
                        ""
                );

            data.cell.styles.fontStyle =
                "bold";

            data.cell.styles.textColor =
                value.startsWith("+")
                    ? COLORS.green
                    : value.startsWith("-")
                        ? COLORS.red
                        : COLORS.gray;
        };

    // ==================================================
    // TAKEAWAY
    // ==================================================

    const takeawayBox = (
        label,
        body
    ) => {
        if (!body) return;

        const w =
            CW - 10;

        const lines =
            measure(
                body,
                w,
                8
            );

        const h =
            10 +
            lines.length *
                3.7;

        ensureSpace(
            h + 3
        );

        card(
            PAGE.m,
            state.y,
            CW,
            h,
            {
                fill:
                    COLORS.blueSoft,
                border: [
                    191,
                    219,
                    254,
                ],
            }
        );

        text(
            label,
            PAGE.m + 4,
            state.y + 5,
            {
                size: 7,
                style: "bold",
                color:
                    COLORS.blue,
            }
        );

        paragraph(
            body,
            PAGE.m + 4,
            state.y + 9,
            w,
            {
                size: 8,
                lineH: 3.7,
            }
        );

        state.y +=
            h + 4;
    };

    // ==================================================
    // CHART FRAME
    // ==================================================

    const drawLegend = (
        items,
        xRight,
        y
    ) => {
        let x =
            xRight;

        [...items]
            .reverse()
            .forEach(
                (item) => {
                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );

                    pdf.setFontSize(
                        6.5
                    );

                    const labelW =
                        pdf.getTextWidth(
                            item.label
                        );

                    x -=
                        labelW;

                    text(
                        item.label,
                        x,
                        y,
                        {
                            size: 6.5,
                            color:
                                COLORS.gray,
                        }
                    );

                    x -= 2;

                    if (
                        item.dash
                    ) {
                        pdf.setDrawColor(
                            ...item.color
                        );

                        pdf.setLineWidth(
                            0.5
                        );

                        pdf.setLineDashPattern(
                            [
                                1,
                                1,
                            ],
                            0
                        );

                        pdf.line(
                            x - 4,
                            y - 1,
                            x,
                            y - 1
                        );

                        pdf.setLineDashPattern(
                            [],
                            0
                        );

                        x -= 6;
                    } else {
                        pdf.setFillColor(
                            ...item.color
                        );

                        pdf.rect(
                            x - 2,
                            y - 2,
                            2,
                            2,
                            "F"
                        );

                        x -= 4;
                    }

                    x -= 3;
                }
            );
    };

    const chartFrame = (
        {
            title,
            note,
            legend,
            height,
        },
        draw
    ) => {
        ensureSpace(
            height + 3
        );

        const x =
            PAGE.m;

        const y =
            state.y;

        card(
            x,
            y,
            CW,
            height
        );

        text(
            title,
            x + 4,
            y + 6,
            {
                size: 8.5,
                style: "bold",
            }
        );

        if (legend) {
            drawLegend(
                legend,
                x + CW - 4,
                y + 6
            );
        } else if (
            note
        ) {
            text(
                note,
                x + CW - 4,
                y + 6,
                {
                    size: 6.5,
                    color:
                        COLORS.gray,
                    align: "right",
                }
            );
        }

        draw({
            x: x + 4,
            y: y + 10,
            w: CW - 8,
            h: height - 13,
        });

        state.y =
            y + height + 4;
    };

    // ==================================================
    // Y AXIS
    // ==================================================

    const drawYAxis = (
        px,
        py,
        pw,
        ph,
        scale,
        o = {}
    ) => {
        const {
            color = COLORS.gray,
            side = "left",
            grid = true,
        } = o;

        for (
            let v = 0;
            v <=
            scale.max +
                scale.step *
                    0.001;
            v +=
                scale.step
        ) {
            const yy =
                py +
                ph -
                (v /
                    scale.max) *
                    ph;

            if (grid) {
                pdf.setDrawColor(
                    ...COLORS.border
                );

                pdf.setLineWidth(
                    0.12
                );

                pdf.line(
                    px,
                    yy,
                    px + pw,
                    yy
                );
            }

            text(
                num(
                    Math.round(
                        v * 100
                    ) / 100
                ),
                side ===
                    "left"
                    ? px - 1
                    : px +
                    pw +
                    1,
                yy + 0.8,
                {
                    size: 5.8,
                    color,
                    align:
                        side ===
                            "left"
                            ? "right"
                            : "left",
                }
            );
        }
    };

    // ==================================================
    // HORIZONTAL BARS
    // ==================================================

    const drawHBars = (
        items,
        area
    ) => {
        const labelW = 54;
        const valueW = 14;

        const axisH = 5;

        const bx =
            area.x +
            labelW;

        const bw =
            area.w -
            labelW -
            valueW;

        const ph =
            area.h -
            axisH;

        const scale =
            niceScale(
                Math.max(
                    ...items.map(
                        (i) =>
                            i.value ||
                            0
                    ),
                    0
                )
            );

        for (
            let v = 0;
            v <=
            scale.max +
                scale.step *
                    0.001;
            v +=
                scale.step
        ) {
            const gx =
                bx +
                (v /
                    scale.max) *
                    bw;

            pdf.setDrawColor(
                ...COLORS.border
            );

            pdf.setLineWidth(
                0.12
            );

            pdf.line(
                gx,
                area.y,
                gx,
                area.y +
                    ph
            );

            text(
                num(v),
                gx,
                area.y +
                    ph +
                    3.5,
                {
                    size: 5.8,
                    color:
                        COLORS.gray,
                    align:
                        "center",
                }
            );
        }

        const rowH =
            ph /
            Math.max(
                items.length,
                1
            );

        const barH =
            Math.min(
                rowH * 0.55,
                5
            );

        items.forEach(
            (
                item,
                i
            ) => {
                const cy =
                    area.y +
                    i *
                        rowH +
                    rowH / 2;

                const w =
                    (item.value /
                        scale.max) *
                    bw;

                text(
                    item.label,
                    area.x,
                    cy + 1,
                    {
                        size: 6.5,
                        style:
                            item.top
                                ? "bold"
                                : "normal",
                    }
                );

                pdf.setFillColor(
                    ...item.color
                );

                pdf.rect(
                    bx,
                    cy -
                        barH /
                            2,
                    Math.max(
                        w,
                        0.4
                    ),
                    barH,
                    "F"
                );

                text(
                    num(
                        item.value
                    ),
                    bx +
                        w +
                        1,
                    cy + 1,
                    {
                        size: 6.5,
                        style:
                            "bold",
                        color:
                            item.top
                                ? COLORS.green
                                : COLORS.navy,
                    }
                );
            }
        );
    };

    // ==================================================
    // STACKED BARS
    // ==================================================

    const drawStackedBars = (
        list,
        series,
        area
    ) => {
        const leftPad = 11;
        const bottomPad = 7;

        const px =
            area.x +
            leftPad;

        const pw =
            area.w -
            leftPad;

        const py =
            area.y + 3;

        const ph =
            area.h -
            bottomPad -
            3;

        const totals =
            list.map(
                (p) =>
                    series.reduce(
                        (sum, s) =>
                            sum +
                            (p[
                                s.key
                            ] ||
                                0),
                        0
                    )
            );

        const scale =
            niceScale(
                Math.max(
                    ...totals,
                    0
                )
            );

        drawYAxis(
            px,
            py,
            pw,
            ph,
            scale
        );

        const slot =
            pw /
            Math.max(
                list.length,
                1
            );

        const bw =
            Math.min(
                slot * 0.55,
                11
            );

        list.forEach(
            (
                post,
                i
            ) => {
                const bx =
                    px +
                    i *
                        slot +
                    (slot -
                        bw) /
                        2;

                let yy =
                    py + ph;

                series.forEach(
                    (s) => {
                        const h =
                            ((post[
                                s.key
                            ] ||
                                0) /
                                scale.max) *
                            ph;

                        if (
                            h >
                            0
                        ) {
                            pdf.setFillColor(
                                ...s.color
                            );

                            pdf.rect(
                                bx,
                                yy -
                                    h,
                                bw,
                                h,
                                "F"
                            );

                            yy -= h;
                        }
                    }
                );

                text(
                    num(
                        totals[i]
                    ),
                    bx +
                        bw /
                            2,
                    yy - 1,
                    {
                        size: 5.8,
                        style:
                            "bold",
                        align:
                            "center",
                    }
                );

                text(
                    `P${post.index}`,
                    bx +
                        bw /
                            2,
                    py +
                        ph +
                        4,
                    {
                        size: 6.5,
                        color:
                            COLORS.gray,
                        align:
                            "center",
                    }
                );
            }
        );
    };

    // ==================================================
    // TREND CHART
    // ==================================================

    const drawTrend = (
        list,
        seriesList,
        area,
        peakId
    ) => {
        const leftPad = 13;
        const rightPad =
            seriesList.length >
            1
                ? 12
                : 3;

        const bottomPad = 8;

        const px =
            area.x +
            leftPad;

        const pw =
            area.w -
            leftPad -
            rightPad;

        const py =
            area.y + 3;

        const ph =
            area.h -
            bottomPad -
            3;

        const n =
            list.length;

        const xAt = (i) =>
            n === 1
                ? px +
                    pw /
                        2
                : px +
                    (i *
                        pw) /
                        (n -
                            1);

        seriesList.forEach(
            (
                s,
                si
            ) => {
                const scale =
                    niceScale(
                        Math.max(
                            ...list.map(
                                (
                                    p
                                ) =>
                                    p[
                                        s.key
                                    ] ||
                                    0
                            ),
                            0
                        )
                    );

                drawYAxis(
                    px,
                    py,
                    pw,
                    ph,
                    scale,
                    {
                        color:
                            s.color,
                        side:
                            si ===
                            0
                                ? "left"
                                : "right",
                        grid:
                            si === 0,
                    }
                );

                const yAt = (
                    v
                ) =>
                    py +
                    ph -
                    ((v ||
                        0) /
                        scale.max) *
                        ph;

                pdf.setDrawColor(
                    ...s.color
                );

                pdf.setLineWidth(
                    0.6
                );

                if (
                    s.dash
                ) {
                    pdf.setLineDashPattern(
                        [
                            1.5,
                            1,
                        ],
                        0
                    );
                }

                for (
                    let i = 1;
                    i < n;
                    i++
                ) {
                    pdf.line(
                        xAt(
                            i -
                                1
                        ),
                        yAt(
                            list[
                                i -
                                    1
                            ][
                                s.key
                            ]
                        ),
                        xAt(i),
                        yAt(
                            list[i][
                                s.key
                            ]
                        )
                    );
                }

                pdf.setLineDashPattern(
                    [],
                    0
                );

                list.forEach(
                    (
                        post,
                        i
                    ) => {
                        pdf.setFillColor(
                            ...s.color
                        );

                        pdf.circle(
                            xAt(i),
                            yAt(
                                post[
                                    s.key
                                ]
                            ),
                            post.id ===
                                peakId
                                ? 1.4
                                : 0.8,
                            "F"
                        );
                    }
                );
            }
        );

        const step =
            n > 10
                ? 2
                : 1;

        list.forEach(
            (
                post,
                i
            ) => {
                if (
                    i %
                        step ===
                    0
                ) {
                    text(
                        shortDate(
                            post.date
                        ),
                        xAt(i),
                        py +
                            ph +
                            5,
                        {
                            size: 5.8,
                            color:
                                COLORS.gray,
                            align:
                                "center",
                        }
                    );
                }
            }
        );
    };

    // ==================================================
    // COVER PAGE
    // ==================================================

    const drawCover = () => {
        pdf.setFillColor(
            ...COLORS.navy
        );

        pdf.rect(
            0,
            0,
            PAGE.w,
            100,
            "F"
        );

        pdf.setFillColor(
            ...COLORS.blue
        );

        pdf.rect(
            0,
            100,
            PAGE.w,
            2,
            "F"
        );

        text(
            truncate(
                pageName.toUpperCase(),
                45
            ),
            PAGE.m,
            25,
            {
                size: 10,
                style: "bold",
                color: [
                    147,
                    197,
                    253,
                ],
            }
        );

        text(
            "MARKETING ANALYTICS",
            PAGE.m,
            32,
            {
                size: 7.5,
                color: [
                    148,
                    163,
                    184,
                ],
            }
        );

        text(
            "Facebook Page",
            PAGE.m,
            60,
            {
                size: 27,
                style: "bold",
                color:
                    COLORS.white,
            }
        );

        text(
            "Performance Report",
            PAGE.m,
            72,
            {
                size: 27,
                style: "bold",
                color:
                    COLORS.white,
            }
        );

        paragraph(
            "A concise data-driven view of page reach, engagement and content performance.",
            PAGE.m,
            85,
            145,
            {
                size: 9,
                color: [
                    203,
                    213,
                    225,
                ],
                lineH: 4.3,
            }
        );

        text(
            "REPORT DETAILS",
            PAGE.m,
            119,
            {
                size: 8,
                style: "bold",
                color:
                    COLORS.blue,
            }
        );

        const generated =
            report.meta
                ?.generatedAt
                ? new Date(
                    report.meta.generatedAt
                )
                : new Date();

        const generatedLabel =
            `${String(
                generated.getDate()
            ).padStart(
                2,
                "0"
            )} ${generated.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                }
            )} ${generated.getFullYear()}`;

        [
            [
                "FACEBOOK PAGE",
                pageName,
            ],
            [
                "REPORTING PERIOD",
                periodLabel,
            ],
            [
                "COMPARED WITH",
                comparisonLabel,
            ],
            [
                "GENERATED DATE",
                generatedLabel,
            ],
            [
                "PREPARED FOR",
                preparedFor,
            ],
        ].forEach(
            (
                [label, value],
                i
            ) => {
                const y =
                    131 +
                    i * 15;

                text(
                    label,
                    PAGE.m,
                    y,
                    {
                        size: 6.5,
                        style:
                            "bold",
                        color:
                            COLORS.gray,
                    }
                );

                text(
                    truncate(
                        value,
                        60
                    ),
                    PAGE.m,
                    y + 5,
                    {
                        size: 10,
                        style:
                            "bold",
                    }
                );

                pdf.setDrawColor(
                    ...COLORS.border
                );

                pdf.setLineWidth(
                    0.2
                );

                pdf.line(
                    PAGE.m,
                    y + 8,
                    PAGE.w -
                        PAGE.m,
                    y + 8
                );
            }
        );

        text(
            `Data Source: Meta Graph API ${report.meta?.apiVersion || ""}`,
            PAGE.m,
            262,
            {
                size: 7.5,
                color:
                    COLORS.gray,
            }
        );
    };

    drawCover();
    newPage();

    // ==================================================
    // 1. EXECUTIVE SUMMARY
    // ==================================================

    sectionHeader(
        "1",
        "Executive Summary",
        `${periodLabel} | Compared with ${comparisonLabel}`,
        45
    );

    kpiGrid([
        {
            label: "Posts",
            value: num(
                current.postsCount
            ),
            sub: "Published",
            growth:
                growth.postsCount,
            color:
                COLORS.blue,
        },
        {
            label: "Reach",
            value: num(
                current.reach
            ),
            sub: "People reached",
            growth:
                growth.reach,
            color:
                COLORS.blue,
        },
        {
            label: "Views",
            value: num(
                current.views
            ),
            sub: "Content views",
            growth:
                growth.views,
            color:
                COLORS.purple,
        },
        {
            label: "Engagement",
            value: num(
                current.engagement
            ),
            sub: "Total actions",
            growth:
                growth.engagement,
            color:
                COLORS.green,
        },
        {
            label: "Reactions",
            value: num(
                current.reactions
            ),
            sub: "Likes & reactions",
            growth:
                growth.reactions,
            color:
                COLORS.green,
        },
        {
            label: "Comments",
            value: num(
                current.comments
            ),
            sub: "Conversations",
            growth:
                growth.comments,
            color:
                COLORS.green,
        },
        {
            label: "Shares",
            value: num(
                current.shares
            ),
            sub: "Amplification",
            growth:
                growth.shares,
            color:
                COLORS.amber,
        },
        {
            label: "Clicks",
            value: num(
                current.clicks
            ),
            sub: "Link traffic",
            growth:
                growth.clicks,
            color:
                COLORS.amber,
        },
        {
            label: "Eng. Rate",
            value: pct(
                current.engagementRate
            ),
            sub: "Engagement / Reach",
            growth:
                growth.engagementRate,
            unit: " pts",
            color:
                COLORS.red,
        },
    ]);

    // ==================================================
    // PERIOD COMPARISON
    // ==================================================

    sectionHeader(
        "2",
        "Period Comparison",
        "Current period versus previous period",
        80
    );

    table({
        head: [
            "Metric",
            "Current",
            "Previous",
            "Change",
        ],

        body: [
            [
                "Posts",
                num(
                    current.postsCount
                ),
                num(
                    previous.postsCount
                ),
                growthText(
                    growth.postsCount
                ),
            ],
            [
                "Reach",
                num(
                    current.reach
                ),
                num(
                    previous.reach
                ),
                growthText(
                    growth.reach
                ),
            ],
            [
                "Views",
                num(
                    current.views
                ),
                num(
                    previous.views
                ),
                growthText(
                    growth.views
                ),
            ],
            [
                "Reactions",
                num(
                    current.reactions
                ),
                num(
                    previous.reactions
                ),
                growthText(
                    growth.reactions
                ),
            ],
            [
                "Comments",
                num(
                    current.comments
                ),
                num(
                    previous.comments
                ),
                growthText(
                    growth.comments
                ),
            ],
            [
                "Shares",
                num(
                    current.shares
                ),
                num(
                    previous.shares
                ),
                growthText(
                    growth.shares
                ),
            ],
            [
                "Link Clicks",
                num(
                    current.clicks
                ),
                num(
                    previous.clicks
                ),
                growthText(
                    growth.clicks
                ),
            ],
            [
                "Engagement",
                num(
                    current.engagement
                ),
                num(
                    previous.engagement
                ),
                growthText(
                    growth.engagement
                ),
            ],
            [
                "Engagement Rate",
                pct(
                    current.engagementRate
                ),
                pct(
                    previous.engagementRate
                ),
                growthText(
                    growth.engagementRate,
                    " pts"
                ),
            ],
        ],

        columnStyles: {
            0: {
                cellWidth: 62,
            },
            1: {
                halign:
                    "center",
            },
            2: {
                halign:
                    "center",
            },
            3: {
                halign:
                    "center",
            },
        },

        didParseCell:
            colorChangeColumn(3),
    });

    // ==================================================
    // 3. INTERACTION CHART
    // ==================================================

    chartFrame(
        {
            title:
                "Interactions: Current vs Previous",
            legend: [
                {
                    label:
                        "Previous",
                    color: [
                        147,
                        197,
                        253,
                    ],
                },
                {
                    label:
                        "Current",
                    color:
                        COLORS.blue,
                },
            ],
            height: 53,
        },
        (area) => {
            const categories = [
                {
                    label:
                        "Reactions",
                    current:
                        current.reactions,
                    previous:
                        previous.reactions,
                },
                {
                    label:
                        "Comments",
                    current:
                        current.comments,
                    previous:
                        previous.comments,
                },
                {
                    label:
                        "Shares",
                    current:
                        current.shares,
                    previous:
                        previous.shares,
                },
                {
                    label:
                        "Clicks",
                    current:
                        current.clicks,
                    previous:
                        previous.clicks,
                },
            ];

            const leftPad = 13;
            const bottomPad = 7;

            const px =
                area.x +
                leftPad;

            const pw =
                area.w -
                leftPad;

            const py =
                area.y + 3;

            const ph =
                area.h -
                bottomPad -
                3;

            const max =
                Math.max(
                    ...categories.flatMap(
                        (c) => [
                            c.current ||
                                0,
                            c.previous ||
                                0,
                        ]
                    ),
                    0
                );

            const scale =
                niceScale(max);

            drawYAxis(
                px,
                py,
                pw,
                ph,
                scale
            );

            const slot =
                pw /
                categories.length;

            const bw =
                Math.min(
                    slot * 0.22,
                    12
                );

            categories.forEach(
                (
                    cat,
                    i
                ) => {
                    const cx =
                        px +
                        i *
                            slot +
                        slot /
                            2;

                    [
                        {
                            value:
                                cat.previous ||
                                0,
                            color: [
                                147,
                                197,
                                253,
                            ],
                            x:
                                cx -
                                bw -
                                0.5,
                        },
                        {
                            value:
                                cat.current ||
                                0,
                            color:
                                COLORS.blue,
                            x:
                                cx +
                                0.5,
                        },
                    ].forEach(
                        (
                            bar
                        ) => {
                            const h =
                                (bar.value /
                                    scale.max) *
                                ph;

                            pdf.setFillColor(
                                ...bar.color
                            );

                            pdf.rect(
                                bar.x,
                                py +
                                    ph -
                                    h,
                                bw,
                                Math.max(
                                    h,
                                    0.2
                                ),
                                "F"
                            );
                        }
                    );

                    text(
                        cat.label,
                        cx,
                        py +
                            ph +
                            4,
                        {
                            size: 6.5,
                            color:
                                COLORS.gray,
                            align:
                                "center",
                        }
                    );
                }
            );
        }
    );

    // ==================================================
    // 4. TOP POSTS
    // ==================================================

    if (hasPosts) {
        sectionHeader(
            "3",
            "Top Performing Content",
            "Posts that generated the strongest results",
            65
        );

        const top =
            highlights.topEngagement;

        const avgReach =
            current.avgReach;

        const cards = [
            highlights.topReach && {
                label:
                    "HIGHEST REACH",
                color:
                    COLORS.blue,
                post:
                    highlights.topReach,
                value: `${num(
                    highlights.topReach
                        .reach
                )} people`,
                note:
                    avgReach
                        ? `${(
                            highlights
                                .topReach
                                .reach /
                            avgReach
                        ).toFixed(
                            1
                        )}x average reach`
                        : "Widest audience",
            },

            top && {
                label:
                    "HIGHEST ENGAGEMENT",
                color:
                    COLORS.green,
                post: top,
                value: `${num(
                    top.engagement
                )} actions`,
                note: `${num(
                    top.reactions
                )} reactions · ${num(
                    top.comments
                )} comments · ${num(
                    top.shares
                )} shares`,
            },

            highlights.topRate && {
                label:
                    "HIGHEST RATE",
                color:
                    COLORS.purple,
                post:
                    highlights.topRate,
                value: `${pct(
                    highlights
                        .topRate
                        .engagementRate
                )}`,
                note:
                    "Highest interaction rate",
            },

            highlights.topShares &&
                highlights.topShares
                    .shares >
                    0 && {
                    label:
                        "MOST SHARED",
                    color:
                        COLORS.amber,
                    post:
                        highlights.topShares,
                    value: `${num(
                        highlights
                            .topShares
                            .shares
                    )} shares`,
                    note:
                        "Strongest amplification",
                },
        ].filter(Boolean);

        const gap = 3;
        const w =
            (CW - gap) /
            2;

        const h = 27;

        for (
            let i = 0;
            i < cards.length;
            i += 2
        ) {
            ensureSpace(
                h + gap
            );

            cards
                .slice(i, i + 2)
                .forEach(
                    (
                        c,
                        k
                    ) => {
                        const x =
                            PAGE.m +
                            k *
                                (w +
                                    gap);

                        const y =
                            state.y;

                        card(
                            x,
                            y,
                            w,
                            h
                        );

                        pdf.setFillColor(
                            ...c.color
                        );

                        pdf.rect(
                            x,
                            y + 1.5,
                            1.2,
                            h - 3,
                            "F"
                        );

                        text(
                            c.label,
                            x + 4,
                            y + 5.5,
                            {
                                size: 6.3,
                                style:
                                    "bold",
                                color:
                                    c.color,
                            }
                        );

                        text(
                            truncate(
                                `P${c.post.index}: ${c.post.title}`,
                                35
                            ),
                            x + 4,
                            y + 11,
                            {
                                size: 7.8,
                                style:
                                    "bold",
                            }
                        );

                        text(
                            c.value,
                            x + 4,
                            y + 17,
                            {
                                size: 10,
                                style:
                                    "bold",
                                color:
                                    c.color,
                            }
                        );

                        text(
                            truncate(
                                c.note,
                                45
                            ),
                            x + 4,
                            y + 23,
                            {
                                size: 6.2,
                                color:
                                    COLORS.gray,
                            }
                        );
                    }
                );

            state.y +=
                h + gap;
        }
    }

    // ==================================================
    // 5. REACH PER POST
    // ==================================================

    if (hasPosts && hasReach) {
        sectionHeader(
            "4",
            "Post Reach",
            "Unique people reached by each post",
            55
        );

        const reachPosts =
            limitPosts(
                posts.filter(
                    (p) =>
                        !isMissing(
                            p.reach
                        )
                ),
                "reach"
            );

        chartFrame(
            {
                title:
                    "Reach per Post",
                note:
                    reachPosts.length <
                    posts.length
                        ? `Top ${reachPosts.length} posts`
                        : `Average: ${num(
                            current.avgReach
                        )}`,
                height: Math.max(
                    40,
                    reachPosts.length *
                        5.8 +
                        17
                ),
            },
            (area) =>
                drawHBars(
                    reachPosts.map(
                        (p) => ({
                            label: `P${p.index}: ${truncate(
                                p.title,
                                22
                            )}`,
                            value:
                                p.reach ||
                                0,
                            color:
                                p.id ===
                                highlights
                                    .topReach
                                    ?.id
                                    ? COLORS.green
                                    : COLORS.blue,
                            top:
                                p.id ===
                                highlights
                                    .topReach
                                    ?.id,
                        })
                    ),
                    area
                )
        );

        takeawayBox(
            "KEY TAKEAWAY",
            takeaways.reach
        );
    }

    // ==================================================
    // 6. ENGAGEMENT BREAKDOWN
    // ==================================================

    if (hasPosts) {
        sectionHeader(
            "5",
            "Engagement Breakdown",
            "Interaction mix across posts",
            55
        );

        const engagementPosts =
            limitPosts(
                posts,
                "engagement"
            );

        chartFrame(
            {
                title:
                    "Interaction Types per Post",
                legend: [
                    {
                        label:
                            "Reactions",
                        color:
                            COLORS.blue,
                    },
                    {
                        label:
                            "Comments",
                        color:
                            COLORS.green,
                    },
                    {
                        label:
                            "Shares",
                        color:
                            COLORS.amber,
                    },
                    {
                        label:
                            "Clicks",
                        color:
                            COLORS.purple,
                    },
                ],
                height: 61,
            },
            (area) =>
                drawStackedBars(
                    engagementPosts,
                    [
                        {
                            key:
                                "reactions",
                            color:
                                COLORS.blue,
                        },
                        {
                            key:
                                "comments",
                            color:
                                COLORS.green,
                        },
                        {
                            key:
                                "shares",
                            color:
                                COLORS.amber,
                        },
                        {
                            key:
                                "clicks",
                            color:
                                COLORS.purple,
                        },
                    ],
                    area
                )
        );

        takeawayBox(
            "KEY TAKEAWAY",
            takeaways.engagement
        );
    }

    // ==================================================
    // 7. POST PERFORMANCE TABLE
    // ==================================================

    if (hasPosts) {
        sectionHeader(
            "6",
            "Post-by-Post Performance",
            "Complete performance data",
            50
        );

        table({
            head: [
                "#",
                "Date",
                "Post",
                "Format",
                "Reach",
                "Views",
                "React.",
                "Comm.",
                "Shares",
                "Clicks",
                "Eng.",
                "Rate",
            ],

            body: posts.map(
                (p) => [
                    p.index,
                    shortDate(
                        p.date
                    ),
                    truncate(
                        p.title,
                        28
                    ),
                    p.format
                        ? p.format
                            .charAt(
                                0
                            )
                            .toUpperCase() +
                        p.format
                            .slice(
                                1
                            )
                            .toLowerCase()
                        : "N/A",
                    num(p.reach),
                    num(p.views),
                    num(
                        p.reactions
                    ),
                    num(
                        p.comments
                    ),
                    num(p.shares),
                    num(p.clicks),
                    num(
                        p.engagement
                    ),
                    pct(
                        p.engagementRate
                    ),
                ]
            ),

            foot: [
                "",
                "",
                "TOTAL",
                "",
                num(
                    current.reach
                ),
                num(
                    current.views
                ),
                num(
                    current.reactions
                ),
                num(
                    current.comments
                ),
                num(
                    current.shares
                ),
                num(
                    current.clicks
                ),
                num(
                    current.engagement
                ),
                pct(
                    current.engagementRate
                ),
            ],

            styles: {
                fontSize: 6.4,
                cellPadding: 1.25,
            },

            columnStyles: {
                0: {
                    cellWidth: 6,
                    halign:
                        "center",
                },

                1: {
                    cellWidth: 13,
                    halign:
                        "center",
                },

                2: {
                    cellWidth: 35,
                },

                3: {
                    cellWidth: 15,
                    halign:
                        "center",
                },

                4: {
                    cellWidth: 12,
                    halign:
                        "center",
                },

                5: {
                    cellWidth: 12,
                    halign:
                        "center",
                },

                6: {
                    cellWidth: 11,
                    halign:
                        "center",
                },

                7: {
                    cellWidth: 11,
                    halign:
                        "center",
                },

                8: {
                    cellWidth: 11,
                    halign:
                        "center",
                },

                9: {
                    cellWidth: 10,
                    halign:
                        "center",
                },

                10: {
                    cellWidth: 11,
                    halign:
                        "center",
                },

                11: {
                    cellWidth: 12,
                    halign:
                        "center",
                },
            },

            didParseCell:
                (data) => {
                    if (
                        data.section ===
                            "body" &&
                        highlights
                            .topEngagement &&
                        posts[
                            data.row.index
                        ]?.id ===
                            highlights
                                .topEngagement
                                .id
                    ) {
                        data.cell.styles.fillColor =
                            COLORS.greenSoft;

                        data.cell.styles.fontStyle =
                            "bold";
                    }
                },
        });

        text(
            "Green row = highest engagement. Engagement = reactions + comments + shares + clicks.",
            PAGE.m,
            state.y,
            {
                size: 6.5,
                color:
                    COLORS.gray,
            }
        );

        state.y += 5;
    }

    // ==================================================
    // 8. CONTENT TYPE
    // ==================================================

    if (
        hasPosts &&
        formats.length
    ) {
        sectionHeader(
            "7",
            "Content Type Analysis",
            "Average performance by format",
            50
        );

        table({
            head: [
                "Format",
                "Posts",
                "Avg Reach",
                "Avg Views",
                "Avg Engagement",
                "Rate",
            ],

            body: formats.map(
                (f) => [
                    f.label,
                    f.count,
                    num(
                        f.avgReach
                    ),
                    num(
                        f.avgViews
                    ),
                    num(
                        f.avgEngagement
                    ),
                    pct(
                        f.engagementRate
                    ),
                ]
            ),

            columnStyles: {
                0: {
                    cellWidth: 40,
                    fontStyle:
                        "bold",
                },

                1: {
                    halign:
                        "center",
                },

                2: {
                    halign:
                        "center",
                },

                3: {
                    halign:
                        "center",
                },

                4: {
                    halign:
                        "center",
                },

                5: {
                    halign:
                        "center",
                },
            },
        });

        takeawayBox(
            "ANALYSIS",
            takeaways.contentType
        );
    }

    // ==================================================
    // 9. PERFORMANCE TREND
    // ==================================================

    // if (hasPosts) {
    //     sectionHeader(
    //         "8",
    //         "Performance Trend",
    //         "Chronological view of post performance",
    //         55
    //     );

    //     const trendSeries = [
    //         hasReach && {
    //             key: "reach",
    //             label: "Reach",
    //             color:
    //                 COLORS.blue,
    //             dash: false,
    //         },

    //         {
    //             key:
    //                 "engagement",
    //             label:
    //                 "Engagement",
    //             color:
    //                 COLORS.green,
    //             dash: true,
    //         },
    //     ].filter(Boolean);

    //     chartFrame(
    //         {
    //             title:
    //                 "Post Performance Timeline",
    //             legend:
    //                 trendSeries.map(
    //                     (s) => ({
    //                         label:
    //                             s.label,
    //                         color:
    //                             s.color,
    //                         dash:
    //                             s.dash,
    //                     })
    //                 ),
    //             height: 58,
    //         },
    //         (area) =>
    //             drawTrend(
    //                 posts,
    //                 trendSeries,
    //                 area,
    //                 highlights
    //                     .topEngagement
    //                     ?.id
    //             )
    //     );

    //     takeawayBox(
    //         "TREND INSIGHT",
    //         takeaways.trend
    //     );
    // }

    // ==================================================
    // 10. INSIGHTS & RECOMMENDATIONS
    // ==================================================

    // sectionHeader(
    //     "9",
    //     "Insights & Recommendations",
    //     "Key observations and practical next steps",
    //     55
    // );

    // const insights =
    //     report.insights || [];

    // const recommendations =
    //     report.recommendations ||
    //     [];

    // const combined = [
    //     ...insights.slice(
    //         0,
    //         4
    //     ),
    //     ...recommendations.slice(
    //         0,
    //         4
    //     ),
    // ];

    // if (combined.length) {
    //     const gap = 3;
    //     const w =
    //         (CW - gap) /
    //         2;

    //     const pad = 4;

    //     for (
    //         let i = 0;
    //         i < combined.length;
    //         i += 2
    //     ) {
    //         const row =
    //             combined.slice(
    //                 i,
    //                 i + 2
    //             );

    //         const heights =
    //             row.map(
    //                 (item) =>
    //                     measure(
    //                         item.detail ||
    //                             item.description ||
    //                             "",
    //                         w -
    //                             pad *
    //                                 2,
    //                         7.5
    //                     ).length *
    //                         3.5 +
    //                     12
    //             );

    //         const h =
    //             Math.max(
    //                 ...heights,
    //                 20
    //             );

    //         ensureSpace(
    //             h + gap
    //         );

    //         row.forEach(
    //             (
    //                 item,
    //                 k
    //             ) => {
    //                 const x =
    //                     PAGE.m +
    //                     k *
    //                         (w +
    //                             gap);

    //                 const y =
    //                     state.y;

    //                 card(
    //                     x,
    //                     y,
    //                     w,
    //                     h
    //                 );

    //                 pdf.setFillColor(
    //                     ...(i <
    //                     insights.length
    //                         ? COLORS.blue
    //                         : COLORS.green)
    //                 );

    //                 pdf.rect(
    //                     x,
    //                     y + 1.5,
    //                     1.2,
    //                     h - 3,
    //                     "F"
    //                 );

    //                 text(
    //                     truncate(
    //                         item.title ||
    //                             "Recommendation",
    //                         42
    //                     ),
    //                     x + pad,
    //                     y + 6,
    //                     {
    //                         size: 7.5,
    //                         style:
    //                             "bold",
    //                     }
    //                 );

    //                 paragraph(
    //                     item.detail ||
    //                         item.description ||
    //                         "",
    //                     x + pad,
    //                     y + 11,
    //                     w -
    //                         pad *
    //                             2,
    //                     {
    //                         size: 7.2,
    //                         color: [
    //                             51,
    //                             65,
    //                             85,
    //                         ],
    //                         lineH:
    //                             3.5,
    //                     }
    //                 );
    //             }
    //         );

    //         state.y +=
    //             h + gap;
    //     }
    // }

    // ==================================================
    // 11. GLOSSARY + DATA QUALITY
    // ==================================================

    // sectionHeader(
    //     "10",
    //     "Metric Guide & Data Notes",
    //     "Simple definitions and platform limitations",
    //     55
    // );

    // const glossary = [
    //     [
    //         "Reach",
    //         "Unique people who saw the content.",
    //     ],
    //     [
    //         "Views",
    //         "Total times content was displayed.",
    //     ],
    //     [
    //         "Engagement",
    //         "Reactions, comments, shares and clicks.",
    //     ],
    //     [
    //         "Engagement Rate",
    //         "Engagement divided by reach × 100.",
    //     ],
    // ];

    // const gap = 3;
    // const w =
    //     (CW - gap) /
    //     2;

    // for (
    //     let i = 0;
    //     i < glossary.length;
    //     i += 2
    // ) {
    //     ensureSpace(
    //         20 + gap
    //     );

    //     glossary
    //         .slice(i, i + 2)
    //         .forEach(
    //             (
    //                 item,
    //                 k
    //             ) => {
    //                 const x =
    //                     PAGE.m +
    //                     k *
    //                         (w +
    //                             gap);

    //                 card(
    //                     x,
    //                     state.y,
    //                     w,
    //                     19,
    //                     {
    //                         fill:
    //                             COLORS.light,
    //                     }
    //                 );

    //                 text(
    //                     item[0],
    //                     x + 4,
    //                     state.y + 6,
    //                     {
    //                         size: 7.5,
    //                         style:
    //                             "bold",
    //                     }
    //                 );

    //                 paragraph(
    //                     item[1],
    //                     x + 4,
    //                     state.y + 11,
    //                     w - 8,
    //                     {
    //                         size: 6.7,
    //                         color:
    //                             COLORS.gray,
    //                         lineH:
    //                             3.2,
    //                     }
    //                 );
    //             }
    //         );

    //     state.y +=
    //         22;
    // }

    // const notes =
    //     report.dataNotes || [];

    // if (notes.length) {
    //     takeawayBox(
    //         "DATA NOTES",
    //         notes
    //             .slice(0, 2)
    //             .map(
    //                 (n) =>
    //                     n.detail ||
    //                     n.title ||
    //                     n
    //             )
    //             .join(" ")
    //     );
    // }

    // ==================================================
    // 12. FINAL SUMMARY
    // ==================================================

    // sectionHeader(
    //     "11",
    //     "Final Executive Summary",
    //     pageName,
    //     50
    // );

    const summary =
        report.summary ||
        "No additional summary was provided.";

    const lines =
        measure(
            summary,
            CW - 12,
            9
        );

    const h =
        17 +
        lines.length * 4;

    // ensureSpace(
    //     h + 20
    // );

    // card(
    //     PAGE.m,
    //     state.y,
    //     CW,
    //     h,
    //     {
    //         fill:
    //             COLORS.blueSoft,
    //         border: [
    //             191,
    //             219,
    //             254,
    //         ],
    //     }
    // );

    // text(
    //     "Performance Conclusion",
    //     PAGE.m + 5,
    //     state.y + 7,
    //     {
    //         size: 9.5,
    //         style: "bold",
    //         color:
    //             COLORS.blue,
    //     }
    // );

    // text(
    //     lines,
    //     PAGE.m + 5,
    //     state.y + 14,
    //     {
    //         size: 9,
    //     }
    // );

    state.y +=
        h + 7;

    text(
        "Report Prepared By:",
        PAGE.m,
        state.y,
        {
            size: 7,
            color:
                COLORS.gray,
        }
    );

    text(
        preparedBy,
        PAGE.m,
        state.y + 5,
        {
            size: 9,
            style: "bold",
        }
    );

    text(
        "Confidential - For Internal & Client Use Only",
        PAGE.m,
        state.y + 11,
        {
            size: 6.5,
            color:
                COLORS.gray,
        }
    );

    // ==================================================
    // HEADERS & FOOTERS
    // ==================================================

    const totalPages =
        pdf.internal.getNumberOfPages();

    for (
        let page = 2;
        page <= totalPages;
        page++
    ) {
        pdf.setPage(page);

        text(
            truncate(
                pageName,
                38
            ),
            PAGE.m,
            10,
            {
                size: 7,
                style:
                    "bold",
                color:
                    COLORS.gray,
            }
        );

        text(
            "Facebook Performance Report",
            PAGE.w -
                PAGE.m,
            10,
            {
                size: 7,
                color:
                    COLORS.gray,
                align:
                    "right",
            }
        );

        pdf.setDrawColor(
            ...COLORS.border
        );

        pdf.setLineWidth(
            0.25
        );

        pdf.line(
            PAGE.m,
            12,
            PAGE.w -
                PAGE.m,
            12
        );

        pdf.line(
            PAGE.m,
            286,
            PAGE.w -
                PAGE.m,
            286
        );

        text(
            `${truncate(
                pageName,
                38
            )} - Meta Report`,
            PAGE.m,
            291,
            {
                size: 6.5,
                color:
                    COLORS.gray,
            }
        );

        text(
            `Page ${page} of ${totalPages}`,
            PAGE.w -
                PAGE.m,
            291,
            {
                size: 6.5,
                color:
                    COLORS.gray,
                align:
                    "right",
            }
        );
    }

    // ==================================================
    // PDF METADATA
    // ==================================================

    pdf.setProperties({
        title: `${pageName} - Facebook Page Performance Report`,
        subject:
            periodLabel,
        creator:
            preparedBy,
    });

    return pdf;
};