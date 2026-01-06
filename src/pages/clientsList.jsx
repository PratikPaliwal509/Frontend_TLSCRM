import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'

import Footer from '@/components/shared/Footer'
import ClientsHeader from '@/components/clients/ClientsHeader'
import ClientssTable from '@/components/clients/ClientsTable'

const ClientsList = () => {
    return (
        <>
            <PageHeader>
                <ClientsHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ClientssTable/>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default ClientsList