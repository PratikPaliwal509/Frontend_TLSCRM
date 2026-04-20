import React, { useEffect, useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import Loader from '@/components/loader'
import TeamTimesheetHeader from '@/components/timesheet/TeamTimesheetHeader'
import TeamTimesheetTabs from '@/components/timesheet/TeamTimesheetTabs'
import TeamTimesheetContent from '@/components/timesheet/TeamTimesheetContent'

const TeamTimesheet = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log('Fetching team timesheet data...')
        const fetchTeamTimesheet = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch('http://localhost:5000/api/timesheet/team', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const json = await res.json()
            setData(json.data)
            setLoading(false)
        }

        fetchTeamTimesheet()
    }, [])

    if (loading) return <div className="d-flex flex-column w-100"><Loader />
    </div>
    return (
        <div className="d-flex flex-column w-100"> {/* 👈 ADD THIS */}

            <PageHeader>
                <TeamTimesheetHeader data={data} />
            </PageHeader>

            {/* <TeamTimesheetTabs /> */}

            <div className="main-content">
                <div className="tab-content m-4 " style={{minHeight:"60vh"}}>
                    <TeamTimesheetContent data={data} />
                </div>
            </div>

            <Footer />

        </div>
    )

}

export default TeamTimesheet
