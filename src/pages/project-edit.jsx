import React, { useRef, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsEditHeader from '@/components/projectEdit/ProjectEditHeader'
import ProjectEditForm from '@/components/projectEdit/ProjectEditForm'
import ToastProvider from '@/components/ToastProvider'

import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
const ProjectEdit = () => {
  const formRef = useRef()
  const [saving, setSaving] = useState(false)
 const navigate = useNavigate();
         useEffect(() => {
            verifyPagePermission('projects', 'edit', navigate);
          }, []);
  return (
    <>
      <PageHeader>
        <ProjectsEditHeader
          saving={saving}
          onUpdate={() => formRef.current.submitForm()}
        />
      </PageHeader>

      <div className="main-content">
        <ToastProvider />
        <ProjectEditForm ref={formRef} setSaving={setSaving} />
      </div>
    </>
  )
}

export default ProjectEdit
