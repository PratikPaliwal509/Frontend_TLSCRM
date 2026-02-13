import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Loader from '@/components/loader'
import Footer from '@/components/shared/Footer'
import TimesheetSummaryCard from '../components/timesheet/TimesheetSummaryCard'

const TimesheetPage = () => {
    const [timesheet, setTimesheet] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTimesheet = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`https://api-0ggv.onrender.com/api/timesheet/`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setTimesheet(data.data)
            } catch (err) {
                console.error('Failed to load timesheet', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTimesheet()
    }, [])

    if (loading) return <div className="d-flex flex-column w-100"><Loader />
    </div>
    if (!timesheet) return <p>Timesheet not found</p>

    return (
        <>
            <div className="d-flex flex-column w-100">
                {/* PAGE HEADER */}
                <PageHeader>
                    <h4 className="mb-0">My Timesheet</h4>
                </PageHeader>

                <div className="main-content ">
                    <div className="card m-4">
                        {/* SUMMARY SECTION */}
                        <div className="row mb-4 mt-2 mx-2">
                            <div className="col-12">
                                <TimesheetSummaryCard timesheet={timesheet.summary} />
                            </div>
                        </div>

                        {/* DETAILED LOGS */}
                        <div className="card shadow-sm mx-4">
                            <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                                <span>Detailed Time Logs</span>
                                <span className="badge bg-light text-dark">
                                    {timesheet.logs.length} Entries
                                </span>
                            </div>

                            <div className="card-body p-0">
                                {timesheet.logs.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Project</th>
                                                    <th>Task</th>
                                                    <th>Date</th>
                                                    <th className="text-center">Hours</th>
                                                    <th className="text-center">Billable</th>
                                                    <th className="text-end">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {timesheet.logs.map((log) => (
                                                    <tr key={log.log_id}>
                                                        <td>{log.project_name}</td>
                                                        <td>{log.task_title}</td>
                                                        <td>{new Date(log.start_time).toLocaleDateString()}</td>
                                                        <td className="text-center fw-semibold">{log.hours}</td>
                                                        <td className="text-center">
                                                            {log.is_billable ? (
                                                                <span className="badge bg-primary">Billable</span>
                                                            ) : (
                                                                <span className="badge bg-secondary">Non-billable</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end fw-semibold">
                                                            {log.currency} {log.amount}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-muted">
                                        No time logs found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div></div>

                <Footer />
            </div>
        </>
    )
}

export default TimesheetPage
