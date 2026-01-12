import React from 'react'
import TabsTeamsProfle from './TabsTeamsProfle'
// import TeamsEmptyCard from './TeamsEmptyCard'

const TeamsViewContent = ({ team }) => {
  const notes = team?.notes || []

  return (
    <>
      {/* PROFILE TAB */}
      <TabsTeamsProfle team={team} />

      {/* MEMBERS TAB */}
      {/* <div className="tab-pane fade" id="membersTab" role="tabpanel">
        <TeamsEmptyCard
          title="No members yet!"
          description={`There are no members added to ${team?.team_name}`}
        />
      </div> */}

      {/* PROJECTS TAB */}
      {/* <div className="tab-pane fade" id="projectsTab" role="tabpanel">
        <TeamsEmptyCard
          title="No projects yet!"
          description={`There are no projects assigned to ${team?.team_name}`}
        />
      </div> */}

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
              </ul>
            </div>
          </div>
        ) : (
          <TeamsEmptyCard
            title="No notes yet!"
            description={`There are no notes created for ${team?.team_name}`}
          />
        )}
      </div> */}
    </>
  )
}

export default TeamsViewContent
