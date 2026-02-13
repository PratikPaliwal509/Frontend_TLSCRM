import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamsViewContent from '@/components/teams/TeamsViewContent'
import TeamHeader from '@/components/teams/TeamHeader'
// import TeamsViewTabs from '@/components/teams/TeamsViewTabs'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
import Loader from '@/components/loader'
import Footer from '@/components/shared/Footer'

import TeamsViewTabs from '../components/teams/TeamsViewTabs'
const TeamsView = () => {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  
   useEffect(() => {
      const checkPermission = async () => {
        await verifyPagePermission('teams', 'view', navigate);
      };
  
      checkPermission();
    }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(
          `https://api-0ggv.onrender.com/api/teams/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) throw new Error('Failed to fetch team')

        const data = await res.json()

        setTeam(data.data)
      } catch (error) {
        console.error('Failed to load team', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [id])

  if (loading) return <Loader/>
  if (!team) return <p>Team not found</p>

  return (
    <>
      <PageHeader>
        <TeamHeader team={team}  mode="view"/>
      </PageHeader>
<TeamsViewTabs />
      {/* <TeamsViewTabs team={team} /> */}

      <div className="main-content">
        <div className="tab-content">
          <TeamsViewContent team={team} />
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default TeamsView
