import React, { useEffect, useState } from "react"
import { toast } from "react-toastify";

const AddsNote = ({
    isOpen,
    onClose,
    noteType,
    clientList = [],
    projectList = [],
    onNoteAdded,
}) => {
    //   const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedClient, setSelectedClient] = useState("")
    const [selectedProject, setSelectedProject] = useState("")

    useEffect(() => {
        if (isOpen) {
            //   setTitle("")
            setDescription("")
            setSelectedClient("")
            setSelectedProject("")
        }
    }, [noteType, isOpen])

    if (!isOpen) return null

    const handleSubmit = async () => {
        if(description===""){
            toast.error("Description Not added!")
            return;
        }
        const token = localStorage.getItem("token")

        const url =
            noteType === "clients"
                ? `http://localhost:5000/api/clients/${selectedClient}`
                : `http://localhost:5000/api/projects/${selectedProject}`

        const body =
            noteType === "clients"
                ? { notes: description }
                : { notes: description }
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })

            const json = await res.json()
            if (!res.ok || !json.success) {
                throw new Error(json.message || "Failed to add note");
            }

            toast.success("Note added successfully!");

            onNoteAdded?.();
            onClose();
        } catch (err) {
            toast.error(err.message || "Something went wrong!");
        }
    };
    return (
        <>
            {/* Overlay */}
            <div
                className="position-fixed top-0 start-0 w-100 h-100 "
                style={{
                    background: "rgba(0,0,0, 0.5)",
                    zIndex: 1050,

                }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="position-fixed top-50 start-50 translate-middle rounded-lg"
                style={{
                    background: "rgb(255, 255, 255)",
                    zIndex: 1060,
                    width: "100%",
                    maxWidth: "700px",
                }}
            >
                <div className="modal-content shadow-lg border-0 bg-white rounded-3 p-4 animate-modal">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title ">Add Note</h5>
                        <button className="btn-close m-2" onClick={onClose} />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            </div> */}

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {noteType === "clients" && (
                            <div className="mb-3">
                                <label className="form-label">Client</label>
                                <select
                                    className="form-select"
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                >
                                    <option value="">Select Client</option>
                                    {(!clientList || clientList.length === 0) ? (
                                        <option value="" disabled>Notes already added for all clients</option>
                                    ) : (clientList.map((c) => (
                                        <option key={c.client_id} value={c.client_id}>
                                            {c.company_name}
                                        </option>
                                    )))}
                                </select>
                            </div>
                        )}

                        {noteType === "projects" && (
                            <div className="mb-3">
                                <label className="form-label">Project</label>
                                <select
                                    className="form-select"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                >
                                    <option value="">Select Project</option>
                                    {(!projectList || projectList.length === 0) ? (
                                        <option value="" disabled>Notes already added for all project</option>
                                    ) : projectList.map((p) => (
                                        <option key={p.project_id} value={p.project_id}>
                                            {p.project_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button className="btn btn-danger" onClick={onClose}>
                            Discard
                        </button>
                        <button
                            className="btn m-2 btn-success"
                            onClick={handleSubmit}
                            disabled={
                                (noteType === "clients" && !selectedClient) ||
                                (noteType === "projects" && !selectedProject)
                            }
                        >
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddsNote
