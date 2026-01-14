import React from 'react'
import TabUsersProfile from './TabUsersProfile'
import UsersEmptyCard from './UsersEmptyCard'

const UsersViewContent = ({ user }) => {
    const notes = user?.notes || []

    return (
        <>
            {/* PROFILE TAB */}
            <TabUsersProfile user={user} />

            {/* TASKS TAB */}
            {/* 
            <div className="tab-pane fade" id="tasksTab" role="tabpanel">
                <UsersEmptyCard
                    title="No tasks yet!"
                    description={`There are no tasks assigned to ${user?.name}`}
                />
            </div> 
            */}

            {/* NOTES TAB */}
            <div className="tab-pane fade" id="notesTab" role="tabpanel">
                {notes.length > 0 ? (
                    <div className="card">
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {/* {notes.map(note => (
                                    <li key={note.id} className="list-group-item">
                                        {note.text}
                                    </li>
                                ))} */}
                                {notes}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <UsersEmptyCard
                        title="No notes yet!"
                        description={`There are no notes created for ${user?.name}`}
                    />
                )}
            </div>

            {/* ACTIVITY TAB */}
            {/* 
            <div className="tab-pane fade" id="activityTab" role="tabpanel">
                <UsersEmptyCard
                    title="No activity yet!"
                    description={`There is no activity recorded for ${user?.name}`}
                />
            </div> 
            */}
        </>
    )
}

export default UsersViewContent
