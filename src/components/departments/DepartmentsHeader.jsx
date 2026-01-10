import React from 'react'
import { FiBarChart, FiFilter, FiPaperclip, FiPlus } from 'react-icons/fi'
import { BsFiletypeCsv, BsFiletypeExe, BsFiletypePdf, BsFiletypeTsx, BsFiletypeXml, BsPrinter } from 'react-icons/bs'
import Dropdown from '@/components/shared/Dropdown'
import { Link } from 'react-router-dom'
import LeadsStatisticsTwo from '../widgetsStatistics/LeadsStatisticsTwo'

const filterAction = [
  { label: 'All' },
  { label: 'Teams' },
  { label: 'Projects' },
  { label: 'Country' },
  { label: 'Active' },
  { label: 'Inactive' },
]

export const fileType = [
  { label: 'PDF' },
  { label: 'CSV' },
  { label: 'XML' },
  { label: 'Text' },
  { label: 'Excel' },
  { label: 'Print' },
]

const DepartmentsHeader = ({ mode = 'list' }) => {
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        {/* Stats Toggle */}
        <a
          href="#"
          className="btn btn-icon btn-light-brand"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
        >
          <FiBarChart size={16} strokeWidth={1.6} />
        </a>

        {/* Filter */}
        {mode === 'list' && (
          <>
            <Dropdown
              dropdownItems={filterAction}
              triggerPosition={'0, 12'}
              triggerIcon={<FiFilter size={16} strokeWidth={1.6} />}
              triggerClass="btn btn-icon btn-light-brand"
              isAvatar={false}
            />

            <Dropdown
              dropdownItems={fileType}
              triggerPosition={'0, 12'}
              triggerIcon={<FiPaperclip size={16} strokeWidth={1.6} />}
              triggerClass="btn btn-icon btn-light-brand"
              iconStrokeWidth={0}
              isAvatar={false}
            />

            {/* Create Department */}
            <Link to="/settings/departments/create" className="btn btn-primary">
              <FiPlus size={16} className="me-2" />
              <span>Create Department</span>
            </Link>
          </>
        )}

        {/* For create/edit page, you can add a Back button */}
        {mode === 'form' && (
          <Link to="/departments" className="btn btn-light">
            Back to Departments
          </Link>
        )}
      </div>

      {/* Collapsible Stats */}
      {mode === 'list' && (
        <div
          id="collapseOne"
          className="accordion-collapse collapse page-header-collapse"
        >
          <div className="accordion-body pb-2">
            <div className="row">
              <LeadsStatisticsTwo />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DepartmentsHeader
