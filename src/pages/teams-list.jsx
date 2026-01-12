import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

import TeamsTable from '@/components/teams/TeamsTable'

import { verifyPagePermission } from '@/utils/verifyPagePermission'
import TeamHeader from '@/components/teams/TeamHeader'

const TeamsList = () => {
  const navigate = useNavigate()

  // Uncomment when permission system is enabled
  // useEffect(() => {
  //   verifyPagePermission('teams', 'view', navigate)
  // }, [])

  return (
    <>
      <PageHeader>
        <TeamHeader/>
      </PageHeader>

      <div className="main-content">
        <div className="row">
          <TeamsTable />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default TeamsList
