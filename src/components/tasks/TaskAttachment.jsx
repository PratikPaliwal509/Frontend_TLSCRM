import React, { useState, useEffect } from "react";

const AddTimeLogAttachment = ({ taskId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Fetch existing attachments when component mounts
  useEffect(() => {
    const id= taskId
    const fetchAttachments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/taskAttachments/${taskId}/attachments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        console.log("attachments"+JSON.stringify(data))
        setAttachments(data.data || []);

      } catch (err) {
        console.error("Failed to fetch attachments:", err);
      }
    };

    fetchAttachments();
  }, [taskId]);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadAttachment = async () => {
    if (!file) return alert("Select a file");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "task_attachments"); 
      formData.append("folder", "timelog_attachments"); 

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwghrvasx/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary error:", data);
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      // Send to backend
      const backendRes = await fetch(
        `http://localhost:5000/api/taskAttachments/${taskId}/attachments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            file_name: data.public_id,
            file_original_name: file.name,
            file_path: data.public_id,
            file_url: data.secure_url,
            file_size: data.bytes,
            file_type: data.resource_type,
            file_extension: file.name.split(".").pop(),
            image_width: data.width || null,
            image_height: data.height || null,
          }),
        }
      );

      const savedAttachment = await backendRes.json();
      setAttachments((prev) => [...prev, savedAttachment]); // update list
      setFile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h6 className="mb-2">Add Attachment</h6>

      <input
        type="file"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <button
        className="btn btn-primary mb-3"
        onClick={uploadAttachment}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Render previously uploaded attachments */}
      <div>
        <h6>Attachments</h6>
        {attachments.length === 0 && <p>No attachments yet.</p>}
        <ul className="list-group">
          {attachments.map((att) => (
            <li key={att.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{att.file_original_name}</span>
              <a
                href={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                Open
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddTimeLogAttachment;
