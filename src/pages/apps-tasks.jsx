import React from 'react'
import TaskContent from '@/components/tasks/TaskContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import { useEffect } from 'react';

const AppsTasks = () => {
    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('tasks', 'view', navigate);
        };
        checkPermission();
    }, []);

    return (
        <>

            <TaskContent />
        </>
    )
}

export default AppsTasks