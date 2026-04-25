import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import ClientsHeader from '@/components/clients/ClientsHeader'
import ClientssTable from '@/components/clients/ClientsTable'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ClientsList = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const [clients, setClients] = useState([]);
    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('clients', 'view', navigate);
        };
        checkPermission();
    }, []);
const filteredClients = clients.filter(c => {
    if (filter === "active") return c.status.status === "active";
    if (filter === "inactive") return c.status.status === "inactive";
    return true; // all
});
    const handleExport = (type) => {
        if (!clients.length) return;

        switch (type) {
            case "csv":
                exportCSV();
                break;
            case "pdf":
                exportPDF();
                break;
            case "xml":
                exportXML();
                break;
            case "txt":
                exportTXT();
                break;
            case "excel":
                exportExcel();
                break;
            case "print":
                handlePrint();
                break;
            default:
                break;
        }
    };
    const exportTXT = () => {
        const text = filteredClients.map(c =>
            `${c.clients.name} | ${c.email} | ${c.phone}`
        ).join("\n");

        const blob = new Blob([text], { type: "text/plain" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "clients.txt";
        link.click();
    };
    const exportXML = () => {
        let xml = "<clients>";

        clients.forEach(c => {
            xml += `
        <client>
            <name>${c.clients.name}</name>
            <email>${c.email}</email>
            <phone>${c.phone}</phone>
        </client>`;
        });

        xml += "</clients>";

        const blob = new Blob([xml], { type: "application/xml" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "clients.xml";
        link.click();
    };
    const exportCSV = () => {
        const headers = ["Name", "Email", "Phone", "Date", "Status"];

        const rows = filteredClients.map(c => [
            c.clients.name,
            c.email,
            c.phone,
            c.date,
            c.status.status
        ]);

        let csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csvContent);
        link.download = "clients.csv";
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        const tableData = filteredClients.map(c => [
            c.clients.name,
            c.email,
            c.phone,
            c.date,
            c.status.status
        ]);

        autoTable(doc, {
            head: [["Name", "Email", "Phone", "Date", "Status"]],
            body: tableData,
        });

        doc.save("clients.pdf");
    };

    const exportExcel = () => {
        if (!clients || clients.length === 0) {
            alert("No data to export");
            return;
        }

        const data = filteredClients.map(c => ({
            Name: c.clients.name,
            Email: c.email,
            Phone: c.phone,
            Date: c.date,
            Status: c.status.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");

        XLSX.writeFile(workbook, "clients.xlsx");
    };
    const handlePrint = () => {
        if (!clients || clients.length === 0) {
            alert("No data to print");
            return;
        }

        const printWindow = window.open("", "_blank");

        const html = `
        <html>
        <head>
            <title>Clients List</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
            </style>
        </head>
        <body>
            <h2>Clients List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredClients.map(c => `
                        <tr>
                            <td>${c.clients.name}</td>
                            <td>${c.email}</td>
                            <td>${c.phone}</td>
                            <td>${c.date}</td>
                            <td>${c.status.status}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        printWindow.focus();
        printWindow.print();
    };
    return (
        <>
            <PageHeader>
                <ClientsHeader onExport={handleExport}  onFilter={setFilter} />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ClientssTable setClients={setClients} clients={filteredClients}   />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ClientsList