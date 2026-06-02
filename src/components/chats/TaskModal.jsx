import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const TaskModal = ({
  show,
  onClose,
  selectedChat,
  currentUserId,
  onTaskCreated,
}) => {

  const [loading, setLoading] =
    useState(false);
  const [projects, setProjects] =
    useState([]);

  const [loadingProjects, setLoadingProjects] =
    useState(false);
  const [formData, setFormData] =
    useState({
      task_title: "",
      description: "",
      priority: "medium",
      due_date: "",
      assigned_to: [],
    });
  useEffect(() => {

    if (!show) return;

    const fetchProjects = async () => {

      try {

        setLoadingProjects(true);

        const token =
          localStorage.getItem("token");

        const res = await axios.get(
          "https://api-0ggv.onrender.com/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(
          res.data.data || []
        );

      } catch (err) {

        console.log(
          "Project fetch error:",
          err
        );

      } finally {

        setLoadingProjects(false);
      }
    };

    fetchProjects();

  }, [show]);
  useEffect(() => {

    if (selectedChat?.project_id) {

      setFormData((prev) => ({
        ...prev,
        project_id:
          selectedChat.project_id,
      }));
    }

  }, [selectedChat]);
  useEffect(() => {

    if (!show || !selectedChat) return;

    if (selectedChat.chat_type === "direct") {

      const otherUser =
        selectedChat.participants?.find(
          (p) =>
            p.user_id !== currentUserId
        );

      setFormData((prev) => ({
        ...prev,
        assigned_to:
          otherUser?.user_id || "",
      }));
    }

  }, [
    show,
    selectedChat,
    currentUserId,
  ]);

  if (!show) return null;

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAssigneeChange = (e) => {
    const selectedUsers = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );

    setFormData((prev) => ({
      ...prev,
      assigned_to: selectedUsers,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        chat_id: selectedChat.chat_id,
        sender_id: currentUserId,
        message_type: "task",

        task: {
          project_id: Number(formData.project_id),

          task_title: formData.task_title,

          description: formData.description,

          task_type: formData.task_type || "Development",

          priority: formData.priority,
 due_date: formData.due_date
    ? new Date(formData.due_date)
    : null,
          status: "to_do",

          estimated_hours: Number(
            formData.estimated_hours || 0
          ),

          is_milestone: false,
          is_billable: true,
          is_recurring: false,
          visible_to_client: false,
          client_approval_required: false,

          assignees: Array.isArray(formData.assigned_to)
            ? formData.assigned_to
            : formData.assigned_to
              ? [Number(formData.assigned_to)]
              : [],

          labels: formData.labels
            ? formData.labels
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
            : [],
        },
      };

      const res = await axios.post(
        "https://api-0ggv.onrender.com/api/chat-messages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        //   onTaskCreated?.(res.data.data);

        setFormData({
          project_id: "",
          task_title: "",
          description: "",
          task_type: "Development",
          priority: "medium",
          estimated_hours: "",
          assigned_to: [],
          labels: "",
        });

        onClose();
      }
    } catch (err) {
      console.log("Task Create Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          background:
            "rgba(0,0,0,.5)",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">
                Create Task
              </h5>

              <button
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="modal-body">
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
                {/* Title */}

                <div className="mb-3">
                  <label className="form-label">
                    Task Name
                  </label>

                  <input
                    type="text"
                    name="task_title"
                    className="form-control"
                    value={
                      formData.task_title
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                {/* Description */}

                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    name="description"
                    className="form-control"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                {/* Assignee */}

                {selectedChat?.chat_type ===
                  "group" && (
                    <div className="mb-3">
                      <label className="form-label">
                        Assignee<small className="text-muted">
                          Hold Ctrl (Windows) or Cmd (Mac) to select multiple users
                        </small>
                      </label>

                      <select
                        multiple
                        name="assigned_to"
                        className="form-select"
                        value={formData.assigned_to}
                        onChange={handleAssigneeChange}
                        required
                      >
                        {selectedChat?.participants?.map((participant) => (
                          <option
                            key={participant.user_id}
                            value={participant.user_id}
                          >
                            {participant?.user?.full_name ||
                              `User ${participant.user_id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* Priority */}

                <div className="mb-3">
                  <label className="form-label">
                    Priority
                  </label>

                  <select
                    name="priority"
                    className="form-select"
                    value={
                      formData.priority
                    }
                    onChange={
                      handleChange
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

                {/* Due Date */}

                <div className="mb-3">
                  <label className="form-label">
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    className="form-control"
                    value={
                      formData.due_date
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? "Creating..."
                    : "Create Task"}
                </button>

              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  );
};

export default TaskModal;