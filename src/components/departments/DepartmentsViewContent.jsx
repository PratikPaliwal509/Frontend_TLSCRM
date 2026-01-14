import React from 'react'
import TabDepartmentProfile from './TabDepartmentProfile'
import DepartmentsEmptyCard from './DepartmentsEmptyCard'

const DepartmentsViewContent = ({ departments }) => {
    const notes = departments?.notes || []
    return (
        <>
            {/* PROFILE TAB */}
            <TabDepartmentProfile departments={departments} />

            {/* TEAMS TAB */}
            {/* <div className="tab-pane fade" id="teamsTab" role="tabpanel">
                <DepartmentsEmptyCard
                    title="No teams yet!"
                    description={`There are no teams created for ${departments?.name}`}
                />
            </div> */}

            {/* MEMBERS TAB */}
            <div className="tab-pane fade" id="membersTab" role="tabpanel">
                <DepartmentsEmptyCard
                    title="No members yet!"
                    description={`There are no members added to ${departments?.name}`}
                />
            </div>

            {/* NOTES TAB */}
            {/* <div className="tab-pane fade" id="notesTab" role="tabpanel">
                {notes.length > 0 ? (
                    <div className="card">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {notes.map(note => (
                                    <li key={note.id} className="list-group-item">
                                        {note.note_text}
                                    </li>
                                ))}
                                {notes}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <DepartmentsEmptyCard
                        title="No notes yet!"
                        description={`There are no notes created for ${departments?.name}`}
                    />
                )}
            </div> */}

            {/* COMMENTS TAB */}
            {/* <div className="tab-pane fade" id="commentTab" role="tabpanel">
                <DepartmentsEmptyCard
                    title="No comments yet!"
                    description={`There are no comments for ${departments?.name}`}
                />
            </div> */}
        </>
    )
}

export default DepartmentsViewContent
