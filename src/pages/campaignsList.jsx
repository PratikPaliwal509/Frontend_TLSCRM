import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import CampaignsHeader from "@/components/metaAds/CampaignsHeader";
import CampaignsTable from "@/components/metaAds/CampaignsTable";
import { useNavigate } from "react-router-dom";
import { verifyPagePermission } from "@/utils/verifyPagePermission";
import GenerateAdsReportModal from "@/components/metaAds/GenerateAdsReportModal";
const CampaignsList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [campaigns, setCampaigns] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    // useEffect(() => {
    //     verifyPagePermission("meta_ads", "view", navigate);
    // }, [navigate]);

    const filteredCampaigns = campaigns.filter((campaign) => {
        if (filter === "active") {
            return campaign.status === "ACTIVE";
        }

        if (filter === "paused") {
            return campaign.status === "PAUSED";
        }

        if (filter === "archived") {
            return campaign.status === "ARCHIVED";
        }

        return true;
    });

    const handleExport = (type) => {
        if (!campaigns.length) return;

        if (type === "csv") exportCSV();
        if (type === "txt") exportTXT();
        if (type === "xml") exportXML();
        if (type === "excel") exportExcel();
        if (type === "pdf") exportPDF();
        if (type === "print") handlePrint();
    };

    const exportCSV = () => {
        const headers = [
            "Name",
            "Campaign ID",
            "Objective",
            "Status",
            "Created Date"
        ];

        const rows = filteredCampaigns.map((c) => [
            c.name,
            c.id,
            c.objective,
            c.status,
            c.createdAt
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((item) => `"${item ?? ""}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "meta-campaigns.csv";
        link.click();
    };

    const exportTXT = () => {
        const text = filteredCampaigns
            .map(
                (c) =>
                    `${c.name} | ${c.objective} | ${c.status} | ${c.createdAt}`
            )
            .join("\n");

        const blob = new Blob([text], {
            type: "text/plain"
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "meta-campaigns.txt";
        link.click();
    };

    const exportXML = () => {
        let xml = "<?xml version='1.0' encoding='UTF-8'?><campaigns>";

        filteredCampaigns.forEach((c) => {
            xml += `
                <campaign>
                    <id>${c.id}</id>
                    <name>${c.name}</name>
                    <objective>${c.objective}</objective>
                    <status>${c.status}</status>
                    <createdAt>${c.createdAt}</createdAt>
                </campaign>
            `;
        });

        xml += "</campaigns>";

        const blob = new Blob([xml], {
            type: "application/xml"
        });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "meta-campaigns.xml";
        link.click();
    };

    const exportExcel = async () => {
        const XLSX = await import("xlsx");

        const data = filteredCampaigns.map((c) => ({
            Name: c.name,
            "Campaign ID": c.id,
            Objective: c.objective,
            Status: c.status,
            "Created Date": c.createdAt
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Campaigns"
        );

        XLSX.writeFile(workbook, "meta-campaigns.xlsx");
    };

    const exportPDF = async () => {
        const jsPDF = (await import("jspdf")).default;
        const autoTable = (await import("jspdf-autotable")).default;

        const doc = new jsPDF();

        autoTable(doc, {
            head: [[
                "Name",
                "Campaign ID",
                "Objective",
                "Status",
                "Created Date"
            ]],
            body: filteredCampaigns.map((c) => [
                c.name,
                c.id,
                c.objective,
                c.status,
                c.createdAt
            ])
        });

        doc.save("meta-campaigns.pdf");
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");

        printWindow.document.write(`
            <html>
                <head>
                    <title>Meta Campaigns</title>
                    <style>
                        body {
                            font-family: Arial;
                            padding: 20px;
                        }

                        h2 {
                            text-align: center;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                        }

                        th {
                            background: #f4f4f4;
                        }
                    </style>
                </head>

                <body>
                    <h2>Meta Campaigns</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Campaign ID</th>
                                <th>Objective</th>
                                <th>Status</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${filteredCampaigns
                .map(
                    (c) => `
                                        <tr>
                                            <td>${c.name}</td>
                                            <td>${c.id}</td>
                                            <td>${c.objective}</td>
                                            <td>${c.status}</td>
                                            <td>${c.createdAt}</td>
                                        </tr>
                                    `
                )
                .join("")}
                        </tbody>
                    </table>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <>
            <PageHeader>
                <CampaignsHeader
                    onExport={handleExport}
                    onFilter={setFilter}
                    onGenerateReport={() => setShowReportModal(true)}
                />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <CampaignsTable
                        campaigns={filteredCampaigns}
                        setCampaigns={setCampaigns}
                    />
                </div>
            </div>

            <GenerateAdsReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
            />

            <Footer />
        </>
    );
};

export default CampaignsList;