import React, { useEffect } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import ClientsHeader from '@/components/clients/ClientsHeader'
import ClientssTable from '@/components/clients/ClientsTable'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'

const ClientsList = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkPermission = async () => {
            await verifyPagePermission('clients', 'view', navigate);
        };
        checkPermission();
    }, []);
    return (
        <>
            <PageHeader>
                <ClientsHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ClientssTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ClientsList