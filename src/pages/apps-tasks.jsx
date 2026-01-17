import React from 'react'
import TaskContent from '@/components/tasks/TaskContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom'
const AppsTasks = () => {

    const navigate = useNavigate();
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