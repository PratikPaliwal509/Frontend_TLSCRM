import React, { useEffect } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProjectsListHeader from '@/components/projectsList/ProjectsListHeader'
import ProjectTable from '@/components/projectsList/ProjectTable'
import ToastProvider from '@/components/ToastProvider'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'

const ProjectsList = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('projects', 'view', navigate);
        };

        checkPermission();
    }, []);
    return (
        <>
            <PageHeader>
                <ProjectsListHeader />
            </PageHeader>
            <div className='main-content'>
                <ToastProvider />
                <div className='row'>
                    <ProjectTable />
                </div>
            </div>

        </>
    )
}

export default ProjectsList