import React, { useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectCreateContent from '@/components/projectsCreate/ProjectCreateContent'
import ProjectCreateHeader from '@/components/projectsCreate/ProjectCreateHeader'

import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
const ProjectsCreate = () => {
    const navigate = useNavigate();
    useEffect(() => {
        verifyPagePermission('projects', 'create', navigate);
    }, []);

    return (
        <>
            <PageHeader>
                <ProjectCreateHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ProjectCreateContent />
                </div>
            </div>

        </>
    )
}

export default ProjectsCreate