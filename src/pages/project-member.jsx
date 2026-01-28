import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
// import ProjectCreateContent from '@/components/projectsCreate/ProjectCreateContent'
// import ProjectCreateHeader from '@/components/projectsCreate/ProjectCreateHeader'

import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import AddProjectMember from '@/components/projectMembers/AddProjectMember'
import Footer from '@/components/shared/Footer'

const projectMember = () => {
    const navigate= useNavigate()
    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('projects', 'edit', navigate);
        };

        checkPermission();
    }, []);
    return (
        <>
            <PageHeader>
                {/* <ProjectCreateHeader /> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <AddProjectMember />
                </div>
            </div>
  <Footer />
        </>
    )
}

export default projectMember
