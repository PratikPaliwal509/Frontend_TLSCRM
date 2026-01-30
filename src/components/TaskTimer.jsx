import { useEffect, useRef, useState } from "react"

const TaskTimer = ({ taskId, project_id }) => {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [logId, setLogId] = useState(null)
  const [totalTime, setTotalTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const intervalRef = useRef(null)

  console.log("project_id"+project_id)

  const startLocalTimer = (initialSeconds = 0) => {
    stopLocalTimer() // ✅ force cleanup

    setSeconds(initialSeconds)
    setRunning(true)

    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }


  const stopLocalTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  useEffect(() => {
    if (!taskId) return

    // ✅ RESET STATE FOR NEW TASK
    stopLocalTimer()
    setSeconds(0)
    setTotalTime(0)
    setIsCompleted(false)
    setLogId(null)

    const token = localStorage.getItem("token")

    const fetchActiveLog = async () => {
      console.log("taskId"+taskId)
      try {
        const res = await fetch(
          `http://localhost:5000/api/tasks/timelogs/active/${taskId}`,
          // `http://localhost:5000/api/tasks/timelogs/${taskId}/time-logs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!res.ok) return

        const result = await res.json()
        console.log("result"+JSON.stringify(result))
        const log = result
        // const log = result?.data?.[0]
        if (!log) return
console.log("log"+JSON.stringify(log))
        // 🟢 ACTIVE TIMER
        if (log.start_time && !log.end_time) {
          const diff = Math.floor(
            (Date.now() - new Date(log.start_time).getTime()) / 1000
          )

          setLogId(log.log_id)
          startLocalTimer(diff)
          return
        }

        // 🟢 COMPLETED TIMER
        if (log.start_time && log.end_time) {
          const totalSeconds = Math.floor(
            (new Date(log.end_time).getTime() -
              new Date(log.start_time).getTime()) / 1000
          )

          setTotalTime(totalSeconds)
          setSeconds(totalSeconds)
          setIsCompleted(true)
        }
      } catch (err) {
        console.error("Error fetching active log", err)
      }
    }

    fetchActiveLog()

    return () => stopLocalTimer()
  }, [taskId])


  const handleStart = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:5000/api/tasks/timelogs/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ taskId, project_id })
    })

    const data = await res.json()
    console.log("dataa" + JSON.stringify(data))
    console.log("data id" + JSON.stringify(data.id))
    console.log("data logid" + JSON.stringify(data.log_id))
    setLogId(data.log_id)
    startLocalTimer(0)
  }

  const handleStop = async () => {
    const token = localStorage.getItem("token")

    await fetch("http://localhost:5000/api/tasks/timelogs/stop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ logId }),
    })

    stopLocalTimer()
    setTotalTime(seconds) // ✅ save final time
    setIsCompleted(true)  // ✅ disable button
    setLogId(null)
  }


  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }


  return (
    <div className="timer-card">
      <div className="timer-card me-2 ">
        <div className="timer-time ">
          {isCompleted
            ? formatTime(totalTime)
            : formatTime(seconds)}
        </div>

        {!isCompleted && (
          <button
            className={`timer-btn btn-primary rounded-2 border-0 px-2 ms-1  ${running ? "stop" : "start"}`}
            onClick={running ? handleStop : handleStart}
          >
            {running ? "Stop" : "Start"}
          </button>
        )}
      </div>

    </div>
  )
}

export default TaskTimer
