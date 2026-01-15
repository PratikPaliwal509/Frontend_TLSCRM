import React, { useEffect, useRef, useState } from 'react'
import { FiAlertOctagon, FiAlertTriangle, FiArchive, FiArrowLeft, FiBell, FiBellOff, FiBookmark, FiCalendar, FiEye, FiEyeOff, FiInfo, FiLink2, FiPlus, FiSlash, FiSliders, FiStar, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import ReactQuill from 'react-quill';
import TaskDateRange from './TaskDateRange';
import TaskStatus from './TaskStatus';
import Comments from '../Comments';
import MultiSelectTags from '@/components/shared/MultiSelectTags';
import MultiSelectImg from '@/components/shared/MultiSelectImg';
import { taskAssigneeOptions, taskLabelsOptions, taskPriorityOptions, taskStatusOptions, taskTypeOptions } from '@/utils/options';
import topTost from '@/utils/topTost';
import CheckList from '../CheckList';
import Select from 'react-select'
import AddComment from './AddComment';
import TaskTimer from '@/components/TaskTimer'
import TaskTimeLogDetails from '../TaskTimeLogDetails';
const detailsMoreOptions = [
    { label: "Make Unread", icon: <FiEyeOff /> },
    { label: "Filter Messages", icon: <FiSliders /> },
    { label: "Make as Archive", icon: <FiArchive /> },
    { type: "divider" },
    { label: "Attach files", icon: <FiLink2 /> },
    { label: "Set Due Date", icon: <FiCalendar />, },
    { label: "Follow Task", icon: <FiEye />, },
    { label: "Apply Labels", icon: <FiBookmark />, },
    { type: "divider" },
    { label: "Report Spam", icon: <FiAlertTriangle /> },
    { label: "Report phishing", icon: <FiAlertOctagon /> },
    { type: "divider" },
    { label: "Mute Conversion", icon: <FiBellOff /> },
    { label: "Block Conversion", icon: <FiSlash /> },
    { label: "Delete Conversion", icon: <FiTrash2 /> },
];


const TasksDetails = ({ task }) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);
    const id = task?.id;
    const tags = task?.tags || [];
    const status = task?.status || 'to_do';
    const title = task?.title || '';
    const description = task?.description || '';
    const priority = task?.priority || 'medium';
    const taskType = task?.taskType || '';
    const user_img = task?.user_img || '/images/avatar/1.png';
    const start_date = task?.start_date || null;
    const checklist = task?.checklist || [];
    const project_id = task?.project_id || '';

    const selectedTags = taskLabelsOptions.filter(opt =>
        tags?.includes(opt.value)

    )

    const [users, setUsers] = useState([])
    const [assignees, setAssignees] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const token = localStorage.getItem("token")
    const assignedUserIds = Array.isArray(task?.assigned_to)
        ? task.assigned_to.map((u) =>
            typeof u === 'object' ? u.user_id : u
        )
        : []

    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `http://localhost:5000/api/tasksComments/${id}/comments`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const result = await res.json()
            setComments(
                Array.isArray(result.data)
                    ? [...result.data].reverse()
                    : []
            )

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchComments()
    }, [id])
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);


    useEffect(() => {
        if (!token) return

        const fetchUsers = async () => {
            try {
                setLoadingUsers(true)

                const res = await fetch('http://localhost:5000/api/users/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) throw new Error('Failed to fetch users')

                const result = await res.json()
                const list = Array.isArray(result?.data) ? result.data : []

                const mappedUsers = list.map((user) => ({
                    value: user.user_id,
                    label: user.full_name,
                    img: user.avatar,
                }))

                // pre-selected users
                const selected = mappedUsers.filter((u) =>
                    assignedUserIds.includes(u.value)
                )

                // remaining users
                const remaining = mappedUsers.filter(
                    (u) => !assignedUserIds.includes(u.value)
                )

                setAssignees(selected)
                setUsers(remaining)
            } catch (error) {
                console.error(error)
                topTost('Failed to load users', 'error')
            } finally {
                setLoadingUsers(false)
            }
        }

        fetchUsers()
    }, [token, task])

    /* ------------------ ASSIGN USERS ------------------ */
    const handleAssignUser = async (e, passedTaskId) => {
        const taskId = passedTaskId
        const userId = Number(e.target.value)
        if (!userId || !taskId) return
        const user = users.find((u) => u.value === userId)
        if (!user) return

        // prevent duplicate
        if (assignees.some((a) => a.value === userId)) {
            topTost('User already assigned', 'warning')
            return
        }

        const confirmed = window.confirm(
            `Do you want to assign ${user.label} to this task?`
        )

        if (!confirmed) {
            e.target.value = ''
            return
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/tasks/${taskId}/assign`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_ids: [userId] }),
                }
            )

            if (!res.ok) throw new Error()

            setAssignees((prev) => [...prev, user])
            setUsers((prev) => prev.filter((u) => u.value !== userId))

            topTost('User assigned successfully', 'success')
            e.target.value = ''
        } catch {
            topTost('Failed to assign user', 'error')
            e.target.value = ''
        }
    }


    const handleClick = () => {
        topTost()
    };
    return (
        <div
            className="offcanvas offcanvas-end w-50"
            tabIndex={-1}
            id="tasksDetailsOffcanvas"
        >
            <div
                className="offcanvas-header border-bottom"
                style={{ paddingTop: 20, paddingBottom: 20,  display: 'flex',   justifyContent: 'space-between' }}
            >
                <div className="d-flex align-items-center">
                    <div
                        className="avatar-text avatar-md items-details-close-trigger"
                        data-bs-dismiss="offcanvas"
                        data-bs-toggle="tooltip"
                        data-bs-trigger="hover"
                        title="Details Close"
                    >
                        <FiArrowLeft />
                    </div>
                    <span className="vr text-muted mx-4" />
                    <a href="#">
                        <h2 className="fs-14 fw-bold text-truncate-1-line">
                            {title}
                        </h2>
                        <span className="fs-12 fw-normal text-muted text-truncate-1-line">
                            {description}
                        </span>
                    </a>
                </div>
                <div className="d-none d-md-flex gap-1 align-items-center justify-content-center">
                    <TaskTimer taskId={id} project_id={project_id}/>
                    <a href="#"
                        className="d-none d-lg-flex align-items-center fs-9 fw-bold text-uppercase text-dark py-2 px-3 border border-gray-2 rounded"
                    >
                        <FiLink2 size={16} strokeWidth={1.7} className='me-2' />
                        <span className="text-nowrap">Copy Link</span>
                    </a>
                    <a href="#" className="d-flex">
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add Contractors"
                        >
                            <FiPlus strokeWidth={1.6} />
                        </div>
                    </a>
                    <a href="#" className="d-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Remainder Notify"
                        >
                            <FiBell strokeWidth={1.6} />
                        </div>
                    </a>
                    <a href="#" className="d-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add to Favorite"
                        >
                            <FiStar strokeWidth={1.6} />
                        </div>
                    </a>
                    <a href="#" className="d-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add to Calendar"
                        >
                            <FiCalendar strokeWidth={1.6} />
                        </div>
                    </a>
                    <Dropdown
                        triggerClass='avatar-md'
                        tooltipTitle="More Options"
                        dropdownItems={detailsMoreOptions}
                        triggerPosition={"0,25"}
                    />

                </div>
            </div>
            <div className="offcanvas-body">
                <div className="row">
                    <div className="col-sm-6">
                        <TaskStatus label={"Status:"} options={taskStatusOptions} value={status} defaultSelect={status} />
                    </div>
                    <div className="col-sm-6">
                        <TaskStatus options={taskPriorityOptions} label={"Priority:"} value={priority} defaultSelect={priority} />
                        {/* <TaskStatus options={taskPriorityOptions} label={"Priority:"} defaultSelect={priority} /> */}
                    </div>
                    {/* <div className="col-sm-6">
                        <TaskStatus options={taskLabelsOptions} label={"Labels:"} value={selectedTags} defaultSelect={selectedTags} />
                    </div> */}
                    <div className="col-sm-6">
                        <TaskStatus options={taskTypeOptions} label={"Types:"} value={taskType} defaultSelect={taskType} />
                    </div>

                    <div className="col-sm-6">
                        <div className="form-group mb-4">
                            <label className="form-label">Tags:</label>
                            <MultiSelectTags options={taskLabelsOptions} value={selectedTags} defaultSelect={[taskLabelsOptions[2]]} />
                        </div>
                    </div>
                    {/* <div className="col-sm-6">
                        <div className="form-group mb-4">
                            <label className="form-label">Assignee:</label>
                            <MultiSelectImg
                                options={users}
                                value={assignees}
                                onChange={handleAssignUsers}
                                isLoading={loadingUsers}
                            />
                        </div>
                    </div> */}
                    <div className="col-sm-6">
                        <label className="form-label">Assignee</label>

                        <select
                            className="form-select"
                            onChange={(e) => handleAssignUser(e, id)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select user
                            </option>

                            {users.map((user) => (
                                <option key={user.value} value={user.value}>
                                    {user.label}
                                </option>
                            ))}
                        </select>

                        {/* Assigned Users Preview */}
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                            {assignees.map((user) => (
                                <span
                                    key={user.value}
                                    className="badge bg-light text-dark d-flex align-items-center gap-2"
                                >
                                    <img
                                        src={user.img || '/images/avatar/1.png'}
                                        className="avatar avatar-xs rounded-circle"
                                    />
                                    {user.label}
                                </span>
                            ))}
                        </div>
                    </div>


                    <TaskDateRange
                        initialStartDate={task?.start_date ? new Date(task.start_date) : null}
                        initialEndDate={task?.due_date ? new Date(task.due_date) : null}
                        onChange={(start, end) => console.log("Selected range:", start, end)}
                    />

                </div>
                <hr className="my-5" />
                
                <TaskTimeLogDetails taskId={id} project_id={project_id} />
                <hr className="my-5" />
                <div className="checklist">
                    <div className="d-flex justify-content-between mb-4">
                        <div>
                            <h2 className="fs-16 fw-bold mb-1">Checklist</h2>
                            <span className="fs-12 text-muted">Issues found checklist</span>
                        </div>
                        <a href="#" className="avatar-text avatar-md">
                            <FiInfo />
                        </a>
                    </div>
                    <CheckList checklist={checklist} taskID={id} />
                </div>
                <hr className="my-5" />
                {/*! BEGIN: Notes !*/}
                {/* <div className="notes">
                    <div className="d-flex justify-content-between mb-4">
                        <div>
                            <h2 className="fs-16 fw-bold mb-1">Notes</h2>
                            <span className="fs-12 text-muted">{notes}</span>
                        </div>
                        <a href="#" className="avatar-text avatar-md">
                            <FiInfo />
                        </a>
                    </div>
                    <div className="editor task-editor ht-250 ">
                        <ReactQuill ref={inputRef} theme="snow" value={value} onChange={setValue} className="ht-200 border-0" />
                    </div>
                </div> */}
                {/*! END: Notes !*/}
                <hr className="my-5" />
                <div className="comments">
                    <div className="d-flex justify-content-between mb-4">
                        <div>
                            <h2 className="fs-16 fw-700 mb-1">Comments</h2>
                            <small className="text-muted">Responses for this tasks</small>
                        </div>
                        <a href="#" className="avatar-text avatar-md">
                            <FiInfo />
                        </a>
                    </div>
                    <Comments comments={comments} loading={loading} setComments={setComments}/>
                    {/* <Comments taskID={id} /> */}
                    <AddComment
                        taskID={id}
                        setComments={setComments}
                    />

                </div>
            </div>
        </div>

    )
}

export default TasksDetails

