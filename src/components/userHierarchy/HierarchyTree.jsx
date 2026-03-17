import React from "react";

const HierarchyTree = ({ nodes, level = 0 }) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    }}>
      {nodes.map((dep, index) => (
        <div key={dep.department_id} style={{ position: 'relative' }}>
          {/* Vertical line */}
          {level > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${level * 28}px`,
                width: '2px',
                backgroundColor: '#cbd5e1',
                borderRadius: '1px'
              }}
            />
          )}

          {/* Horizontal connecting line */}
          {level > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '28px',
                height: '2px',
                left: `${level * 28}px`,
                width: '16px',
                backgroundColor: '#cbd5e1',
                borderRadius: '1px'
              }}
            />
          )}

          {/* Department Node */}
          <div
            style={{
              marginLeft: level * 28,
              position: 'relative',
              zIndex: 10
            }}
          >
            <div style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontWeight: '600',
              fontSize: '15px',
              minWidth: '180px'
            }}>
              {dep.manager
                ? dep.manager.full_name || `${dep.manager.first_name} ${dep.manager.last_name}`
                : dep.department_name}
            </div>
          </div>

          {/* Teams */}
          {dep.teams?.map((team, teamIndex) => (
            <div key={team.team_id} style={{ marginTop: '16px', position: 'relative' }}>
              {/* Team vertical line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${(level + 1) * 28}px`,
                  width: '2px',
                  backgroundColor: '#d1d5db',
                  borderRadius: '1px'
                }}
              />

              {/* Team horizontal line */}
              <div
                style={{
                  position: 'absolute',
                  top: '28px',
                  height: '2px',
                  left: `${(level + 1) * 28}px`,
                  width: '16px',
                  backgroundColor: '#d1d5db',
                  borderRadius: '1px'
                }}
              />

              {/* Team Node */}
              <div style={{
                marginLeft: (level + 1) * 28,
                position: 'relative',
                zIndex: 10
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  color: '#475569',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontWeight: '500',
                  fontSize: '14px',
                  display: 'inline-block'
                }}>
                  {team.team_lead
                    ? team.team_lead.full_name || `${team.team_lead.first_name} ${team.team_lead.last_name}`
                    : team.team_name}
                </div>
              </div>

              {/* Users */}
              {team.users?.map((user, userIndex) => (
                <div
                  key={user.user_id}
                  style={{
                    marginTop: '6px',
                    marginLeft: (level + 2) * 28,
                    position: 'relative'
                  }}
                >
                  {/* User vertical line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '-20px',
                      width: '1px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '1px'
                    }}
                  />

                  {/* User horizontal line */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      height: '1px',
                      left: '-20px',
                      width: '12px',
                      backgroundColor: '#e5e7eb'
                    }}
                  />

                  {/* User Node */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid #f1f5f9',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'inline-block',
                    minWidth: '100px',
                    textAlign: 'center'
                  }}>
                    {user.full_name || `${user.first_name} ${user.last_name}`}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HierarchyTree;
