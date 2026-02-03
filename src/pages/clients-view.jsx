
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ClientsViewHeader from '@/components/clientsViewCreate/ClientsViewHeader'
import ClientsViewContent from '@/components/clientsViewCreate/ClientsViewContent'
import ClientsViewTab from '@/components/clientsViewCreate/ClientsViewTabs'
import { useNavigate } from 'react-router-dom'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Footer from '@/components/shared/Footer'
const ClientsView = () => {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();
  useEffect(() => {
    const checkPermission = async () => {
       await verifyPagePermission('clients', 'view', navigate);
    };
    checkPermission();
  }, []);
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(`http://localhost:5000/api/clients/client/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        setClient(data.data)
      } catch (error) {
        console.error('Failed to load client', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id])

  if (loading) return <p>Loading client...</p>
  if (!client) return <p>Client not found</p>

  return (
    <>
      <PageHeader>
        <ClientsViewHeader client={client} />
      </PageHeader>
      <ClientsViewTab client={client} />
      <div className="main-content">
        <div className='tab-content'>
          <ClientsViewContent client={client} />
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default ClientsView
