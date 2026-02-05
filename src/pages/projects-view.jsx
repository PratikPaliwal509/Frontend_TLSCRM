
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectViewHeader from '@/components/projectsView/ProjectViewHeader'
import ProjectViewTabItems from '@/components/projectsView/ProjectViewTabItems'
import TabProjectOverview from '@/components/projectsView/TabProjectOverview'
import LeadsEmptyCard from '@/components/leadsViewCreate/LeadsEmptyCard'
import GanttTimeline from '@/components/Gantt/GanttTimeline'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import TabProjectMembers from '@/components/projectsView/TabProjectMembers'
import Footer from '@/components/shared/Footer'
import Loader from '@/components/loader'
const ProjectsView = () => {
  const { id } = useParams() // project id from route
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();
  useEffect(() => {
    const checkPermission = async () => {
      await verifyPagePermission('projects', 'view', navigate);
    };

    checkPermission();
  }, []);
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const json = await res.json()

        if (json.success) {
          setProject(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch project', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return <Loader/>
  }

  if (!project) {
    return <div className="p-4 text-danger">Project not found</div>
  }

  return (
    <>
      <PageHeader>
        {/* pass project to header */}
        <ProjectViewHeader project={project} />
      </PageHeader>

      {/* <ProjectViewTabItems /> */}
      <ProjectViewTabItems
        tabs={[
          { id: 'overviewTab', label: 'Overview', active: true },
          { id: 'ganttTab', label: 'Gantt Timeline' },
          { id: 'activityTab', label: 'Activity' },
        ]}
      />


      <div className="main-content">
        <div className="tab-content">
          {/* pass project to overview */}
          <TabProjectOverview project={project} />
          <TabProjectMembers project={project} />
          <div className="tab-pane fade" id="ganttTab">
            <GanttTimeline projectId={project.project_id} />
          </div>
          <div className="tab-pane fade" id="activityTab">
            <LeadsEmptyCard
              title="No activity yet!"
              description="There is no activity on this project"
            />
          </div>

          <div className="tab-pane fade" id="timesheetsTab">
            <LeadsEmptyCard
              title="No timesheets yet!"
              description="There is no timesheets on this project"
            />
          </div>

          <div className="tab-pane fade" id="milestonesTab">
            <LeadsEmptyCard
              title="No milestones yet!"
              description="There is no milestones on this project"
            />
          </div>

          <div className="tab-pane fade" id="discussionsTab">
            <LeadsEmptyCard
              title="No discussions yet!"
              description="There is no discussions on this project"
            />
          </div>
        </div>
      </div>
        <Footer/>
    </>
  )
}

export default ProjectsView
