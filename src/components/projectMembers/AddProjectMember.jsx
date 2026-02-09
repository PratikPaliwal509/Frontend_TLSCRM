import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddProjectMember = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  const [roleInProject, setRoleInProject] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // 1️⃣ Fetch managed projects
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const res = await fetch(
          // "http://localhost:5000/api/projects/managed",
          "http://localhost:5000/api/projects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      }
      finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 2️⃣ Fetch users for selected project
  useEffect(() => {
    if (!projectId) return;

    const fetchUsers = async () => {

      setUsersLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/projects/${projectId}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      }
      finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [projectId]);
  const parseApiError = async (res) => {
  const contentType = res.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    const json = await res.json()
    return json.message || 'Something went wrong'
  }

  const text = await res.text()
  return text || 'Something went wrong'
}


  // 3️⃣ Add project member
  const handleAddMember = async () => {
    if (!projectId || !userId) {
      setError("Project and User are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: Number(userId),
            role_in_project: roleInProject,
            hourly_rate: hourlyRate ? Number(hourlyRate) : null,
          }),
        }
      );

      if (!res.ok) {
        const message = await parseApiError(res);
        throw new Error(message);
      }

      await res.json();
      toast.success("Member added successfully");

      // Reset form
      setUserId("");
      setRoleInProject("");
      setHourlyRate("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-6">
      <div className="card p-4">
        <h4 className="mb-3">Add Project Member</h4>

        {error && <p className="text-danger">{error}</p>}

        {/* Project */}
        <div className="mb-3">
          <label className="form-label">Project</label>
          <select
            className="form-control"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">
              {projectsLoading ? "Loading projects…" : "Select Project"}
            </option>
            {!projectsLoading && projects.map((p) => (
              <option key={p.project_id} value={p.project_id}>
                {p.project_name}
              </option>
            ))}
          </select>
        </div>

        {/* User */}
        <div className="mb-3">
          <label className="form-label">User</label>
          <select
            className="form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={!projectId}
          >
            <option value="">
              {usersLoading ? "Loading users…" : "Select User"}
            </option>
            {!usersLoading && users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="form-label">Role in Project</label>
          <input
            type="text"
            className="form-control"
            placeholder="Developer / Designer"
            value={roleInProject}
            onChange={(e) => setRoleInProject(e.target.value)}
          />
        </div>

        {/* Hourly Rate */}
        <div className="mb-3">
          <label className="form-label">Hourly Rate</label>
          <input
            type="number"
            className="form-control"
            placeholder="e.g. 25"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddMember}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </div>
    </div>
  );
};

export default AddProjectMember;
