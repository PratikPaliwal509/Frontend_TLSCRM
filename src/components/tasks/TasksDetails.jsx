import React, { useEffect, useRef, useState } from 'react'
import { FiAlertOctagon, FiEdit, FiAlertTriangle, FiArchive, FiArrowLeft, FiBell, FiBellOff, FiBookmark, FiCalendar, FiEye, FiEyeOff, FiInfo, FiLink2, FiPlus, FiSlash, FiSliders, FiStar, FiTrash2 } from 'react-icons/fi'
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
import AdminTaskTimelogs from '../AdminTaskTimelogs';
import { toast } from 'react-toastify'
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


const TasksDetails = ({ task, user_id, onStatusChange, onPriorityChange, onDeleteTask, onDescriptionChange,project_name }) => {
    console.log(task, project_name)
    const [status, setStatus] = useState(task?.status || 'to_do');
    const [priority, setPriority] = useState(task?.priority || 'medium');
    const [taskType, setTaskType] = useState(task?.taskType || '');
    const [selectedTags, setSelectedTags] = useState([]);
    const { canRemoveAssignee } = useVerifyRole()
    const [value, setValue] = useState('');
    const [assigningUserId, setAssigningUserId] = useState(null)
    const [role, setRole] = useState("")
    const inputRef = useRef(null);
    const id = task?.id;
    const tags = task?.tags || [];
    const title = task?.title || task?.task_title || '';
    const projectName = task?.projectName || task?.project?.project_name || project_name||'';
    const description = task?.description || '';
    const user_img = task?.user_img || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z';
    const start_date = task?.start_date || null;
    const checklist = task?.checklist || [];
    const project_id = task?.project_id || '';
    const createdBy = task?.created_by;
    // const selectedTags = taskLabelsOptions.filter(opt =>
    //     tags?.includes(opt.value)
    // )
    const [isUpdatingDesc, setIsUpdatingDesc] = useState(false);
    const [usersList, setUsersList] = useState([])
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
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [taskDescription, setTaskDescription] = useState(description);
    const isAssignedUser = assignedUserIds.includes(user_id)
    const isCreatedByUser = createdBy === user_id
    console.log(isCreatedByUser)
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
        setStatus(task?.status || 'to_do');
        setPriority(task?.priority || 'medium');
        setTaskType(task?.task_type || '');
        setTaskDescription(task?.description || '');
        if (task?.tags) {
            const mappedTags = taskLabelsOptions.filter(opt =>
                task.tags.includes(opt.value)
            );
            setSelectedTags(mappedTags);
        }
    }, [task]);
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
            full_name: a.user?.full_name,
            avatar: a.user.avatar || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z',
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

                const res = await fetch('http://localhost:5000/api/users/user', {
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
                    label: user?.full_name,
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
            setAssignees(prev => [
                ...prev,
                {
                    user_id: user.value,
                    full_name: user.label,
                    avatar: user.img || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z',
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
    const handleStatusChange = async (selectedOption) => {
        setStatus(selectedOption); // Optimistically update UI
        try {

            const res = await fetch(
                `http://localhost:5000/api/tasks/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status: selectedOption }),
                }
            )

            if (!res.ok) throw new Error()

            // 🔥 IMPORTANT: update parent state
            onStatusChange && onStatusChange(id, selectedOption);
            topTost("Status updated", "success")
        } catch (err) {
            console.error(err)
            topTost("Failed to update status", "error")
        }
    }
    const handlePriorityChange = async (selectedOption) => {
        const newPriority = selectedOption?.value || selectedOption;

        setPriority(newPriority);
        try {
            const res = await fetch(
                `http://localhost:5000/api/tasks/${id}/priority`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ priority: newPriority }),
                }
            )

            if (!res.ok) throw new Error()
            // 🔥 update parent state
            onPriorityChange && onPriorityChange(id, newPriority);
            topTost("Priority updated", "success")
        } catch (err) {
            console.error(err)
            topTost("Failed to update priority", "error")
        }
    }

    const handleTypeChange = async (selectedOption) => {
        setTaskType(selectedOption); // Optimistically update UI
        try {
            const res = await fetch(
                `http://localhost:5000/api/tasks/${id}/type`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ task_type: selectedOption }),
                }
            )

            if (!res.ok) throw new Error()

            topTost("Task type updated", "success")
        } catch (err) {
            console.error(err)
            topTost("Failed to update type", "error")
        }
    }

    const handletagchange = async (selectedOptions) => {
        const previousTags = selectedTags; // 🧠 keep backup for rollback

        // optimistic UI update
        setSelectedTags(selectedOptions || []);

        const tags = selectedOptions ? selectedOptions.map(opt => opt.value) : [];

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}/tags`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tags })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to update tags');
            }

            topTost('Tags updated successfully', 'success');

        } catch (error) {
            console.error('Error updating tags:', error);

            // ❌ rollback UI
            setSelectedTags(previousTags);

            topTost(error.message || 'Failed to update tags', 'error');
        }
    };
    const handleClick = () => {
        topTost()
    };

    const handleRemoveAssignee = async (userId) => {
        if (!window.confirm('Remove this user from task?')) return

        try {
            const res = await fetch(
                `http://localhost:5000/api/tasks/${id}/assignments/${userId}/remove`,
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
    const handleUpdateDescription = async () => {
        if (!taskDescription.trim()) {
            topTost("Description cannot be empty", "warning");
            return;
        }
        setIsUpdatingDesc(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/tasks/${id}/description`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ description: taskDescription }),
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.message || "Failed to update description");
            }

            // ✅ IMPORTANT FIX: send updated value to parent (Kanban)
            if (onDescriptionChange) {
                onDescriptionChange(id, taskDescription);
            }

            toast.success("Description updated successfully", "success");
            setIsEditingDesc(false);

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error updating description", "error");
        } finally {
            setIsUpdatingDesc(false); // 🔥 stop loading
        }
    };
    const handleDeleteTask = async () => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/tasks/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ✅ handle non-JSON safely
            let data = null;
            try {
                data = await res.json();
            } catch {
                // ignore if no JSON
            }

            // ❌ API error handling
            if (!res.ok) {
                const message =
                    data?.message ||
                    data?.error ||
                    `Failed to delete task (Status: ${res.status})`;

                throw new Error(message);
            }

            // ✅ success
            toast.success(data?.message || "Task deleted successfully", "success");

            // ✅ update parent UI safely
            if (typeof onDeleteTask === "function") {
                onDeleteTask(id);
            }

        } catch (err) {
            console.error("Delete Task Error:", err);

            // ✅ better user message
            let errorMessage = "Something went wrong while deleting task";

            if (err.name === "TypeError") {
                errorMessage = "Network error. Please check your connection.";
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage, "error");
        }
    };
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
                            <span className="text-truncate">
                                {title}
                            </span>
                            {task?.estimated_hours && (
                                <span className="badge ms-2 bg-primary">
                                    {task.estimated_hours}h
                                </span>
                            )}
                            {/* {projectName && (
                                <span className="text-muted fw-normal ms-2 flex-shrink-0">
                                    - {projectName}
                                </span>
                            )} */}

                        </h2>
                        <span className="fs-13 fw-medium text-secondary">
                            <span className='fw-bold text-dark'>Project Name:-</span> {projectName}
                        </span>
                        {/* <span className="fs-12 fw-normal text-muted text-truncate-1-line">
                            {description}
                        </span> */}

                    </a>
                </div>

                <div className="d-none d-md-flex gap-1 align-items-center justify-content-center">
                    {isAssignedUser && (<TaskTimer taskId={id} project_id={project_id} />)}
                    {/* <a href="#"
                        className="d-none d-lg-flex align-items-center fs-9 fw-bold text-uppercase text-dark py-2 px-3 border border-gray-2 rounded"
                    >
                        <FiLink2 size={16} strokeWidth={1.7} className='me-2' />
                        <span className="text-nowrap">Copy Link</span>
                    </a> */}
                    {/* <a href="#" className="d-flex">
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add Contractors"
                        >
                            <FiPlus strokeWidth={1.6} />
                        </div>
                    </a> */}
                    {/* <a href="#" className="d-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Remainder Notify"
                        >
                            <FiBell strokeWidth={1.6} />
                        </div>
                    </a> */}
                    {/* <a href="#" className="d-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add to Favorite"
                        >
                            <FiStar strokeWidth={1.6} />
                        </div>
                    </a> */}
                    {/* <a href="#" className="d-flex" onClick={handleClick}>
                        <div
                            className="avatar-text avatar-md"
                            data-bs-toggle="tooltip"
                            data-bs-trigger="hover"
                            title="Add to Calendar"
                        >
                            <FiCalendar strokeWidth={1.6} />
                        </div>
                    </a> */}
                    {/* <Dropdown
                        triggerClass='avatar-md'
                        tooltipTitle="More Options"
                        dropdownItems={detailsMoreOptions}
                        triggerPosition={"0,25"}
                    /> */}
                    {isCreatedByUser && <button
                        className="btn btn-danger btn-sm d-flex align-items-center"
                        onClick={handleDeleteTask}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#tasksDetailsOffcanvas"
                    >
                        <FiTrash2 className="me-1" />
                        Delete
                    </button>}
                </div>
            </div>
            <div className="offcanvas-body">
                <div className="col-12">
                    <div className="form-group mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">Description:</label>

                            {!isEditingDesc ? (
                                <FiEdit
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setIsEditingDesc(true)}
                                />
                            ) : (
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-success d-flex align-items-center"
                                        onClick={handleUpdateDescription}
                                        disabled={isUpdatingDesc}
                                    >
                                        {isUpdatingDesc ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save"
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setIsEditingDesc(false);
                                            setTaskDescription(description); // reset
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        <textarea
                            className="form-control"
                            rows={4}
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            disabled={!isEditingDesc}
                            placeholder="Enter task description..."
                        />
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-sm-6">
                        <div className="form-group mb-4">
                            <label className="form-label">Estimated Hours:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={task?.estimated_hours || ''}
                                readOnly
                            />
                        </div>
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-sm-6">
                        <TaskStatus label={"Status:"} options={taskStatusOptions} value={status} defaultSelect={status} onChange={handleStatusChange} />
                    </div>
                    <div className="col-sm-6">
                        <TaskStatus label={"Priority:"} options={taskPriorityOptions} value={priority} defaultSelect={priority} onChange={handlePriorityChange} />
                        {/* <TaskStatus options={taskPriorityOptions} label={"Priority:"} defaultSelect={priority} /> */}
                    </div>
                    {/* <div className="col-sm-6">
                        <TaskStatus options={taskLabelsOptions} label={"Labels:"} value={selectedTags} defaultSelect={selectedTags} />
                    </div> */}
                    <div className="col-sm-6">
                        <TaskStatus label={"Types:"} options={taskTypeOptions} value={taskType} defaultSelect={taskType} onChange={handleTypeChange} />
                    </div>

                    <div className="col-sm-6">
                        <div className="form-group mb-4">
                            <label className="form-label">Tags:</label>
                            <MultiSelectTags
                                options={taskLabelsOptions}
                                value={selectedTags}
                                onChange={handletagchange}
                            />
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
                                            alt={user?.full_name}
                                        />
                                        {user?.full_name}
                                        {user.is_active === false && (
                                            <small className="ms-1 text-muted">(Inactive)</small>
                                        )}

                                        <span>{canRemoveAssignee({
                                            taskCreatedBy: task?.created_by,
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

                    <div className="col-sm-6">
                        <label className="form-label">Create By:</label>
                        <select
                            className="form-control"
                            value={task?.createdByName || task?.createdBy?.full_name}
                            onChange={(e) => onSelectOption(e.target.value)}
                        >
                            <option key={task?.createdByName || task?.createdBy?.full_name} value={task?.createdByName || task?.createdBy?.full_name}>
                                {task?.createdByName || task?.createdBy?.full_name}
                            </option>
                        </select>

                    </div>
                    <TaskDateRange
                        initialStartDate={task?.start_date ? new Date(task.start_date) : null}
                        initialEndDate={task?.due_date ? new Date(task.due_date) : null}
                        onChange={(start, end) => console.log("Selected range:", start, end)}
                    />

                </div>
                <hr className="my-5" />

                {(isAssignedUser) && (<TaskTimeLogDetails taskId={id} project_id={project_id} role={role} />)}
                {(role === "Super Admin" || role === "Admin") && (<AdminTaskTimelogs taskId={id} project_id={project_id} role={role} />)}
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
                <div className="col-12">
                    <div className="form-group mb-4">
                        <label className="form-label" >Depends On:</label>

                        {task?.dependsOnTasks?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {task?.dependsOnTasks.map(t => (
                                    <span key={t.task_id} className="badge bg-warning text-dark" onClick={() => console.log("Dependent Task ID:", t)}>
                                        #{t.task_id} - {t?.task_title}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <small className="text-muted">No dependencies</small>
                        )}
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-group mb-4">
                        <label className="form-label">Blocks:</label>

                        {task?.blocksTasks?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                                {task?.blocksTasks.map(t => (
                                    <span key={t.task_id} className="badge bg-danger" onClick={() => console.log("Blocked Task ID:", t)}>
                                        #{t.task_id} - {t?.task_title}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <small className="text-muted">No blocked tasks</small>
                        )}
                    </div>
                </div>
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
                    <Comments comments={comments} loading={loading} setComments={setComments} portal_user_id={user_id} usersList={usersList}/>
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

