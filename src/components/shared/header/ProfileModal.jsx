import React, { Fragment, useEffect, useState } from "react";
import {
  FiActivity,
  FiBell,
  FiChevronRight,
  FiDollarSign,
  FiLogOut,
  FiSettings,
  FiUser
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const activePosition = ["Active", "Always", "Bussy", "Inactive", "Disabled", "Cutomization"];
const subscriptionsList = ["Plan", "Billings", "Referrals", "Payments", "Statements", "Subscriptions"];

const ProfileModal = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    
    const fetchUser = async () => {
      
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (res.ok && json.success) {
          setUser(json.data); // ✅ SINGLE OBJECT
        } else {
          console.error(json.message);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    if (token) fetchUser();
  }, [token]);

  // 🔹 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/authentication/login");
  };

  if (!user) {
    return (
      <div className="dropdown nxl-h-item">
        <span className="px-3 text-muted">Loading...</span>
      </div>
    );
  }


  return (
    <div className="dropdown nxl-h-item">
      <a href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" className="">
        <img
          src={user.avatar_url || "/images/avatar/1.png"}
          alt="user"
          className="img-fluid user-avtar me-0"
        />
      </a>

      <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
        {/* HEADER */}
        <div className="dropdown-header">
          <div className="d-flex align-items-center">
            <img
              src={user.avatar_url || "/images/avatar/1.png"}
              alt="user"
              className="img-fluid user-avtar"
            />
            <div>
              <h6 className="text-dark mb-0">
                {user?.first_name}
              </h6>
              <span className="fs-12 fw-medium text-muted">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="dropdown">
          <a href="#" className="dropdown-item" data-bs-toggle="dropdown">
            <span className="hstack">
              <i className="wd-10 ht-10 bg-success rounded-circle me-2"></i>
              <span>{user?.is_active ? "Active" : "Inactive"}</span>
            </span>
            <i className="ms-auto"><FiChevronRight /></i>
          </a>

          <div className="dropdown-menu user-active">
            {activePosition.map((item, index) => (
              <Fragment key={index}>
                {index === activePosition.length - 1 && <div className="dropdown-divider"></div>}
                <a href="#" className="dropdown-item">
                  <span className="hstack">
                    <i className={`wd-10 ht-10 rounded-circle me-2 ${getColor(item)}`}></i>
                    <span>{item}</span>
                  </span>
                </a>
              </Fragment>
            ))}
          </div>
        </div>

        <div className="dropdown-divider"></div>

        {/* MENU */}
        <a className="dropdown-item" onClick={() => navigate("/profile")}>
          <FiUser />
          <span>Profile Details</span>
        </a>

        <a className="dropdown-item" onClick={() => navigate("/activity")}>
          <FiActivity />
          <span>Activity Feed</span>
        </a>

        <a className="dropdown-item" onClick={() => navigate("/notifications")}>
          <FiBell />
          <span>Notifications</span>
        </a>

        <a className="dropdown-item" onClick={() => navigate("/settings")}>
          <FiSettings />
          <span>Account Settings</span>
        </a>

        <div className="dropdown-divider"></div>

        {/* LOGOUT */}
        <button className="dropdown-item text-danger" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;

// 🔹 STATUS COLOR HANDLER
const getColor = (item) => {
  switch (item) {
    case "Always":
      return "always_clr";
    case "Bussy":
      return "bussy_clr";
    case "Inactive":
      return "inactive_clr";
    case "Disabled":
      return "disabled_clr";
    case "Cutomization":
      return "cutomization_clr";
    default:
      return "active-clr";
  }
};
