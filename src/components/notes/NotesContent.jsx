import React, { useEffect, useState } from 'react'
import { FiStar, FiTrash2 } from 'react-icons/fi'
import PerfectScrollbar from "react-perfect-scrollbar"
import NotesHeader from './NotesHeader'
import NotesSidebar from './NotesSidebar'
import Footer from '@/components/shared/Footer'
import AddsNote from './AddsNote'
import { toast } from 'react-toastify'

const NotesContent = () => {
    const [data, setData] = useState([])
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectTab, setSelectTab] = useState("alls")
    const [noteType, setNoteType] = useState("clients") // clients | projects
    const [favourites, setFavourites] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [clientsList, setClientsList] = useState([])
    const [projectsList, setProjectsList] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchNotes()
        fetchClientsWithoutNotes()
        fetchProjectsWithoutNotes()
    }, [noteType])

    const fetchNotes = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const url =
                noteType === "clients"
                    ? "http://localhost:5000/api/clients/notes"
                    : "http://localhost:5000/api/projects/notes"

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            })

            const json = await res.json()
            const notesArray = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []

            const formatted = notesArray.map(item => ({
                id: item?.client_id || item?.project_id,
                title: item?.company_name || item?.project_name,
                content: item?.notes,
                date: item?.created_at,
                category: noteType,
            }))
            console.log(formatted)
            setData(formatted)
            // toast.success("Notes loaded successfully")
        } catch (error) {
            console.error(error)
            toast.error(error.message || "Unable to load notes")
            setData([])
        } finally {
            setLoading(false)
        }
    }
    const fetchClientsWithoutNotes = async () => {
        try {
            setLoading(true)

            const token = localStorage.getItem("token")

            const res = await fetch(
                "http://localhost:5000/api/clients/without-notes",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const json = await res.json()

            if (json.success) {
                console.log("c" + JSON.stringify(json.data))
                setClientsList(json.data)
            } else {
                setClientsList([])
            }
        } catch (error) {
            console.error("Fetch clients without notes error:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchProjectsWithoutNotes = async () => {
        try {
            const token = localStorage.getItem("token")

            const res = await fetch(
                "http://localhost:5000/api/projects/without-notes",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const json = await res.json()

            if (json.success) {
                console.log("p" + JSON.stringify(json.data))
                setProjectsList(json.data)
            } else {
                setProjectsList([])
            }
        } catch (error) {
            console.error("Fetch projects without notes error:", error)
        }
    }



    const filteredData =
        selectTab === "alls" ? data : data.filter(note => note.category === selectTab)
    console.log("filteredData", filteredData)
    const handleDeleteNote = (id) => setData(prev => prev.filter(note => note.id !== id))
    const handleFavourite = (id) =>
        setFavourites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        )

    return (
        <>
            <NotesSidebar
                selectTab={selectTab}
                setSelectTab={setSelectTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                setShowAddModal={setShowAddModal}
            />

            <div className="content-area">
                <PerfectScrollbar>
                    <NotesHeader
                        setSidebarOpen={setSidebarOpen}
                        noteType={noteType}
                        setNoteType={setNoteType}
                    />

                    <div className="content-area-body pb-0">
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
                                <h6 className="mb-1">No notes found</h6>
                                <p className="fs-12">Add a note to get started</p>
                            </div>
                        ) : (
                            <div className="row note-has-grid">
                                {filteredData.map(note => (<>
                                    {note.content && <div key={note.id} className="col-xxl-4 col-xl-6 col-lg-4 col-sm-6">
                                        <div className="card card-body mb-4 stretch stretch-full">
                                            <h5 className="note-title text-truncate mb-1">{note.title}</h5>
                                            <p className="fs-11 text-muted">
                                                {new Date(note.date).toLocaleDateString()}
                                            </p>
                                            <div className="note-content flex-grow-1">
                                                <p className="text-muted text-truncate-3-line">
                                                    {note.content || "No notes added"}
                                                </p>
                                            </div>

                                            <div className="d-flex align-items-center gap-1">
                                                {/* <span
                                                    className={`avatar-text avatar-sm ${favourites.includes(note.id) ? "favourite" : ""}`}
                                                    onClick={() => handleFavourite(note.id)}
                                                >
                                                    <FiStar />
                                                </span> */}

                                                <span
                                                    className="avatar-text avatar-sm"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                >
                                                    <FiTrash2 />
                                                </span>
                                            </div>
                                        </div>
                                    </div>}
                                </>
                                )
                                )}
                            </div>
                        )}
                    </div>
                    <Footer />
                </PerfectScrollbar>
            </div>
            {/* Add Notes Modal */}
            {showAddModal && (
                <AddsNote
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    noteType={noteType}
                    clientList={clientsList}
                    projectList={projectsList}
                    onNoteAdded={fetchNotes}
                />

            )}
        </>
    )
}

export default NotesContent
