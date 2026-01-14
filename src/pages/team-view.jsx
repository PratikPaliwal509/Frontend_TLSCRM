import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import TeamsViewContent from '@/components/teams/TeamsViewContent'
import TeamHeader from '@/components/teams/TeamHeader'
// import TeamsViewTabs from '@/components/teams/TeamsViewTabs'
// import { verifyPagePermission } from '@/utils/verifyPagePermission'

const TeamsView = () => {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  // useEffect(() => {
  //   verifyPagePermission('teams', 'view', navigate)
  // }, [])

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(
          `http://localhost:5000/api/teams/${id}`,
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

  if (loading) return <p>Loading team...</p>
  if (!team) return <p>Team not found</p>

  return (
    <>
      <PageHeader>
        <TeamHeader team={team}  mode="view"/>
      </PageHeader>

      {/* <TeamsViewTabs team={team} /> */}

      <div className="main-content">
        <div className="tab-content">
          <TeamsViewContent team={team} />
        </div>
      </div>
    </>
  )
}

export default TeamsView
