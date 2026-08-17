import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
const CreateWeeklyPlan = () => {
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [formData, setFormData] = useState({
        project_id: "",
        plan_name: "",
        week_start: "",
        week_end: "",
        description: "",
        tasks: [
            {
                task_title: "",
                priority: "medium",
                due_date: "",
            },
        ],
    });
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);

                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "https://api-0ggv.onrender.com/api/projects/projects-members",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProjects(res.data.data || []);
            } catch (error) {
                console.error("Project fetch error:", error);
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTaskChange = (index, field, value) => {
        const updatedTasks = [...formData.tasks];

        updatedTasks[index][field] = value;

        setFormData((prev) => ({
            ...prev,
            tasks: updatedTasks,
        }));
    };

    const addTask = () => {
        setFormData((prev) => ({
            ...prev,
            tasks: [
                ...prev.tasks,
                {
                    task_title: "",
                    priority: "medium",
                    due_date: "",
                },
            ],
        }));
    };

    const removeTask = (index) => {
        const updatedTasks = formData.tasks.filter(
            (_, i) => i !== index
        );

        setFormData((prev) => ({
            ...prev,
            tasks: updatedTasks,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");
            const payload = {
                ...formData,
                project_id: Number(formData.project_id),
            };
            const res = await axios.post(
                "https://api-0ggv.onrender.com/api/weekly-plans",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res.data);
toast.success('Weekly Plan Created successfully');
            // alert("Weekly Plan Created");

            setFormData({
                project_id: "",
                plan_name: "",
                week_start: "",
                week_end: "",
                description: "",
                tasks: [
                    {
                        task_title: "",
                        priority: "medium",
                        due_date: "",
                    },
                ],
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to create weekly plan');
            // alert("Failed to create weekly plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="card">
                <div className="card-header">
                    <h4>Create Weekly Plan</h4>
                </div>
               
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                         <div className="mb-3">
                    <label className="form-label">
                        Project
                    </label>

                    <select
                        name="project_id"
                        className="form-select"
                        value={formData.project_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            {loadingProjects
                                ? "Loading Projects..."
                                : "Select Project"}
                        </option>

                        {projects.map((project) => (
                            <option
                                key={project.project_id}
                                value={project.project_id}
                            >
                                {project.project_name}
                            </option>
                        ))}
                    </select>
                </div>
                        {/* Plan Name */}
                        <div className="mb-3">
                            <label className="form-label">
                                Plan Name
                            </label>

                            <input
                                type="text"
                                name="plan_name"
                                className="form-control"
                                value={formData.plan_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Week Dates */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Week Start Date
                                </label>

                                <input
                                    type="date"
                                    name="week_start"
                                    className="form-control"
                                    value={formData.week_start}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Week End Date
                                </label>

                                <input
                                    type="date"
                                    name="week_end"
                                    className="form-control"
                                    value={formData.week_end}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                rows={4}
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Tasks</h5>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addTask}
                            >
                                + Add Task
                            </button>
                        </div>

                        {formData.tasks.map(
                            (task, index) => (
                                <div
                                    key={index}
                                    className="card mb-3"
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h6>
                                                Task #{index + 1}
                                            </h6>

                                            {formData.tasks.length >
                                                1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            removeTask(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Task Title
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={
                                                    task.task_title
                                                }
                                                onChange={(e) =>
                                                    handleTaskChange(
                                                        index,
                                                        "task_title",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Priority
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={
                                                        task.priority
                                                    }
                                                    onChange={(e) =>
                                                        handleTaskChange(
                                                            index,
                                                            "priority",
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                >
                                                    <option value="low">
                                                        Low
                                                    </option>

                                                    <option value="medium">
                                                        Medium
                                                    </option>

                                                    <option value="high">
                                                        High
                                                    </option>

                                                    <option value="urgent">
                                                        Urgent
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Due Date
                                                </label>

                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={
                                                        task.due_date
                                                    }
                                                    onChange={(e) =>
                                                        handleTaskChange(
                                                            index,
                                                            "due_date",
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}

                        <div className="text-end">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Weekly Plan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWeeklyPlan;