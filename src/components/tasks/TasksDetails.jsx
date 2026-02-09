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
import AddAttachment from './TaskAttachment';
import useVerifyRole from '@/utils/canRemoveAssognee'
import { getUserRole } from "@/utils/verifyRole"

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


const TasksDetails = ({ task, user_id }) => {
    const { canRemoveAssignee } = useVerifyRole()
    const [value, setValue] = useState('');
    const [assigningUserId, setAssigningUserId] = useState(null)
    const [role, setRole] = useState("")
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
const [usersList, setUsersList] =useState([])
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

    const isAssignedUser = assignedUserIds.includes(user_id)

    const fetchComments = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `https://api-0ggv.onrender.com/api/tasksComments/${id}/comments`,
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
        const data = async () => {
            const res = await getUserRole()
            setRole(res.role_name)
        }
        data()
    })
    useEffect(() => {
        if (id) {
            fetchComments()
        }

    }, [id])
    useEffect(() => {
        if (!task?.assignments) return

        const normalized = task.assignments.map(a => ({
            user_id: a.user.user_id,
            full_name: a.user.full_name,
            avatar: a.user.avatar || '/images/avatar/1.png',
            assigned_by: a.assigned_by,
            is_active: a.is_active,
        }))

        setAssignees(normalized)
    }, [task])

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

                const res = await fetch('https://api-0ggv.onrender.com/api/users/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!res.ok) throw new Error('Failed to fetch users')

                const result = await res.json()
                const list = Array.isArray(result?.data) ? result.data : []
setUsersList(list)
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

                // setAssignees(selected)
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
        if (assignees.some(a => a.user_id === userId)) {
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
            setAssigningUserId(userId)
            const res = await fetch(
                `https://api-0ggv.onrender.com/api/tasks/${taskId}/assign`,
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
            setAssignees(prev => [
                ...prev,
                {
                    user_id: user.value,
                    full_name: user.label,
                    avatar: user.img || '/images/avatar/1.png',
                    assigned_by: user.value || null, // You can set this value accordingly
                    is_active: true,
                }
            ])


            setUsers((prev) => prev.filter((u) => u.value !== userId))

            topTost('User assigned successfully', 'success')
            e.target.value = ''
        } catch {
            topTost('Failed to assign user', 'error')
            e.target.value = ''
        } finally {
            setAssigningUserId(null) // 🔥 stop loading
            e.target.value = ''
        }
    }


    const handleClick = () => {
        topTost()
    };

    const handleRemoveAssignee = async (userId) => {
        if (!window.confirm('Remove this user from task?')) return

        try {
            const res = await fetch(
                `https://api-0ggv.onrender.com/api/tasks/${id}/assignments/${userId}/remove`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) throw new Error()

            // ✅ remove from UI
            // setAssignees(prev => prev.filter(u => u.user_id !== userId))
            setAssignees(prev =>
                prev.map(u =>
                    u.user_id === userId
                        ? { ...u, is_active: false }
                        : u
                )
            )

            topTost('User removed from task', 'success')
        } catch (err) {
            console.error(err)
            topTost('Failed to remove user', 'error')
        }
    }

    return (
        <div
            className="offcanvas offcanvas-end w-50"
            tabIndex={-1}
            id="tasksDetailsOffcanvas"
        >

            <div
                className="offcanvas-header border-bottom"
                style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', justifyContent: 'space-between' }}
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
                    {isAssignedUser && (<TaskTimer taskId={id} project_id={project_id} />)}
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
                        {/* when you are showing assignee show only those who are preiously not added to same task  */}
                        <label className="form-label">Assignee:</label>

                        <select
                            className="form-select"
                            onChange={(e) => handleAssignUser(e, id)}
                            defaultValue=""
                            disabled={assigningUserId !== null}
                        >
                            <option value="" disabled>
                                {assigningUserId ? 'Assigning user...' : 'Select user'}
                            </option>

                            {users.map((user) => (
                                <option key={user.value} value={user.value}>
                                    {user.label}
                                </option>
                            ))}
                        </select>

                        {/* Assigned Users Preview */}
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                            {<div className="d-flex gap-2 mt-2 flex-wrap">
                                {assignees.map(user => (
                                    <span
                                        key={user.user_id}
                                        className={`badge d-flex align-items-center gap-2 ${user.is_active ? 'bg-light text-dark' : 'bg-light text-muted opacity-75'
                                            }`}

                                    >
                                        <img
                                            src={user.avatar}
                                            className="avatar avatar-xs rounded-circle"
                                            alt={user.full_name}
                                        />
                                        {user.full_name}
                                        {user.is_active === false && (
                                            <small className="ms-1 text-muted">(Inactive)</small>
                                        )}

                                        <span>{canRemoveAssignee({
                                            taskCreatedBy: task.created_by,
                                            assignedBy: user?.assigned_by,
                                        }) && user.is_active && (
                                                <button
                                                    className="btn btn-sm btn-link text-danger"
                                                    onClick={() => handleRemoveAssignee(user.user_id)}
                                                >
                                                    ✕

                                                </button>
                                            )}</span>

                                        {/* <button
                                            type="button"
                                            className="btn btn-sm btn-link text-danger p-0 ms-1"
                                            title="Remove assignee"
                                            onClick={() => handleRemoveAssignee(user.user_id)}
                                        >
                                            ✕
                                        </button> */}
                                    </span>
                                ))}
                            </div>
                            }
                        </div>
                    </div>


                    <TaskDateRange
                        initialStartDate={task?.start_date ? new Date(task.start_date) : null}
                        initialEndDate={task?.due_date ? new Date(task.due_date) : null}
                        onChange={(start, end) => console.log("Selected range:", start, end)}
                    />

                </div>
                <hr className="my-5" />


                {(isAssignedUser || role === "Super Admin" || role === "Admin") && (<TaskTimeLogDetails taskId={id} project_id={project_id} role={role} />)}
                {/* <TaskTimeLogDetails taskId={id} project_id={project_id} /> */}

                <hr className="my-5" />
                <AddAttachment taskCreatedBy={task?.created_by} taskId={task?.id} />
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
                    <Comments comments={comments} loading={loading} setComments={setComments} portal_user_id={user_id} />
                    {/* <Comments taskID={id} /> */}
                    <AddComment
                    usersList={usersList}
                        taskID={id}
                        setComments={setComments}
                    />

                </div>
            </div>
        </div>

    )
}

export default TasksDetails

