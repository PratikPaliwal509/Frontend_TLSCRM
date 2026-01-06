
import React from 'react'
import TabClientsProfile from './TabClientsProfile'
import ClientsEmptyCard from './ClientsEmptyCard'

const ClientsViewContent = ({ client }) => {
  const notes = client?.notes || []

  return (
    <>
      {/* PROFILE TAB */}
      <TabClientsProfile client={client} />

      {/* PROPOSALS TAB */}
      {/* <div className="tab-pane fade" id="proposalTab" role="tabpanel">
        <ClientsEmptyCard
          title="No proposals yet!"
          description={`There are no proposals created for ${client?.company_name}`}
        />
      </div> */}

      {/* TASKS TAB */}
      {/* <div className="tab-pane fade" id="tasksTab" role="tabpanel">
        <ClientsEmptyCard
          title="No tasks yet!"
          description={`There are no tasks created for ${client?.company_name}`}
        />
      </div> */}

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
          <ClientsEmptyCard
            title="No notes yet!"
            description={`There are no notes created for ${client?.company_name}`}
          />
        )}
      </div>

      {/* COMMENTS TAB */}
      {/* <div className="tab-pane fade" id="commentTab" role="tabpanel">
        <ClientsEmptyCard
          title="No comments yet!"
          description={`There are no comments for ${client?.company_name}`}
        />
      </div> */}
    </>
  )
}

export default ClientsViewContent
