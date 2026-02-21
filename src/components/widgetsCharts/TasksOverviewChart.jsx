import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { tasksOverviewChartOption } from '@/utils/chartsLogic/tasksOverviewChatOption'
import getIcon from '@/utils/getIcon'
import { toast } from 'react-toastify'

const TasksOverviewChart = ({ filters }) => {
  const [overviewInfo, setOverviewInfo] = useState([])
  const [loading, setLoading] = useState(false)

  const chartOptions = tasksOverviewChartOption()

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem('token')
        if (!token) throw new Error('Authentication token missing')

        // ✅ Build Query Params
        const queryParams = new URLSearchParams()

        if (filters?.startDate)
          queryParams.append('startDate', filters.startDate)

        if (filters?.endDate)
          queryParams.append('endDate', filters.endDate)

        if (filters?.selectedFilters?.length)
          queryParams.append(
            'filters',
            filters.selectedFilters.join(',')
          )

        const url = `http://localhost:5000/api/tasks/overview?${queryParams.toString()}`

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Failed to fetch task overview')
        }

        const json = await res.json()
        setOverviewInfo(json.data || [])
      } catch (error) {
        console.error('Task overview error:', error)
        toast.error(error.message || 'Unable to load task overview')
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [filters]) // ✅ Refetch when filters change

  if (loading) {
    return <div className="text-center py-5">Loading overview...</div>
  }

  return (
    <>
      {overviewInfo.map(
        (
          {
            title,
            completed_number,
            total_number,
            progress,
            chartColor,
            color,
            chartData,
          },
          index
        ) => (
          <div key={index} className="col-lg-4 task-overview-card">
            <div className="card mb-4 stretch stretch-full">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div className="d-flex gap-3 align-items-center">
                  <div className="avatar-text">
                    <i className="fs-16">
                      {getIcon(
                        title === 'Tasks Completed'
                          ? 'feather-star'
                          : title === 'New Tasks'
                          ? 'feather-file-text'
                          : 'feather-airplay'
                      )}
                    </i>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">{title}</div>
                    <div className="fs-12 text-muted">
                      {completed_number}/{total_number} completed
                    </div>
                  </div>
                </div>
                <div className="fs-4 fw-bold text-dark">
                  {completed_number}/{total_number}
                </div>
              </div>

              <div className="card-body d-flex align-items-center justify-content-between gap-4">
                <ReactApexChart
                  options={{ ...chartOptions, colors: [chartColor] }}
                  series={[{ name: title, data: chartData }]}
                  type="area"
                  height={100}
                />

                <div className="fs-12 text-muted text-nowrap">
                  <span className={`fw-semibold text-${color}`}>
                    {progress}% more
                  </span>
                  <br />
                  <span>from last week</span>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default TasksOverviewChart