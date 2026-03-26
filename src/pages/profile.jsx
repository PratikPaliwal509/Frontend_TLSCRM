import React, { useEffect, useState } from "react";
import {
    FiMail,
    FiPhone,
    FiUser,
    FiBriefcase,
    FiClock,
    FiGlobe,
    FiShield,
    FiCalendar,
    FiTrash2
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiEdit } from 'react-icons/fi'
const Profile = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("https://api-0ggv.onrender.com/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const json = await res.json();

                // ⚠️ your API returns array
                if (json.success && json.data) {
                    setUser(json.data);
                }

            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };

        if (token) fetchUser();
    }, [token]);

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure? This action will permanently delete your account."
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch("https://api-0ggv.onrender.com/api/users/me", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                localStorage.removeItem("token");
                navigate("/authentication/login");
            } else {
                alert("Failed to delete account");
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleEditProfile = () => {
        navigate("/profile/edit");
    };

    if (!user) return <div className="container py-5">Loading profile...</div>;

    return (
        <div className="container py-4">
            <h3 className="fw-bold  mb-4 ">My Profile</h3>

            {/* ================= BASIC INFO ================= */}
            <div className="card  mb-4">
                <div className="card-body d-flex justify-content-between  align-items-center">
                    <div className="d-flex align-items-center">
                        <img
                            src={user.avatar_url || "/images/avatar/1.png"}
                            alt="avatar"
                            className="rounded-circle me-4"
                            width="120"
                        />
                        <div>
                            <h4 className="mb-1">{user.full_name || `${user.first_name} ${user.last_name}`}</h4>
                            <p className="text-muted mb-1">{user.job_title || "—"}</p>
                            <span className={`badge ${user.is_active ? "bg-success" : "bg-danger"}`}>
                                {user.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                    <button
                        className="btn border btn-sm btn-primary"
                        onClick={handleEditProfile}
                    >
                        <FiEdit className="me-1" /> Edit
                    </button>
                </div>


            </div>

            {/* ================= PERSONAL INFO ================= */}
            <Section title="Personal Information">
                <Info icon={<FiUser />} label="First Name" value={user.first_name} />
                <Info icon={<FiUser />} label="Last Name" value={user.last_name} />
                <Info icon={<FiMail />} label="Email" value={user.email} />
                <Info icon={<FiPhone />} label="Phone" value={user.phone || "—"} />
                <Info icon={<FiPhone />} label="Mobile" value={user.mobile || "—"} />
                <Info icon={<FiCalendar />} label="Date of Joining" value={formatDate(user.date_of_joining)} />
                <Info label="Employee ID" value={user.employee_id || "—"} />
            </Section>

            {/* ================= WORK INFO ================= */}
            <Section title="Work Information">
                <Info icon={<FiBriefcase />} label="Job Title" value={user.job_title || "—"} />
                <Info label="Role" value={user.role?.role_name} />
                <Info label="Department" value={user.department?.department_name || "—"} />
                <Info label="Team" value={user.team?.team_name || "—"} />
                <Info label="Hourly Rate" value={user.hourly_rate ? `$${user.hourly_rate}` : "—"} />
            </Section>

            {/* ================= ACCOUNT SETTINGS ================= */}
            <Section title="Account Settings">
                <Info icon={<FiShield />} label="Two Factor Auth" value={user.two_factor_enabled ? "Enabled" : "Disabled"} />
                <Info label="Verified" value={user.is_verified ? "Yes" : "No"} />
                <Info icon={<FiGlobe />} label="Timezone" value={user.timezone} />
                <Info label="Language" value={user.language} />
            </Section>

            {/* ================= SYSTEM INFO ================= */}
            <Section title="System Information">
                <Info icon={<FiClock />} label="Last Login" value={formatDate(user.last_login_at)} />
                <Info label="Last Login IP" value={user.last_login_ip || "—"} />
                <Info label="Created At" value={formatDate(user.created_at)} />
                <Info label="Updated At" value={formatDate(user.updated_at)} />
            </Section>

            {/* ================= BIO ================= */}
            <Section title="Bio">
                <p className="text-muted mb-0">{user.bio || "No bio provided."}</p>
            </Section>
            <div className="d-flex gap-2 text-center pt-4">
                {/* <a href="#" className="w-50 btn btn-light-brand">
                    <FiTrash2 size={16} className='me-2' />
                    <span>Delete</span>
                </a> */}
                {/* <a href="#" className="w-50 btn btn-primary"> */}

                {/* <button
                        className="w-100 btn btn-primary"
                        onClick={handleEditProfile}
                    >
                        <FiEdit className="me-1" /> Edit
                    </button> */}
                {/* </a> */}
            </div>
            <div className="card border-danger mt-4">
                <div className="card-header bg-danger text-white fw-bold">
                    Danger Zone
                </div>
                <div className="card-body">
                    <p className="text-muted mb-3">
                        Deleting your account is permanent and cannot be undone.
                    </p>

                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteAccount}
                    >
                        <FiTrash2 className="me-1" /> Delete Account
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Profile;

/* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, children }) => (
    <div className="card mb-4">
        <div className="card-header fw-bold">{title}</div>
        <div className="card-body row">{children}</div>
    </div>
);

const Info = ({ icon, label, value }) => (
    <div className="col-md-6 mb-3">
        <div className="d-flex align-items-start">
            {icon && <div className="me-2 fs-5 text-primary">{icon}</div>}
            <div>
                <div className="fw-semibold">{label}</div>
                <div className="text-muted">{value}</div>
            </div>
        </div>
    </div>
);

const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
};
