import React, { useEffect, useState } from "react";
import { FiEye, FiEdit2, FiX } from "react-icons/fi";
import CardLoader from "@/components/shared/CardLoader";
import Footer from "@/components/shared/Footer";
import PageHeaderSetting from "@/components/shared/pageHeader/PageHeaderSetting";
import PerfectScrollbar from "react-perfect-scrollbar";
import { canUser } from '../../utils/canUser'
import { verifyPagePermission } from "@/utils/verifyPagePermission";
import { useNavigate } from 'react-router-dom';

const RoleListTable = ({ title }) => {
const [roles, setRoles] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshKey, setRefreshKey] = useState(false);
  
    const navigate = useNavigate();
    
  useEffect(() => {
    verifyPagePermission('roles', 'view', navigate);
    fetchRoles();
  }, []);
  
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized. Please login again.");
    return;
  }

  if (!canUser('role', 'delete')) {
    alert('You do not have permission to delete roles')
    return
  }


  const isConfirmed = window.confirm("Are you sure you want to delete this role?");

    if (!isConfirmed) {
        // User clicked Cancel
        console.log("Role deletion cancelled");
        return;
    }
  try {
    const res = await fetch(
      `http://localhost:5000/api/roles/${roleId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Delete failed");
    }

    // ✅ Remove role from UI
    setRoles(prev =>
      prev.filter(role => role.role_id !== roleId)
    );

  } catch (error) {
    console.error("Delete role error:", error);
    // alert(error.message || "Failed to delete role");
    alert("Failed to delete role");
    // console.log(error || "Failed to delete role");
  }
};

  return (
    <div className="content-area">
      <PerfectScrollbar>
        <PageHeaderSetting />

        <div className="content-area-body">
          <div className={`card stretch stretch-full ${refreshKey ? "card-loading" : ""}`}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0 fw-bold">{title}</h4>
              <button className="btn btn-sm btn-outline-primary" onClick={fetchRoles}>
                Refresh
              </button>
            </div>

            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="text-start fs-6 fw-bold py-3">Role Name</th>
                        <th className="fs-6 fw-bold py-3">Description</th>
                        <th className="fs-6 fw-bold py-3 text-center">System Role</th>
                        <th className="fs-6 fw-bold py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-muted py-4">
                            No roles available.
                          </td>
                        </tr>
                      ) : (
                        roles.map((role) => (
                          <tr key={role.role_id} className="align-middle">
                            <td className=" py-3">{role.role_name}</td>
                            <td className=" py-3">{role.role_description || "-"}</td>
                            <td className="text-center py-3">
                              {role.is_system_role ? (
                                <span className="badge bg-success">Yes</span>
                              ) : (
                                <span className="badge bg-secondary">No</span>
                              )}
                            </td>
                            <td className="text-center py-3">
                              <div className="d-flex justify-content-center gap-3">
                                    <FiEye
                                        size={20}
                                        className="text-info action-icon"
                                        title="View"
                                        style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                        onClick={() =>
                                            navigate(`/settings/roles/view/${role.role_id}`, { state: { role } })
                                        }
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    />

                                <FiEdit2
                                  size={20}
                                  className="text-warning action-icon"
                                  title="Edit"
                                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                  onClick={() => navigate(`/settings/roles/edit/${role.role_id}`, { state: { role } })}
                                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                                <FiX
                                  size={20}
                                  className="text-danger action-icon"
                                  title="Delete"
                                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                  onClick={() => handleDeleteRole(role.role_id)}
                                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <CardLoader refreshKey={refreshKey} />
          </div>
        </div>

        <Footer />
      </PerfectScrollbar>
    </div>
  );
};

export default RoleListTable;
