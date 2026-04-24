import React from 'react'
import { FiBarChart, FiFilter, FiPaperclip, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Dropdown from '@/components/shared/Dropdown'
// import { fileType } from '../leads/LeadsHeader'
import ProjectsStatistics from '../widgetsStatistics/ProjectsStatistics'


const ProjectsListHeader = ({setStatusFilter, fileType  }) => {
 
  const options = [
  { label: "Alls", color: "bg-primary", onClick: () => setStatusFilter("all") },
  { label: "On Hold", color: "bg-indigo", onClick: () => setStatusFilter("on_hold") },
  { label: "Pending", color: "bg-warning", onClick: () => setStatusFilter("pending") },
  { label: "Finished", color: "bg-success", onClick: () => setStatusFilter("finished") },
  { label: "Declined", color: "bg-danger", onClick: () => setStatusFilter("declined") },
  { label: "In Progress", color: "bg-teal", onClick: () => setStatusFilter("in_progress") },
  { label: "Not Started", color: "bg-success", onClick: () => setStatusFilter("not_started") },
  { label: "My Projects", color: "bg-warning", onClick: () => setStatusFilter("my_projects") }
];
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">
        <a href="#" className="btn btn-icon btn-light-brand" data-bs-toggle="collapse" data-bs-target="#collapseOne">
          <FiBarChart size={16} />
        </a>
        <Dropdown
          dropdownItems={options}
          triggerPosition={"0, 10"}
          triggerIcon={<FiFilter size={16} strokeWidth={1.6} />}
          triggerClass='btn btn-icon btn-light-brand'
          isAvatar={false}
          dropdownAutoClose={"outside"}
          isItemIcon={false}
        />
        <Dropdown
          dropdownItems={fileType}
          triggerPosition={"0, 12"}
          triggerIcon={<FiPaperclip size={16} strokeWidth={1.6} />}
          triggerClass='btn btn-icon btn-light-brand'
          isAvatar={false}
          iconStrokeWidth={0}
        />
        <Link to="/projects/create" className="btn btn-primary">
          <FiPlus size={16} className='me-2' />
          <span>Create Prject</span>
        </Link>
      </div>
      <div id="collapseOne" className="accordion-collapse collapse page-header-collapse">
        <div className="accordion-body pb-2">
          <div className="row">
            <ProjectsStatistics />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectsListHeader