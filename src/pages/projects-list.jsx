import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/projectsList/ProjectsListHeader'
import ProjectTable from '@/components/projectsList/ProjectTable'
import ToastProvider from '@/components/ToastProvider'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'
import { fileType } from '../components/leads/LeadsHeader'

import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const ProjectsList = () => {
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState("all")
  const [projects, setProjects] = useState([])

  useEffect(() => {
    verifyPagePermission('projects', 'view', navigate)
  }, [])

  /* ---------------- EXPORT FUNCTIONS ---------------- */

  const exportCSV = (data) => {
    const rows = [
      ["Project", "Client", "Start", "End", "Status"],
      ...data.map(p => [
        p.project.name,
        p.client.name,
        p.start,
        p.end,
        p.status.status
      ])
    ]

    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })

    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "projects.csv"
    a.click()
  }

  const exportPDF = (data) => {
    const doc = new jsPDF()

    const tableRows = data.map(p => [
      p.project.name,
      p.client.name,
      p.start,
      p.end,
      p.status.status
    ])

    autoTable(doc, {
      head: [["Project", "Client", "Start", "End", "Status"]],
      body: tableRows,
    })

    doc.save("projects.pdf")
  }

  const exportExcel = (data) => {
    const sheetData = data.map(p => ({
      Project: p.project.name,
      Client: p.client.name,
      Start: p.start,
      End: p.end,
      Status: p.status.status,
    }))

    const ws = XLSX.utils.json_to_sheet(sheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Projects")

    XLSX.writeFile(wb, "projects.xlsx")
  }

  const exportXML = (data) => {
    let xml = "<projects>"

    data.forEach(p => {
      xml += `
        <project>
          <name>${p.project.name}</name>
          <client>${p.client.name}</client>
          <start>${p.start}</start>
          <end>${p.end}</end>
          <status>${p.status.status}</status>
        </project>`
    })

    xml += "</projects>"

    const blob = new Blob([xml], { type: "application/xml" })

    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "projects.xml"
    a.click()
  }

  const exportTXT = (data) => {
    const text = data.map((p, i) => `
Project ${i + 1}
------------------
Name   : ${p.project.name}
Client : ${p.client.name}
Start  : ${p.start}
End    : ${p.end}
Status : ${p.status.status}
`).join("\n")

    const blob = new Blob([text], { type: "text/plain" })

    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "projects.txt"
    a.click()
  }
const getFilteredProjects = () => {
  if (statusFilter === "all") return projects

  return projects.filter(p => p.status?.status === statusFilter)
}
 const handleExport = (type) => {
  const filteredData = getFilteredProjects()

  if (!filteredData.length) return

  switch (type) {
    case "csv":
      exportCSV(filteredData)
      break
    case "pdf":
      exportPDF(filteredData)
      break
    case "excel":
      exportExcel(filteredData)
      break
    case "xml":
      exportXML(filteredData)
      break
    case "txt":
      exportTXT(filteredData)
      break
    case "print":
      window.print()
      break
    default:
      break
  }
}
  return (
    <>
      <PageHeader>
        <ProjectsListHeader
          setStatusFilter={setStatusFilter}
          // handleExport={handleExport}
          projects={projects}
         fileType={fileType(handleExport)} />
      </PageHeader>

      <div className="main-content">
        <ToastProvider />
        <div className="row">
          <ProjectTable
            statusFilter={statusFilter}
            projects={projects}
            setProjects={setProjects}
          />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ProjectsList