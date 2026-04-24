import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/projectsList/ProjectsListHeader'
import ProjectTable from '@/components/projectsList/ProjectTable'
import ToastProvider from '@/components/ToastProvider'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'
import { fileType } from '../components/leads/LeadsHeader'

import * as XLSX from "xlsx";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const ProjectsList = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState("all");
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('projects', 'view', navigate);
        };

        checkPermission();
    }, []);
    const exportCSV = (projects) => {
  const rows = [
    ["Project", "Client", "Start", "End", "Status"],
    ...projects.map(p => [
      p.project_name,
      p.client_id,
      p.start_date,
      p.end_date,
      p.status
    ])
  ];

  const csv = rows.map(r => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "projects.csv";
  a.click();
};
const exportPDF = (projects) => {
  const doc = new jsPDF();

  const tableColumn = ["Project", "Client", "Start", "End", "Status"];

  const tableRows = projects.map((p) => [
    p.project_name,
    p.client_id || "—",
    p.start_date ? new Date(p.start_date).toLocaleDateString() : "—",
    p.end_date ? new Date(p.end_date).toLocaleDateString() : "—",
    p.status,
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  });

  doc.save("projects.pdf");
};
const exportExcel = (projects) => {
  const data = projects.map((p) => ({
    Project: p.project_name,
    Client: p.client_id || "—",
    Start: p.start_date
      ? new Date(p.start_date).toLocaleDateString()
      : "—",
    End: p.end_date
      ? new Date(p.end_date).toLocaleDateString()
      : "—",
    Status: p.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

  XLSX.writeFile(workbook, "projects.xlsx");
};
const exportXML = (projects) => {
  const xml = `
<projects>
${projects
  .map(
    (p) => `
  <project>
    <name>${p.project_name}</name>
    <client>${p.client_id || ""}</client>
    <start>${p.start_date || ""}</start>
    <end>${p.end_date || ""}</end>
    <status>${p.status}</status>
  </project>`
  )
  .join("")}
</projects>`;

  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "projects.xml";
  a.click();
};
const exportText = (projects) => {
  const text = projects
    .map(
      (p, i) => `
Project ${i + 1}
---------------------
Name   : ${p.project_name}
Client : ${p.client_id || "—"}
Start  : ${p.start_date || "—"}
End    : ${p.end_date || "—"}
Status : ${p.status}
`
    )
    .join("\n");

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "projects.txt";
  a.click();
};
 const handleExport = (type) => {
  console.log("Export:", type);

  switch (type) {
    case "csv":
      exportCSV(projects);
      break;
    case "excel":
      exportExcel(projects);
      break;
    case "pdf":
      exportPDF(projects);
      break;
         case "xml":
      exportXML(projects); // ✅
      break;

    case "txt":
      exportText(projects); // ✅
      break;
    case "print":
      window.print();
      break;
    default:
      break;
  }
};


    return (
        <>
            <PageHeader>
                <ProjectsListHeader setStatusFilter={setStatusFilter}
                    statusFilter={statusFilter}
                    fileType={fileType(handleExport)} />
            </PageHeader>
            <div className='main-content '>
                <ToastProvider />
                <div className='row ' style={{ height: "61vh" }}>
                    <ProjectTable statusFilter={statusFilter} projects={projects} setProjects={setProjects} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProjectsList