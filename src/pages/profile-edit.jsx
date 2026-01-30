import React, { useEffect, useState } from "react";
import { FiSave, FiUser, FiMail, FiPhone, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // 🔹 Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
         const data = json.data;
          console.log("Fetched user data:", JSON.stringify(data));
        if (json.success ) {
          setUser(data);
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            mobile: data.mobile || "",
            job_title: data.job_title || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="container py-5">Loading...</div>;

  // 🔹 Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle avatar upload
  const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setForm((prev) => ({
      ...prev,
      avatar: file,
      avatar_url: URL.createObjectURL(file),
    }));
  }
};

  // 🔹 Save profile
const handleSave = async (e) => {
  e.preventDefault();
  setSaving(true);

  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();

    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);

    if (form.phone) formData.append("phone", form.phone);
    if (form.gender) formData.append("gender", form.gender);
    if (form.date_of_birth)
      formData.append("date_of_birth", form.date_of_birth);

    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    // 🔍 REAL debug
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await fetch("http://localhost:5000/api/users/mee", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.message);

    toast.success("Profile updated successfully");
    navigate("/profile");
  } catch (err) {
    toast.error(err.message);
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Edit Profile</h3>

      <form onSubmit={handleSave}>
        {/* AVATAR */}
        <div className="mb-4">
          <label className="form-label fw-bold">Avatar</label>
          <div className="d-flex align-items-center gap-3">
            <img
              src={form.avatar_url || "/images/avatar/1.png"}
              alt="avatar"
              className="rounded-circle"
              width="100"
            />
            <input
              type="file"
              className="form-control"
              onChange={handleAvatarChange}
              accept="image/*"
            />
          </div>
        </div>

        {/* NAME */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PHONE & MOBILE */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* JOB TITLE */}
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            type="text"
            className="form-control"
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
          />
        </div>

        {/* BIO */}
        <div className="mb-4">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            rows="4"
            name="bio"
            value={form.bio}
            onChange={handleChange}
          />
        </div>

        {/* SAVE BUTTON */}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <FiSave className="me-1" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
