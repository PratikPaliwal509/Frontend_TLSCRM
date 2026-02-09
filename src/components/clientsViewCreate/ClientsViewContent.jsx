
import React from 'react'
import TabClientsProfile from './TabClientsProfile'
import ClientsEmptyCard from './ClientsEmptyCard'
import ClientProjectCost from './ClientProjectCost'
import KanbanBoard from '../kanban/KanbanBoard'
import ClientProjects from './ClientProjects'
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
      {/* PROJECT COST TAB */}
      <div className="tab-pane fade" id="projectCostTab" role="tabpanel">
        {client?.projectCost.length > 0 ? (
          <ClientProjectCost projectCost={client?.projectCost} />
        ) : (
          <ClientsEmptyCard
            title="No project cost data"
            description={`No billing data available for ${client?.company_name}`}
          />
        )}
      </div>
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

{/* TASKS TAB */}
<div className="tab-pane fade " id="tasksTab" role="tabpanel">
  <KanbanBoard tasks={client?.tasks || []} />
</div>
<div className="tab-pane fade " id="projectTab" role="tabpanel"><ClientProjects projects={client.projects} /></div>


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
